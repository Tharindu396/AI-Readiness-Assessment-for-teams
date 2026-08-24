import Link from "next/link";

export function DemoBanner({ clearHref }: { clearHref: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent-200 bg-accent-50 px-6 py-4 text-sm text-accent-700">
      <p>
        <span className="font-medium">You&apos;re viewing sample data.</span> This is a
        realistic example org, not anything from your account.
      </p>
      <Link
        href={clearHref}
        className="shrink-0 rounded-md border border-accent-200 bg-white px-3 py-1.5 font-medium text-accent-700 hover:bg-accent-100"
      >
        Clear sample data
      </Link>
    </div>
  );
}
