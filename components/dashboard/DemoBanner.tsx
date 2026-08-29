import Link from "next/link";

export function DemoBanner({ clearHref }: { clearHref: string }) {
  return (
    <div className="animate-fade-slide-in flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-500/20 bg-accent-500/10 px-6 py-4 text-sm text-accent-200 backdrop-blur-[16px]">
      <p>
        <span className="font-semibold text-accent-200">You&apos;re viewing sample data.</span>{" "}
        This is a realistic example org, not anything from your account.
      </p>
      <Link
        href={clearHref}
        className="shrink-0 rounded-lg border border-accent-500/30 bg-accent-500/10 px-4 py-2 font-medium text-accent-200 transition-all duration-200 hover:bg-accent-500/20 hover:border-accent-500/50"
      >
        Clear sample data
      </Link>
    </div>
  );
}
