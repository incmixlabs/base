const arbitraryOpen = '['
const arbitraryClose = ']'

export function arbitrary(value: string) {
  return `${arbitraryOpen}${value}${arbitraryClose}`
}

export function arbitraryDeclaration(property: string, value: string) {
  return arbitrary(`${property}:${value}`)
}

export function arbitraryUtility(prefix: string, value: string) {
  return `${prefix}-${arbitrary(value)}`
}

export function arbitraryVariant(selector: string, className: string) {
  return `${arbitrary(selector)}:${className}`
}

export function cssVar(name: string) {
  return `var(--${name})`
}
