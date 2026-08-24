import { describe, expect, it } from "vitest";
import { generateSlug } from "./slug";

describe("generateSlug", () => {
  it("defaults to 12 characters", () => {
    expect(generateSlug()).toHaveLength(12);
  });

  it("respects a custom length", () => {
    expect(generateSlug(20)).toHaveLength(20);
  });

  it("only uses unambiguous, url-safe characters", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateSlug()).toMatch(/^[a-hj-km-np-z2-9]+$/);
    }
  });

  it("is not deterministic across calls", () => {
    const slugs = new Set(Array.from({ length: 20 }, () => generateSlug()));
    expect(slugs.size).toBe(20);
  });
});
