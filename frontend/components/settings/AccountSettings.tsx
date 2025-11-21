'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile, useGenerateBitcoinAddress, useBitcoinAddress } from '@/lib/hooks/useHeirlock';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatDate, formatPrincipal, formatBitcoinAddress } from '@/lib/utils/format';
import { User, Wallet, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function AccountSettings() {
  const { data: profile, isLoading } = useProfile();
  const { principal } = useAuth();
  const { data: address } = useBitcoinAddress();
  const { mutate: generateAddress, isPending: isGenerating } = useGenerateBitcoinAddress();

  const handleGenerateAddress = () => {
    generateAddress(undefined, {
      onSuccess: (newAddress) => {
        toast.success('Bitcoin address generated successfully!');
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to generate address');
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">Error loading account information</div>
        </CardContent>
      </Card>
    );
  }

  // Safely check account_status
  const accountStatusObj = profile.account_status;
  const isActive = accountStatusObj && 'active' in accountStatusObj;
  const accountStatus = isActive ? 'Active' : 'Inherited';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>
          View your account details and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <User className="h-4 w-4" />
                Principal
              </div>
              <div className="text-sm font-mono text-gray-900 break-all">
                {formatPrincipal(principal || '')}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                {isActive ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                )}
                Account Status
              </div>
              <div className={`text-sm font-semibold ${isActive ? 'text-green-700' : 'text-orange-700'}`}>
                {accountStatus}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Bitcoin Address
              </div>
              <div className="text-sm font-mono text-gray-900 break-all">
                {address ? address : 'Not generated'}
              </div>
              {!address && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAddress}
                  disabled={isGenerating}
                  className="mt-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-3 w-3" />
                      Generate Address
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Account Created
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(profile.created_at)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Login
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(profile.last_login)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Activity
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(profile.last_activity)}
              </div>
            </div>
          </div>

          {profile.last_bitcoin_activity && (
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-1">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Last Bitcoin Activity
                </div>
                <div className="text-sm text-gray-900">
                  {formatDate(profile.last_bitcoin_activity)}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

