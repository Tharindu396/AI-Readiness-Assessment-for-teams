import { formatScore } from "@/lib/format";

interface ScoreMeterProps {
  label: string;
  score: number;
  /** Compact meters drop the numeric label and shrink the track, for dense rows like team cards. */
  compact?: boolean;
}

/** A labeled horizontal meter. Fill is warning-colored below 40 (Nascent) to flag risk areas, accent otherwise. */
export function ScoreMeter({ label, score, compact = false }: ScoreMeterProps) {
  const isLow = score < 40;
  const fillGradient = isLow
    ? "bg-gradient-to-r from-amber-500 to-red-500"
    : "bg-gradient-to-r from-indigo-500 to-violet-500";
  const glowColor = isLow ? "shadow-[0_0_8px_rgba(245,158,11,0.3)]" : "shadow-[0_0_8px_rgba(99,102,241,0.3)]";
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div
      className={compact ? "flex items-center gap-2" : "flex items-center gap-4"}
      title={`${label}: ${formatScore(score)} of 100`}
    >
      {!compact && (
        <span className="w-24 shrink-0 text-sm text-ink-700 sm:w-40">{label}</span>
      )}
      <div
        className={`relative grow overflow-hidden rounded-full bg-ink-100/60 ${compact ? "h-1.5" : "h-2.5"}`}
        role="img"
        aria-label={`${label}: ${formatScore(score)} out of 100`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${fillGradient} ${glowColor} animate-meter-fill`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {!compact && (
        <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums text-ink-900">
          {formatScore(score)}
        </span>
      )}
    </div>
  );
}
