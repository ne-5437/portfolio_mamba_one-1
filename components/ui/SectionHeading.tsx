interface SectionHeadingProps {
  index: string;
  title: string;
  eyebrow?: string;
}

export default function SectionHeading({ index, title, eyebrow }: SectionHeadingProps) {
  return (
    <div className="mb-12 flex items-end gap-2 sm:mb-16">
      <span className="mono-tel text-sm text-neon/80 sm:text-base">{index}</span>
      <div className="h-px w-4 bg-border-strong" />
      <div>
        {eyebrow && (
          <p className="mono-tel mb-1 text-xs uppercase tracking-[0.3em] text-text-muted">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-bold uppercase tracking-tight text-text sm:text-5xl">
          {title}
        </h2>
      </div>
    </div>
  );
}
