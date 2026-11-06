import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Ruler } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { hasConfiguredWhatsApp, storeConfig } from "@/config/store";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/size-guide",
  title: "Size Guide — How to Measure & Request the Right Size",
  description:
    "Measure chest, length and sleeve in three steps with a tape measure, then send your numbers with the order request. Sizes here are requests confirmed by the team, never guessed.",
});

const steps = [
  {
    title: "Chest — the number that matters most",
    copy: "Lay a tee you already own flat, smooth out the wrinkles, and measure straight across the chest about 2 cm below the armpit seams. Double it. That is the chest circumference to quote.",
    diagram: "chest",
  },
  {
    title: "Length — where the hem should fall",
    copy: "On the same flat tee, measure from the highest point of the shoulder (next to the collar) straight down to the bottom hem. Note whether you prefer the hem at hip or below.",
    diagram: "length",
  },
  {
    title: "Sleeve & shoulder — for polos and stand collars",
    copy: "Measure from the shoulder seam at the collar edge, across the shoulder and down the sleeve to the cuff. Collared styles read sharper when this line is right.",
    diagram: "sleeve",
  },
] as const;

function TeeDiagram({ kind }: { kind: (typeof steps)[number]["diagram"] }) {
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 text-ink" role="img" aria-label={`Diagram: measuring the ${kind}`}>
      <path
        d="M32 12 L42 7 Q50 13 58 7 L68 12 L84 28 L72 36 L70 30 L70 88 L30 88 L30 30 L28 36 L16 28 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {kind === "chest" && (
        <g stroke="currentColor" strokeWidth="1.3">
          <line x1="30" y1="48" x2="70" y2="48" />
          <path d="M34 45 L30 48 L34 51 M66 45 L70 48 L66 51" fill="none" />
        </g>
      )}
      {kind === "length" && (
        <g stroke="currentColor" strokeWidth="1.3">
          <line x1="80" y1="12" x2="80" y2="88" />
          <path d="M77 16 L80 12 L83 16 M77 84 L80 88 L83 84" fill="none" />
        </g>
      )}
      {kind === "sleeve" && (
        <g stroke="currentColor" strokeWidth="1.3">
          <path d="M50 10 L68 12 L80 26" fill="none" />
          <path d="M65 9 L68 12 L66 16 M77 23 L80 26 L76 28" fill="none" />
        </g>
      )}
    </svg>
  );
}

export default function SizeGuidePage() {
  const whatsappUrl = hasConfiguredWhatsApp()
    ? buildWhatsAppUrl(`Hello ${storeConfig.brandName}, here are my measurements for a size request: chest __ cm, length __ cm, sleeve __ cm.`)
    : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Size guide", path: "/size-guide" }]),
          {
            "@type": "HowTo",
            name: "How to measure yourself for a MEMORY MAKERS size request",
            description: metadata.description as string,
            step: steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.copy,
            })),
            tool: { "@type": "HowToTool", name: "A soft measuring tape and a T-shirt you already own" },
          },
        ]}
      />

      <div className="frame grid gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <p className="eyebrow flex items-center gap-2 text-muted"><Ruler size={14} strokeWidth={1.6} aria-hidden="true" /> Three measurements</p>
            <h1 className="mt-6 text-[clamp(3rem,6.5vw,6.5rem)] font-black uppercase leading-[0.82] tracking-tightest">
              Fit starts<br /><span className="font-serif font-normal normal-case italic tracking-normal">with a tape.</span>
            </h1>
            <p className="mt-7 max-w-sm text-sm leading-7 text-muted">
              Verified garment measurements are still being finalised by the owner, so this site does not
              publish a size chart it cannot stand behind. Instead: measure a tee you love, send the numbers,
              and the team matches them to the nearest available size before accepting your order.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button-dark self-start">
                  <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" /> Send my measurements
                </a>
              )}
              <Link href="/faq" className="text-link self-start">Size questions, answered <ArrowRight size={14} aria-hidden="true" /></Link>
            </div>
          </div>
        </header>

        <div className="lg:col-span-7 lg:col-start-6">
          <ol className="border-t border-ink/20">
            {steps.map((step, index) => (
              <li key={step.title} className="index-row">
                <div className="flex items-start gap-4">
                  <span className="eyebrow pt-1 text-muted">0{index + 1}</span>
                  <TeeDiagram kind={step.diagram} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold uppercase tracking-[-0.03em] sm:text-xl">{step.title}</h2>
                  <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted sm:text-sm sm:leading-7">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 border border-ink/20 bg-chalk p-6 sm:p-8">
            <h2 className="text-lg font-semibold uppercase tracking-[-0.03em]">How size requests work here</h2>
            <ul className="mt-4 space-y-3 text-[13px] leading-relaxed text-muted">
              <li>— The size buttons (S to XXL) send a <strong className="font-semibold text-ink">request</strong>, not a confirmed stock claim.</li>
              <li>— Include your chest measurement in the order notes and the team matches it to the nearest piece.</li>
              <li>— Between two sizes? Say which fit you prefer — relaxed or close — and ask before sending payment.</li>
              <li>— Collared styles (polos, stand collars) also carry a shoulder-to-cuff line; quote it if you have it.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
