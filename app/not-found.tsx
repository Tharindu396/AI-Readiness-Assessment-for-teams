import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-prose flex-col items-center justify-center px-6 py-16 text-center">
      <div className="animate-scale-in">
        <p className="text-7xl font-bold">
          <span className="gradient-text">404</span>
        </p>
        <h1 className="mt-4 font-serif text-2xl text-ink-950">Page not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist.
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
