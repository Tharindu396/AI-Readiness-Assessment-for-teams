import { formatScore } from "@/lib/format";
import { Dimension, DIMENSION_LABELS, DimensionScores, ReadinessBand } from "@/lib/types";
import { BandBadge } from "@/components/ui/Badge";

export function ResultScreen({
  scores,
  overall,
  band,
  strongest,
  weakest,
}: {
  scores: DimensionScores;
  overall: number;
  band: ReadinessBand;
  strongest: Dimension;
  weakest: Dimension;
}) {
  return (
    <div className="animate-fade-slide-in">
      <p className="text-sm font-medium text-accent-600">Response recorded</p>
      <h1 className="mt-2 font-serif text-2xl text-ink-950 sm:text-3xl">
        Thanks — that&apos;s everything.
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Your answers are anonymous and only count toward your team&apos;s total.
      </p>

      <div className="mt-8 rounded-lg border border-ink-200 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink-500">Your overall score</p>
          <BandBadge band={band} />
        </div>
        <p className="mt-2 text-4xl font-semibold tabular-nums text-ink-950">
          {formatScore(overall)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-ink-200 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Strongest area
          </p>
          <p className="mt-1 text-base font-medium text-ink-900">
            {DIMENSION_LABELS[strongest]}
          </p>
          <p className="text-sm tabular-nums text-ink-500">{formatScore(scores[strongest])} / 100</p>
        </div>
        <div className="rounded-lg border border-ink-200 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Growth area
          </p>
          <p className="mt-1 text-base font-medium text-ink-900">
            {DIMENSION_LABELS[weakest]}
          </p>
          <p className="text-sm tabular-nums text-ink-500">{formatScore(scores[weakest])} / 100</p>
        </div>
      </div>
    </div>
  );
}
