/**
 * Editorial film-grain overlay: one fixed, GPU-friendly texture layer that
 * gives flat colours and product photography a printed-magazine depth.
 * Purely decorative — pointer events and assistive tech ignore it.
 */
const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>`;

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-multiply motion-reduce:opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`,
        backgroundSize: "180px 180px",
      }}
    />
  );
}
