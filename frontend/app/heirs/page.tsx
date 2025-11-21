'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeirList } from '@/components/heirs/HeirList';
import { AddHeirForm } from '@/components/heirs/AddHeirForm';

export default function HeirsPage() {
  return (
    <DashboardLayout
      title="Heir Management"
      description="Add and manage your Bitcoin inheritance beneficiaries"
    >
      <div className="space-y-6">
        <AddHeirForm />
        <HeirList />
      </div>
    </DashboardLayout>
  );
}

