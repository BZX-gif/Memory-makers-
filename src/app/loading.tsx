export default function Loading() {
  return (
    <div className="frame flex min-h-[65vh] items-center justify-center" role="status" aria-label="Loading page">
      <div className="text-center">
        <div className="mx-auto h-px w-28 origin-left animate-pulse bg-ink" />
        <p className="eyebrow mt-5">Making room for memories</p>
      </div>
    </div>
  );
}
