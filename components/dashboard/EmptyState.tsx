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
    <div className="rounded-lg border border-ink-200 p-8 text-center sm:p-12">
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
          className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700"
          onFocus={(e) => e.currentTarget.select()}
        />
        <CopyButton value={inviteUrl} label="Copy invite link" />
      </div>
      <p className="mt-6 text-sm text-ink-500">
        Not ready to invite anyone yet?{" "}
        <Link href={demoHref} className="font-medium text-accent-600 hover:text-accent-700">
          View sample data
        </Link>{" "}
        to see what a populated dashboard looks like.
      </p>
    </div>
  );
}
