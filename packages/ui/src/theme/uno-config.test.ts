import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const unoConfigSource = readFileSync(resolve(process.cwd(), '../config/uno.config.ts'), 'utf8')

describe('base Uno config', () => {
  it('keeps muted text as neutral text plus opacity utility', () => {
    expect(unoConfigSource).toContain("'text-muted': 'text-neutral opacity-70'")
    expect(unoConfigSource).toContain("foreground: 'var(--color-neutral-text)'")
    expect(unoConfigSource).not.toContain('semanticMutedTextColor')
    expect(unoConfigSource).not.toContain("foreground: 'color-mix")
  })
})
