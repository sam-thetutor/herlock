'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBalance } from '@/lib/hooks/useHeirlock';
import { formatBalance, formatSatoshi } from '@/lib/utils/format';
import { Bitcoin } from 'lucide-react';
import { BalanceSkeleton } from '@/components/common/LoadingSkeleton';

export function BalanceCard() {
  const { data: balance, isLoading, error } = useBalance();

  if (isLoading) {
    return <BalanceSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-[#F7931A]" />
            Bitcoin Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">Error loading balance</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5 text-[#F7931A]" />
          Bitcoin Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {balance !== undefined && (
          <div className="space-y-2">
            <div className="text-3xl font-bold text-[#F7931A]">
              {formatBalance(balance)}
            </div>
            <div className="text-sm text-gray-500">
              {formatSatoshi(balance)} satoshis
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

