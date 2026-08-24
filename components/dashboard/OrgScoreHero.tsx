import { formatPercent, formatScore } from "@/lib/format";
import { ReadinessBand } from "@/lib/types";
import { BandBadge } from "@/components/ui/Badge";

interface OrgScoreHeroProps {
  orgOverall: number;
  orgBand: ReadinessBand;
  totalResponses: number;
  totalHeadcount: number;
  totalTeams: number;
  participation: number;
}

export function OrgScoreHero({
  orgOverall,
  orgBand,
  totalResponses,
  totalHeadcount,
  totalTeams,
  participation,
}: OrgScoreHeroProps) {
  return (
    <div className="grid grid-cols-1 divide-y divide-ink-200 rounded-lg border border-ink-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink-500">Org readiness score</p>
          <BandBadge band={orgBand} />
        </div>
        <p className="mt-2 text-5xl font-semibold tabular-nums text-ink-950">
          {formatScore(orgOverall)}
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Headcount-weighted mean across {totalTeams} team{totalTeams === 1 ? "" : "s"} with responses
        </p>
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-sm font-medium text-ink-500">Participation</p>
        <p className="mt-2 text-5xl font-semibold tabular-nums text-ink-950">
          {formatPercent(participation)}
        </p>
        <p className="mt-2 text-sm text-ink-500">
          {totalResponses} of {totalHeadcount} people responded
        </p>
      </div>
    </div>
  );
}
