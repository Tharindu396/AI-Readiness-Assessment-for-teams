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
  const fillColor = isLow ? "bg-warning-500" : "bg-accent-500";
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
        className={`relative grow overflow-hidden bg-ink-100 ${compact ? "h-1.5 rounded-sm" : "h-2 rounded-sm"}`}
        role="img"
        aria-label={`${label}: ${formatScore(score)} out of 100`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-r-sm ${fillColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {!compact && (
        <span className="w-8 shrink-0 text-right text-sm tabular-nums text-ink-900">
          {formatScore(score)}
        </span>
      )}
    </div>
  );
}
