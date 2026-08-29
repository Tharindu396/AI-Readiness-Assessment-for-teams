import { ReadinessBand } from "@/lib/types";

const BAND_STYLES: Record<ReadinessBand, string> = {
  Nascent: "bg-red-500/15 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]",
  Emerging: "bg-amber-500/15 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
  Operational: "bg-blue-500/15 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
  Advanced: "bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]",
};

export function BandBadge({ band }: { band: ReadinessBand }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${BAND_STYLES[band]}`}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {band}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles: Record<typeof priority, string> = {
    high: "bg-red-500/15 text-red-400",
    medium: "bg-amber-500/15 text-amber-400",
    low: "bg-ink-100 text-ink-500",
  };
  const labels: Record<typeof priority, string> = {
    high: "High priority",
    medium: "Medium priority",
    low: "Low priority",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${styles[priority]}`}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {labels[priority]}
    </span>
  );
}
