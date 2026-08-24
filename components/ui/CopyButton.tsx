"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copy link",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (permissions, non-secure context); fail silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-ink-200 bg-paper px-4 py-2 text-sm font-medium text-ink-900 transition-colors hover:border-ink-300 hover:bg-ink-50"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
