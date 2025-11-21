import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Types "Types";

module {
    type Heir = Types.Heir;
    type HeirId = Types.HeirId;
    type Allocation = Types.Allocation;
    type BitcoinAddress = Types.BitcoinAddress;
    type AddHeirRequest = Types.AddHeirRequest;
    type Result<Ok, Err> = Types.Result<Ok, Err>;
    type Principal = Principal.Principal;
    type Timestamp = Types.Timestamp;

    /// Storage for heirs (per user)
    /// HashMap<Principal, [Heir]>
    public type HeirStorage = HashMap.HashMap<Principal, [Heir]>;

    /// Creates a new HeirManager storage
    public func create_storage() : HeirStorage {
        HashMap.HashMap<Principal, [Heir]>(0, Principal.equal, Principal.hash);
    };

    /// Adds a new heir for the given user
    public func add_heir(
        storage : HeirStorage,
        principal : Principal,
        request : AddHeirRequest
    ) : Result<HeirId, Text> {
        // Validate allocation percentage (0-100)
        if (request.allocation_percentage > 100) {
            return #err("Allocation percentage must be between 0 and 100");
        };

        // Get existing heirs for this user
        let existing_heirs = switch (storage.get(principal)) {
            case (?heirs) heirs;
            case (null) [];
        };

        // Calculate current total allocation
        let current_total = get_total_allocation_internal(existing_heirs);

        // Check if adding this heir would exceed 100%
        let new_total = current_total + request.allocation_percentage;
        if (new_total > 100) {
            return #err("Total allocation would exceed 100%. Current total: " # Nat.toText(current_total) # "%, adding: " # Nat.toText(request.allocation_percentage) # "%");
        };

        // Validate Bitcoin address (basic check - not empty)
        if (request.bitcoin_address == "") {
            return #err("Bitcoin address cannot be empty");
        };

        // Generate new HeirId (next available ID)
        let new_heir_id = get_next_heir_id(existing_heirs);

        // Create timestamp
        let now = Time.now();
        let timestamp = Nat64.fromNat(Int.abs(now / 1_000_000));

        // Create new heir
        let new_heir : Heir = {
            id = new_heir_id;
            bitcoin_address = request.bitcoin_address;
            allocation = #percentage(request.allocation_percentage);
            added_at = timestamp;
        };

        // Add to existing heirs
        let updated_heirs = Array.append(existing_heirs, [new_heir]);

        // Store updated heirs
        storage.put(principal, updated_heirs);

        #ok(new_heir_id);
    };

    /// Removes a heir by ID for the given user
    public func remove_heir(
        storage : HeirStorage,
        principal : Principal,
        heir_id : HeirId
    ) : Result<(), Text> {
        switch (storage.get(principal)) {
            case (?heirs) {
                // Filter out the heir with matching ID
                let updated_heirs = Array.filter<Heir>(heirs, func(heir) { heir.id != heir_id });

                // Check if heir was found and removed
                if (updated_heirs.size() == heirs.size()) {
                    return #err("Heir with ID " # Nat.toText(heir_id) # " not found");
                };

                // Update storage
                if (updated_heirs.size() == 0) {
                    storage.delete(principal);
                } else {
                    storage.put(principal, updated_heirs);
                };

                #ok(());
            };
            case (null) {
                #err("No heirs found for user");
            };
        };
    };

    /// Gets all heirs for the given user
    public func get_heirs(
        storage : HeirStorage,
        principal : Principal
    ) : [Heir] {
        switch (storage.get(principal)) {
            case (?heirs) heirs;
            case (null) [];
        };
    };

    /// Gets the total allocation percentage for the given user
    public func get_total_allocation(
        storage : HeirStorage,
        principal : Principal
    ) : Nat {
        let heirs = get_heirs(storage, principal);
        get_total_allocation_internal(heirs);
    };

    /// Internal function to calculate total allocation from heirs array
    func get_total_allocation_internal(heirs : [Heir]) : Nat {
        var total : Nat = 0;
        for (heir in heirs.vals()) {
            switch (heir.allocation) {
                case (#percentage(percent)) {
                    total += percent;
                };
            };
        };
        total;
    };

    /// Gets the next available HeirId for a user
    func get_next_heir_id(heirs : [Heir]) : HeirId {
        if (heirs.size() == 0) {
            return 0;
        };

        var max_id : HeirId = 0;
        for (heir in heirs.vals()) {
            if (heir.id > max_id) {
                max_id := heir.id;
            };
        };
        max_id + 1;
    };
};

