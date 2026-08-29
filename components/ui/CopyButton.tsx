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
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
        copied
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_16px_rgba(34,197,94,0.15)]"
          : "border-surface-border bg-surface text-ink-900 backdrop-blur-[16px] hover:border-surface-border-hover hover:bg-surface-hover"
      }`}
    >
      <span aria-live="polite">{copied ? "✓ Copied" : label}</span>
    </button>
  );
}
