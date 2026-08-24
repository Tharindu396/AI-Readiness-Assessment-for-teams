export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="h-1.5 w-full overflow-hidden rounded-sm bg-ink-100">
        <div
          className="h-full rounded-r-sm bg-accent-500 transition-all duration-250"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-500">
        Question {current} of {total}
      </p>
    </div>
  );
}
