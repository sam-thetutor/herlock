'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInactivityStatus } from '@/lib/hooks/useHeirlock';
import { formatTimeRemaining } from '@/lib/utils/format';
import { Clock, AlertCircle, CheckCircle2, Timer } from 'lucide-react';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';

export function InactivityStatus() {
  const { data: status, isLoading, error, dataUpdatedAt } = useInactivityStatus();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Live countdown timer - updates every second
  // MUST be called before any early returns (React Hooks rules)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (error || !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Inactivity Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">Error loading status</div>
        </CardContent>
      </Card>
    );
  }

  const isActive = status.is_active ?? true;
  const secondsSinceActivity = status.seconds_since_activity ? Number(status.seconds_since_activity) : 0;
  const secondsUntilInheritance = status.seconds_until_inheritance ? Number(status.seconds_until_inheritance) : null;
  const canTriggerInheritance = status.can_trigger_inheritance ?? false;

  // Convert seconds to days for display
  const daysSinceActivity = secondsSinceActivity / 86400;

  // Calculate remaining time accounting for elapsed time since last fetch
  const getAdjustedRemainingTime = () => {
    if (secondsUntilInheritance === null || !dataUpdatedAt) return null;
    
    // Calculate how many seconds have passed since the data was fetched
    const secondsSinceUpdate = Math.floor((currentTime - dataUpdatedAt) / 1000);
    
    // Subtract elapsed time from the remaining time
    const adjusted = secondsUntilInheritance - secondsSinceUpdate;
    
    // Don't go below 0
    return Math.max(0, adjusted);
  };

  const adjustedRemainingTime = getAdjustedRemainingTime();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Inactivity Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-green-700">Active</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-orange-700">Inactive</span>
            </>
          )}
        </div>

        {/* Prominent Time Until Inheritance Display with Live Countdown */}
        {isActive && adjustedRemainingTime !== null && adjustedRemainingTime > 0 && (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                Time until inheritance can be triggered
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-900 tabular-nums">
              {formatTimeRemaining(adjustedRemainingTime)}
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Days since activity:</span>
            <span className="font-medium">
              {typeof daysSinceActivity === 'number' 
                ? `${daysSinceActivity.toFixed(1)} days`
                : '0 days'}
            </span>
          </div>
        </div>

        {/* Warning if inheritance can be triggered */}
        {canTriggerInheritance && (
          <div className="p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
            ⚠️ Inheritance can be triggered
          </div>
        )}
      </CardContent>
    </Card>
  );
}

