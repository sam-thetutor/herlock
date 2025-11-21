'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InactivityPeriodSettings } from '@/components/settings/InactivityPeriodSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Settings"
      description="Configure your account and inheritance preferences"
    >
      <div className="space-y-6">
        <InactivityPeriodSettings />
        <AccountSettings />
      </div>
    </DashboardLayout>
  );
}

