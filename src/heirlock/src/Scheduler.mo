import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Types "Types";
import UserManager "UserManager";
import HeirManager "HeirManager";
import ActivityTracker "ActivityTracker";
import InheritanceEngine "InheritanceEngine";
import BitcoinApi "BitcoinApi";

module {
    type UserProfile = Types.UserProfile;
    type Principal = Principal.Principal;
    type Network = Types.Network;
    type Satoshi = Types.Satoshi;
    type Heir = Types.Heir;
    type InheritanceResult = Types.InheritanceResult;
    type EcdsaCanisterActor = Types.EcdsaCanisterActor;

    /// Check a single user for inactivity and trigger inheritance if needed
    public func check_user(
        users : HashMap.HashMap<Principal, UserProfile>,
        heirs_storage : HeirManager.HeirStorage,
        ecdsa_canister_actor : EcdsaCanisterActor,
        network : Network,
        key_name : Text,
        principal : Principal
    ) : async ?InheritanceResult {
        switch (UserManager.get_user(users, principal)) {
            case (?profile) {
                // Check if user is inactive
                if (not ActivityTracker.is_inactive(users, principal)) {
                    Debug.print("User " # Principal.toText(principal) # " is still active, skipping inheritance check");
                    return null; // User is still active
                };

                // Check prerequisites
                let user_heirs = HeirManager.get_heirs(heirs_storage, principal);
                if (user_heirs.size() == 0) {
                    Debug.print("User " # Principal.toText(principal) # " has no heirs configured");
                    return null; // No heirs configured
                };

                // Check if user has Bitcoin address
                switch (profile.bitcoin_address) {
                    case (null) {
                        Debug.print("User " # Principal.toText(principal) # " has no Bitcoin address");
                        return null; // No Bitcoin address
                    };
                    case (?address) {
                        // Check if user has positive balance
                        Debug.print("Checking balance for user " # Principal.toText(principal) # " at address " # address);
                        let balance = await BitcoinApi.get_balance(network, address);
                        Debug.print("Balance check completed: " # debug_show(balance) # " satoshis");
                        if (balance == 0) {
                            Debug.print("User " # Principal.toText(principal) # " has zero balance");
                            return null; // No balance
                        };

                        // Check if account is already inherited
                        switch (profile.account_status) {
                            case (#inherited) {
                                Debug.print("User " # Principal.toText(principal) # " already has inheritance executed");
                                return null; // Already inherited
                            };
                            case (#active) {
                                // Execute inheritance
                                Debug.print("Executing inheritance for user " # Principal.toText(principal) # " with balance " # debug_show(balance));
                                switch (await InheritanceEngine.execute_inheritance(
                                    users,
                                    heirs_storage,
                                    ecdsa_canister_actor,
                                    network,
                                    key_name,
                                    principal
                                )) {
                                    case (#ok(result)) {
                                        ?result;
                                    };
                                    case (#err(error_msg)) {
                                        // Log the error for debugging
                                        Debug.print("Inheritance execution failed for user: " # Principal.toText(principal) # " - " # error_msg);
                                        null; // Execution failed
                                    };
                                };
                            };
                            case (_) {
                                null; // Other statuses (frozen, inactive)
                            };
                        };
                    };
                };
            };
            case (null) {
                null; // User not found
            };
        };
    };

    /// Check all users for inactivity and trigger inheritance if needed
    public func check_all_users(
        users : HashMap.HashMap<Principal, UserProfile>,
        heirs_storage : HeirManager.HeirStorage,
        ecdsa_canister_actor : EcdsaCanisterActor,
        network : Network,
        key_name : Text
    ) : async () {
        // Iterate through all users
        for ((principal, profile) in users.entries()) {
            // Only check active accounts (skip inherited, frozen, inactive)
            if (profile.account_status == #active) {
                // Check this user - don't ignore result, but handle errors gracefully
                switch (await check_user(users, heirs_storage, ecdsa_canister_actor, network, key_name, principal)) {
                    case (?result) {
                        // Inheritance executed successfully
                        // Result is returned but we don't need to do anything with it here
                    };
                    case (null) {
                        // User doesn't meet conditions or execution failed
                        // This is expected for users who are still active, have no heirs, etc.
                    };
                };
            };
        };
    };
};

