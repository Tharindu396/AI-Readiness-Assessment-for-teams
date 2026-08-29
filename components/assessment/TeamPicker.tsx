import { TeamRow } from "@/lib/types";

export function TeamPicker({
  orgName,
  teams,
  onSelect,
}: {
  orgName: string;
  teams: TeamRow[];
  onSelect: (teamId: string) => void;
}) {
  return (
    <div className="animate-fade-slide-in">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-200">{orgName}</p>
      <h1 className="mt-3 font-serif text-2xl text-ink-950 sm:text-3xl">
        Which team are you on?
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Your answers stay anonymous. Team scores only show once 3 or more people from
        that team have responded.
      </p>
      <ul className="mt-8 space-y-3">
        {teams.map((team, index) => (
          <li key={team.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
            <button
              type="button"
              onClick={() => onSelect(team.id)}
              className="glass-card-interactive group w-full px-5 py-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-base font-medium text-ink-900 transition-colors group-hover:text-ink-950">
                    {team.name}
                  </span>
                  <span className="block text-xs text-ink-500">{team.headcount} people</span>
                </div>
                <span className="text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-accent-200">
                  →
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
