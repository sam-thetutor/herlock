'use client';

import { LoginButton } from '@/components/auth/LoginButton';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <main className="flex flex-col items-center justify-center space-y-8 p-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[#F7931A]">HeirLock</h1>
          <p className="text-xl text-gray-700 max-w-md">
            Secure Bitcoin inheritance on the Internet Computer
          </p>
        </div>
        
        <div className="space-y-4 w-full max-w-sm">
          <LoginButton />
          <p className="text-sm text-gray-600">
            Connect your Internet Computer identity to get started
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg shadow-lg border-2 border-orange-200 hover:border-[#F7931A] transition-all duration-300 hover:shadow-xl">
            <h3 className="font-bold text-xl mb-2 text-[#F7931A]">🔐 Secure</h3>
            <p className="text-gray-700 text-sm">
              Your Bitcoin is secured by smart contracts on ICP
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg shadow-lg border-2 border-orange-200 hover:border-[#F7931A] transition-all duration-300 hover:shadow-xl">
            <h3 className="font-bold text-xl mb-2 text-[#F7931A]">⏰ Automatic</h3>
            <p className="text-gray-700 text-sm">
              Automatic inheritance after inactivity period
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg shadow-lg border-2 border-orange-200 hover:border-[#F7931A] transition-all duration-300 hover:shadow-xl">
            <h3 className="font-bold text-xl mb-2 text-[#F7931A]">👥 Flexible</h3>
            <p className="text-gray-700 text-sm">
              Designate multiple heirs with custom allocations
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
