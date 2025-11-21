import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Types "Types";
import UserManager "UserManager";
import HeirManager "HeirManager";
import BitcoinApi "BitcoinApi";
import P2pkh "P2pkh";
import Utils "Utils";

module {
    type UserProfile = Types.UserProfile;
    type Heir = Types.Heir;
    type HeirDistribution = Types.HeirDistribution;
    type InheritanceResult = Types.InheritanceResult;
    type Satoshi = Types.Satoshi;
    type Network = Types.Network;
    type BitcoinAddress = Types.BitcoinAddress;
    type EcdsaCanisterActor = Types.EcdsaCanisterActor;
    type Principal = Principal.Principal;
    type Result<Ok, Err> = Types.Result<Ok, Err>;

    /// Estimated fee per transaction in satoshis (conservative estimate)
    /// This is a rough estimate - actual fees may vary
    // This buffer must comfortably exceed the actual fee calculated inside P2PKH
    // otherwise transaction construction fails with "Insufficient balance".
    // Using 10k sat (~0.0001 BTC) provides enough headroom for regtest fees
    // (actual fees are typically 300-500 satoshis on regtest)
    let ESTIMATED_FEE_PER_TRANSACTION : Satoshi = 10000; // 0.0001 BTC (10,000 satoshis)

    /// Calculates the distribution of Bitcoin to each heir
    public func calculate_distribution(
        _user : UserProfile,
        heirs : [Heir],
        balance : Satoshi
    ) : Result<[HeirDistribution], Text> {
        if (heirs.size() == 0) {
            return #err("No heirs configured");
        };

        if (balance == 0) {
            return #err("Balance is zero");
        };

        // Calculate total allocation percentage
        var total_percentage : Nat = 0;
        for (heir in heirs.vals()) {
            switch (heir.allocation) {
                case (#percentage(percent)) {
                    total_percentage += percent;
                };
            };
        };

        if (total_percentage == 0) {
            return #err("Total allocation is zero");
        };

        // Estimate total fees (one transaction per heir)
        let total_fees = ESTIMATED_FEE_PER_TRANSACTION * Nat64.fromNat(heirs.size());
        
        // Check if balance is sufficient for fees
        if (balance <= total_fees) {
            return #err("Insufficient balance to cover transaction fees");
        };

        // Calculate distributable amount (balance minus fees)
        let distributable = balance - total_fees;

        // Calculate distribution for each heir
        var distributions_list : [var HeirDistribution] = Array.init<HeirDistribution>(heirs.size(), {
            heir_id = 0;
            bitcoin_address = "";
            allocation_percentage = 0;
            amount = 0 : Satoshi;
        });
        var distributed_total : Satoshi = 0;
        var idx = 0;

        for (i in heirs.vals()) {
            switch (i.allocation) {
                case (#percentage(percent)) {
                    // Calculate amount: (distributable * percent) / 100
                    // Use integer arithmetic to avoid floating point
                    let amount_nat = (Nat64.toNat(distributable) * percent) / 100;
                    let amount = Nat64.fromNat(amount_nat);
                    
                    distributed_total += amount;
                    
                    let distribution : HeirDistribution = {
                        heir_id = i.id;
                        bitcoin_address = i.bitcoin_address;
                        allocation_percentage = percent;
                        amount = amount;
                    };
                    
                    distributions_list[idx] := distribution;
                    idx += 1;
                };
            };
        };

        // Convert to immutable array
        var distributions : [HeirDistribution] = Array.freeze(distributions_list);

        // Adjust last distribution to account for rounding
        // This ensures we distribute the full distributable amount
        if (distributions.size() > 0 and distributed_total < distributable) {
            let remainder = distributable - distributed_total;
            let last_idx = distributions.size() - 1;
            let last_dist = distributions[last_idx];
            let updated_dist : HeirDistribution = {
                heir_id = last_dist.heir_id;
                bitcoin_address = last_dist.bitcoin_address;
                allocation_percentage = last_dist.allocation_percentage;
                amount = last_dist.amount + remainder;
            };
            // Rebuild array with updated last element
            var updated_list : [var HeirDistribution] = Array.thaw(distributions);
            updated_list[last_idx] := updated_dist;
            distributions := Array.freeze(updated_list);
        };

        #ok(distributions);
    };

    /// Executes inheritance by sending Bitcoin to all heirs
    public func execute_inheritance(
        users : HashMap.HashMap<Principal, UserProfile>,
        heirs_storage : HeirManager.HeirStorage,
        ecdsa_canister_actor : EcdsaCanisterActor,
        network : Network,
        key_name : Text,
        principal : Principal
    ) : async Result<InheritanceResult, Text> {
        // Get user profile
        let user = switch (UserManager.get_user(users, principal)) {
            case (?u) u;
            case (null) return #err("User not found");
        };

        // Get user's Bitcoin address
        let user_address = switch (user.bitcoin_address) {
            case (?addr) addr;
            case (null) return #err("User has no Bitcoin address");
        };

        // Get user's derivation path
        if (user.derivation_path.size() == 0) {
            return #err("User has no derivation path");
        };

        // Get heirs
        let heirs = HeirManager.get_heirs(heirs_storage, principal);
        if (heirs.size() == 0) {
            return #err("No heirs configured");
        };

        // Get Bitcoin balance
        let balance = await BitcoinApi.get_balance(network, user_address);
        if (balance == 0) {
            return #err("Balance is zero");
        };

        // Calculate distribution
        let distributions = switch (calculate_distribution(user, heirs, balance)) {
            case (#ok(dists)) {
                dists;
            };
            case (#err(msg)) {
                return #err(msg);
            };
        };

        // Execute transactions for each heir
        var transaction_ids : [Text] = [];
        var total_distributed : Satoshi = 0;
        var total_fees : Satoshi = 0;

        for (distribution in distributions.vals()) {
            if (distribution.amount > 0) {
                // Send transaction to heir
                let txid_bytes = await P2pkh.send(
                    ecdsa_canister_actor,
                    network,
                    user.derivation_path,
                    key_name,
                    distribution.bitcoin_address,
                    distribution.amount
                );
                
                // Convert transaction ID to hex string
                let txid_hex = Utils.bytesToText(txid_bytes);
                transaction_ids := Array.append(transaction_ids, [txid_hex]);
                total_distributed += distribution.amount;
                total_fees += ESTIMATED_FEE_PER_TRANSACTION;
            };
        };

        // Update account status to inherited
        ignore UserManager.update_account_status(users, principal, #inherited);

        // Create result
        let now = Time.now();
        let timestamp = Nat64.fromNat(Int.abs(now / 1_000_000));

        let result : InheritanceResult = {
            transaction_ids = transaction_ids;
            total_distributed = total_distributed;
            fees_paid = total_fees;
            execution_timestamp = timestamp;
            heir_count = distributions.size();
        };

        #ok(result);
    };
};

