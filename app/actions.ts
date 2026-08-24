"use server";

import { createOrganization } from "@/lib/db";

export type CreateOrgResult =
  | { ok: true; orgSlug: string; adminSlug: string; orgName: string }
  | { ok: false; error: string };

export interface CreateOrgInput {
  name: string;
  teams: { name: string; headcount: number }[];
}

export async function createOrganizationAction(
  input: CreateOrgInput
): Promise<CreateOrgResult> {
  const name = input.name.trim();
  if (!name) {
    return { ok: false, error: "Organization name is required." };
  }

  const teams = input.teams
    .map((t) => ({ name: t.name.trim(), headcount: t.headcount }))
    .filter((t) => t.name.length > 0);

  if (teams.length === 0) {
    return { ok: false, error: "Add at least one team." };
  }
  if (teams.some((t) => !Number.isFinite(t.headcount) || t.headcount < 1)) {
    return { ok: false, error: "Each team needs a headcount of at least 1." };
  }

  try {
    const { organization } = await createOrganization({ name, teams });
    return {
      ok: true,
      orgSlug: organization.slug,
      adminSlug: organization.admin_slug,
      orgName: organization.name,
    };
  } catch (err) {
    console.error("createOrganizationAction failed:", err);
    return {
      ok: false,
      error: "Something went wrong creating your assessment. Please try again.",
    };
  }
}
