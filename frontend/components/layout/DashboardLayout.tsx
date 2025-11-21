'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({
  children,
  title,
  description,
}: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <main className="flex-1 lg:pl-64">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {(title || description) && (
                <div className="mb-6">
                  {title && (
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                  )}
                  {description && (
                    <p className="text-gray-600 mt-1">{description}</p>
                  )}
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}

