import { Skeleton } from "@/components/ui/Skeleton";

export function AssessmentSkeleton() {
  return (
    <div>
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="mt-6 h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-2/3" />
      <Skeleton className="mt-2 h-4 w-full" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
