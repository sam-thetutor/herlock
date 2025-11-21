import { useCallback, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useAuthStore } from '../store/authStore';
import { createAgent } from '../canister/agent';
import { INTERNET_IDENTITY_CANISTER_ID, IC_HOST } from '../utils/constants';
import toast from 'react-hot-toast';

export function useAuth() {
  const { identity, principal, isAuthenticated, setIdentity, logout } = useAuthStore();

  // Initialize auth client on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const authClient = await AuthClient.create();
        const isAuthenticated = await authClient.isAuthenticated();
        
        if (isAuthenticated) {
          const identity = authClient.getIdentity();
          setIdentity(identity);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    }
    
    initAuth();
  }, [setIdentity]);

  const login = useCallback(async () => {
    try {
      const authClient = await AuthClient.create();
      
      const isLocal = IC_HOST.includes('localhost') || IC_HOST.includes('127.0.0.1');
      
      // Use local Internet Identity if available, otherwise use mainnet
      // Use subdomain format to avoid asset routing issues
      const identityProvider = isLocal && INTERNET_IDENTITY_CANISTER_ID
        ? `http://${INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`
        : 'https://identity.ic0.app';
      
      console.log('Using identity provider:', identityProvider);
      
      await authClient.login({
        identityProvider,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
        },
        onError: (error) => {
          console.error('Login failed:', error);
          toast.error('Login failed. Please try again.');
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to initialize authentication. Please try again.');
    }
  }, [setIdentity]);

  const handleLogout = useCallback(async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.logout();
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      logout(); // Still clear local state
    }
  }, [logout]);

  const getAgent = useCallback(async () => {
    if (!identity) {
      throw new Error('Not authenticated');
    }
    return createAgent(identity);
  }, [identity]);

  return {
    identity,
    principal,
    isAuthenticated,
    login,
    logout: handleLogout,
    getAgent,
  };
}

