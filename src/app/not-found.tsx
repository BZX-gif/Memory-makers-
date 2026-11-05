import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="frame flex min-h-[72vh] flex-col justify-center py-20">
      <p className="eyebrow text-muted">404 / Missing memory</p>
      <h1 className="mt-6 max-w-5xl text-[clamp(4rem,11vw,10rem)] font-black uppercase leading-[0.8] tracking-tightest">Not here.<br /><span className="font-serif font-normal normal-case italic tracking-normal">Still somewhere.</span></h1>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">This page or product may have moved. The collection is a good place to start again.</p>
      <Link href="/shop" className="button-dark mt-8 self-start"><ArrowLeft size={15} /> Back to the collection</Link>
    </div>
  );
}
