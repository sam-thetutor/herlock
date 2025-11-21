'use client';

import { useHeirs } from '@/lib/hooks/useHeirlock';
import { HeirCard } from './HeirCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';

export function HeirList() {
  const { data: heirs, isLoading, error } = useHeirs();

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Heirs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">Error loading heirs. Please try again.</div>
        </CardContent>
      </Card>
    );
  }

  if (!heirs || heirs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Heirs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No heirs added yet</p>
            <p className="text-sm">Add your first heir using the form above.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Your Heirs ({heirs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heirs.map((heir) => (
            <HeirCard key={heir.id} heir={heir} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

