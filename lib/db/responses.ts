import { Answers, DimensionScores, ResponseRow } from "../types";
import { getServerSupabaseClient } from "./client";

export interface SubmitResponseInput {
  orgId: string;
  teamId: string;
  answers: Answers;
  scores: DimensionScores;
}

export async function submitResponse(
  input: SubmitResponseInput
): Promise<ResponseRow> {
  const db = getServerSupabaseClient();
  const { data, error } = await db
    .from("responses")
    .insert({
      org_id: input.orgId,
      team_id: input.teamId,
      answers: input.answers,
      scores: input.scores,
    })
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to submit response: ${error?.message}`);
  return data;
}

export async function listResponses(orgId: string): Promise<ResponseRow[]> {
  const db = getServerSupabaseClient();
  const { data, error } = await db.from("responses").select().eq("org_id", orgId);

  if (error) throw new Error(`Failed to list responses: ${error.message}`);
  return data ?? [];
}
