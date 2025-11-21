import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AccountStatus = { 'active' : null } |
  { 'inherited' : null } |
  { 'inactive' : null } |
  { 'frozen' : null };
export interface AddHeirRequest {
  'bitcoin_address' : BitcoinAddress,
  'allocation_percentage' : bigint,
}
export type Allocation = { 'percentage' : bigint };
export type BitcoinAddress = string;
export type BlockHash = Uint8Array | number[];
export interface GetUtxosResponse {
  'next_page' : [] | [Page],
  'tip_height' : number,
  'tip_block_hash' : BlockHash,
  'utxos' : Array<Utxo>,
}
export interface Heir {
  'id' : HeirId,
  'bitcoin_address' : BitcoinAddress,
  'added_at' : Timestamp,
  'allocation' : Allocation,
}
export type HeirId = bigint;
export interface HeirLock {
  /**
   * / Add a new heir with allocation percentage
   */
  'add_heir' : ActorMethod<[AddHeirRequest], Result_2>,
  /**
   * / Check if user is inactive and trigger inheritance if conditions are met
   */
  'check_and_trigger_inheritance' : ActorMethod<[], Result_1>,
  /**
   * / Generate a unique Bitcoin address for the caller
   */
  'generate_bitcoin_address' : ActorMethod<[], BitcoinAddress>,
  /**
   * / Get balance for any Bitcoin address
   */
  'get_address_balance' : ActorMethod<[string], Satoshi>,
  /**
   * / Get UTXOs (transaction history) for any Bitcoin address
   * / This shows all unspent transaction outputs for the address
   * / Note: This only shows UNSPENT transactions, not full history
   */
  'get_address_utxos' : ActorMethod<[string], GetUtxosResponse>,
  /**
   * / Get the Bitcoin balance for the caller's address
   */
  'get_balance' : ActorMethod<[], Satoshi>,
  /**
   * / Get the Bitcoin address for the caller
   */
  'get_bitcoin_address' : ActorMethod<[], [] | [BitcoinAddress]>,
  /**
   * / Get all heirs for the caller
   */
  'get_heirs' : ActorMethod<[], Array<Heir>>,
  /**
   * / Get inactivity status for the caller
   */
  'get_inactivity_status' : ActorMethod<[], [] | [InactivityStatus]>,
  /**
   * / Get user profile
   */
  'get_profile' : ActorMethod<[], [] | [UserProfile]>,
  /**
   * / Get total allocation percentage for the caller
   */
  'get_total_allocation' : ActorMethod<[], bigint>,
  /**
   * / Get user status including inactivity information
   */
  'get_user_status' : ActorMethod<[], [] | [UserStatus]>,
  /**
   * / Heartbeat endpoint - explicit activity signal
   * / Also triggers a check of all users for inheritance
   */
  'heartbeat' : ActorMethod<[], undefined>,
  /**
   * / Login endpoint - creates user if new, updates activity if existing
   */
  'login' : ActorMethod<[], UserProfile>,
  /**
   * / Remove a heir by ID
   */
  'remove_heir' : ActorMethod<[HeirId], Result>,
  /**
   * / Set the inactivity period in seconds (flexible for testing and production)
   * / Minimum: 30 seconds, Maximum: 31,536,000 seconds (1 year)
   */
  'set_inactivity_period' : ActorMethod<[bigint], Result>,
  /**
   * / Manual trigger for inheritance check (for testing/debugging)
   * / This simulates what the timer does automatically
   * / Note: This does NOT update user activity (unlike heartbeat)
   */
  'trigger_inheritance_check' : ActorMethod<[], undefined>,
}
export interface InactivityStatus {
  'seconds_since_activity' : bigint,
  'seconds_until_inheritance' : [] | [bigint],
  'can_trigger_inheritance' : boolean,
  'is_active' : boolean,
}
export interface InheritanceResult {
  'execution_timestamp' : Timestamp,
  'transaction_ids' : Array<string>,
  'heir_count' : bigint,
  'total_distributed' : Satoshi,
  'fees_paid' : Satoshi,
}
export type Network = { 'mainnet' : null } |
  { 'regtest' : null } |
  { 'testnet' : null };
export interface OutPoint { 'txid' : Uint8Array | number[], 'vout' : number }
export type Page = Uint8Array | number[];
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : InheritanceResult } |
  { 'err' : string };
export type Result_2 = { 'ok' : HeirId } |
  { 'err' : string };
export type Satoshi = bigint;
export type Timestamp = bigint;
export interface UserProfile {
  'last_login' : Timestamp,
  'principal' : Principal,
  'bitcoin_address' : [] | [BitcoinAddress],
  'inactivity_period_days' : bigint,
  'derivation_path' : Array<Uint8Array | number[]>,
  'created_at' : Timestamp,
  'last_activity' : Timestamp,
  'last_bitcoin_activity' : [] | [Timestamp],
  'account_status' : AccountStatus,
}
export interface UserStatus {
  'bitcoin_balance' : [] | [Satoshi],
  'days_since_activity' : bigint,
  'days_until_inheritance' : [] | [bigint],
  'is_inactive' : boolean,
  'profile' : UserProfile,
}
export interface Utxo {
  'height' : number,
  'value' : Satoshi,
  'outpoint' : OutPoint,
}
export interface _SERVICE extends HeirLock {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
