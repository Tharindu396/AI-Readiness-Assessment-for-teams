/** The five dimensions every assessment scores against. Order here is the display order everywhere. */
export const DIMENSIONS = [
  "tooling_access",
  "usage_depth",
  "skill_confidence",
  "policy_clarity",
  "workflow_integration",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  tooling_access: "Tooling access",
  usage_depth: "Usage depth",
  skill_confidence: "Skill confidence",
  policy_clarity: "Policy clarity",
  workflow_integration: "Workflow integration",
};

/** Raw 1-5 Likert response to a single question. */
export type LikertValue = 1 | 2 | 3 | 4 | 5;

/** questionId -> raw 1-5 answer, as submitted by a respondent. */
export type Answers = Record<string, LikertValue>;

/** dimension -> 0-100 score, the shared shape for a respondent, a team, or an org. */
export type DimensionScores = Record<Dimension, number>;

export const READINESS_BANDS = [
  { band: "Nascent", min: 0, max: 39 },
  { band: "Emerging", min: 40, max: 59 },
  { band: "Operational", min: 60, max: 79 },
  { band: "Advanced", min: 80, max: 100 },
] as const;

export type ReadinessBand = (typeof READINESS_BANDS)[number]["band"];

export type Priority = "high" | "medium" | "low";

/** A team must have at least this many responses before its scores are shown. */
export const ANONYMITY_FLOOR = 3;

// --- Database row shapes (mirrors supabase/migrations/0001_init.sql) ---

export interface OrganizationRow {
  id: string;
  slug: string;
  name: string;
  admin_slug: string;
  created_at: string;
}

export interface TeamRow {
  id: string;
  org_id: string;
  name: string;
  headcount: number;
}

export interface ResponseRow {
  id: string;
  org_id: string;
  team_id: string;
  answers: Answers;
  scores: DimensionScores;
  created_at: string;
}
