import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CheckeredAccent from "@/components/ui/CheckeredAccent";
import ProjectMedia from "@/components/ui/ProjectMedia";
import { projects } from "@/data/content";

/**
 * Project card supports the full slot shape: number, name, description,
 * technologies, visual, links, and an optional category/status. Any field left
 * unset simply doesn't render, so entries can be filled in incrementally.
 */
export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="03" eyebrow="Featured Work" title="Projects" />

        {/* Two rows of three — six real projects fill the grid exactly. */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <RevealOnScroll key={project.title} delay={(i % 3) * 0.1} className="h-full">
              <article className="glass-card glass-card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl">
                <CheckeredAccent className="absolute right-6 top-6 z-10" />

                {/* Visual slot — project photo, or a placeholder tile when unset */}
                <div className="px-6 pt-6 sm:px-8 sm:pt-8">
                  <ProjectMedia image={project.image} index={project.index} />
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="mono-tel text-xs text-neon">{project.index}</span>
                    {project.category && (
                      <span className="mono-tel text-[10px] uppercase tracking-[0.18em] text-text-faint">
                        {project.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-text transition-colors group-hover:text-neon">
                    {project.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-text-muted">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="mono-tel rounded border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links slot */}
                  {project.href && (
                    <div className="mt-6 border-t border-border pt-4">
                      {project.href !== "#" ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor-hover
                          className="mono-tel inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neon transition-opacity hover:opacity-70"
                        >
                          View Source
                          <span aria-hidden>→</span>
                        </a>
                      ) : (
                        <span className="mono-tel inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neon">
                          View Source
                          <span aria-hidden>→</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </RevealOnScroll>
          ))}

        </div>
      </div>
    </section>
  );
}
