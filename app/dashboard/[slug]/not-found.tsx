import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-prose flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-serif text-2xl text-ink-950">Dashboard not found</h1>
      <p className="mt-2 text-sm text-ink-500">
        We couldn&apos;t find an org at this address. Check the link, or create a new
        assessment to get one.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-accent-600 hover:text-accent-700"
      >
        Go to the homepage
      </Link>
    </main>
  );
}
