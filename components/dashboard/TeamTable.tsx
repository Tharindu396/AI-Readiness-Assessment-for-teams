import { TeamDashboardRow } from "@/lib/dashboard-data";
import { formatPercent, formatScore } from "@/lib/format";
import { participationRate } from "@/lib/scoring";
import { DIMENSIONS, DIMENSION_LABELS } from "@/lib/types";
import { BandBadge } from "@/components/ui/Badge";
import { ScoreMeter } from "@/components/ui/ScoreMeter";

function AnonymityPlaceholder({ responsesNeeded }: { responsesNeeded: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-ink-50 px-2.5 py-1 text-xs text-ink-500">
      {responsesNeeded} more response{responsesNeeded === 1 ? "" : "s"} needed
    </span>
  );
}

function MiniDimensionBars({ scores }: { scores: Record<string, number> }) {
  return (
    <div className="flex gap-1.5">
      {DIMENSIONS.map((dimension) => (
        <div key={dimension} className="w-9">
          <ScoreMeter label={DIMENSION_LABELS[dimension]} score={scores[dimension]} compact />
        </div>
      ))}
    </div>
  );
}

export function TeamTable({ teams }: { teams: TeamDashboardRow[] }) {
  return (
    <div className="rounded-lg border border-ink-200">
      <div className="border-b border-ink-200 p-6 sm:p-8 sm:pb-6">
        <h2 className="font-serif text-xl text-ink-950">Teams</h2>
        <p className="mt-1 text-sm text-ink-500">
          Scores are hidden until a team has 3 or more responses, to keep individual answers anonymous.
        </p>
      </div>

      {/* Desktop / tablet: table */}
      <table className="hidden w-full md:table">
        <thead>
          <tr className="border-b border-ink-200 text-left text-xs font-medium uppercase tracking-wide text-ink-500">
            <th className="px-8 py-3 font-medium">Team</th>
            <th className="px-4 py-3 font-medium">Responses</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 pr-8 font-medium">Dimensions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {teams.map((team) => (
            <tr key={team.id}>
              <td className="px-8 py-4">
                <p className="text-sm font-medium text-ink-900">{team.name}</p>
                <p className="text-xs text-ink-500">{team.headcount} people</p>
              </td>
              <td className="px-4 py-4 text-sm tabular-nums text-ink-700">
                {team.responseCount} · {formatPercent(participationRate(team.responseCount, team.headcount))}
              </td>
              <td className="px-4 py-4">
                {team.meetsFloor && team.overall !== null && team.band !== null ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tabular-nums text-ink-900">
                      {formatScore(team.overall)}
                    </span>
                    <BandBadge band={team.band} />
                  </div>
                ) : (
                  <AnonymityPlaceholder responsesNeeded={team.responsesNeeded} />
                )}
              </td>
              <td className="px-4 py-4 pr-8">
                {team.meetsFloor && team.scores ? (
                  <MiniDimensionBars scores={team.scores} />
                ) : (
                  <span className="text-sm text-ink-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: cards, never a horizontally-scrolling table */}
      <ul className="divide-y divide-ink-100 md:hidden">
        {teams.map((team) => (
          <li key={team.id} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-900">{team.name}</p>
                <p className="text-xs text-ink-500">
                  {team.headcount} people · {team.responseCount} response{team.responseCount === 1 ? "" : "s"} (
                  {formatPercent(participationRate(team.responseCount, team.headcount))})
                </p>
              </div>
              {team.meetsFloor && team.band !== null ? (
                <BandBadge band={team.band} />
              ) : (
                <AnonymityPlaceholder responsesNeeded={team.responsesNeeded} />
              )}
            </div>
            {team.meetsFloor && team.overall !== null && team.scores && (
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-2xl font-semibold tabular-nums text-ink-950">
                  {formatScore(team.overall)}
                </span>
                <MiniDimensionBars scores={team.scores} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
