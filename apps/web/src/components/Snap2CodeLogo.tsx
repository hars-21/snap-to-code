export function Snap2CodeLogo() {
  return (
    <svg
      viewBox="0 0 320 64"
      xmlns="http://www.w3.org/2000/svg"
      className="snap2code-logo"
      width="150"
      height="150"
    >
      <defs>
        <linearGradient id="snapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Icon */}
      <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#snapGradient)" />

      {/* Corner marks */}
      <path d="M18 14h-4v4" stroke="#fff" strokeWidth="3" fill="none" />
      <path d="M46 14h4v4" stroke="#fff" strokeWidth="3" fill="none" />
      <path d="M18 50h-4v-4" stroke="#fff" strokeWidth="3" fill="none" />
      <path d="M46 50h4v-4" stroke="#fff" strokeWidth="3" fill="none" />

      {/* Code text inside icon */}
      <text
        x="32"
        y="39"
        textAnchor="middle"
        fontSize="20"
        fill="#ffffff"
        fontFamily="monospace"
        fontWeight="600"
      >
        &lt;/&gt;
      </text>

      {/* Brand text */}
      <text
        x="80"
        y="42"
        fontSize="28"
        fontFamily="Inter, Segoe UI, sans-serif"
        fontWeight="700"
        fill="url(#snapGradient)"
        letterSpacing="0.5"
      >
        Snap2Code
      </text>
    </svg>
  )
}
