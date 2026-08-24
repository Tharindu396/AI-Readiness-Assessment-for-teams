import Link from "next/link";

export default function AssessmentNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-prose flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-serif text-2xl text-ink-950">This link isn&apos;t valid</h1>
      <p className="mt-2 text-sm text-ink-500">
        We couldn&apos;t find an assessment at this address. Double-check the link your
        admin shared, or ask them to resend it.
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
