import { describe, expect, it } from "vitest";
import {
  aggregateOrgDimensionScores,
  aggregateOrgScore,
  aggregateTeamScores,
  computeOverall,
  getBand,
  likertToScore,
  meetsAnonymityFloor,
  participationRate,
  responsesNeededForFloor,
  scoreAnswers,
  strongestAndWeakest,
} from "./scoring";
import { Answers, DimensionScores, LikertValue } from "./types";

/** All questions answered with the same value, except overrides. */
function makeAnswers(base: LikertValue, overrides: Record<string, LikertValue> = {}): Answers {
  const answers: Answers = {
    tooling_access_1: base,
    tooling_access_2: base,
    usage_depth_1: base,
    usage_depth_2: base,
    skill_confidence_1: base,
    skill_confidence_2: base,
    policy_clarity_1: base,
    policy_clarity_2: base,
    workflow_integration_1: base,
    workflow_integration_2: base,
  };
  return { ...answers, ...overrides };
}

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

describe("likertToScore", () => {
  it("maps the 1-5 scale onto 0/25/50/75/100", () => {
    expect(likertToScore(1)).toBe(0);
    expect(likertToScore(2)).toBe(25);
    expect(likertToScore(3)).toBe(50);
    expect(likertToScore(4)).toBe(75);
    expect(likertToScore(5)).toBe(100);
  });
});

describe("scoreAnswers", () => {
  it("scores a uniform response set at a flat value across all dimensions", () => {
    const scores = scoreAnswers(makeAnswers(5));
    expect(scores).toEqual(makeScores({
      tooling_access: 100,
      usage_depth: 100,
      skill_confidence: 100,
      policy_clarity: 100,
      workflow_integration: 100,
    }));
  });

  it("averages the two questions within a dimension", () => {
    const scores = scoreAnswers(
      makeAnswers(3, { tooling_access_1: 1, tooling_access_2: 5 })
    );
    // (0 + 100) / 2 = 50
    expect(scores.tooling_access).toBe(50);
  });

  it("scores each dimension independently", () => {
    const answers = makeAnswers(3, {
      policy_clarity_1: 1,
      policy_clarity_2: 1,
      usage_depth_1: 5,
      usage_depth_2: 5,
    });
    const scores = scoreAnswers(answers);
    expect(scores.policy_clarity).toBe(0);
    expect(scores.usage_depth).toBe(100);
    expect(scores.skill_confidence).toBe(50);
  });

  it("throws when an answer is missing", () => {
    const answers = makeAnswers(3);
    delete (answers as Record<string, unknown>).tooling_access_1;
    expect(() => scoreAnswers(answers)).toThrow(/tooling_access_1/);
  });

  it("throws when an answer is out of the 1-5 range", () => {
    const answers = makeAnswers(3, { usage_depth_1: 0 as LikertValue });
    expect(() => scoreAnswers(answers)).toThrow(/usage_depth_1/);
  });

  it("throws when an answer is not an integer", () => {
    const answers = makeAnswers(3, { skill_confidence_1: 2.5 as LikertValue });
    expect(() => scoreAnswers(answers)).toThrow(/skill_confidence_1/);
  });
});

describe("computeOverall", () => {
  it("averages all 5 dimensions equally", () => {
    const overall = computeOverall(
      makeScores({
        tooling_access: 0,
        usage_depth: 25,
        skill_confidence: 50,
        policy_clarity: 75,
        workflow_integration: 100,
      })
    );
    expect(overall).toBe(50);
  });
});

describe("getBand", () => {
  it.each([
    [0, "Nascent"],
    [39, "Nascent"],
    [39.9, "Nascent"],
    [40, "Emerging"],
    [59, "Emerging"],
    [60, "Operational"],
    [79, "Operational"],
    [79.166, "Operational"],
    [79.99, "Operational"],
    [80, "Advanced"],
    [100, "Advanced"],
  ] as const)("scores %s as %s", (score, band) => {
    expect(getBand(score)).toBe(band);
  });

  it("handles fractional scores between every pair of integer band boundaries", () => {
    // Regression test: means-of-means routinely produce non-integer scores
    // (e.g. 79.166666...), which must not fall through to the wrong band.
    expect(getBand(39.5)).toBe("Nascent");
    expect(getBand(59.5)).toBe("Emerging");
    expect(getBand(99.99)).toBe("Advanced");
  });
});

describe("strongestAndWeakest", () => {
  it("finds the highest and lowest scoring dimensions", () => {
    const { strongest, weakest } = strongestAndWeakest(
      makeScores({ policy_clarity: 90, workflow_integration: 10 })
    );
    expect(strongest).toBe("policy_clarity");
    expect(weakest).toBe("workflow_integration");
  });

  it("breaks ties by dimension declaration order", () => {
    // tooling_access is first in DIMENSIONS order, so it wins ties on both ends.
    const { strongest, weakest } = strongestAndWeakest(makeScores());
    expect(strongest).toBe("tooling_access");
    expect(weakest).toBe("tooling_access");
  });
});

describe("aggregateTeamScores", () => {
  it("averages respondents' scores per dimension", () => {
    const team = aggregateTeamScores([
      makeScores({ usage_depth: 0 }),
      makeScores({ usage_depth: 100 }),
    ]);
    expect(team.usage_depth).toBe(50);
    expect(team.tooling_access).toBe(50);
  });

  it("throws when there are no respondents", () => {
    expect(() => aggregateTeamScores([])).toThrow();
  });
});

describe("aggregateOrgScore", () => {
  it("weights team overall scores by headcount", () => {
    const org = aggregateOrgScore([
      { overall: 100, headcount: 1 },
      { overall: 0, headcount: 9 },
    ]);
    expect(org).toBe(10);
  });

  it("throws when total headcount is 0", () => {
    expect(() => aggregateOrgScore([{ overall: 50, headcount: 0 }])).toThrow();
  });
});

describe("aggregateOrgDimensionScores", () => {
  it("weights each dimension by team headcount independently", () => {
    const org = aggregateOrgDimensionScores([
      { scores: makeScores({ policy_clarity: 100 }), headcount: 1 },
      { scores: makeScores({ policy_clarity: 0 }), headcount: 3 },
    ]);
    expect(org.policy_clarity).toBe(25);
    expect(org.tooling_access).toBe(50);
  });
});

describe("anonymity floor", () => {
  it("requires at least 3 responses", () => {
    expect(meetsAnonymityFloor(0)).toBe(false);
    expect(meetsAnonymityFloor(2)).toBe(false);
    expect(meetsAnonymityFloor(3)).toBe(true);
    expect(meetsAnonymityFloor(4)).toBe(true);
  });

  it("reports how many more responses are needed", () => {
    expect(responsesNeededForFloor(0)).toBe(3);
    expect(responsesNeededForFloor(1)).toBe(2);
    expect(responsesNeededForFloor(3)).toBe(0);
    expect(responsesNeededForFloor(5)).toBe(0);
  });
});

describe("participationRate", () => {
  it("divides responses by headcount", () => {
    expect(participationRate(5, 20)).toBe(0.25);
  });

  it("returns 0 rather than dividing by zero headcount", () => {
    expect(participationRate(0, 0)).toBe(0);
  });
});
