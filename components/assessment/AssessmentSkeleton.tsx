import { Skeleton } from "@/components/ui/Skeleton";

export function AssessmentSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-2/3" />
      <Skeleton className="mt-2 h-4 w-full" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
