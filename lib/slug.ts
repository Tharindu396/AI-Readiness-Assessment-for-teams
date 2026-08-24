import { randomBytes } from "crypto";

// Excludes visually ambiguous characters (0/O, 1/l/I) so slugs are easy to read back if ever transcribed.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/** Generates an unguessable, URL-safe slug for accessing an org's assessment or dashboard. */
export function generateSlug(length = 12): string {
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return result;
}
