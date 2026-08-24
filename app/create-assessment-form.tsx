"use client";

import { useState } from "react";
import Link from "next/link";
import { createOrganizationAction } from "./actions";
import { Button, buttonClass } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";

interface TeamDraft {
  name: string;
  headcount: string;
}

function emptyTeam(): TeamDraft {
  return { name: "", headcount: "" };
}

export function CreateAssessmentForm() {
  const [orgName, setOrgName] = useState("");
  const [teams, setTeams] = useState<TeamDraft[]>([emptyTeam()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    orgSlug: string;
    adminSlug: string;
    orgName: string;
  } | null>(null);

  function updateTeam(index: number, patch: Partial<TeamDraft>) {
    setTeams((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  function removeTeam(index: number) {
    setTeams((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await createOrganizationAction({
      name: orgName,
      teams: teams.map((t) => ({ name: t.name, headcount: Number(t.headcount) })),
    });

    setSubmitting(false);

    if (result.ok) {
      setCreated(result);
    } else {
      setError(result.error);
    }
  }

  if (created) {
    const respondentUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/a/${created.orgSlug}`
        : `/a/${created.orgSlug}`;
    const dashboardHref = `/dashboard/${created.adminSlug}`;
    const dashboardUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${dashboardHref}`
        : dashboardHref;

    return (
      <div className="animate-fade-slide-in rounded-lg border border-ink-200 p-6 sm:p-8">
        <h2 className="font-serif text-xl text-ink-950">
          {created.orgName} is ready
        </h2>
        <p className="mt-2 text-sm text-warning-700">
          Save these links now — there are no accounts, so this is the only time
          they&apos;re shown.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-ink-900">Invite link — share with your team</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                aria-label="Invite link"
                value={respondentUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700"
              />
              <CopyButton value={respondentUrl} />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink-900">Admin dashboard link — keep private</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                readOnly
                aria-label="Admin dashboard link"
                value={dashboardUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700"
              />
              <CopyButton value={dashboardUrl} />
            </div>
          </div>
        </div>

        <Link href={dashboardHref} className={buttonClass("primary", "mt-6")}>
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-ink-200 p-6 sm:p-8">
      <div>
        <label htmlFor="org-name" className="text-sm font-medium text-ink-900">
          Organization name
        </label>
        <input
          id="org-name"
          required
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Acme Robotics"
          className="mt-2 w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300"
        />
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-ink-900">Teams</p>
        <div className="mt-2 space-y-3">
          {teams.map((team, index) => (
            <div key={index} className="flex items-start gap-3">
              <input
                required
                aria-label={`Team ${index + 1} name`}
                value={team.name}
                onChange={(e) => updateTeam(index, { name: e.target.value })}
                placeholder="Team name"
                className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300"
              />
              <input
                required
                aria-label={`Team ${index + 1} headcount`}
                type="number"
                min={1}
                value={team.headcount}
                onChange={(e) => updateTeam(index, { headcount: e.target.value })}
                placeholder="Headcount"
                className="w-32 rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300"
              />
              {teams.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTeam(index)}
                  aria-label={`Remove ${team.name || "team"}`}
                  className="shrink-0 px-2 py-2 text-sm text-ink-500 hover:text-warning-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTeams((prev) => [...prev, emptyTeam()])}
          className="mt-3 text-sm font-medium text-accent-600 hover:text-accent-700"
        >
          + Add another team
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-warning-700">{error}</p>}

      <Button type="submit" disabled={submitting} className="mt-6">
        {submitting ? "Creating…" : "Create assessment"}
      </Button>
    </form>
  );
}
