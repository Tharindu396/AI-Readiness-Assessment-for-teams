import { DIMENSIONS, DIMENSION_LABELS, DimensionScores } from "@/lib/types";
import { ScoreMeter } from "@/components/ui/ScoreMeter";

export function DimensionBreakdown({ scores }: { scores: DimensionScores }) {
  return (
    <div className="rounded-lg border border-ink-200 p-6 sm:p-8">
      <h2 className="font-serif text-xl text-ink-950">Dimension breakdown</h2>
      <p className="mt-1 text-sm text-ink-500">
        Org-wide average per dimension. A bar under 40 is shown in warning color.
      </p>
      <div className="mt-6 space-y-4">
        {DIMENSIONS.map((dimension) => (
          <ScoreMeter
            key={dimension}
            label={DIMENSION_LABELS[dimension]}
            score={scores[dimension]}
          />
        ))}
      </div>
    </div>
  );
}
