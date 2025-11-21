'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const { logout, principal } = useAuth();

  if (!principal) {
    return null;
  }

  return (
    <Button onClick={logout} variant="outline" size="sm">
      Logout
    </Button>
  );
}

