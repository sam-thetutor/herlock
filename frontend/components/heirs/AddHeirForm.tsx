'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAddHeir, useTotalAllocation } from '@/lib/hooks/useHeirlock';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function AddHeirForm() {
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [allocationPercentage, setAllocationPercentage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: totalAllocation } = useTotalAllocation();
  const { mutate: addHeir, isPending } = useAddHeir();

  // Convert BigInt to number for calculations
  const totalAllocationNum = totalAllocation !== undefined 
    ? (typeof totalAllocation === 'bigint' ? Number(totalAllocation) : totalAllocation)
    : 0;

  const validateAddress = (address: string): boolean => {
    // Basic Bitcoin address validation
    // P2PKH addresses start with 1 (mainnet) or m/n (testnet)
    // P2SH addresses start with 3 (mainnet) or 2 (testnet)
    // Bech32 addresses start with bc1 (mainnet) or tb1 (testnet)
    const patterns = [
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // P2PKH/P2SH mainnet
      /^[mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // P2PKH/P2SH testnet
      /^bc1[a-z0-9]{39,59}$/, // Bech32 mainnet
      /^tb1[a-z0-9]{39,59}$/, // Bech32 testnet
    ];
    return patterns.some((pattern) => pattern.test(address));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!bitcoinAddress.trim()) {
      setError('Bitcoin address is required');
      return;
    }

    if (!validateAddress(bitcoinAddress.trim())) {
      setError('Invalid Bitcoin address format');
      return;
    }

    const percentage = parseFloat(allocationPercentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      setError('Allocation must be between 1 and 100');
      return;
    }

    const newTotal = totalAllocationNum + percentage;
    if (newTotal > 100) {
      setError(
        `Total allocation would be ${newTotal.toFixed(1)}%. Maximum is 100%.`
      );
      return;
    }

    addHeir(
      {
        bitcoin_address: bitcoinAddress.trim(),
        allocation_percentage: Math.round(percentage),
      },
      {
        onSuccess: (result) => {
          if ('err' in result) {
            setError(result.err);
            toast.error(result.err);
          } else {
            setSuccess(true);
            setBitcoinAddress('');
            setAllocationPercentage('');
            toast.success('Heir added successfully!');
            setTimeout(() => setSuccess(false), 3000);
          }
        },
        onError: (err) => {
          const errorMsg = err instanceof Error ? err.message : 'Failed to add heir';
          setError(errorMsg);
          toast.error(errorMsg);
        },
      }
    );
  };

  const remainingAllocation = 100 - totalAllocationNum;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Heir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 flex-1">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 flex-1">
                Heir added successfully!
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="bitcoin-address" className="text-sm font-medium text-gray-700">
              Bitcoin Address
            </label>
            <input
              id="bitcoin-address"
              type="text"
              value={bitcoinAddress}
              onChange={(e) => {
                setBitcoinAddress(e.target.value);
                setError(null);
              }}
              placeholder="Enter Bitcoin address (e.g., mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7931A] focus:border-transparent"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="allocation" className="text-sm font-medium text-gray-700">
              Allocation Percentage
            </label>
            <div className="flex items-center gap-2">
              <input
                id="allocation"
                type="number"
                min="1"
                max="100"
                step="1"
                value={allocationPercentage}
                onChange={(e) => {
                  setAllocationPercentage(e.target.value);
                  setError(null);
                }}
                placeholder="0"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7931A] focus:border-transparent"
                disabled={isPending}
              />
              <span className="text-gray-600">%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                Current total: <span className="font-medium">{totalAllocationNum}%</span>
              </span>
              <span className="text-gray-600">
                Remaining: <span className="font-medium">{remainingAllocation.toFixed(1)}%</span>
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || !bitcoinAddress.trim() || !allocationPercentage}
            className="w-full"
          >
            {isPending ? 'Adding Heir...' : 'Add Heir'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

