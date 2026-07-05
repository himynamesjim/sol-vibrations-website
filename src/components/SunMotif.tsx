/**
 * Decorative brand motif: a golden sun core radiating violet sound-waves.
 * Purely decorative — hidden from assistive tech.
 */
export function SunMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className={className}
      role="presentation"
    >
      {/* sound-wave arcs */}
      {[150, 190, 230, 270].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke="#8B43E6"
          strokeOpacity={0.5 - i * 0.11}
          strokeWidth="3"
          strokeDasharray="18 14"
          strokeLinecap="round"
        />
      ))}
      {/* sun rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const x1 = 200 + Math.cos(angle) * 92
        const y1 = 200 + Math.sin(angle) * 92
        const x2 = 200 + Math.cos(angle) * 122
        const y2 = 200 + Math.sin(angle) * 122
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FFC83D"
            strokeWidth="8"
            strokeLinecap="round"
          />
        )
      })}
      {/* sun core */}
      <circle cx="200" cy="200" r="64" fill="#FFC83D" />
      <circle cx="200" cy="200" r="64" fill="url(#sun-shine)" />
      <defs>
        <radialGradient id="sun-shine" cx="0.35" cy="0.35" r="1">
          <stop offset="0%" stopColor="#FFE29A" />
          <stop offset="100%" stopColor="#FFC83D" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
