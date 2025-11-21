import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Types "Types";
import UserManager "UserManager";

module {
    type UserProfile = Types.UserProfile;
    type Principal = Principal.Principal;
    type Timestamp = Types.Timestamp;

    /// Gets the number of seconds since last activity for a user
    /// Note: For testing, we're using seconds instead of days
    public func get_seconds_since_activity(
        users : HashMap.HashMap<Principal, UserProfile>,
        principal : Principal
    ) : ?Nat {
        switch (UserManager.get_user(users, principal)) {
            case (?profile) {
                let now = Time.now();
                let current_timestamp = Nat64.fromNat(Int.abs(now / 1_000_000));
                let last_activity_timestamp = profile.last_activity;
                
                // Timestamps are stored in milliseconds (from Time.now() / 1_000_000)
                // Convert difference to seconds by dividing by 1000
                let milliseconds_since_activity_nat64 = if (current_timestamp > last_activity_timestamp) {
                    current_timestamp - last_activity_timestamp;
                } else {
                    0 : Nat64;
                };
                // Convert milliseconds to seconds
                let seconds_since_activity_nat64 = milliseconds_since_activity_nat64 / 1000;
                let seconds_since_activity_nat = Nat64.toNat(seconds_since_activity_nat64);
                ?seconds_since_activity_nat;
            };
            case (null) {
                null;
            };
        };
    };

    /// Gets the number of days since last activity for a user (for display)
    public func get_days_since_activity(
        users : HashMap.HashMap<Principal, UserProfile>,
        principal : Principal
    ) : ?Nat {
        switch (get_seconds_since_activity(users, principal)) {
            case (?seconds) {
                ?(seconds / (24 * 60 * 60));
            };
            case (null) {
                null;
            };
        };
    };

    /// Checks if a user is inactive based on their inactivity period (in seconds for testing)
    public func is_inactive(
        users : HashMap.HashMap<Principal, UserProfile>,
        principal : Principal
    ) : Bool {
        switch (get_seconds_since_activity(users, principal)) {
            case (?seconds) {
                switch (UserManager.get_user(users, principal)) {
                    case (?profile) {
                        // For testing: inactivity_period_days actually stores seconds
                        // Compare seconds with seconds
                        seconds >= profile.inactivity_period_days;
                    };
                    case (null) {
                        false;
                    };
                };
            };
            case (null) {
                false;
            };
        };
    };

    /// Gets the last activity timestamp for a user
    public func get_last_activity(
        users : HashMap.HashMap<Principal, UserProfile>,
        principal : Principal
    ) : ?Timestamp {
        switch (UserManager.get_user(users, principal)) {
            case (?profile) {
                ?profile.last_activity;
            };
            case (null) {
                null;
            };
        };
    };
};

