'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function LoginButton() {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Button onClick={login} className="w-full">
      Connect Wallet
    </Button>
  );
}

