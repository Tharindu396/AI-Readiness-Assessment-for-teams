import { ReadinessBand } from "@/lib/types";

const BAND_STYLES: Record<ReadinessBand, string> = {
  Nascent: "bg-warning-50 text-warning-700",
  Emerging: "bg-ink-100 text-ink-700",
  Operational: "bg-accent-50 text-accent-700",
  Advanced: "bg-accent-100 text-accent-700",
};

export function BandBadge({ band }: { band: ReadinessBand }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${BAND_STYLES[band]}`}
    >
      {band}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles: Record<typeof priority, string> = {
    high: "bg-warning-50 text-warning-700",
    medium: "bg-ink-100 text-ink-700",
    low: "bg-ink-50 text-ink-500",
  };
  const labels: Record<typeof priority, string> = {
    high: "High priority",
    medium: "Medium priority",
    low: "Low priority",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}
