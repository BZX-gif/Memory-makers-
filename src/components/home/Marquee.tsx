const words = ["ART", "WORDS", "IDEAS", "MEMORY", "FORM", "EXPRESSION"];

export function Marquee() {
  const content = [...words, ...words];
  return (
    <div className="overflow-hidden border-b border-chalk/10 bg-ink py-4 text-chalk" aria-label="Art, words, ideas, memory, form, expression">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0" aria-hidden={group === 1}>
            {content.map((word, index) => (
              <span key={`${group}-${index}`} className="flex items-center text-[11px] font-medium tracking-[0.22em]">
                <span className="px-8 sm:px-12">{word}</span>
                <span className="font-serif text-lg italic text-chalk/45">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
