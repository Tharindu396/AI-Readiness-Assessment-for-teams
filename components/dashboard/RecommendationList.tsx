import { OrgRecommendation } from "@/lib/recommendations";
import { PriorityBadge } from "@/components/ui/Badge";

export function RecommendationList({
  recommendations,
}: {
  recommendations: OrgRecommendation[];
}) {
  return (
    <div className="glass-card p-6 sm:p-8">
      <h2 className="font-serif text-xl text-ink-950">Recommendations</h2>
      <p className="mt-1.5 text-sm text-ink-500">
        Ranked by priority, then by how many people they affect.
      </p>

      {recommendations.length === 0 ? (
        <p className="mt-6 text-sm text-ink-500">
          No patterns triggered a recommendation yet. Check back as more teams clear the anonymity floor.
        </p>
      ) : (
        <ol className="mt-6 space-y-1">
          {recommendations.map((rec, index) => (
            <li
              key={rec.ruleId}
              className="-mx-2 rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-surface-border hover:bg-surface-hover first:mt-0 sm:-mx-3 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-medium text-ink-900">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-accent text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  {rec.title}
                </h3>
                <PriorityBadge priority={rec.priority} />
              </div>
              <p className="mt-2 pl-8 text-sm text-ink-700">{rec.why}</p>
              <p className="mt-2 pl-8 text-sm font-medium text-ink-900">{rec.action}</p>
              <p className="mt-3 pl-8 text-xs text-ink-500">
                Affects {rec.affected_headcount} people across{" "}
                {rec.teams.map((t) => t.name).join(", ")}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
