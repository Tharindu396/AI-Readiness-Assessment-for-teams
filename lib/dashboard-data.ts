import { OrgRecommendation, recommendationsForOrg, TeamInput } from "./recommendations";
import {
  aggregateOrgDimensionScores,
  aggregateOrgScore,
  aggregateTeamScores,
  computeOverall,
  getBand,
  meetsAnonymityFloor,
  participationRate,
  responsesNeededForFloor,
} from "./scoring";
import { DIMENSIONS, DimensionScores, ReadinessBand, ResponseRow, TeamRow } from "./types";

const ZERO_SCORES: DimensionScores = DIMENSIONS.reduce((acc, d) => {
  acc[d] = 0;
  return acc;
}, {} as DimensionScores);

export interface TeamDashboardRow {
  id: string;
  name: string;
  headcount: number;
  responseCount: number;
  meetsFloor: boolean;
  responsesNeeded: number;
  /** null when the team hasn't cleared the anonymity floor yet. */
  scores: DimensionScores | null;
  overall: number | null;
  band: ReadinessBand | null;
}

export interface DashboardData {
  totalHeadcount: number;
  totalResponses: number;
  participation: number;
  /** null when the org has zero responses (nothing to score yet). */
  orgOverall: number | null;
  orgBand: ReadinessBand | null;
  orgDimensionScores: DimensionScores | null;
  teams: TeamDashboardRow[];
  recommendations: OrgRecommendation[];
}

/**
 * Builds the full dashboard view model from raw team and response rows.
 *
 * The org-level score and dimension breakdown are computed from every team with at
 * least one response (headcount-weighted) — that's a macro number, not team-identifying,
 * so it isn't subject to the anonymity floor. Per-team scores ARE gated by the floor:
 * `scores`/`overall`/`band` are null until a team has 3+ responses, per the anonymity rule.
 */
export function buildDashboardData(
  teams: TeamRow[],
  responses: ResponseRow[]
): DashboardData {
  const responsesByTeam = new Map<string, ResponseRow[]>();
  for (const response of responses) {
    const existing = responsesByTeam.get(response.team_id);
    if (existing) {
      existing.push(response);
    } else {
      responsesByTeam.set(response.team_id, [response]);
    }
  }

  const teamRows: TeamDashboardRow[] = teams.map((team) => {
    const teamResponses = responsesByTeam.get(team.id) ?? [];
    const responseCount = teamResponses.length;
    const meetsFloor = meetsAnonymityFloor(responseCount);
    const scores =
      responseCount > 0
        ? aggregateTeamScores(teamResponses.map((r) => r.scores))
        : null;
    const overall = scores ? computeOverall(scores) : null;

    return {
      id: team.id,
      name: team.name,
      headcount: team.headcount,
      responseCount,
      meetsFloor,
      responsesNeeded: responsesNeededForFloor(responseCount),
      scores: meetsFloor ? scores : null,
      overall: meetsFloor ? overall : null,
      band: meetsFloor && overall !== null ? getBand(overall) : null,
    };
  });

  const totalHeadcount = teams.reduce((sum, t) => sum + t.headcount, 0);
  const totalResponses = responses.length;
  const participation = participationRate(totalResponses, totalHeadcount);

  // Org math uses every team with data, independent of the per-team display floor.
  const teamsWithData = teams
    .map((team) => {
      const teamResponses = responsesByTeam.get(team.id) ?? [];
      if (teamResponses.length === 0) return null;
      return {
        headcount: team.headcount,
        scores: aggregateTeamScores(teamResponses.map((r) => r.scores)),
      };
    })
    .filter((t): t is { headcount: number; scores: DimensionScores } => t !== null);

  const orgDimensionScores =
    teamsWithData.length > 0 ? aggregateOrgDimensionScores(teamsWithData) : null;
  const orgOverall =
    teamsWithData.length > 0
      ? aggregateOrgScore(
          teamsWithData.map((t) => ({
            overall: computeOverall(t.scores),
            headcount: t.headcount,
          }))
        )
      : null;
  const orgBand = orgOverall !== null ? getBand(orgOverall) : null;

  const recommendationInputs: TeamInput[] = teamRows.map((row) => ({
    teamId: row.id,
    teamName: row.name,
    headcount: row.headcount,
    responseCount: row.responseCount,
    scores: row.scores ?? ZERO_SCORES,
  }));

  return {
    totalHeadcount,
    totalResponses,
    participation,
    orgOverall,
    orgBand,
    orgDimensionScores,
    teams: teamRows,
    recommendations: recommendationsForOrg(recommendationInputs),
  };
}
