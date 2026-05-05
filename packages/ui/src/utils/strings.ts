export function capitalize(str: string): string {
  // Handles potential issues with non-string input by coercing to a string
  str = String(str)
  if (str.length === 0) {
    return '' // Return an empty string if the input is empty
  }
  // Get the first character and uppercase it, then add the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Convert camelCase or snake_case input to kebab-case. */
export function toKebabCase(input: string): string {
  return input
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

/** Convert camelCase, snake_case, or kebab-case keys to a human-readable label */
export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/** Best-effort singularization for short UI labels. */
export function singularizeLabel(label: string): string {
  if (/[b-df-hj-np-tv-z]ies$/i.test(label)) return `${label.slice(0, -3)}y`
  if (/ies$/i.test(label)) return label.slice(0, -1)
  if (/(sses|shes|ches|xes|zes)$/.test(label)) return label.slice(0, -2)
  if (label.endsWith('s') && !label.endsWith('ss') && !label.endsWith('es')) return label.slice(0, -1)
  return label
}

/** Escape user-provided content for safe inclusion inside a CSS string literal. */
export function escapeCssString(input: string): string {
  return input
    .split('')
    .filter(char => {
      const code = char.charCodeAt(0)
      return (code >= 0x20 && code !== 0x7f) || code > 0x7f
    })
    .join('')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
}

/** Return the first font family token from a CSS font-family stack. */
export function extractPrimaryFontFamily(fontStack: string): string {
  let buffer = ''
  let quote: '"' | "'" | null = null

  for (const char of fontStack) {
    if ((char === '"' || char === "'") && quote === null) {
      quote = char
      continue
    }

    if (quote && char === quote) {
      quote = null
      continue
    }

    if (char === ',' && quote === null) {
      break
    }

    buffer += char
  }

  return buffer.trim()
}
