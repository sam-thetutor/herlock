'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function BalanceSkeleton() {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-6 space-y-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function HeirCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

