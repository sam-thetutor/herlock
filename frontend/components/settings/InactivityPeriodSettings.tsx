'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile, useSetInactivityPeriod } from '@/lib/hooks/useHeirlock';
import { Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function InactivityPeriodSettings() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { mutate: setInactivityPeriod, isPending } = useSetInactivityPeriod();
  const [seconds, setSeconds] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Convert inactivity_period_days (which stores seconds) to display
  const currentSeconds = profile?.inactivity_period_days 
    ? (typeof profile.inactivity_period_days === 'bigint' 
        ? Number(profile.inactivity_period_days) 
        : profile.inactivity_period_days)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const secondsNum = parseFloat(seconds);
    if (isNaN(secondsNum) || secondsNum < 30 || secondsNum > 86400) {
      setError('Inactivity period must be between 30 seconds and 1 day (86400 seconds)');
      return;
    }

    setInactivityPeriod(Math.round(secondsNum), {
      onSuccess: (result) => {
        if ('err' in result) {
          setError(result.err);
          toast.error(result.err);
        } else {
          toast.success(`Inactivity period updated to ${secondsNum} seconds!`);
          setSeconds('');
          // Force reload the page after 1 second to ensure fresh data
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      },
      onError: (err) => {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update inactivity period';
        setError(errorMsg);
        toast.error(errorMsg);
      },
    });
  };

  const days = currentSeconds / 86400;
  const hours = (currentSeconds % 86400) / 3600;
  const minutes = ((currentSeconds % 86400) % 3600) / 60;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Inactivity Period
        </CardTitle>
        <CardDescription>
          Set how long you can be inactive before inheritance is triggered
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Current Setting</div>
            <div className="text-lg font-semibold text-gray-900">
              {days >= 1 
                ? `${days.toFixed(1)} days`
                : hours >= 1
                ? `${hours.toFixed(1)} hours`
                : `${minutes.toFixed(1)} minutes`}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ({currentSeconds} seconds)
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="inactivity-seconds" className="text-sm font-medium text-gray-700">
              New Inactivity Period (seconds)
            </label>
            <input
              id="inactivity-seconds"
              type="number"
              min="30"
              max="86400"
              step="1"
              value={seconds}
              onChange={(e) => {
                setSeconds(e.target.value);
                setError(null);
              }}
              placeholder="e.g., 30, 3600, 86400"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7931A] focus:border-transparent"
              disabled={isPending}
            />
            <div className="text-xs text-gray-500">
              <p>Examples:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>30 seconds (for testing)</li>
                <li>3600 seconds (1 hour)</li>
                <li>86400 seconds (1 day)</li>
                <li>604800 seconds (7 days)</li>
              </ul>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || !seconds}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Inactivity Period'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

