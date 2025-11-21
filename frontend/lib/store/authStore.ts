import { create } from 'zustand';
import { Identity } from '@dfinity/agent';

interface AuthState {
  identity: Identity | null;
  principal: string | null;
  isAuthenticated: boolean;
  setIdentity: (identity: Identity | null) => void;
  setPrincipal: (principal: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  identity: null,
  principal: null,
  isAuthenticated: false,
  setIdentity: (identity) => {
    const principal = identity ? identity.getPrincipal().toText() : null;
    set({
      identity,
      principal,
      isAuthenticated: identity !== null,
    });
  },
  setPrincipal: (principal) => {
    set({ principal, isAuthenticated: principal !== null });
  },
  logout: () => {
    set({
      identity: null,
      principal: null,
      isAuthenticated: false,
    });
  },
}));

