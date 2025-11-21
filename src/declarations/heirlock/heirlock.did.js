export const idlFactory = ({ IDL }) => {
  const Network = IDL.Variant({
    'mainnet' : IDL.Null,
    'regtest' : IDL.Null,
    'testnet' : IDL.Null,
  });
  const BitcoinAddress = IDL.Text;
  const AddHeirRequest = IDL.Record({
    'bitcoin_address' : BitcoinAddress,
    'allocation_percentage' : IDL.Nat,
  });
  const HeirId = IDL.Nat;
  const Result_2 = IDL.Variant({ 'ok' : HeirId, 'err' : IDL.Text });
  const Timestamp = IDL.Nat64;
  const Satoshi = IDL.Nat64;
  const InheritanceResult = IDL.Record({
    'execution_timestamp' : Timestamp,
    'transaction_ids' : IDL.Vec(IDL.Text),
    'heir_count' : IDL.Nat,
    'total_distributed' : Satoshi,
    'fees_paid' : Satoshi,
  });
  const Result_1 = IDL.Variant({ 'ok' : InheritanceResult, 'err' : IDL.Text });
  const Page = IDL.Vec(IDL.Nat8);
  const BlockHash = IDL.Vec(IDL.Nat8);
  const OutPoint = IDL.Record({
    'txid' : IDL.Vec(IDL.Nat8),
    'vout' : IDL.Nat32,
  });
  const Utxo = IDL.Record({
    'height' : IDL.Nat32,
    'value' : Satoshi,
    'outpoint' : OutPoint,
  });
  const GetUtxosResponse = IDL.Record({
    'next_page' : IDL.Opt(Page),
    'tip_height' : IDL.Nat32,
    'tip_block_hash' : BlockHash,
    'utxos' : IDL.Vec(Utxo),
  });
  const Allocation = IDL.Variant({ 'percentage' : IDL.Nat });
  const Heir = IDL.Record({
    'id' : HeirId,
    'bitcoin_address' : BitcoinAddress,
    'added_at' : Timestamp,
    'allocation' : Allocation,
  });
  const InactivityStatus = IDL.Record({
    'seconds_since_activity' : IDL.Nat,
    'seconds_until_inheritance' : IDL.Opt(IDL.Nat),
    'can_trigger_inheritance' : IDL.Bool,
    'is_active' : IDL.Bool,
  });
  const AccountStatus = IDL.Variant({
    'active' : IDL.Null,
    'inherited' : IDL.Null,
    'inactive' : IDL.Null,
    'frozen' : IDL.Null,
  });
  const UserProfile = IDL.Record({
    'last_login' : Timestamp,
    'principal' : IDL.Principal,
    'bitcoin_address' : IDL.Opt(BitcoinAddress),
    'inactivity_period_days' : IDL.Nat,
    'derivation_path' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'created_at' : Timestamp,
    'last_activity' : Timestamp,
    'last_bitcoin_activity' : IDL.Opt(Timestamp),
    'account_status' : AccountStatus,
  });
  const UserStatus = IDL.Record({
    'bitcoin_balance' : IDL.Opt(Satoshi),
    'days_since_activity' : IDL.Nat,
    'days_until_inheritance' : IDL.Opt(IDL.Nat),
    'is_inactive' : IDL.Bool,
    'profile' : UserProfile,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const HeirLock = IDL.Service({
    'add_heir' : IDL.Func([AddHeirRequest], [Result_2], []),
    'check_and_trigger_inheritance' : IDL.Func([], [Result_1], []),
    'generate_bitcoin_address' : IDL.Func([], [BitcoinAddress], []),
    'get_address_balance' : IDL.Func([IDL.Text], [Satoshi], []),
    'get_address_utxos' : IDL.Func([IDL.Text], [GetUtxosResponse], []),
    'get_balance' : IDL.Func([], [Satoshi], []),
    'get_bitcoin_address' : IDL.Func([], [IDL.Opt(BitcoinAddress)], []),
    'get_heirs' : IDL.Func([], [IDL.Vec(Heir)], []),
    'get_inactivity_status' : IDL.Func([], [IDL.Opt(InactivityStatus)], []),
    'get_profile' : IDL.Func([], [IDL.Opt(UserProfile)], []),
    'get_total_allocation' : IDL.Func([], [IDL.Nat], []),
    'get_user_status' : IDL.Func([], [IDL.Opt(UserStatus)], []),
    'heartbeat' : IDL.Func([], [], []),
    'login' : IDL.Func([], [UserProfile], []),
    'remove_heir' : IDL.Func([HeirId], [Result], []),
    'set_inactivity_period' : IDL.Func([IDL.Nat], [Result], []),
    'trigger_inheritance_check' : IDL.Func([], [], []),
  });
  return HeirLock;
};
export const init = ({ IDL }) => {
  const Network = IDL.Variant({
    'mainnet' : IDL.Null,
    'regtest' : IDL.Null,
    'testnet' : IDL.Null,
  });
  return [Network];
};
