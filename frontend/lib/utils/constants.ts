// Application constants
export const IC_HOST = process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943';
export const HEIRLOCK_CANISTER_ID = process.env.NEXT_PUBLIC_HEIRLOCK_CANISTER_ID || '';
export const INTERNET_IDENTITY_CANISTER_ID = process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || '';
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'local';

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
  inactivityPeriodMin: 30, // seconds (for testing)
  inactivityPeriodMax: 120, // seconds (for testing)
};

