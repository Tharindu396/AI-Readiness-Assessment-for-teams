import { describe, expect, it } from "vitest";
import { buildDemoDataset } from "./demo";

describe("buildDemoDataset", () => {
  it("builds 4 teams with varied headcounts and response counts", () => {
    const demo = buildDemoDataset();
    expect(demo.teams).toHaveLength(4);
    expect(demo.responses.length).toBe(18 + 14 + 6 + 2);
  });

  it("includes at least one team below the anonymity floor", () => {
    const demo = buildDemoDataset();
    expect(demo.dashboard.teams.some((t) => !t.meetsFloor)).toBe(true);
  });

  it("surfaces a shadow AI risk recommendation", () => {
    const demo = buildDemoDataset();
    expect(demo.dashboard.recommendations.map((r) => r.ruleId)).toContain(
      "shadow_ai_risk"
    );
  });

  it("surfaces an unused licences recommendation", () => {
    const demo = buildDemoDataset();
    expect(demo.dashboard.recommendations.map((r) => r.ruleId)).toContain(
      "unused_licenses"
    );
  });

  it("surfaces an internal champion candidate", () => {
    const demo = buildDemoDataset();
    expect(demo.dashboard.recommendations.map((r) => r.ruleId)).toContain(
      "internal_champion"
    );
  });

  it("has a populated org score and participation rate", () => {
    const demo = buildDemoDataset();
    expect(demo.dashboard.orgOverall).not.toBeNull();
    expect(demo.dashboard.participation).toBeGreaterThan(0);
  });
});
