import { TeamRow } from "../types";
import { getServerSupabaseClient } from "./client";

export async function listTeams(orgId: string): Promise<TeamRow[]> {
  const db = getServerSupabaseClient();
  const { data, error } = await db
    .from("teams")
    .select()
    .eq("org_id", orgId)
    .order("name");

  if (error) throw new Error(`Failed to list teams: ${error.message}`);
  return data ?? [];
}

export async function addTeam(
  orgId: string,
  name: string,
  headcount: number
): Promise<TeamRow> {
  const db = getServerSupabaseClient();
  const { data, error } = await db
    .from("teams")
    .insert({ org_id: orgId, name, headcount })
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to add team: ${error?.message}`);
  return data;
}
