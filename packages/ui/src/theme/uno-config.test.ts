import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const thisDir = dirname(fileURLToPath(import.meta.url))
const unoConfigSource = readFileSync(resolve(thisDir, '../../../config/uno.config.ts'), 'utf8')

describe('base Uno config', () => {
  it('keeps muted text as neutral text plus opacity utility', () => {
    expect(unoConfigSource).toContain("'text-muted': 'text-neutral opacity-70'")
    expect(unoConfigSource).not.toContain('semanticMutedTextColor')
    expect(unoConfigSource).not.toContain(`'${['muted', 'foreground'].join('-')}'`)
    expect(unoConfigSource).not.toContain("background: 'var(--background)'")
    expect(unoConfigSource).not.toContain("foreground: 'var(--foreground)'")
    expect(unoConfigSource).not.toContain('muted: {')
    expect(unoConfigSource).not.toContain("border: 'var(--color-neutral-border)'")
    expect(unoConfigSource).not.toContain("input: 'var(--color-neutral-border-subtle)'")
    expect(unoConfigSource).not.toContain("ring: 'var(--color-primary-solid)'")
  })

  it('generates semantic background role utilities', () => {
    expect(unoConfigSource).toContain('solid|soft|surface|background')
    expect(unoConfigSource).toContain('background: `var(--color-${color}-background)`')
    expect(unoConfigSource).toContain('`bg-${color}-background`')
  })
})
