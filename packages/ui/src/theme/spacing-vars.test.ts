import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const thisDir = dirname(fileURLToPath(import.meta.url))
const globalsCssSource = readFileSync(resolve(thisDir, '../globals.css'), 'utf8')

describe('Wind spacing variable bridge', () => {
  it('keeps integer spacing aliases on the Wind spacing scale', () => {
    expect(globalsCssSource).toContain('--spacing: 0.25rem;')
    expect(globalsCssSource).toContain('--spacing-0: 0;')

    for (const step of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      expect(globalsCssSource).toContain(`--spacing-${step}: calc(var(--spacing) * ${step});`)
      expect(globalsCssSource).not.toContain(`--spacing-${step}: var(--space-${step});`)
    }
  })
})
