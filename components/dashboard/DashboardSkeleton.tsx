import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-page space-y-8 px-6 py-10 sm:px-10 sm:py-14">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-8 w-64" />
      </div>

      <div className="grid grid-cols-1 divide-y divide-ink-200 rounded-lg border border-ink-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {[0, 1].map((i) => (
          <div key={i} className="p-6 sm:p-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-12 w-24" />
            <Skeleton className="mt-3 h-3 w-48" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-ink-200 p-6 sm:p-8">
        <Skeleton className="h-5 w-48" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-2 grow" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-ink-200">
        <div className="border-b border-ink-200 p-6 sm:p-8">
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="divide-y divide-ink-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-ink-200 p-6 sm:p-8">
        <Skeleton className="h-5 w-40" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
