"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200/60", className)} />
  );
}

export function AuthSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      {/* Form skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Footer skeleton */}
      <div className="text-center">
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    </div>
  );
}

export function OtpSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto rounded-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-32 mx-auto" />
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
