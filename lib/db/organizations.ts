import { generateSlug } from "../slug";
import { OrganizationRow, TeamRow } from "../types";
import { getServerSupabaseClient } from "./client";

export interface CreateOrganizationInput {
  name: string;
  teams: { name: string; headcount: number }[];
}

export interface CreateOrganizationResult {
  organization: OrganizationRow;
  teams: TeamRow[];
}

/** Creates an org and its initial teams in one call, generating both access slugs. */
export async function createOrganization(
  input: CreateOrganizationInput
): Promise<CreateOrganizationResult> {
  const db = getServerSupabaseClient();

  const { data: organization, error: orgError } = await db
    .from("organizations")
    .insert({
      name: input.name,
      slug: generateSlug(),
      admin_slug: generateSlug(16),
    })
    .select()
    .single();

  if (orgError || !organization) {
    throw new Error(`Failed to create organization: ${orgError?.message}`);
  }

  if (input.teams.length === 0) {
    return { organization, teams: [] };
  }

  const { data: teams, error: teamsError } = await db
    .from("teams")
    .insert(
      input.teams.map((t) => ({
        org_id: organization.id,
        name: t.name,
        headcount: t.headcount,
      }))
    )
    .select();

  if (teamsError || !teams) {
    throw new Error(`Failed to create teams: ${teamsError?.message}`);
  }

  return { organization, teams };
}

export async function getOrganizationBySlug(
  slug: string
): Promise<OrganizationRow | null> {
  const db = getServerSupabaseClient();
  const { data, error } = await db
    .from("organizations")
    .select()
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch organization: ${error.message}`);
  return data;
}

export async function getOrganizationByAdminSlug(
  adminSlug: string
): Promise<OrganizationRow | null> {
  const db = getServerSupabaseClient();
  const { data, error } = await db
    .from("organizations")
    .select()
    .eq("admin_slug", adminSlug)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch organization: ${error.message}`);
  return data;
}

/** Deletes an org and (via cascade) its teams and responses. Used by the "clear sample data" control. */
export async function deleteOrganization(orgId: string): Promise<void> {
  const db = getServerSupabaseClient();
  const { error } = await db.from("organizations").delete().eq("id", orgId);
  if (error) throw new Error(`Failed to delete organization: ${error.message}`);
}
