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
    <div className="glass-card glow-accent grid grid-cols-1 divide-y divide-surface-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="relative overflow-hidden p-6 sm:p-8">
        {/* Subtle background glow */}
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl"
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink-500">Org readiness score</p>
            <BandBadge band={orgBand} />
          </div>
          <p className="mt-3 text-5xl font-semibold tabular-nums">
            <span className="gradient-text">{formatScore(orgOverall)}</span>
          </p>
          <p className="mt-3 text-sm text-ink-500">
            Headcount-weighted mean across {totalTeams} team{totalTeams === 1 ? "" : "s"} with responses
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"
        />
        <div className="relative">
          <p className="text-sm font-medium text-ink-500">Participation</p>
          <p className="mt-3 text-5xl font-semibold tabular-nums text-ink-950">
            {formatPercent(participation)}
          </p>
          <p className="mt-3 text-sm text-ink-500">
            {totalResponses} of {totalHeadcount} people responded
          </p>
        </div>
      </div>
    </div>
  );
}
