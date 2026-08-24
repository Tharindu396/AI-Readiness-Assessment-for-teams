import "server-only";
import { headers } from "next/headers";

/** Best-effort site origin from the incoming request, for building shareable invite links. */
export function getSiteOrigin(): string {
  const h = headers();
  const host = h.get("host") ?? "localhost:3000";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  return `${isLocal ? "http" : "https"}://${host}`;
}
