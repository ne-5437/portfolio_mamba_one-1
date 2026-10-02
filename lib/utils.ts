/**
 * Minimal `cn` — joins truthy class values. Intentionally dependency-free
 * (no clsx/tailwind-merge) since nothing here relies on conflict resolution.
 */
export function cn(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
