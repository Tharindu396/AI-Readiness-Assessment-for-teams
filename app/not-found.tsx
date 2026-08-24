import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-prose flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-serif text-2xl text-ink-950">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">
        The page you&apos;re looking for doesn&apos;t exist.
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
