import { notFound } from "next/navigation";
import { getOrganizationBySlug, listTeams } from "@/lib/db";
import { AssessmentFlow } from "./assessment-flow";

export default async function AssessmentPage({
  params,
}: {
  params: { slug: string };
}) {
  const org = await getOrganizationBySlug(params.slug);
  if (!org) notFound();

  const teams = await listTeams(org.id);

  return (
    <main className="mx-auto min-h-dvh max-w-prose px-6 py-10 sm:py-16">
      {teams.length === 0 ? (
        <p className="text-sm text-ink-500">
          This assessment doesn&apos;t have any teams set up yet. Check back once your
          admin has added teams.
        </p>
      ) : (
        <AssessmentFlow orgId={org.id} orgName={org.name} teams={teams} />
      )}
    </main>
  );
}
