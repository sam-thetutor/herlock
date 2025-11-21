'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { BitcoinAddress } from '@/components/dashboard/BitcoinAddress';
import { InactivityStatus } from '@/components/dashboard/InactivityStatus';
import { ActivityTimer } from '@/components/dashboard/ActivityTimer';

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Manage your Bitcoin inheritance settings"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceCard />
        <BitcoinAddress />
        <InactivityStatus />
        <ActivityTimer />
      </div>
    </DashboardLayout>
  );
}
