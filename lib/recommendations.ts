import { meetsAnonymityFloor } from "./scoring";
import { DIMENSIONS, DimensionScores, Priority } from "./types";

export interface RecommendationRule {
  id: string;
  title: string;
  priority: Priority;
  /** Why this pattern matters, independent of which team(s) triggered it. */
  why: string;
  /** The suggested next step. */
  action: string;
  condition: (scores: DimensionScores) => boolean;
}

export const RULES: RecommendationRule[] = [
  {
    id: "shadow_ai_risk",
    title: "Shadow AI risk",
    priority: "high",
    condition: (s) => s.policy_clarity < 50 && s.usage_depth >= 60,
    why: "People are already using AI heavily, but guidance on what is and isn't appropriate is unclear. That gap is where sensitive data leaks and ungoverned tool use happen.",
    action:
      "Publish clear, specific AI usage guidelines (approved tools, data handling rules) and communicate them directly to the affected teams.",
  },
  {
    id: "unused_licenses",
    title: "Licences going unused",
    priority: "high",
    condition: (s) => s.tooling_access >= 70 && s.usage_depth < 40,
    why: "Teams have strong access to AI tools but aren't using them much day-to-day. That access is likely paid for and going to waste.",
    action:
      "Audit licence utilization and run a targeted adoption push before renewing spend on unused seats.",
  },
  {
    id: "training_needed",
    title: "Prompting & verification training",
    priority: "medium",
    condition: (s) => s.skill_confidence < 50,
    why: "People aren't confident writing effective prompts or catching AI mistakes, which caps how much value they get from the tools they already have.",
    action:
      "Run hands-on prompting and output-verification training tailored to real workflows.",
  },
  {
    id: "usage_not_sticking",
    title: "Usage isn't sticking to process",
    priority: "medium",
    condition: (s) => s.workflow_integration < 40 && s.usage_depth >= 60,
    why: "People use AI often, but it lives outside their actual workflows and tools, so gains don't compound and usage stays ad hoc.",
    action:
      "Embed AI steps directly into existing tools and processes rather than leaving it as a separate habit.",
  },
  {
    id: "internal_champion",
    title: "Candidate for internal champion team",
    priority: "low",
    condition: (s) => DIMENSIONS.every((d) => s[d] >= 75),
    why: "This team is strong across every readiness dimension: access, usage, skill, policy understanding, and workflow integration.",
    action:
      "Recruit this team as internal AI champions to mentor other teams and pilot new tools first.",
  },
];

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function byPriorityThenHeadcount(
  a: { priority: Priority; affected_headcount: number },
  b: { priority: Priority; affected_headcount: number }
): number {
  const priorityDiff = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
  if (priorityDiff !== 0) return priorityDiff;
  return b.affected_headcount - a.affected_headcount;
}

export interface TeamInput {
  teamId: string;
  teamName: string;
  headcount: number;
  /** Number of responses this team has received; scores below the anonymity floor are excluded. */
  responseCount: number;
  scores: DimensionScores;
}

export interface TeamRecommendation {
  ruleId: string;
  title: string;
  why: string;
  action: string;
  priority: Priority;
  affected_headcount: number;
  team: { id: string; name: string };
}

/**
 * Recommendations for a single team. Returns nothing for a team below the anonymity
 * floor — its scores aren't visible, so no recommendation should reveal them either.
 */
export function recommendationsForTeam(team: TeamInput): TeamRecommendation[] {
  if (!meetsAnonymityFloor(team.responseCount)) return [];

  return RULES.filter((rule) => rule.condition(team.scores))
    .map((rule) => ({
      ruleId: rule.id,
      title: rule.title,
      why: rule.why,
      action: rule.action,
      priority: rule.priority,
      affected_headcount: team.headcount,
      team: { id: team.teamId, name: team.teamName },
    }))
    .sort(byPriorityThenHeadcount);
}

export interface OrgRecommendation {
  ruleId: string;
  title: string;
  why: string;
  action: string;
  priority: Priority;
  /** Total headcount across every team this recommendation applies to. */
  affected_headcount: number;
  teams: { id: string; name: string; headcount: number }[];
}

/**
 * Org-level recommendations: each rule's matches across all teams are deduped into a
 * single recommendation that names every affected team and sums their headcount.
 */
export function recommendationsForOrg(teams: TeamInput[]): OrgRecommendation[] {
  const byRule = new Map<string, OrgRecommendation>();

  for (const team of teams) {
    for (const rec of recommendationsForTeam(team)) {
      const existing = byRule.get(rec.ruleId);
      if (existing) {
        existing.affected_headcount += rec.affected_headcount;
        existing.teams.push({
          id: rec.team.id,
          name: rec.team.name,
          headcount: rec.affected_headcount,
        });
      } else {
        byRule.set(rec.ruleId, {
          ruleId: rec.ruleId,
          title: rec.title,
          why: rec.why,
          action: rec.action,
          priority: rec.priority,
          affected_headcount: rec.affected_headcount,
          teams: [
            {
              id: rec.team.id,
              name: rec.team.name,
              headcount: rec.affected_headcount,
            },
          ],
        });
      }
    }
  }

  return Array.from(byRule.values()).sort(byPriorityThenHeadcount);
}
