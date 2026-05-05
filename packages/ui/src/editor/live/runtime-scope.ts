import { type CatalogEntry, catalog, loadCatalogEntryRuntimeScope } from '../catalog'

const catalogEntriesByComponentName = catalog.reduce<Map<string, CatalogEntry>>((result, entry) => {
  if (entry.runtime.kind === 'known-renderer') {
    result.set(entry.runtime.componentName, entry)
  }
  return result
}, new Map())

function stripJsxScannerIgnoredSource(source: string): string {
  let result = ''
  let index = 0
  let state: 'code' | 'line-comment' | 'block-comment' | 'single-quote' | 'double-quote' | 'template' = 'code'

  while (index < source.length) {
    const char = source[index]
    const next = source[index + 1]

    if (state === 'line-comment') {
      if (char === '\n') {
        state = 'code'
        result += char
      } else {
        result += ' '
      }
      index += 1
      continue
    }

    if (state === 'block-comment') {
      if (char === '*' && next === '/') {
        result += '  '
        index += 2
        state = 'code'
      } else {
        result += char === '\n' ? char : ' '
        index += 1
      }
      continue
    }

    if (state === 'single-quote' || state === 'double-quote' || state === 'template') {
      const quote = state === 'single-quote' ? "'" : state === 'double-quote' ? '"' : '`'
      if (char === '\\') {
        result += '  '
        index += 2
        continue
      }
      if (char === quote) {
        result += ' '
        index += 1
        state = 'code'
        continue
      }
      result += char === '\n' ? char : ' '
      index += 1
      continue
    }

    if (char === '/' && next === '/') {
      result += '  '
      index += 2
      state = 'line-comment'
      continue
    }
    if (char === '/' && next === '*') {
      result += '  '
      index += 2
      state = 'block-comment'
      continue
    }
    if (char === "'") {
      result += ' '
      index += 1
      state = 'single-quote'
      continue
    }
    if (char === '"') {
      result += ' '
      index += 1
      state = 'double-quote'
      continue
    }
    if (char === '`') {
      result += ' '
      index += 1
      state = 'template'
      continue
    }

    result += char
    index += 1
  }

  return result
}

function getRuntimeComponentName(tagName: string): string | null {
  const componentName = tagName.split('.')[0]
  if (!componentName || componentName === 'Fragment' || tagName === 'React.Fragment') {
    return null
  }
  return /^[A-Z]/.test(componentName) ? componentName : null
}

export function getJsxComponentTagNames(source: string): string[] {
  const sanitizedSource = stripJsxScannerIgnoredSource(source)
  const names = new Set<string>()

  for (const match of sanitizedSource.matchAll(/<\/?\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)?)/g)) {
    const componentName = getRuntimeComponentName(match[1] ?? '')
    if (componentName) names.add(componentName)
  }

  return [...names]
}

export function getCatalogEntriesForJsx(source: string, baseScope: Record<string, unknown> = {}): CatalogEntry[] {
  return getJsxComponentTagNames(source)
    .map(componentName => {
      if (componentName in baseScope) {
        return null
      }

      const entry = catalogEntriesByComponentName.get(componentName)
      if (!entry) {
        throw new Error(`Unknown JSX component "${componentName}". Add it to the UI catalog before previewing it.`)
      }
      return entry
    })
    .filter((entry): entry is CatalogEntry => entry != null)
}

export async function loadCatalogRuntimeScopeForJsx(
  source: string,
  baseScope: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
  const entries = getCatalogEntriesForJsx(source, baseScope)
  const scopes = await Promise.all(entries.map(entry => loadCatalogEntryRuntimeScope(entry)))
  return Object.assign({}, ...scopes)
}
