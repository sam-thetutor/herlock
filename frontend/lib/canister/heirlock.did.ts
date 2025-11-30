// This is a placeholder for the generated Candid interface
// In production, this should be generated using: didc bind or dfx generate
// For now, we'll create a minimal IDL factory

import { IDL } from '@dfinity/candid';

export const idlFactory = (idl: { IDL: typeof IDL }) => {
  const IDLType = idl.IDL;
  return IDLType.Service({
    login: IDLType.Func([], [IDLType.Record({
      principal: IDLType.Principal,
      last_login: IDLType.Nat64,
      bitcoin_address: IDLType.Opt(IDLType.Text),
      inactivity_period_days: IDLType.Nat,
      created_at: IDLType.Nat64,
      last_activity: IDLType.Nat64,
      last_bitcoin_activity: IDLType.Opt(IDLType.Nat64),
      account_status: IDLType.Variant({
        active: IDLType.Null,
        inactive: IDLType.Null,
        inherited: IDLType.Null,
        frozen: IDLType.Null,
      }),
    })], []),
    get_profile: IDLType.Func([], [IDLType.Opt(IDLType.Record({
      principal: IDLType.Principal,
      last_login: IDLType.Nat64,
      bitcoin_address: IDLType.Opt(IDLType.Text),
      inactivity_period_days: IDLType.Nat,
      created_at: IDLType.Nat64,
      last_activity: IDLType.Nat64,
      last_bitcoin_activity: IDLType.Opt(IDLType.Nat64),
      account_status: IDLType.Variant({
        active: IDLType.Null,
        inactive: IDLType.Null,
        inherited: IDLType.Null,
        frozen: IDLType.Null,
      }),
    }))], []),
    get_user_status: IDLType.Func([], [IDLType.Opt(IDLType.Record({
      profile: IDLType.Record({
        principal: IDLType.Principal,
        last_login: IDLType.Nat64,
        bitcoin_address: IDLType.Opt(IDLType.Text),
        inactivity_period_days: IDLType.Nat,
        created_at: IDLType.Nat64,
        last_activity: IDLType.Nat64,
        last_bitcoin_activity: IDLType.Opt(IDLType.Nat64),
        account_status: IDLType.Variant({
          active: IDLType.Null,
          inherited: IDLType.Null,
        }),
      }),
      days_since_activity: IDLType.Nat,
      is_inactive: IDLType.Bool,
      days_until_inheritance: IDLType.Opt(IDLType.Nat),
      bitcoin_balance: IDLType.Opt(IDLType.Nat64),
    }))], []),
    generate_bitcoin_address: IDLType.Func([], [IDLType.Text], []),
    get_bitcoin_address: IDLType.Func([], [IDLType.Opt(IDLType.Text)], []),
    get_balance: IDLType.Func([], [IDLType.Nat64], []),
    add_heir: IDLType.Func([
      IDLType.Record({
        bitcoin_address: IDLType.Text,
        allocation_percentage: IDLType.Nat,
      }),
    ], [
      IDLType.Variant({
        ok: IDLType.Nat,
        err: IDLType.Text,
      }),
    ], []),
    remove_heir: IDLType.Func([IDLType.Nat], [
      IDLType.Variant({
        ok: IDLType.Null,
        err: IDLType.Text,
      }),
    ], []),
    get_heirs: IDLType.Func([], [IDLType.Vec(IDLType.Record({
      id: IDLType.Nat,
      bitcoin_address: IDLType.Text,
      added_at: IDLType.Nat64,
      allocation: IDLType.Variant({
        percentage: IDLType.Nat,
      }),
    }))], []),
    get_total_allocation: IDLType.Func([], [IDLType.Nat], []),
    set_inactivity_period: IDLType.Func([IDLType.Nat], [
      IDLType.Variant({
        ok: IDLType.Null,
        err: IDLType.Text,
      }),
    ], []),
    get_inactivity_status: IDLType.Func([], [IDLType.Opt(IDLType.Record({
      is_active: IDLType.Bool,
      seconds_since_activity: IDLType.Nat,
      seconds_until_inheritance: IDLType.Opt(IDLType.Nat),
      can_trigger_inheritance: IDLType.Bool,
    }))], []),
    heartbeat: IDLType.Func([], [], []),
    trigger_inheritance_check: IDLType.Func([], [], []),
    get_address_balance: IDLType.Func([IDLType.Text], [IDLType.Nat64], []),
    get_address_utxos: IDLType.Func([IDLType.Text], [IDLType.Record({
      tip_height: IDLType.Nat32,
      tip_block_hash: IDLType.Vec(IDLType.Nat8),
      utxos: IDLType.Vec(IDLType.Record({
        outpoint: IDLType.Record({
          txid: IDLType.Vec(IDLType.Nat8),
          vout: IDLType.Nat32,
        }),
        value: IDLType.Nat64,
        height: IDLType.Nat32,
      })),
      next_page: IDLType.Opt(IDLType.Vec(IDLType.Nat8)),
    })], []),
    send_bitcoin: IDLType.Func(
      [IDLType.Text, IDLType.Nat64], // [recipient_address, amount]
      [
        IDLType.Variant({
          ok: IDLType.Text, // transaction ID
          err: IDLType.Text, // error message
        }),
      ],
      []
    ),
  });
};
