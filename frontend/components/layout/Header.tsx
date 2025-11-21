'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { MobileNav } from './MobileNav';
import { formatPrincipal } from '@/lib/utils/format';
import { Wallet } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'HeirLock' }: HeaderProps) {
  const { principal, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#F7931A]">{title}</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-[#F7931A] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/heirs"
                className="text-gray-700 hover:text-[#F7931A] transition-colors"
              >
                Heirs
              </Link>
              <Link
                href="/settings"
                className="text-gray-700 hover:text-[#F7931A] transition-colors"
              >
                Settings
              </Link>
            </nav>
            <MobileNav />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wallet className="h-4 w-4" />
              <span className="font-mono hidden sm:inline">
                {formatPrincipal(principal || '')}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}

