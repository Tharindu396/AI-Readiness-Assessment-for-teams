import { DashboardData } from "@/lib/dashboard-data";
import { OrgScoreHero } from "./OrgScoreHero";
import { DimensionBreakdown } from "./DimensionBreakdown";
import { TeamTable } from "./TeamTable";
import { RecommendationList } from "./RecommendationList";
import { DemoBanner } from "./DemoBanner";
import { EmptyState } from "./EmptyState";

export function DashboardView({
  orgName,
  dashboard,
  isDemo,
  inviteUrl,
  demoHref,
  clearDemoHref,
}: {
  orgName: string;
  dashboard: DashboardData;
  isDemo: boolean;
  inviteUrl: string | null;
  demoHref: string;
  clearDemoHref: string;
}) {
  const isEmpty = dashboard.totalResponses === 0;

  return (
    <main className="mx-auto max-w-page space-y-8 px-6 py-10 sm:px-10 sm:py-14">
      <div>
        <p className="text-sm font-medium text-accent-600">{orgName}</p>
        <h1 className="mt-1 font-serif text-2xl text-ink-950 sm:text-3xl">
          AI readiness dashboard
        </h1>
      </div>

      {isDemo && <DemoBanner clearHref={clearDemoHref} />}

      {isEmpty ? (
        <EmptyState inviteUrl={inviteUrl ?? ""} demoHref={demoHref} />
      ) : (
        <>
          <OrgScoreHero
            orgOverall={dashboard.orgOverall as number}
            orgBand={dashboard.orgBand!}
            totalResponses={dashboard.totalResponses}
            totalHeadcount={dashboard.totalHeadcount}
            totalTeams={dashboard.teams.filter((t) => t.responseCount > 0).length}
            participation={dashboard.participation}
          />
          <DimensionBreakdown scores={dashboard.orgDimensionScores!} />
          <TeamTable teams={dashboard.teams} />
          <RecommendationList recommendations={dashboard.recommendations} />
        </>
      )}
    </main>
  );
}
