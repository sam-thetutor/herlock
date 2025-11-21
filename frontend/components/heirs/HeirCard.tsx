'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRemoveHeir, useHeirBalance } from '@/lib/hooks/useHeirlock';
import { formatBitcoinAddress, formatDate, formatBitcoin } from '@/lib/utils/format';
import { Trash2, Copy, Check, Wallet, Bitcoin } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Heir } from '@/lib/canister/heirlock';

interface HeirCardProps {
  heir: Heir;
}

export function HeirCard({ heir }: HeirCardProps) {
  const { mutate: removeHeir, isPending: isRemoving } = useRemoveHeir();
  const { data: balance, isLoading: isLoadingBalance } = useHeirBalance(heir.bitcoin_address);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(heir.bitcoin_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemove = () => {
    if (showConfirm) {
      removeHeir(heir.id, {
        onSuccess: (result) => {
          if ('err' in result) {
            toast.error(result.err);
          } else {
            toast.success('Heir removed successfully');
            setShowConfirm(false);
          }
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to remove heir');
        },
      });
    } else {
      setShowConfirm(true);
    }
  };

  const cancelRemove = () => {
    setShowConfirm(false);
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#F7931A]" />
            Heir #{heir.id}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showConfirm && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 mb-2">
              Are you sure you want to remove this heir?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleRemove}
                disabled={isRemoving}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isRemoving ? 'Removing...' : 'Confirm'}
              </Button>
              <Button size="sm" variant="outline" onClick={cancelRemove}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Bitcoin Balance */}
          <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Bitcoin className="h-4 w-4 text-[#F7931A]" />
              <div className="text-sm text-gray-600">Bitcoin Balance</div>
            </div>
            <div className="text-xl font-bold text-[#F7931A]">
              {isLoadingBalance ? (
                <span className="text-gray-400">Loading...</span>
              ) : balance !== undefined ? (
                formatBitcoin(balance)
              ) : (
                <span className="text-gray-400">0.00000000 BTC</span>
              )}
            </div>
            {balance !== undefined && balance > 0 && (
              <div className="text-xs text-gray-600 mt-1">
                {Number(balance).toLocaleString()} satoshis
              </div>
            )}
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Allocation</div>
            <div className="text-2xl font-bold text-[#F7931A]">
              {heir.allocation.percentage}%
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Bitcoin Address</div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <code className="flex-1 text-xs font-mono break-all text-gray-800">
                {formatBitcoinAddress(heir.bitcoin_address)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="shrink-0 h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Added</div>
            <div className="text-sm text-gray-800">
              {formatDate(heir.added_at)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

