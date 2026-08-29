import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOrganizationByAdminSlug, listResponses, listTeams } from "@/lib/db";
import { buildDashboardData } from "@/lib/dashboard-data";
import { buildDemoDataset } from "@/lib/demo";
import { getSiteOrigin } from "@/lib/site-url";
import { OrganizationRow } from "@/lib/types";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const isDemo = searchParams.demo === "1";
  const basePath = `/dashboard/${params.slug}`;
  const demoHref = `${basePath}?demo=1`;

  if (isDemo) {
    const demo = buildDemoDataset();
    return (
      <DashboardView
        orgName={demo.orgName}
        dashboard={demo.dashboard}
        isDemo
        inviteUrl={null}
        demoHref={demoHref}
        clearDemoHref={basePath}
      />
    );
  }

  // Resolved here, before any Suspense boundary exists, so a bad slug returns a real
  // 404 status. A file-based loading.tsx (or a <Suspense> wrapping this lookup) would
  // force Next.js to commit to a 200 response before this check finishes — the rest of
  // the page (the part worth showing a skeleton for) is deferred into <DashboardData>.
  const org = await getOrganizationByAdminSlug(params.slug);
  if (!org) notFound();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData org={org} demoHref={demoHref} clearDemoHref={basePath} />
    </Suspense>
  );
}

async function DashboardData({
  org,
  demoHref,
  clearDemoHref,
}: {
  org: OrganizationRow;
  demoHref: string;
  clearDemoHref: string;
}) {
  const [teams, responses] = await Promise.all([
    listTeams(org.id),
    listResponses(org.id),
  ]);
  const dashboard = buildDashboardData(teams, responses);
  const inviteUrl = `${getSiteOrigin()}/a/${org.slug}`;

  return (
    <DashboardView
      orgName={org.name}
      dashboard={dashboard}
      isDemo={false}
      inviteUrl={inviteUrl}
      demoHref={demoHref}
      clearDemoHref={clearDemoHref}
    />
  );
}
