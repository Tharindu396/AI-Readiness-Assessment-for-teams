"use client";

import { Button } from "@/components/ui/Button";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-prose flex-col items-center justify-center px-6 py-16 text-center">
      <div className="animate-scale-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <span className="text-3xl">⚠</span>
        </div>
        <h1 className="font-serif text-2xl text-ink-950">Couldn&apos;t load the dashboard</h1>
        <p className="mt-2 text-sm text-ink-500">
          Something went wrong fetching this data. This is usually temporary.
        </p>
        <Button onClick={reset} className="mx-auto mt-6">
          Try again
        </Button>
      </div>
    </main>
  );
}
