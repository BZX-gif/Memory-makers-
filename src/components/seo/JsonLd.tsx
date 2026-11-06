/**
 * Renders validated JSON-LD for search engines. Data is serialised once on the
 * server; the script tag is inert for users and screen readers.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- structured data must be raw JSON
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
