import Curves "mo:bitcoin/ec/Curves";
import Principal "mo:base/Principal";

module Types {
    // Re-export Bitcoin-related types
    public type Satoshi = Nat64;
    public type MillisatoshiPerVByte = Nat64;
    public type Cycles = Nat;
    public type BitcoinAddress = Text;
    public type BlockHash = [Nat8];
    public type Page = [Nat8];
    public type Timestamp = Nat64; // Milliseconds since epoch

    public let CURVE = Curves.secp256k1;

    /// The type of Bitcoin network the dapp will be interacting with.
    public type Network = {
        #mainnet;
        #testnet;
        #regtest;
    };

    /// The type of Bitcoin network as defined by the Bitcoin Motoko library
    public type NetworkCamelCase = {
        #Mainnet;
        #Testnet;
        #Regtest;
    };

    public func network_to_network_camel_case(network : Network) : NetworkCamelCase {
        switch (network) {
            case (#regtest) {
                #Regtest;
            };
            case (#testnet) {
                #Testnet;
            };
            case (#mainnet) {
                #Mainnet;
            };
        };
    };

    /// A reference to a transaction output.
    public type OutPoint = {
        txid : Blob;
        vout : Nat32;
    };

    /// An unspent transaction output.
    public type Utxo = {
        outpoint : OutPoint;
        value : Satoshi;
        height : Nat32;
    };

    /// A request for getting the balance for a given address.
    public type GetBalanceRequest = {
        address : BitcoinAddress;
        network : Network;
        min_confirmations : ?Nat32;
    };

    /// A filter used when requesting UTXOs.
    public type UtxosFilter = {
        #MinConfirmations : Nat32;
        #Page : Page;
    };

    /// A request for getting the UTXOs for a given address.
    public type GetUtxosRequest = {
        address : BitcoinAddress;
        network : Network;
        filter : ?UtxosFilter;
    };

    /// The response returned for a request to get the UTXOs of a given address.
    public type GetUtxosResponse = {
        utxos : [Utxo];
        tip_block_hash : BlockHash;
        tip_height : Nat32;
        next_page : ?Page;
    };

    /// A request for getting the current fee percentiles.
    public type GetCurrentFeePercentilesRequest = {
        network : Network;
    };

    public type SendTransactionRequest = {
        transaction : [Nat8];
        network : Network;
    };

    // ECDSA types
    public type ECDSAPublicKeyReply = {
        public_key : Blob;
        chain_code : Blob;
    };

    public type EcdsaKeyId = {
        curve : EcdsaCurve;
        name : Text;
    };

    public type EcdsaCurve = {
        #secp256k1;
    };

    public type SignWithECDSAReply = {
        signature : Blob;
    };

    public type ECDSAPublicKey = {
        canister_id : ?Principal;
        derivation_path : [Blob];
        key_id : EcdsaKeyId;
    };

    public type SignWithECDSA = {
        message_hash : Blob;
        derivation_path : [Blob];
        key_id : EcdsaKeyId;
    };

    public type EcdsaSignFunction = (EcdsaCanisterActor, Text, [Blob], Blob) -> async Blob;

    /// Actor definition to handle interactions with the ECDSA canister.
    public type EcdsaCanisterActor = actor {
        ecdsa_public_key : ECDSAPublicKey -> async ECDSAPublicKeyReply;
        sign_with_ecdsa : SignWithECDSA -> async SignWithECDSAReply;
    };

    // Schnorr types (for future use)
    public type SchnorrKeyId = {
        algorithm : SchnorrAlgorithm;
        name : Text;
    };

    public type SchnorrAlgorithm = {
        #bip340secp256k1;
    };

    public type SchnorrPublicKeyArgs = {
        canister_id : ?Principal;
        derivation_path : [Blob];
        key_id : SchnorrKeyId;
    };

    public type SchnorrPublicKeyReply = {
        public_key : Blob;
        chain_code : Blob;
    };

    public type SignWithSchnorrArgs = {
        message : Blob;
        derivation_path : [Blob];
        key_id : SchnorrKeyId;
        aux : ?SchnorrAux;
    };

    public type SchnorrAux = {
        #bip341 : {
            merkle_root_hash : Blob;
        };
    };

    public type SignWithSchnorrReply = {
        signature : Blob;
    };

    public type SchnorrSignFunction = (SchnorrCanisterActor, Text, [Blob], Blob, ?SchnorrAux) -> async Blob;

    /// Actor definition to handle interactions with the Schnorr canister.
    public type SchnorrCanisterActor = actor {
        schnorr_public_key : SchnorrPublicKeyArgs -> async SchnorrPublicKeyReply;
        sign_with_schnorr : SignWithSchnorrArgs -> async SignWithSchnorrReply;
    };

    // HeirLock-specific types

    /// User account status
    public type AccountStatus = {
        #active;
        #inactive;
        #inherited; // Inheritance has been executed
        #frozen; // Manually frozen by user
    };

    /// User profile containing all user information
    public type UserProfile = {
        principal : Principal;
        bitcoin_address : ?BitcoinAddress;
        derivation_path : [[Nat8]];
        created_at : Timestamp;
        last_activity : Timestamp;
        last_login : Timestamp;
        last_bitcoin_activity : ?Timestamp;
        inactivity_period_days : Nat; // Default: 365
        account_status : AccountStatus;
    };

    /// User status response
    public type UserStatus = {
        profile : UserProfile;
        days_since_activity : Nat;
        is_inactive : Bool;
        days_until_inheritance : ?Nat;
        bitcoin_balance : ?Satoshi;
    };

    /// Heir ID (unique identifier for a heir)
    public type HeirId = Nat;

    /// Allocation type - percentage-based for MVP
    public type Allocation = {
        #percentage : Nat; // 0-100
    };

    /// Heir information
    public type Heir = {
        id : HeirId;
        bitcoin_address : BitcoinAddress;
        allocation : Allocation;
        added_at : Timestamp;
    };

    /// Request to add a new heir
    public type AddHeirRequest = {
        bitcoin_address : BitcoinAddress;
        allocation_percentage : Nat; // 0-100
    };

    /// Inactivity status
    public type InactivityStatus = {
        is_active : Bool;
        seconds_since_activity : Nat;
        seconds_until_inheritance : ?Nat;
        can_trigger_inheritance : Bool;
    };

    /// Result type for operations that can fail
    public type Result<Ok, Err> = {
        #ok : Ok;
        #err : Err;
    };

    /// Heir distribution calculation result
    public type HeirDistribution = {
        heir_id : HeirId;
        bitcoin_address : BitcoinAddress;
        allocation_percentage : Nat;
        amount : Satoshi;
    };

    /// Inheritance execution result
    public type InheritanceResult = {
        transaction_ids : [Text]; // Transaction IDs as hex strings
        total_distributed : Satoshi;
        fees_paid : Satoshi;
        execution_timestamp : Timestamp;
        heir_count : Nat;
    };
};


