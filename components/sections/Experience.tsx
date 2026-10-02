import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { experience } from "@/data/content";

/**
 * Employers hang off one continuous rail; multiple roles at the same employer
 * nest inside a single card so a promotion reads as one tenure, not two jobs.
 */
export default function Experience() {
  // Flatten all roles into a single list
  const allRoles = experience.flatMap((company) =>
    company.roles.map((role, idx) => ({
      ...role,
      company: company.company,
      location: company.location,
      lap: company.lap,
      roleIndex: idx,
    }))
  );

  return (
    <section id="experience" className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="02" eyebrow="Career Circuit" title="Experience" />

        <div className="relative pl-8 sm:pl-12">
          <div className="absolute left-0 top-3 bottom-3 w-px bg-gradient-to-b from-neon via-neon-dim to-transparent" />

          <div className="flex flex-col gap-0.5">
            {allRoles.map((role, i) => (
              <RevealOnScroll key={`${role.company}-${role.role}-${i}`} delay={(i % 3) * 0.1}>
                <div className="relative">
                  <span className="absolute top-9 -left-[38px] h-3 w-3 rounded-full border border-neon bg-black shadow-[0_0_10px_rgba(57,255,143,0.7)] sm:-left-[54px]" />

                  <article className="glass-card glass-card-hover rounded-3xl p-7 sm:p-8">
                    {/* Role title header */}
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
                      <h3 className="text-lg font-bold text-text sm:text-xl">{role.role}</h3>
                      <span className="mono-tel text-xs text-neon whitespace-nowrap">
                        {role.duration}
                      </span>
                    </div>

                    {/* Company */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-2">
                      <span className="text-sm text-text">
                        {role.company}
                      </span>
                    </div>

                    <p className="mono-tel mt-2 text-[10px] uppercase tracking-[0.18em] text-text-faint">
                      {role.location}
                    </p>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted">
                      {role.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-0.5">
                      {role.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="mono-tel rounded border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
