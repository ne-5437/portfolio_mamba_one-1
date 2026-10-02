import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ProjectMedia from "@/components/ui/ProjectMedia";
import { expertise } from "@/data/content";

/**
 * Three horizontal feature blocks. Visual and copy swap sides on alternate rows
 * so the section reads as one connected run rather than three stacked cards.
 */
export default function Expertise() {
  return (
    <section id="expertise" className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" eyebrow="What I Do" title="Expertise" />

        {/* Three across on desktop — equal columns, so the blocks read as one row. */}
        <div className="grid gap-5 md:grid-cols-3">
          {expertise.map((item, i) => (
            <RevealOnScroll key={item.index} delay={i * 0.1} className="h-full">
              <article className="glass-card glass-card-hover flex h-full flex-col overflow-hidden rounded-3xl">
                <div className="px-6 pt-6">
                  <ProjectMedia image={item.image} index={item.index} />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span className="mono-tel text-xs text-neon">{item.index}</span>
                  <h3 className="mt-3 text-xl font-bold leading-snug text-text lg:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                    {item.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="mono-tel rounded border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
