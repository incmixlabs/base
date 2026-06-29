import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const thisDir = dirname(fileURLToPath(import.meta.url))
const unoConfigSource = readFileSync(resolve(thisDir, '../../../config/uno.config.ts'), 'utf8')

describe('base Uno config', () => {
  it('keeps muted text as neutral text plus opacity utility', () => {
    expect(unoConfigSource).toContain("'text-muted': 'text-neutral opacity-70'")
    expect(unoConfigSource).toContain("foreground: 'var(--color-neutral-text)'")
    expect(unoConfigSource).not.toContain('semanticMutedTextColor')
    expect(unoConfigSource).not.toContain("foreground: 'color-mix")
  })
})
