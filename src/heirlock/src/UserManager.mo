import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Types "Types";

module {
    type UserProfile = Types.UserProfile;
    type Principal = Principal.Principal;
    type Timestamp = Types.Timestamp;
    type AccountStatus = Types.AccountStatus;

    /// Default inactivity period in days
    public let DEFAULT_INACTIVITY_PERIOD_DAYS : Nat = 365;

    /// Creates a new user profile for the given principal
    public func create_user(users : HashMap.HashMap<Principal, UserProfile>, principal : Principal) : UserProfile {
        let now = Time.now();
        let timestamp = Nat64.fromNat(Int.abs(now / 1_000_000)); // Convert nanoseconds to milliseconds

        let profile : UserProfile = {
            principal = principal;
            bitcoin_address = null;
            derivation_path = [];
            created_at = timestamp;
            last_activity = timestamp;
            last_login = timestamp;
            last_bitcoin_activity = null;
            inactivity_period_days = DEFAULT_INACTIVITY_PERIOD_DAYS;
            account_status = #active;
        };

        users.put(principal, profile);
        profile;
    };

    /// Gets the user profile for the given principal, if it exists
    public func get_user(users : HashMap.HashMap<Principal, UserProfile>, principal : Principal) : ?UserProfile {
        users.get(principal);
    };

    /// Updates the last login timestamp for the user
    public func update_last_login(users : HashMap.HashMap<Principal, UserProfile>, principal : Principal) : Bool {
        switch (users.get(principal)) {
            case (?profile) {
                let now = Time.now();
                let timestamp = Nat64.fromNat(Int.abs(now / 1_000_000)); // Convert nanoseconds to milliseconds
                let updated_profile : UserProfile = {
                    principal = profile.principal;
                    bitcoin_address = profile.bitcoin_address;
                    derivation_path = profile.derivation_path;
                    created_at = profile.created_at;
                    last_activity = timestamp;
                    last_login = timestamp;
                    last_bitcoin_activity = profile.last_bitcoin_activity;
                    inactivity_period_days = profile.inactivity_period_days;
                    account_status = profile.account_status;
                };
                users.put(principal, updated_profile);
                true;
            };
            case (null) {
                false;
            };
        };
    };

    /// Updates the last activity timestamp for the user
    public func update_last_activity(users : HashMap.HashMap<Principal, UserProfile>, principal : Principal) : Bool {
        switch (users.get(principal)) {
            case (?profile) {
                let now = Time.now();
                let timestamp = Nat64.fromNat(Int.abs(now / 1_000_000)); // Convert nanoseconds to milliseconds
                let updated_profile : UserProfile = {
                    principal = profile.principal;
                    bitcoin_address = profile.bitcoin_address;
                    derivation_path = profile.derivation_path;
                    created_at = profile.created_at;
                    last_activity = timestamp;
                    last_login = profile.last_login;
                    last_bitcoin_activity = profile.last_bitcoin_activity;
                    inactivity_period_days = profile.inactivity_period_days;
                    account_status = profile.account_status;
                };
                users.put(principal, updated_profile);
                true;
            };
            case (null) {
                false;
            };
        };
    };

    /// Updates the Bitcoin address for the user
    public func update_bitcoin_address(users : HashMap.HashMap<Principal, UserProfile>, principal : Principal, address : Types.BitcoinAddress, derivation_path : [[Nat8]]) : Bool {
        switch (users.get(principal)) {
            case (?profile) {
                let updated_profile : UserProfile = {
                    principal = profile.principal;
                    bitcoin_address = ?address;
                    derivation_path = derivation_path;
                    created_at = profile.created_at;
                    last_activity = profile.last_activity;
                    last_login = profile.last_login;
                    last_bitcoin_activity = profile.last_bitcoin_activity;
                    inactivity_period_days = profile.inactivity_period_days;
                    account_status = profile.account_status;
                };
                users.put(principal, updated_profile);
                true;
            };
            case (null) {
                false;
            };
        };
    };

    /// Updates the last Bitcoin activity timestamp
    public func update_last_bitcoin_activity(users : HashMap.HashMap<Principal, UserProfile>, principal : Principal) : Bool {
        switch (users.get(principal)) {
            case (?profile) {
                let now = Time.now();
                let timestamp = Nat64.fromNat(Int.abs(now / 1_000_000)); // Convert nanoseconds to milliseconds
                let updated_profile : UserProfile = {
                    principal = profile.principal;
                    bitcoin_address = profile.bitcoin_address;
                    derivation_path = profile.derivation_path;
                    created_at = profile.created_at;
                    last_activity = timestamp;
                    last_login = profile.last_login;
                    last_bitcoin_activity = ?timestamp;
                    inactivity_period_days = profile.inactivity_period_days;
                    account_status = profile.account_status;
                };
                users.put(principal, updated_profile);
                true;
            };
            case (null) {
                false;
            };
        };
    };

    /// Updates the inactivity period for the user
    public func update_inactivity_period(users : HashMap.HashMap<Principal, UserProfile>, principal : Principal, days : Nat) : Bool {
        switch (users.get(principal)) {
            case (?profile) {
                let updated_profile : UserProfile = {
                    principal = profile.principal;
                    bitcoin_address = profile.bitcoin_address;
                    derivation_path = profile.derivation_path;
                    created_at = profile.created_at;
                    last_activity = profile.last_activity;
                    last_login = profile.last_login;
                    last_bitcoin_activity = profile.last_bitcoin_activity;
                    inactivity_period_days = days;
                    account_status = profile.account_status;
                };
                users.put(principal, updated_profile);
                true;
            };
            case (null) {
                false;
            };
        };
    };

    /// Updates the account status
    public func update_account_status(users : HashMap.HashMap<Principal, UserProfile>, principal : Principal, status : AccountStatus) : Bool {
        switch (users.get(principal)) {
            case (?profile) {
                let updated_profile : UserProfile = {
                    principal = profile.principal;
                    bitcoin_address = profile.bitcoin_address;
                    derivation_path = profile.derivation_path;
                    created_at = profile.created_at;
                    last_activity = profile.last_activity;
                    last_login = profile.last_login;
                    last_bitcoin_activity = profile.last_bitcoin_activity;
                    inactivity_period_days = profile.inactivity_period_days;
                    account_status = status;
                };
                users.put(principal, updated_profile);
                true;
            };
            case (null) {
                false;
            };
        };
    };

    /// Gets all users (for scheduler)
    public func get_all_users(users : HashMap.HashMap<Principal, UserProfile>) : [UserProfile] {
        var result : [UserProfile] = [];
        for ((principal, profile) in users.entries()) {
            result := Array.append(result, [profile]);
        };
        result;
    };
};
