'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBalance, useBitcoinAddress, useGenerateBitcoinAddress } from '@/lib/hooks/useHeirlock';
import { formatBalance, formatSatoshi, formatBitcoinAddress } from '@/lib/utils/format';
import { Bitcoin, Copy, Check, Wallet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { BalanceSkeleton } from '@/components/common/LoadingSkeleton';

export function BitcoinWalletCard() {
  const { data: balance, isLoading: isLoadingBalance, error: balanceError } = useBalance();
  const { data: address, isLoading: isLoadingAddress } = useBitcoinAddress();
  const { mutate: generateAddress, isPending: isGenerating } = useGenerateBitcoinAddress();
  const [copied, setCopied] = useState(false);

  const isLoading = isLoadingBalance || isLoadingAddress;

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = () => {
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
    return <BalanceSkeleton />;
  }

  if (balanceError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-[#F7931A]" />
            Bitcoin Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">Error loading wallet information</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5 text-[#F7931A]" />
          Bitcoin Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!address ? (
          // No address state - centered layout
          <div className="space-y-4">
            {balance !== undefined && (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-[#F7931A]">
                  {formatBalance(balance)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatSatoshi(balance)} satoshis
                </div>
              </div>
            )}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-700 mb-3">No Bitcoin address generated yet.</p>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Generate Address
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Two-column layout: Left (Balance + Address), Right (QR Code)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Balance + Address */}
            <div className="space-y-4">
              {/* Balance Section */}
              {balance !== undefined && (
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#F7931A]">
                    {formatBalance(balance)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatSatoshi(balance)} satoshis
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t pt-4">
                {/* Address Section */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Bitcoin Address</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <code className="flex-1 text-sm font-mono break-all text-gray-900">
                      {address}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Display: {formatBitcoinAddress(address)}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Regenerate Address
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: QR Code */}
            <div className="flex items-center justify-center">
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <QRCodeSVG
                  value={address}
                  size={200}
                  level="M"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
                <p className="text-xs text-center text-gray-500 mt-2">
                  Scan to receive Bitcoin
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

