export function MiniChart({ trend = "up" }: { trend?: "up" | "down" | "flat" }) {
  const path =
    trend === "up"
      ? "M0 40 L15 35 L30 38 L45 28 L60 30 L75 18 L90 22 L105 10 L120 12"
      : trend === "down"
      ? "M0 10 L20 15 L40 12 L60 22 L80 20 L100 30 L120 35"
      : "M0 25 L30 22 L60 28 L90 24 L120 26";
  const color = trend === "down" ? "var(--destructive)" : "var(--primary)";
  return (
    <svg viewBox="0 0 120 50" className="h-12 w-full" fill="none">
      <defs>
        <linearGradient id={`g-${trend}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L120 50 L0 50 Z`} fill={`url(#g-${trend})`} />
      <path d={path} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
