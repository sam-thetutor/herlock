import { Actor, HttpAgent } from '@dfinity/agent';
import { HEIRLOCK_CANISTER_ID } from '../utils/constants';
import { idlFactory } from './heirlock.did';

// Types (will be generated from Candid)
export interface HeirlockCanister {
  login: () => Promise<UserProfile>;
  get_profile: () => Promise<UserProfile | null>;
  get_user_status: () => Promise<UserStatus | null>;
  generate_bitcoin_address: () => Promise<string>;
  get_bitcoin_address: () => Promise<string | null>;
  get_balance: () => Promise<bigint>;
  add_heir: (request: AddHeirRequest) => Promise<Result<number, string>>;
  remove_heir: (heirId: number) => Promise<Result<void, string>>;
  get_heirs: () => Promise<Heir[]>;
  get_total_allocation: () => Promise<number>;
  set_inactivity_period: (seconds: number) => Promise<Result<void, string>>;
  get_inactivity_status: () => Promise<InactivityStatus | null>;
  heartbeat: () => Promise<void>;
  trigger_inheritance_check: () => Promise<void>;
  get_address_balance: (address: string) => Promise<bigint>;
  get_address_utxos: (address: string) => Promise<any>;
  send_bitcoin: (recipientAddress: string, amount: bigint) => Promise<Result<string, string>>;
}

// Type definitions (simplified - should match Motoko types)
export interface UserProfile {
  principal: string;
  last_login: bigint;
  bitcoin_address: string | null;
  inactivity_period_days: number;
  created_at: bigint;
  last_activity: bigint;
  last_bitcoin_activity: bigint | null;
  account_status: { active: null } | { inactive: null } | { inherited: null } | { frozen: null };
}

export interface UserStatus {
  profile: UserProfile;
  days_since_activity: number;
  is_inactive: boolean;
  days_until_inheritance: number | null;
  bitcoin_balance: bigint | null;
}

export interface Heir {
  id: number;
  bitcoin_address: string;
  added_at: bigint;
  allocation: { percentage: number };
}

export interface AddHeirRequest {
  bitcoin_address: string;
  allocation_percentage: number;
}

export interface InactivityStatus {
  is_active: boolean;
  days_since_activity: number;
  days_until_inheritance: number | null;
  can_trigger_inheritance: boolean;
}

export type Result<Ok, Err> = { ok: Ok } | { err: Err };

/**
 * Create Heirlock canister actor
 */
export async function createHeirlockActor(
  agent: HttpAgent
): Promise<HeirlockCanister> {
  return Actor.createActor(idlFactory as any, {
    agent,
    canisterId: HEIRLOCK_CANISTER_ID,
  }) as unknown as HeirlockCanister;
}

