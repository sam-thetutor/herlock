'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile, useHeartbeat } from '@/lib/hooks/useHeirlock';
import { formatDate } from '@/lib/utils/format';
import { Activity, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ActivityTimer() {
  const { data: profile } = useProfile();
  const { mutate: heartbeat, isPending: isHeartbeating } = useHeartbeat();
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);

  const handleHeartbeat = () => {
    heartbeat(undefined, {
      onSuccess: () => {
        setLastHeartbeat(new Date());
        toast.success('Activity updated successfully');
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to update activity');
      },
    });
  };

  const lastActivity = profile && profile.last_activity
    ? new Date(Number(profile.last_activity))
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-600">Last activity: </span>
            <span className="font-medium">
              {lastActivity && profile ? formatDate(profile.last_activity) : 'Never'}
            </span>
          </div>
          {lastHeartbeat && (
            <div className="text-sm text-green-600">
              ✓ Heartbeat sent at {lastHeartbeat.toLocaleTimeString()}
            </div>
          )}
        </div>

        <Button
          onClick={handleHeartbeat}
          disabled={isHeartbeating}
          className="w-full"
          variant="outline"
        >
          {isHeartbeating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending heartbeat...
            </>
          ) : (
            <>
              <Activity className="mr-2 h-4 w-4" />
              Send Heartbeat
            </>
          )}
        </Button>

        <p className="text-xs text-gray-600">
          Click to update your activity timestamp and reset the inactivity timer.
        </p>
      </CardContent>
    </Card>
  );
}

