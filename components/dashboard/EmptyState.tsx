"use client";

import Link from "next/link";
import { CopyButton } from "@/components/ui/CopyButton";

export function EmptyState({
  inviteUrl,
  demoHref,
}: {
  inviteUrl: string;
  demoHref: string;
}) {
  return (
    <div className="glass-card relative overflow-hidden p-8 text-center sm:p-12">
      {/* Animated pulsing circles illustration */}
      <div aria-hidden="true" className="mx-auto mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border border-accent-500/20 animate-glow-pulse" />
        <div className="absolute h-16 w-16 rounded-full border border-accent-500/30 animate-glow-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute h-8 w-8 rounded-full bg-accent-500/20 animate-glow-pulse" style={{ animationDelay: "1s" }} />
        <span className="relative text-2xl">📊</span>
      </div>

      <h2 className="font-serif text-xl text-ink-950">No responses yet</h2>
      <p className="mx-auto mt-2 max-w-prose text-sm text-ink-500">
        Share the assessment link with your team. Once the first responses come in,
        your org score, participation rate, and recommendations will appear here.
      </p>
      <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 sm:flex-row">
        <input
          readOnly
          aria-label="Invite link"
          value={inviteUrl}
          className="w-full rounded-lg border border-surface-border bg-ink-50/50 px-3 py-2.5 text-sm text-ink-700 backdrop-blur-[16px]"
          onFocus={(e) => e.currentTarget.select()}
        />
        <CopyButton value={inviteUrl} label="Copy invite link" />
      </div>
      <p className="mt-6 text-sm text-ink-500">
        Not ready to invite anyone yet?{" "}
        <Link href={demoHref} className="font-medium text-accent-200 transition-colors hover:text-accent-500">
          View sample data
        </Link>{" "}
        to see what a populated dashboard looks like.
      </p>
    </div>
  );
}
