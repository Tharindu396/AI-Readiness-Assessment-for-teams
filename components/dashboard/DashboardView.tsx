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
      <div className="animate-fade-slide-in">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-200">{orgName}</p>
        <h1 className="mt-2 font-serif text-2xl sm:text-3xl">
          <span className="gradient-text">AI readiness dashboard</span>
        </h1>
      </div>

      {isDemo && <DemoBanner clearHref={clearDemoHref} />}

      {isEmpty ? (
        <EmptyState inviteUrl={inviteUrl ?? ""} demoHref={demoHref} />
      ) : (
        <>
          <div className="animate-slide-up stagger-1">
            <OrgScoreHero
              orgOverall={dashboard.orgOverall as number}
              orgBand={dashboard.orgBand!}
              totalResponses={dashboard.totalResponses}
              totalHeadcount={dashboard.totalHeadcount}
              totalTeams={dashboard.teams.filter((t) => t.responseCount > 0).length}
              participation={dashboard.participation}
            />
          </div>
          <div className="animate-slide-up stagger-2">
            <DimensionBreakdown scores={dashboard.orgDimensionScores!} />
          </div>
          <div className="animate-slide-up stagger-3">
            <TeamTable teams={dashboard.teams} />
          </div>
          <div className="animate-slide-up stagger-4">
            <RecommendationList recommendations={dashboard.recommendations} />
          </div>
        </>
      )}
    </main>
  );
}
