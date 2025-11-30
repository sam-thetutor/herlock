'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSendBitcoin, useBalance, useProfile } from '@/lib/hooks/useHeirlock';
import { Send, Bitcoin, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { isValidBitcoinAddress, btcToSatoshi, formatSatoshiToBTC, formatBitcoin } from '@/lib/utils/format';

// Estimated fee in satoshis (0.0001 BTC = 10,000 satoshis)
const ESTIMATED_FEE = BigInt(10000);

export function SendBitcoinForm() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amountBtc, setAmountBtc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const { data: balance } = useBalance();
  const { data: profile } = useProfile();
  const { mutate: sendBitcoin, isPending } = useSendBitcoin();

  // Check if account is inherited or frozen
  const accountStatus = profile?.account_status;
  const isAccountBlocked = accountStatus && ('inherited' in accountStatus || 'frozen' in accountStatus);
  const accountStatusMessage = accountStatus && 'inherited' in accountStatus
    ? 'Account has been inherited. Cannot send Bitcoin.'
    : accountStatus && 'frozen' in accountStatus
    ? 'Account is frozen. Cannot send Bitcoin.'
    : null;

  // Calculate available balance (balance - estimated fee)
  const availableBalance = useMemo(() => {
    if (!balance) return BigInt(0);
    const bal = typeof balance === 'bigint' ? balance : BigInt(balance);
    return bal > ESTIMATED_FEE ? bal - ESTIMATED_FEE : BigInt(0);
  }, [balance]);

  // Calculate amount in satoshis
  const amountSatoshi = useMemo(() => {
    if (!amountBtc.trim()) return BigInt(0);
    return btcToSatoshi(amountBtc);
  }, [amountBtc]);

  // Calculate total required (amount + fee)
  const totalRequired = useMemo(() => {
    return amountSatoshi + ESTIMATED_FEE;
  }, [amountSatoshi]);

  // Validate form
  const validateForm = (): boolean => {
    setError(null);

    if (!recipientAddress.trim()) {
      setError('Recipient address is required');
      return false;
    }

    if (!isValidBitcoinAddress(recipientAddress.trim())) {
      setError('Invalid Bitcoin address format');
      return false;
    }

    if (!amountBtc.trim()) {
      setError('Amount is required');
      return false;
    }

    const amountNum = parseFloat(amountBtc);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    if (!balance) {
      setError('Unable to fetch balance. Please try again.');
      return false;
    }

    const bal = typeof balance === 'bigint' ? balance : BigInt(balance);
    if (totalRequired > bal) {
      setError(
        `Insufficient balance. Required: ${formatBitcoin(totalRequired)}, Available: ${formatBitcoin(bal)}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAccountBlocked) {
      setError(accountStatusMessage || 'Cannot send Bitcoin');
      return;
    }

    if (!validateForm()) {
      return;
    }

    sendBitcoin(
      {
        recipientAddress: recipientAddress.trim(),
        amount: amountSatoshi,
      },
      {
        onSuccess: (result) => {
          if ('err' in result) {
            setError(result.err);
            toast.error(result.err);
          } else {
            setSuccess(true);
            setTransactionId(result.ok);
            setRecipientAddress('');
            setAmountBtc('');
            toast.success(`Bitcoin sent successfully! Transaction ID: ${result.ok.slice(0, 16)}...`);
            setTimeout(() => {
              setSuccess(false);
              setTransactionId(null);
            }, 10000);
          }
        },
        onError: (err) => {
          const errorMsg = err instanceof Error ? err.message : 'Failed to send Bitcoin';
          setError(errorMsg);
          toast.error(errorMsg);
        },
      }
    );
  };

  const handleSendMax = () => {
    if (availableBalance > BigInt(0)) {
      setAmountBtc(formatSatoshiToBTC(availableBalance));
      setError(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-[#F7931A]" />
          Send Bitcoin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 flex-1">{error}</p>
            </div>
          )}

          {success && transactionId && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-1">
                  Bitcoin sent successfully!
                </p>
                <p className="text-xs text-green-700 font-mono break-all">
                  TX ID: {transactionId}
                </p>
              </div>
            </div>
          )}

          {isAccountBlocked && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 flex-1">{accountStatusMessage}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="recipient-address" className="text-sm font-medium text-gray-700">
              Recipient Address
            </label>
            <input
              id="recipient-address"
              type="text"
              value={recipientAddress}
              onChange={(e) => {
                setRecipientAddress(e.target.value);
                setError(null);
              }}
              placeholder="Enter Bitcoin address (e.g., mzTu7s8NXTUkayUqTRpbVCEkG6ta6L91ss)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7931A] focus:border-transparent font-mono text-sm"
              disabled={isPending || isAccountBlocked}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount (BTC)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-l-lg">
                <Bitcoin className="h-4 w-4 text-[#F7931A]" />
                <span className="text-gray-600 text-sm">BTC</span>
              </div>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.00000001"
                value={amountBtc}
                onChange={(e) => {
                  setAmountBtc(e.target.value);
                  setError(null);
                }}
                placeholder="0.00000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#F7931A] focus:border-transparent"
                disabled={isPending || isAccountBlocked}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSendMax}
                disabled={isPending || isAccountBlocked || availableBalance === BigInt(0)}
                className="shrink-0"
              >
                Max
              </Button>
            </div>
            {balance && (
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  Available: <span className="font-medium">{formatBitcoin(availableBalance)}</span>
                </span>
                {amountSatoshi > BigInt(0) && (
                  <span>
                    Total: <span className="font-medium">{formatBitcoin(totalRequired)}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {amountSatoshi > BigInt(0) && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Estimated Fee:</span>
                <span className="font-medium text-gray-900">{formatBitcoin(ESTIMATED_FEE)}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending || isAccountBlocked || !recipientAddress.trim() || !amountBtc.trim()}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Transaction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

