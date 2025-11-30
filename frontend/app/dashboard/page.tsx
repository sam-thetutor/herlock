'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BitcoinWalletCard } from '@/components/dashboard/BitcoinWalletCard';
import { InactivityStatus } from '@/components/dashboard/InactivityStatus';
import { ActivityTimer } from '@/components/dashboard/ActivityTimer';
import { SendBitcoinForm } from '@/components/dashboard/SendBitcoinForm';

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Manage your Bitcoin inheritance settings"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BitcoinWalletCard />
        <SendBitcoinForm />
        <InactivityStatus />
        <ActivityTimer />
      </div>
    </DashboardLayout>
  );
}
