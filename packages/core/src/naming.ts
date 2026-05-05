export function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function splitDelimitedList(value: string, delimiter = ','): string[] {
  return value
    .split(delimiter)
    .map(item => item.trim())
    .filter(Boolean)
}

export function splitNormalizedPath(value: string, separator = '/'): string[] {
  return value
    .split(separator)
    .map(item => normalizeToken(item))
    .filter(Boolean)
}

export function formatPascalIdentifier(value: string, fallback = 'UntitledComponent', prefix = 'Component'): string {
  const name = value
    .trim()
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('')

  if (!name) return fallback
  return /^[A-Z]/.test(name) ? name : `${prefix}${name}`
}

export function getNextPascalIdentifier(baseName: string, existingNames: string[], currentName = '') {
  const normalizedBaseName = formatPascalIdentifier(baseName)
  const normalizedCurrentName = currentName.trim() ? formatPascalIdentifier(currentName) : null
  const taken = new Set(
    existingNames
      .map(name => formatPascalIdentifier(name).toLowerCase())
      .filter(name => normalizedCurrentName == null || name !== normalizedCurrentName.toLowerCase()),
  )

  if (!taken.has(normalizedBaseName.toLowerCase())) return normalizedBaseName

  let index = 2
  let candidate = `${normalizedBaseName}${index}`
  while (taken.has(candidate.toLowerCase())) {
    index += 1
    candidate = `${normalizedBaseName}${index}`
  }

  return candidate
}
