/** Rounds a 0-100 score to a display-friendly integer string, e.g. "68". */
export function formatScore(score: number): string {
  return String(Math.round(score));
}

/** Formats a 0-1 fraction as a whole-number percentage, e.g. 0.367 -> "37%". */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
