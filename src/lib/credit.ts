/**
 * Returns a trimmed http(s) URL, or null when the value is empty or not a real
 * web destination. Used so the developer credit only becomes a link once an
 * actual WEBPI website or social profile URL is configured.
 */
export function safeHttpUrl(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (!parsed.hostname) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Resolves the clickable developer credit URL, or null for a plain-text signature. */
export function developerCreditUrl(url: string | null | undefined) {
  return safeHttpUrl(url);
}
