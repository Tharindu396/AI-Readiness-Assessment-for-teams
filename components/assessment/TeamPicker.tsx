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
      <p className="text-sm font-medium text-accent-600">{orgName}</p>
      <h1 className="mt-2 font-serif text-2xl text-ink-950 sm:text-3xl">
        Which team are you on?
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Your answers stay anonymous. Team scores only show once 3 or more people from
        that team have responded.
      </p>
      <ul className="mt-8 space-y-3">
        {teams.map((team) => (
          <li key={team.id}>
            <button
              type="button"
              onClick={() => onSelect(team.id)}
              className="w-full rounded-lg border border-ink-200 px-5 py-4 text-left transition-colors hover:border-accent-500 hover:bg-accent-50"
            >
              <span className="block text-base font-medium text-ink-900">{team.name}</span>
              <span className="block text-xs text-ink-500">{team.headcount} people</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
