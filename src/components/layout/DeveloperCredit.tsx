import { storeConfig } from "@/config/store";
import { developerCreditUrl } from "@/lib/credit";

type DeveloperCreditProps = {
  label?: string;
  url?: string | null;
  className?: string;
};

const nameClasses = "font-semibold tracking-[0.2em] text-chalk/80";

/**
 * Discreet signature at the very bottom of the footer. Renders as plain text
 * until a verified WEBPI website or social profile URL is configured, and only
 * then becomes a quiet, underlined link.
 */
export function DeveloperCredit({
  label = storeConfig.credit.label,
  url = storeConfig.credit.url,
  className = "",
}: DeveloperCreditProps) {
  const href = developerCreditUrl(url);

  return (
    <p
      className={`text-[10px] uppercase leading-relaxed tracking-[0.13em] text-chalk/50 ${className}`.trim()}
      data-testid="developer-credit"
    >
      Designed &amp; developed by{" "}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Visit WEBPI — the digital studio behind this website"
          className={`border-b border-chalk/25 pb-px transition-colors duration-300 hover:border-chalk/60 focus-visible:outline-chalk ${nameClasses}`}
        >
          {label}
        </a>
      ) : (
        <span className={nameClasses}>{label}</span>
      )}
    </p>
  );
}
