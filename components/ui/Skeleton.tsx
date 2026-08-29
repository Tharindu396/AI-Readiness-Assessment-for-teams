export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}
