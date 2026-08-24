import { buildDashboardData, DashboardData } from "./dashboard-data";
import { Answers, DimensionScores, LikertValue, ResponseRow, TeamRow } from "./types";
import { QUESTIONS } from "./questions";
import { scoreAnswers } from "./scoring";

export const DEMO_ORG_NAME = "Northwind Robotics";

/** Deterministic fake answers that score close to the given target dimension values. */
function answersFor(target: DimensionScores, seed: number): Answers {
  const answers: Answers = {};
  let i = seed;
  for (const question of QUESTIONS) {
    // Two questions per dimension average to ~target: alternate one tick above, one below.
    const base = Math.round(target[question.dimension] / 25) + 1; // 1-5
    const jitter = i % 2 === 0 ? 0 : (i % 3 === 0 ? 1 : -1);
    const value = Math.min(5, Math.max(1, base + jitter)) as LikertValue;
    answers[question.id] = value;
    i++;
  }
  return answers;
}

interface DemoTeamSpec {
  id: string;
  name: string;
  headcount: number;
  responseCount: number;
  targetScores: DimensionScores;
}

const DEMO_TEAM_SPECS: DemoTeamSpec[] = [
  {
    id: "demo-team-product",
    name: "Product & Engineering",
    headcount: 42,
    responseCount: 18,
    targetScores: {
      tooling_access: 95,
      usage_depth: 95,
      skill_confidence: 90,
      policy_clarity: 92,
      workflow_integration: 90,
    },
  },
  {
    id: "demo-team-sales",
    name: "Sales",
    headcount: 25,
    responseCount: 14,
    targetScores: {
      tooling_access: 65,
      usage_depth: 72,
      skill_confidence: 58,
      policy_clarity: 28,
      workflow_integration: 55,
    },
  },
  {
    id: "demo-team-legal",
    name: "Legal & Compliance",
    headcount: 12,
    responseCount: 6,
    targetScores: {
      tooling_access: 85,
      usage_depth: 22,
      skill_confidence: 45,
      policy_clarity: 70,
      workflow_integration: 30,
    },
  },
  {
    id: "demo-team-support",
    name: "Customer Support",
    headcount: 30,
    responseCount: 2, // below the anonymity floor — demonstrates the partial state
    targetScores: {
      tooling_access: 55,
      usage_depth: 48,
      skill_confidence: 40,
      policy_clarity: 45,
      workflow_integration: 42,
    },
  },
];

export interface DemoDataset {
  orgName: string;
  teams: TeamRow[];
  responses: ResponseRow[];
  dashboard: DashboardData;
}

/** Builds a realistic, fully in-memory sample org. Never touches the database. */
export function buildDemoDataset(): DemoDataset {
  const teams: TeamRow[] = DEMO_TEAM_SPECS.map((spec) => ({
    id: spec.id,
    org_id: "demo-org",
    name: spec.name,
    headcount: spec.headcount,
  }));

  const responses: ResponseRow[] = DEMO_TEAM_SPECS.flatMap((spec) =>
    Array.from({ length: spec.responseCount }, (_, i) => {
      const answers = answersFor(spec.targetScores, i);
      return {
        id: `${spec.id}-r${i}`,
        org_id: "demo-org",
        team_id: spec.id,
        answers,
        scores: scoreAnswers(answers),
        created_at: new Date(Date.now() - i * 86_400_000).toISOString(),
      };
    })
  );

  return {
    orgName: DEMO_ORG_NAME,
    teams,
    responses,
    dashboard: buildDashboardData(teams, responses),
  };
}
