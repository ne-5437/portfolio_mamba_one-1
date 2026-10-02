export default function CheckeredAccent({ className = "" }: { className?: string }) {
  const cells = Array.from({ length: 16 });
  return (
    <div
      aria-hidden
      className={`grid grid-cols-4 grid-rows-4 gap-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${className}`}
      style={{ width: 20, height: 20 }}
    >
      {cells.map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const isDark = (row + col) % 2 === 0;
        return (
          <div key={i} className={isDark ? "bg-neon" : "bg-transparent"} />
        );
      })}
    </div>
  );
}
