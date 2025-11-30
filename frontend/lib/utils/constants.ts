// Application constants
export const IC_HOST = process.env.NEXT_PUBLIC_IC_HOST || 'https://identity.ic0.app';
export const HEIRLOCK_CANISTER_ID =
  process.env.NEXT_PUBLIC_HEIRLOCK_CANISTER_ID || 'uxrrr-q7777-77774-qaaaq-cai';
export const INTERNET_IDENTITY_CANISTER_ID =
  process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || 'uzt4z-lp777-77774-qaabq-cai';
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'ic';

// Canister configuration
export const canisterConfig = {
  heirlock: {
    canisterId: HEIRLOCK_CANISTER_ID,
  },
};

// App configuration
export const APP_CONFIG = {
  balanceRefreshInterval: 30000, // 30 seconds
  statusRefreshInterval: 60000, // 60 seconds
  inactivityPeriodMin: 30, // seconds (backend minimum)
  inactivityPeriodMax: 31_536_000, // 1 year in seconds
};

