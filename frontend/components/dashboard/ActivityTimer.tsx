'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile, useHeartbeat } from '@/lib/hooks/useHeirlock';
import { formatRelativeTime } from '@/lib/utils/format';
import { Activity, Loader2, CheckCircle2, Bitcoin } from 'lucide-react';
import toast from 'react-hot-toast';

export function ActivityTimer() {
  const { data: profile } = useProfile();
  const { mutate: heartbeat, isPending: isHeartbeating } = useHeartbeat();
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second for relative time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHeartbeat = () => {
    // Trigger ripple effect
    setRipple(true);
    setTimeout(() => setRipple(false), 600);

    heartbeat(undefined, {
      onSuccess: () => {
        const now = new Date();
        setLastHeartbeat(now);
        setShowSuccess(true);
        toast.success('Activity updated successfully');
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to update activity');
      },
    });
  };

  const lastActivity = profile && profile.last_activity
    ? new Date(Number(profile.last_activity))
    : null;

  const relativeTime = lastActivity ? formatRelativeTime(lastActivity) : 'Never';
  const isJustNow = lastActivity && (Date.now() - lastActivity.getTime()) < 60000;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-white pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Bitcoin className="h-5 w-5 text-[#F7931A] animate-pulse" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
          Proof of Life
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Circular Button with Pulse Animation */}
          <div className="relative flex items-center justify-center h-32">
            {/* Pulse Rings */}
            {!isHeartbeating && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className="absolute w-24 h-24 rounded-full border-2 border-orange-300 animate-ping"
                  style={{ animationDuration: '2s' }}
                />
                <div 
                  className="absolute w-28 h-28 rounded-full border-2 border-orange-200 animate-ping"
                  style={{ animationDuration: '2s', animationDelay: '0.5s' }}
                />
              </div>
            )}

            {/* Ripple Effect */}
            {ripple && (
              <div 
                className="absolute w-24 h-24 rounded-full bg-orange-400 opacity-0 animate-ripple"
                style={{ animation: 'ripple 0.6s ease-out' }}
              />
            )}

            {/* Main Circular Button */}
            <button
              onClick={handleHeartbeat}
              disabled={isHeartbeating}
              className={`
                relative w-24 h-24 rounded-full 
                bg-gradient-to-br from-[#F7931A] via-[#F7931A] to-[#E8821A]
                shadow-lg hover:shadow-xl 
                transition-all duration-300 
                hover:scale-105 active:scale-95 
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center 
                text-white
                ${!isHeartbeating ? 'animate-pulse-slow' : ''}
              `}
              style={{
                boxShadow: '0 4px 15px rgba(247, 147, 26, 0.3)',
              }}
            >
              {isHeartbeating ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Bitcoin className="h-10 w-10" />
              )}
            </button>
          </div>

          {/* Status Section */}
          <div className="w-full space-y-3 text-center">
            {/* Last Activity Display */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Last Activity</p>
              <p className={`text-2xl font-bold ${isJustNow ? 'text-green-600' : 'text-gray-700'}`}>
                {relativeTime}
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && lastHeartbeat && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>Heartbeat sent at {lastHeartbeat.toLocaleTimeString()}</span>
              </div>
            )}

            {/* Helper Text */}
            <p className="text-xs text-gray-500 pt-2">
              Keep your account active by sending regular heartbeats
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
