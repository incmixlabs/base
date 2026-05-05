/** Up/down caret icon — typically used for dropdown-style triggers. */
export function UpDownCaret({
  size = '0.75em',
  color = 'currentColor',
  className = 'shrink-0 text-muted-foreground',
}: {
  size?: string | number
  color?: string
  className?: string
}) {
  const resolvedSize = typeof size === 'number' ? `${size}px` : size
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={className}
      style={{ width: resolvedSize, height: resolvedSize, opacity: 0.85 }}
    >
      <path
        d="M3.5 4.5L6 2L8.5 4.5M3.5 7.5L6 10L8.5 7.5"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
