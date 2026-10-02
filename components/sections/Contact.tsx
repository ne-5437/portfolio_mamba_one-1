"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { profile } from "@/data/content";

/**
 * Compact contact module: a message box on one side, direct channels on the
 * other. Submissions go to /api/contact, which stores them in Supabase.
 */
export default function Contact() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — hidden from humans
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = name.trim().length > 0 && message.trim().length > 0 && !sending;

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(false), 3000);
    return () => clearTimeout(t);
  }, [sent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, website }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not send right now. Please email instead.");
      }
      setName("");
      setMessage("");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send right now. Please email instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="06" eyebrow="Get In Touch" title="Contact" />

        <RevealOnScroll>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
            {/* Message */}
            <form onSubmit={handleSubmit} className="glass-card flex flex-col rounded-3xl p-7 sm:p-8">
              <p className="mono-tel mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
                Leave a message
              </p>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
                required
                data-cursor-hover
                className="mb-3 w-full rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-text outline-none transition-colors placeholder:text-text-faint focus:border-border-strong"
              />

              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                placeholder="Your thoughts on this portfolio?"
                maxLength={4000}
                data-cursor-hover
                className="w-full flex-1 resize-none rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-text outline-none transition-colors placeholder:text-text-faint focus:border-border-strong"
              />

              <button
                type="submit"
                disabled={!canSend}
                data-cursor-hover
                className="mono-tel mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-border-strong px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-neon transition-colors enabled:hover:bg-neon enabled:hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sent ? "Sent ✓" : sending ? "Sending…" : "Send Message"}
                {!sent && !sending && <span aria-hidden>→</span>}
              </button>

              {error && (
                <p role="alert" className="mt-3 text-sm text-text-muted">
                  {error}
                </p>
              )}
            </form>

            {/* Direct channels */}
            <div className="flex flex-col gap-5">
              <div className="glass-card glass-card-hover flex flex-1 flex-col justify-between rounded-3xl p-7 sm:p-8">
                <p className="mono-tel mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
                  Or email directly
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor-hover
                  className="group break-all text-lg font-semibold text-text transition-colors hover:text-neon"
                >
                  {profile.email}
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
                <p className="mt-4 text-sm text-text-muted">
                  Based in {profile.location} — open to opportunities and collaborations.
                </p>
              </div>

              <div className="glass-card rounded-3xl p-7 sm:p-8">
                <p className="mono-tel mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
                  Elsewhere
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {profile.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor-hover
                      className="mono-tel rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-text-muted transition-colors hover:border-border-strong hover:text-neon"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
