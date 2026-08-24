import { describe, expect, it } from "vitest";
import {
  recommendationsForOrg,
  recommendationsForTeam,
  TeamInput,
} from "./recommendations";
import { DimensionScores } from "./types";

function makeScores(overrides: Partial<DimensionScores> = {}): DimensionScores {
  return {
    tooling_access: 50,
    usage_depth: 50,
    skill_confidence: 50,
    policy_clarity: 50,
    workflow_integration: 50,
    ...overrides,
  };
}

function makeTeam(overrides: Partial<TeamInput> = {}): TeamInput {
  return {
    teamId: "team-1",
    teamName: "Team One",
    headcount: 10,
    responseCount: 5,
    scores: makeScores(),
    ...overrides,
  };
}

describe("recommendationsForTeam", () => {
  it("flags shadow AI risk when usage is high but policy clarity is low", () => {
    const recs = recommendationsForTeam(
      makeTeam({ scores: makeScores({ usage_depth: 70, policy_clarity: 30 }) })
    );
    expect(recs.map((r) => r.ruleId)).toContain("shadow_ai_risk");
    expect(recs.find((r) => r.ruleId === "shadow_ai_risk")?.priority).toBe("high");
  });

  it("flags unused licences when access is high but usage is low", () => {
    const recs = recommendationsForTeam(
      makeTeam({ scores: makeScores({ tooling_access: 80, usage_depth: 20 }) })
    );
    expect(recs.map((r) => r.ruleId)).toContain("unused_licenses");
  });

  it("flags training need when skill confidence is low", () => {
    const recs = recommendationsForTeam(
      makeTeam({ scores: makeScores({ skill_confidence: 40 }) })
    );
    expect(recs.map((r) => r.ruleId)).toContain("training_needed");
  });

  it("flags usage not sticking to process when integration is low but usage is high", () => {
    const recs = recommendationsForTeam(
      makeTeam({
        scores: makeScores({ workflow_integration: 20, usage_depth: 65 }),
      })
    );
    expect(recs.map((r) => r.ruleId)).toContain("usage_not_sticking");
  });

  it("flags internal champion candidates when every dimension is strong", () => {
    const recs = recommendationsForTeam(
      makeTeam({
        scores: {
          tooling_access: 75,
          usage_depth: 90,
          skill_confidence: 80,
          policy_clarity: 100,
          workflow_integration: 75,
        },
      })
    );
    expect(recs.map((r) => r.ruleId)).toContain("internal_champion");
  });

  it("produces no recommendations for balanced, unremarkable scores", () => {
    const recs = recommendationsForTeam(makeTeam({ scores: makeScores() }));
    expect(recs).toEqual([]);
  });

  it("returns nothing for a team below the anonymity floor, even if scores would trigger a rule", () => {
    const recs = recommendationsForTeam(
      makeTeam({
        responseCount: 2,
        scores: makeScores({ usage_depth: 90, policy_clarity: 10 }),
      })
    );
    expect(recs).toEqual([]);
  });

  it("sorts multiple matches by priority (high before medium before low)", () => {
    const recs = recommendationsForTeam(
      makeTeam({
        scores: makeScores({
          usage_depth: 90,
          policy_clarity: 10, // high: shadow_ai_risk
          skill_confidence: 30, // medium: training_needed
        }),
      })
    );
    expect(recs[0].ruleId).toBe("shadow_ai_risk");
    expect(recs[1].ruleId).toBe("training_needed");
  });
});

describe("recommendationsForOrg", () => {
  it("dedupes a shared rule across teams into one recommendation naming both teams", () => {
    const teams: TeamInput[] = [
      makeTeam({
        teamId: "a",
        teamName: "Team A",
        headcount: 10,
        scores: makeScores({ usage_depth: 70, policy_clarity: 20 }),
      }),
      makeTeam({
        teamId: "b",
        teamName: "Team B",
        headcount: 5,
        scores: makeScores({ usage_depth: 80, policy_clarity: 10 }),
      }),
    ];

    const orgRecs = recommendationsForOrg(teams);
    const shadowRisk = orgRecs.find((r) => r.ruleId === "shadow_ai_risk");

    expect(shadowRisk).toBeDefined();
    expect(shadowRisk?.affected_headcount).toBe(15);
    expect(shadowRisk?.teams.map((t) => t.name).sort()).toEqual(["Team A", "Team B"]);
  });

  it("excludes teams below the anonymity floor from org recommendations", () => {
    const teams: TeamInput[] = [
      makeTeam({
        teamId: "a",
        responseCount: 1,
        scores: makeScores({ usage_depth: 90, policy_clarity: 5 }),
      }),
    ];
    expect(recommendationsForOrg(teams)).toEqual([]);
  });

  it("sorts by priority first, then by total affected headcount descending", () => {
    const teams: TeamInput[] = [
      makeTeam({
        teamId: "small-high",
        headcount: 3,
        scores: makeScores({ skill_confidence: 30 }), // medium
      }),
      makeTeam({
        teamId: "big-shadow",
        headcount: 50,
        scores: makeScores({ usage_depth: 90, policy_clarity: 5 }), // high
      }),
      makeTeam({
        teamId: "small-shadow",
        headcount: 4,
        scores: makeScores({ usage_depth: 90, policy_clarity: 5 }), // high
      }),
    ];

    const orgRecs = recommendationsForOrg(teams);
    expect(orgRecs[0].ruleId).toBe("shadow_ai_risk");
    expect(orgRecs[0].affected_headcount).toBe(54);
    expect(orgRecs[1].ruleId).toBe("training_needed");
  });
});
