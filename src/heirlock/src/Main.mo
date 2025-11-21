import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Timer "mo:base/Timer";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Types "Types";
import UserManager "UserManager";
import HeirManager "HeirManager";
import ActivityTracker "ActivityTracker";
import InheritanceEngine "InheritanceEngine";
import BitcoinApi "BitcoinApi";
import P2pkh "P2pkh";
import Scheduler "Scheduler";

persistent actor class HeirLock(network : Types.Network) {
    type UserProfile = Types.UserProfile;
    type UserStatus = Types.UserStatus;
    type Network = Types.Network;
    type Satoshi = Types.Satoshi;
    type BitcoinAddress = Types.BitcoinAddress;
    type Heir = Types.Heir;
    type HeirId = Types.HeirId;
    type AddHeirRequest = Types.AddHeirRequest;
    type Result<Ok, Err> = Types.Result<Ok, Err>;
    type InactivityStatus = Types.InactivityStatus;
    type InheritanceResult = Types.InheritanceResult;

    /// The Bitcoin network to connect to (testnet for MVP)
    let NETWORK : Network = network;

    // The ECDSA key name.
    transient let KEY_NAME : Text = switch NETWORK {
        // For local development, we use a special test key with dfx.
        case (#regtest) "dfx_test_key";
        // On the IC we're using a test ECDSA key.
        case _ "test_key_1";
    };

    // Threshold signing APIs instantiated with the management canister ID.
    transient var ecdsa_canister_actor : Types.EcdsaCanisterActor = actor ("aaaaa-aa");

    /// Storage for user profiles
    var users_stable : [(Principal, UserProfile)] = [];
    private transient var users : HashMap.HashMap<Principal, UserProfile> = do {
        if (users_stable.size() > 0) {
            HashMap.fromIter<Principal, UserProfile>(users_stable.vals(), 0, Principal.equal, Principal.hash);
        } else {
            HashMap.HashMap<Principal, UserProfile>(0, Principal.equal, Principal.hash);
        };
    };

    /// Storage for heirs (per user)
    var heirs_stable : [(Principal, [Heir])] = [];
    private transient var heirs : HeirManager.HeirStorage = do {
        if (heirs_stable.size() > 0) {
            let temp_storage = HeirManager.create_storage();
            for ((principal, heirs_list) in heirs_stable.vals()) {
                temp_storage.put(principal, heirs_list);
            };
            temp_storage;
        } else {
            HeirManager.create_storage();
        };
    };

    /// Timer for periodic inheritance checks (every 60 seconds)
    private var timer_id : ?Timer.TimerId = null;
    /// Prevent overlapping scheduler executions (timer vs manual)
    private var is_scheduler_running : Bool = false;

    /// Periodic check function - runs every 60 seconds
    /// Note: This is called by the timer automatically
    /// IMPORTANT: ICP timers may not reliably call long-running async functions
    /// If inheritance execution takes >60 seconds, the timer might not work reliably
    /// Use trigger_inheritance_check() or heartbeat() as backup
    private func periodic_check() : async () {
        Debug.print("Timer tick: running periodic_check");
        if (is_scheduler_running) {
            Debug.print("Scheduler run already in progress; skipping periodic tick");
            return;
        };
        is_scheduler_running := true;
        try {
            await Scheduler.check_all_users(users, heirs, ecdsa_canister_actor, NETWORK, KEY_NAME);
        } catch (err) {
            Debug.print("Scheduler run failed: " # Error.message(err));
        };
        is_scheduler_running := false;
    };

    // Initialize timer on first deployment
    timer_id := ?Timer.recurringTimer(#seconds(60), periodic_check);
    Debug.print("Timer initialized on install: 60-second interval");

    system func preupgrade() {
        users_stable := Iter.toArray(users.entries());
        // Store heirs
        var heirs_array : [(Principal, [Heir])] = [];
        for ((principal, heirs_list) in heirs.entries()) {
            heirs_array := Array.append(heirs_array, [(principal, heirs_list)]);
        };
        heirs_stable := heirs_array;
    };

    system func postupgrade() {
        if (users_stable.size() > 0) {
            users := HashMap.fromIter<Principal, UserProfile>(users_stable.vals(), 0, Principal.equal, Principal.hash);
            users_stable := [];
        };
        // Restore heirs
        if (heirs_stable.size() > 0) {
            heirs := HeirManager.create_storage();
            for ((principal, heirs_list) in heirs_stable.vals()) {
                heirs.put(principal, heirs_list);
            };
            heirs_stable := [];
        };
        
        // Re-initialize timer after upgrade (runs every 60 seconds)
        timer_id := ?Timer.recurringTimer(#seconds(60), periodic_check);
        Debug.print("Timer re-initialized after upgrade: 60-second interval");
    };

    /// Login endpoint - creates user if new, updates activity if existing
    public shared(msg) func login() : async UserProfile {
        let caller_principal = msg.caller;
        
        switch (UserManager.get_user(users, caller_principal)) {
            case (?profile) {
                // User exists - update last login and activity
                ignore UserManager.update_last_login(users, caller_principal);
                // Return updated profile
                switch (UserManager.get_user(users, caller_principal)) {
                    case (?updated_profile) updated_profile;
                    case (null) profile; // Fallback to original if update failed
                };
            };
            case (null) {
                // New user - create profile
                let new_profile = UserManager.create_user(users, caller_principal);
                new_profile;
            };
        };
    };

    /// Get user profile
    public shared(msg) func get_profile() : async ?UserProfile {
        let caller_principal = msg.caller;
        UserManager.get_user(users, caller_principal);
    };

    /// Get user status including inactivity information
    public shared(msg) func get_user_status() : async ?UserStatus {
        let caller_principal = msg.caller;
        
        switch (UserManager.get_user(users, caller_principal)) {
            case (?profile) {
                // For testing: use seconds instead of days
                let seconds_since_activity = switch (ActivityTracker.get_seconds_since_activity(users, caller_principal)) {
                    case (?secs) secs;
                    case (null) 0;
                };
                let days_since_activity = seconds_since_activity / (24 * 60 * 60); // For display
                
                // Check if inactive (comparing seconds with seconds for testing)
                let is_inactive = ActivityTracker.is_inactive(users, caller_principal);
                
                // Calculate seconds until inheritance (for testing)
                let seconds_until_inheritance = if (is_inactive) {
                    null;
                } else {
                    // inactivity_period_days actually stores seconds for testing
                    let remaining = if (seconds_since_activity < profile.inactivity_period_days) {
                        profile.inactivity_period_days - seconds_since_activity;
                    } else {
                        0;
                    };
                    // Convert to days for display
                    ?(remaining / (24 * 60 * 60));
                };

                // Get Bitcoin balance
                let bitcoin_balance = switch (profile.bitcoin_address) {
                    case (?address) {
                        ?(await BitcoinApi.get_balance(NETWORK, address));
                    };
                    case (null) {
                        null;
                    };
                };

                ?{
                    profile = profile;
                    days_since_activity = days_since_activity;
                    is_inactive = is_inactive;
                    days_until_inheritance = seconds_until_inheritance;
                    bitcoin_balance = bitcoin_balance;
                };
            };
            case (null) {
                null;
            };
        };
    };

    /// Heartbeat endpoint - explicit activity signal
    /// Also triggers a check of all users for inheritance
    public shared(msg) func heartbeat() : async () {
        let caller_principal = msg.caller;
        // Update caller's activity if they're a user
        ignore UserManager.update_last_activity(users, caller_principal);
        // Also trigger a check of all users (if not already running)
        if (is_scheduler_running) {
            Debug.print("Scheduler run already in progress; heartbeat check skipped");
            return;
        };
        is_scheduler_running := true;
        try {
            await Scheduler.check_all_users(users, heirs, ecdsa_canister_actor, NETWORK, KEY_NAME);
        } catch (err) {
            is_scheduler_running := false;
            Debug.print("Heartbeat scheduler run failed: " # Error.message(err));
            throw err;
        };
        is_scheduler_running := false;
    };

    /// Manual trigger for inheritance check (for testing/debugging)
    /// This simulates what the timer does automatically
    /// Note: This does NOT update user activity (unlike heartbeat)
    public shared(_) func trigger_inheritance_check() : async () {
        if (is_scheduler_running) {
            Debug.print("Scheduler run already in progress; trigger_inheritance_check skipped");
            return;
        };
        is_scheduler_running := true;
        try {
            await Scheduler.check_all_users(users, heirs, ecdsa_canister_actor, NETWORK, KEY_NAME);
        } catch (err) {
            is_scheduler_running := false;
            Debug.print("Manual scheduler run failed: " # Error.message(err));
            throw err;
        };
        is_scheduler_running := false;
    };

    // Helper function to convert Principal to derivation path
    func principal_to_derivation_path(principal : Principal) : [[Nat8]] {
        let principal_bytes = Blob.toArray(Principal.toBlob(principal));
        // Use principal bytes as the derivation path suffix
        // This ensures each user gets a unique derivation path
        [principal_bytes];
    };

    /// Generate a unique Bitcoin address for the caller
    public shared(msg) func generate_bitcoin_address() : async BitcoinAddress {
        let caller_principal = msg.caller;
        
        // Ensure user exists
        switch (UserManager.get_user(users, caller_principal)) {
            case (null) {
                // Create user if doesn't exist
                ignore UserManager.create_user(users, caller_principal);
            };
            case (_) {};
        };

        // Generate unique derivation path from Principal
        let derivation_path = principal_to_derivation_path(caller_principal);
        
        // Generate Bitcoin address using P2PKH
        let address = await P2pkh.get_address(ecdsa_canister_actor, NETWORK, KEY_NAME, derivation_path);
        
        // Store address and derivation path in user profile
        ignore UserManager.update_bitcoin_address(users, caller_principal, address, derivation_path);
        
        address;
    };

    /// Get the Bitcoin address for the caller
    public shared(msg) func get_bitcoin_address() : async ?BitcoinAddress {
        let caller_principal = msg.caller;
        
        switch (UserManager.get_user(users, caller_principal)) {
            case (?profile) {
                profile.bitcoin_address;
            };
            case (null) {
                null;
            };
        };
    };

    /// Get the Bitcoin balance for the caller's address
    public shared(msg) func get_balance() : async Satoshi {
        let caller_principal = msg.caller;
        
        switch (UserManager.get_user(users, caller_principal)) {
            case (?profile) {
                switch (profile.bitcoin_address) {
                    case (?address) {
                        await BitcoinApi.get_balance(NETWORK, address);
                    };
                    case (null) {
                        0 : Satoshi; // No address means no balance
                    };
                };
            };
            case (null) {
                0 : Satoshi; // No user means no balance
            };
        };
    };

    // ========== Heir Management API ==========

    /// Add a new heir with allocation percentage
    public shared(msg) func add_heir(request : AddHeirRequest) : async Result<HeirId, Text> {
        let caller_principal = msg.caller;
        
        // Ensure user exists
        switch (UserManager.get_user(users, caller_principal)) {
            case (null) {
                // Create user if doesn't exist
                ignore UserManager.create_user(users, caller_principal);
            };
            case (_) {};
        };

        // Add heir using HeirManager
        HeirManager.add_heir(heirs, caller_principal, request);
    };

    /// Remove a heir by ID
    public shared(msg) func remove_heir(heir_id : HeirId) : async Result<(), Text> {
        let caller_principal = msg.caller;
        HeirManager.remove_heir(heirs, caller_principal, heir_id);
    };

    /// Get all heirs for the caller
    public shared(msg) func get_heirs() : async [Heir] {
        let caller_principal = msg.caller;
        HeirManager.get_heirs(heirs, caller_principal);
    };

    /// Get total allocation percentage for the caller
    public shared(msg) func get_total_allocation() : async Nat {
        let caller_principal = msg.caller;
        HeirManager.get_total_allocation(heirs, caller_principal);
    };

    // ========== Inactivity & Inheritance API ==========

    /// Set the inactivity period in seconds (flexible for testing and production)
    /// Minimum: 30 seconds, Maximum: 31,536,000 seconds (1 year)
    public shared(msg) func set_inactivity_period(seconds : Nat) : async Result<(), Text> {
        let caller_principal = msg.caller;
        
        // Minimum 30 seconds, maximum 1 year (31,536,000 seconds)
        if (seconds < 30) {
            return #err("Inactivity period must be at least 30 seconds");
        };
        if (seconds > 31_536_000) {
            return #err("Inactivity period cannot exceed 1 year (31,536,0000 seconds)");
        };

        // Update inactivity period (stored as seconds for testing)
        // Note: We're storing seconds in the days field for testing purposes
        if (UserManager.update_inactivity_period(users, caller_principal, seconds)) {
            #ok(());
        } else {
            #err("User not found");
        };
    };

    /// Get inactivity status for the caller
    public shared(msg) func get_inactivity_status() : async ?InactivityStatus {
        let caller_principal = msg.caller;
        
        switch (UserManager.get_user(users, caller_principal)) {
            case (?profile) {
                // For testing: get seconds since activity
                let seconds_since_activity = switch (ActivityTracker.get_seconds_since_activity(users, caller_principal)) {
                    case (?secs) secs;
                    case (null) 0;
                };
                let days_since_activity = seconds_since_activity / (24 * 60 * 60); // For display
                
                let is_inactive = ActivityTracker.is_inactive(users, caller_principal);
                
                // For testing: calculate seconds until inheritance
                let seconds_until_inheritance = if (is_inactive) {
                    null;
                } else {
                    // inactivity_period_days actually stores seconds for testing
                    let remaining = if (seconds_since_activity < profile.inactivity_period_days) {
                        profile.inactivity_period_days - seconds_since_activity;
                    } else {
                        0;
                    };
                    // Return raw seconds for frontend flexibility
                    ?remaining;
                };

                // Check if inheritance can be triggered
                let has_heirs = HeirManager.get_heirs(heirs, caller_principal).size() > 0;
                let has_address = switch (profile.bitcoin_address) {
                    case (?_) true;
                    case (null) false;
                };
                let can_trigger = is_inactive and has_heirs and has_address;

                ?{
                    is_active = not is_inactive;
                    seconds_since_activity = seconds_since_activity;
                    seconds_until_inheritance = seconds_until_inheritance;
                    can_trigger_inheritance = can_trigger;
                };
            };
            case (null) {
                null;
            };
        };
    };

    /// Check if user is inactive and trigger inheritance if conditions are met
    public shared(msg) func check_and_trigger_inheritance() : async Result<InheritanceResult, Text> {
        let caller_principal = msg.caller;
        
        // Validate user exists
        switch (UserManager.get_user(users, caller_principal)) {
            case (null) {
                return #err("User not found");
            };
            case (_) {};
        };

        // Check if user is inactive
        if (not ActivityTracker.is_inactive(users, caller_principal)) {
            return #err("User is still active. Inheritance can only be triggered for inactive users.");
        };

        // Check if user has heirs
        let user_heirs = HeirManager.get_heirs(heirs, caller_principal);
        if (user_heirs.size() == 0) {
            return #err("No heirs configured. Cannot execute inheritance.");
        };

        // Check if user has Bitcoin address
        let user = switch (UserManager.get_user(users, caller_principal)) {
            case (?u) u;
            case (null) return #err("User not found");
        };

        switch (user.bitcoin_address) {
            case (null) {
                return #err("User has no Bitcoin address. Cannot execute inheritance.");
            };
            case (?address) {
                // Check balance
                let balance = await BitcoinApi.get_balance(NETWORK, address);
                if (balance == 0) {
                    return #err("Balance is zero. Cannot execute inheritance.");
                };
            };
        };

        // Check if account is already inherited
        if (user.account_status == #inherited) {
            return #err("Inheritance has already been executed for this account.");
        };

        // Execute inheritance
        await InheritanceEngine.execute_inheritance(
            users,
            heirs,
            ecdsa_canister_actor,
            NETWORK,
            KEY_NAME,
            caller_principal
        );
    };

    // ========== Bitcoin Transaction History API ==========

    /// Get UTXOs (transaction history) for any Bitcoin address
    /// This shows all unspent transaction outputs for the address
    /// Note: This only shows UNSPENT transactions, not full history
    public func get_address_utxos(address : Text) : async Types.GetUtxosResponse {
        await BitcoinApi.get_utxos(NETWORK, address);
    };

    /// Get balance for any Bitcoin address
    public func get_address_balance(address : Text) : async Satoshi {
        await BitcoinApi.get_balance(NETWORK, address);
    };
};

