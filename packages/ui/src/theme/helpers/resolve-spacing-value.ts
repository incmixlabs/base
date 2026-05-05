export function resolveSpacingValue(
  value: string | undefined,
  spacingMap: Record<string, string>,
  negate: (resolvedValue: string) => string = resolvedValue =>
    resolvedValue === '0' || resolvedValue === '0px' ? resolvedValue : `-${resolvedValue}`,
): string | undefined {
  if (value === undefined) return undefined

  const isNegative = value.startsWith('-')
  const token = isNegative ? value.slice(1) : value
  const resolvedValue = spacingMap[token]

  if (!resolvedValue) return value

  return isNegative ? negate(resolvedValue) : resolvedValue
}
