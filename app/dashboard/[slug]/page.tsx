import { notFound } from "next/navigation";
import { getOrganizationByAdminSlug, listResponses, listTeams } from "@/lib/db";
import { buildDashboardData } from "@/lib/dashboard-data";
import { buildDemoDataset } from "@/lib/demo";
import { getSiteOrigin } from "@/lib/site-url";
import { DashboardView } from "@/components/dashboard/DashboardView";

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

  const org = await getOrganizationByAdminSlug(params.slug);
  if (!org) notFound();

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
      clearDemoHref={basePath}
    />
  );
}
