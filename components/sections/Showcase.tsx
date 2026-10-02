import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { designStats, gamingStats, gamerProfile, profile } from "@/data/content";

/** Opens a pre-filled Outlook web compose window; the visitor fills in the purpose. */
const WORK_ENQUIRY_HREF =
  "https://outlook.office.com/mail/deeplink/compose?" +
  new URLSearchParams({
    to: profile.email,
    subject: "Enquiry about your work",
    body:
      "Hi Eshwar,\n\nI would like to contact you and ask you more about your work.\n\nPurpose: \n\nThanks,\n",
  }).toString().replace(/\+/g, "%20");

const STAT_ICONS: Record<(typeof gamingStats)[number]["icon"], React.ReactNode> = {
  controller: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="10" rx="5" />
      <path d="M7 11v4M5 13h4" />
      <circle cx="16" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="14" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="M9.5 9.5 7 3M14.5 9.5 17 3" />
      <path d="M10 14.5h4" />
    </svg>
  ),
  completion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" opacity="0.35" />
      <path d="M12 3a9 9 0 1 1-8.56 6.22" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  ),
};

/**
 * Two summary tiles rather than full grids — Designs links out to the full
 * gallery instead of embedding every piece here. Gaming shows the Steam
 * profile summary from `gamingStats`.
 */
export default function Showcase() {
  return (
    <section id="showcase" className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="05" eyebrow="Off The Clock" title="Showcase" />

        <RevealOnScroll>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Designs */}
            <div className="glass-card glass-card-hover flex flex-col rounded-3xl p-7 sm:p-8">
              <p className="mono-tel mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
                Graphic Design
              </p>
              <span className="mono-tel text-3xl font-bold text-neon sm:text-4xl">
                {designStats.total} pieces · {designStats.orgs} orgs
              </span>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                Posters, brand identity, and event campaigns for Acumen ECE, GDSC, Newton&apos;s
                Apple Magazine, and Swayam Ed-Cell — {designStats.range}.
              </p>
              <a
                href={WORK_ENQUIRY_HREF}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="mono-tel mt-5 inline-flex items-center gap-2 self-start text-[10px] uppercase tracking-[0.2em] text-neon transition-opacity hover:opacity-70"
              >
                View More
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* Gaming */}
            <div className="glass-card flex flex-col rounded-3xl p-7 sm:p-8">
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <p className="mono-tel text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
                  Gaming
                </p>
                <span className="mono-tel text-xs">
                  <span className="text-text">Steam ID:</span>{" "}
                  <span className="text-neon">{gamerProfile.tag}</span>
                </span>
              </div>
              <p className="mb-5 text-sm italic leading-relaxed text-text-muted">
                &ldquo;{gamerProfile.quote}&rdquo;
              </p>
              <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 content-start">
                {gamingStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-neon">
                      <span className="h-4 w-4">{STAT_ICONS[stat.icon]}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] leading-tight text-text-muted">{stat.label}</div>
                      <div className="mono-tel text-base font-bold text-text">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
