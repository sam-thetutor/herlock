'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBitcoinAddress, useGenerateBitcoinAddress } from '@/lib/hooks/useHeirlock';
import { formatBitcoinAddress } from '@/lib/utils/format';
import { Copy, Check, Wallet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function BitcoinAddress() {
  const { data: address, isLoading } = useBitcoinAddress();
  const { mutate: generateAddress, isPending: isGenerating } = useGenerateBitcoinAddress();
  const [copied, setCopied] = useState(false);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Bitcoin Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        )}
        {!isLoading && !address && (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">No Bitcoin address generated yet.</p>
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
                'Generate Address'
              )}
            </Button>
          </div>
        )}
        {address && (
          <div className="space-y-3">
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
        )}
      </CardContent>
    </Card>
  );
}

