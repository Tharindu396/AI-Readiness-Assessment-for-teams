import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-prose flex-col items-center justify-center px-6 py-16 text-center">
      <div className="animate-scale-in">
        <p className="text-7xl font-bold">
          <span className="gradient-text">404</span>
        </p>
        <h1 className="mt-4 font-serif text-2xl text-ink-950">Dashboard not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          We couldn&apos;t find an org at this address. Check the link, or create a new
          assessment to get one.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-accent-200 transition-colors hover:text-accent-500"
        >
          ← Go to the homepage
        </Link>
      </div>
    </main>
  );
}
