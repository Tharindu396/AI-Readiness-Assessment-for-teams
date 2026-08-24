import { describe, expect, it } from "vitest";
import { buildDashboardData } from "./dashboard-data";
import { DimensionScores, ResponseRow, TeamRow } from "./types";

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

function makeTeam(overrides: Partial<TeamRow> = {}): TeamRow {
  return { id: "t1", org_id: "org1", name: "Team One", headcount: 10, ...overrides };
}

function makeResponse(overrides: Partial<ResponseRow> = {}): ResponseRow {
  return {
    id: "r1",
    org_id: "org1",
    team_id: "t1",
    answers: {},
    scores: makeScores(),
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("buildDashboardData", () => {
  it("returns null org score and empty state when there are no responses", () => {
    const data = buildDashboardData([makeTeam()], []);
    expect(data.orgOverall).toBeNull();
    expect(data.orgBand).toBeNull();
    expect(data.totalResponses).toBe(0);
    expect(data.participation).toBe(0);
  });

  it("hides a team's scores below the anonymity floor but still counts it toward org totals", () => {
    const team = makeTeam({ headcount: 10 });
    const responses = [
      makeResponse({ id: "r1" }),
      makeResponse({ id: "r2" }),
    ]; // only 2 responses, floor is 3

    const data = buildDashboardData([team], responses);

    expect(data.teams[0].meetsFloor).toBe(false);
    expect(data.teams[0].scores).toBeNull();
    expect(data.teams[0].responsesNeeded).toBe(1);
    // org-level math still reflects the 2 responses even though the team row is hidden
    expect(data.orgOverall).toBe(50);
    expect(data.totalResponses).toBe(2);
  });

  it("shows a team's scores once it clears the anonymity floor", () => {
    const team = makeTeam({ headcount: 10 });
    const responses = [
      makeResponse({ id: "r1", scores: makeScores({ usage_depth: 0 }) }),
      makeResponse({ id: "r2", scores: makeScores({ usage_depth: 100 }) }),
      makeResponse({ id: "r3", scores: makeScores({ usage_depth: 50 }) }),
    ];

    const data = buildDashboardData([team], responses);

    expect(data.teams[0].meetsFloor).toBe(true);
    expect(data.teams[0].scores?.usage_depth).toBe(50);
    expect(data.teams[0].band).toBe("Emerging");
  });

  it("weights the org score by headcount across teams with data", () => {
    const teams = [
      makeTeam({ id: "a", headcount: 1 }),
      makeTeam({ id: "b", headcount: 9 }),
    ];
    const responses = [
      makeResponse({ id: "r1", team_id: "a", scores: makeScores({ tooling_access: 100 }) }),
      makeResponse({ id: "r2", team_id: "a", scores: makeScores({ tooling_access: 100 }) }),
      makeResponse({ id: "r3", team_id: "a", scores: makeScores({ tooling_access: 100 }) }),
      makeResponse({ id: "r4", team_id: "b", scores: makeScores({ tooling_access: 0 }) }),
      makeResponse({ id: "r5", team_id: "b", scores: makeScores({ tooling_access: 0 }) }),
      makeResponse({ id: "r6", team_id: "b", scores: makeScores({ tooling_access: 0 }) }),
    ];

    const data = buildDashboardData(teams, responses);
    expect(data.orgDimensionScores?.tooling_access).toBe(10);
  });

  it("excludes teams with zero responses from org score math entirely", () => {
    const teams = [makeTeam({ id: "a", headcount: 5 }), makeTeam({ id: "b", headcount: 100 })];
    const responses = [
      makeResponse({ id: "r1", team_id: "a" }),
      makeResponse({ id: "r2", team_id: "a" }),
      makeResponse({ id: "r3", team_id: "a" }),
    ];

    const data = buildDashboardData(teams, responses);
    // team b has 100 headcount but 0 responses — must not silently drag the org score
    expect(data.orgOverall).toBe(50);
  });

  it("produces recommendations for teams that meet the floor", () => {
    const team = makeTeam({ headcount: 10 });
    const responses = [
      makeResponse({ scores: makeScores({ usage_depth: 90, policy_clarity: 10 }) }),
      makeResponse({ scores: makeScores({ usage_depth: 90, policy_clarity: 10 }) }),
      makeResponse({ scores: makeScores({ usage_depth: 90, policy_clarity: 10 }) }),
    ];

    const data = buildDashboardData([team], responses);
    expect(data.recommendations.map((r) => r.ruleId)).toContain("shadow_ai_risk");
  });
});
