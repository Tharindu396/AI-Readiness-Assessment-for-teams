"use server";

import { submitResponse } from "@/lib/db";
import { scoreAnswers } from "@/lib/scoring";
import { Answers, DimensionScores } from "@/lib/types";

export type SubmitAssessmentResult =
  | { ok: true; scores: DimensionScores }
  | { ok: false; error: string };

/** Re-derives scores server-side from the raw answers — the client's copy is never trusted. */
export async function submitAssessmentResponse(
  orgId: string,
  teamId: string,
  answers: Answers
): Promise<SubmitAssessmentResult> {
  try {
    const scores = scoreAnswers(answers);
    await submitResponse({ orgId, teamId, answers, scores });
    return { ok: true, scores };
  } catch (err) {
    console.error("submitAssessmentResponse failed:", err);
    return { ok: false, error: "Couldn't submit your response. Please try again." };
  }
}
