"use client";

import { Button } from "@/components/ui/Button";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-prose flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-serif text-2xl text-ink-950">Couldn&apos;t load the dashboard</h1>
      <p className="mt-2 text-sm text-ink-500">
        Something went wrong fetching this data. This is usually temporary.
      </p>
      <Button onClick={reset} className="mx-auto mt-6">
        Try again
      </Button>
    </main>
  );
}
