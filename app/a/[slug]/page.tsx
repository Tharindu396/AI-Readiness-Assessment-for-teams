import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOrganizationBySlug, listTeams } from "@/lib/db";
import { AssessmentFlow } from "./assessment-flow";
import { AssessmentSkeleton } from "@/components/assessment/AssessmentSkeleton";
import { OrganizationRow } from "@/lib/types";

export default async function AssessmentPage({
  params,
}: {
  params: { slug: string };
}) {
  // Resolved here, before any Suspense boundary exists, so a bad slug returns a real
  // 404 status. A file-based loading.tsx (or a <Suspense> wrapping this lookup) would
  // force Next.js to commit to a 200 response before this check finishes — the rest of
  // the page (the part worth showing a skeleton for) is deferred into <AssessmentData>.
  const org = await getOrganizationBySlug(params.slug);
  if (!org) notFound();

  return (
    <main className="mx-auto min-h-dvh max-w-prose px-6 py-10 sm:py-16">
      <Suspense fallback={<AssessmentSkeleton />}>
        <AssessmentData org={org} />
      </Suspense>
    </main>
  );
}

async function AssessmentData({ org }: { org: OrganizationRow }) {
  const teams = await listTeams(org.id);

  if (teams.length === 0) {
    return (
      <p className="text-sm text-ink-500">
        This assessment doesn&apos;t have any teams set up yet. Check back once your
        admin has added teams.
      </p>
    );
  }

  return <AssessmentFlow orgId={org.id} orgName={org.name} teams={teams} />;
}
