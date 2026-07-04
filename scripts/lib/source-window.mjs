export function sourceWindow(lines, lineIndex, radius = 3) {
  const start = Math.max(0, lineIndex - radius)
  const end = Math.min(lines.length, lineIndex + radius + 1)
  return lines.slice(start, end).join('\n')
}

export function windowOffset(lines, lineIndex, index, radius = 3) {
  const start = Math.max(0, lineIndex - radius)
  const previous = lines.slice(start, lineIndex).join('\n')
  return previous.length + (previous.length > 0 ? 1 : 0) + index
}

export function isVarReference(source, index) {
  const before = source.slice(0, index)
  const lastVarCall = before.lastIndexOf('var(')
  if (lastVarCall === -1) return false

  const between = before.slice(lastVarCall + 'var('.length)
  return !between.includes(')')
}
