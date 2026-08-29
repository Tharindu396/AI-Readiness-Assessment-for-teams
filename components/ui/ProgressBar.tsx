export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2.5 text-xs font-medium text-ink-500">
        Question {current} of {total}
      </p>
    </div>
  );
}
