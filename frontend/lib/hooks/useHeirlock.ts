import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { createHeirlockActor } from '../canister/heirlock';

/**
 * Hook to get Heirlock canister actor
 */
export function useHeirlockActor() {
  const { getAgent } = useAuth();

  return useQuery({
    queryKey: ['heirlock-actor'],
    queryFn: async () => {
      const agent = await getAgent();
      return createHeirlockActor(agent);
    },
    enabled: !!getAgent,
    staleTime: Infinity, // Actor doesn't change
  });
}

/**
 * Hook to get user profile
 */
export function useProfile() {
  const { data: actor } = useHeirlockActor();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      const result = await actor.get_profile();
      // Backend returns [] | [UserProfile], so we need to extract the first element
      return Array.isArray(result) && result.length > 0 ? result[0] : result;
    },
    enabled: !!actor,
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook to get user status (comprehensive)
 */
export function useUserStatus() {
  const { data: actor } = useHeirlockActor();

  return useQuery({
    queryKey: ['user-status'],
    queryFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      const result = await actor.get_user_status();
      // Backend returns [] | [UserStatus], extract first element if array
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    },
    enabled: !!actor,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook to get Bitcoin balance
 */
export function useBalance() {
  const { data: actor } = useHeirlockActor();

  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      return actor.get_balance();
    },
    enabled: !!actor,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook to get Bitcoin address
 */
export function useBitcoinAddress() {
  const { data: actor } = useHeirlockActor();

  return useQuery({
    queryKey: ['bitcoin-address'],
    queryFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      const result = await actor.get_bitcoin_address();
      // Backend returns [] | [BitcoinAddress], extract first element if array
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    },
    enabled: !!actor,
  });
}

/**
 * Hook to get inactivity status
 */
export function useInactivityStatus() {
  const { data: actor } = useHeirlockActor();

  return useQuery({
    queryKey: ['inactivity-status'],
    queryFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      const result = await actor.get_inactivity_status();
      // Backend returns [] | [InactivityStatus], extract first element if array
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    },
    enabled: !!actor,
    refetchInterval: 10000, // Refetch every 10 seconds for countdown
  });
}

/**
 * Hook to generate Bitcoin address
 */
export function useGenerateBitcoinAddress() {
  const { data: actor } = useHeirlockActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      return actor.generate_bitcoin_address();
    },
    onSuccess: () => {
      // Invalidate and refetch address
      queryClient.invalidateQueries({ queryKey: ['bitcoin-address'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/**
 * Hook to send heartbeat (update activity)
 */
export function useHeartbeat() {
  const { data: actor } = useHeirlockActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      return actor.heartbeat();
    },
    onSuccess: () => {
      // Invalidate and refetch status
      queryClient.invalidateQueries({ queryKey: ['inactivity-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-status'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/**
 * Hook to get all heirs
 */
export function useHeirs() {
  const { data: actor } = useHeirlockActor();

  return useQuery({
    queryKey: ['heirs'],
    queryFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      return actor.get_heirs();
    },
    enabled: !!actor,
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook to get total allocation
 */
export function useTotalAllocation() {
  const { data: actor } = useHeirlockActor();

  return useQuery({
    queryKey: ['total-allocation'],
    queryFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      return actor.get_total_allocation();
    },
    enabled: !!actor,
  });
}

/**
 * Hook to add a new heir
 */
export function useAddHeir() {
  const { data: actor } = useHeirlockActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: { bitcoin_address: string; allocation_percentage: number }) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.add_heir(request);
    },
    onSuccess: () => {
      // Invalidate and refetch heirs and allocation
      queryClient.invalidateQueries({ queryKey: ['heirs'] });
      queryClient.invalidateQueries({ queryKey: ['total-allocation'] });
    },
  });
}

/**
 * Hook to remove a heir
 */
export function useRemoveHeir() {
  const { data: actor } = useHeirlockActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (heirId: number) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.remove_heir(heirId);
    },
    onSuccess: () => {
      // Invalidate and refetch heirs and allocation
      queryClient.invalidateQueries({ queryKey: ['heirs'] });
      queryClient.invalidateQueries({ queryKey: ['total-allocation'] });
    },
  });
}

/**
 * Hook to set inactivity period
 */
export function useSetInactivityPeriod() {
  const { data: actor } = useHeirlockActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (seconds: number) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.set_inactivity_period(seconds);
    },
    onSuccess: () => {
      // Invalidate and refetch profile and status
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['inactivity-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-status'] });
    },
  });
}

/**
 * Hook to get Bitcoin balance for any address
 */
export function useHeirBalance(address: string) {
  const { data: actor } = useHeirlockActor();

  return useQuery({
    queryKey: ['heir-balance', address],
    queryFn: async () => {
      if (!actor) throw new Error('Not authenticated');
      const balance = await actor.get_address_balance(address);
      return balance;
    },
    enabled: !!actor && !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook to send Bitcoin to a recipient address
 */
export function useSendBitcoin() {
  const { data: actor } = useHeirlockActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipientAddress, amount }: { recipientAddress: string; amount: bigint }) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.send_bitcoin(recipientAddress, amount);
    },
    onSuccess: () => {
      // Invalidate balance, profile, and inactivity status queries
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['inactivity-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-status'] });
    },
  });
}
