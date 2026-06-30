import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const thisDir = dirname(fileURLToPath(import.meta.url))
const globalsCssSource = readFileSync(resolve(thisDir, '../globals.css'), 'utf8')
const designTokensCssSource = readFileSync(resolve(thisDir, 'design-tokens.css'), 'utf8')

describe('Theme token CSS ownership', () => {
  it('keeps integer spacing aliases in the design token layer', () => {
    expect(designTokensCssSource).toContain('--spacing: 0.25rem;')
    expect(designTokensCssSource).toContain('--spacing-0: 0;')

    for (const step of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      expect(designTokensCssSource).toContain(`--spacing-${step}: calc(var(--spacing) * ${step});`)
      expect(designTokensCssSource).not.toContain(`--spacing-${step}: var(--space-${step});`)
    }
  })

  it('does not re-declare design tokens or legacy aliases in globals', () => {
    for (const token of [
      '--background:',
      '--foreground:',
      '--border:',
      '--ring:',
      '--radius:',
      '--spacing:',
      '--card:',
      '--card-foreground:',
      '--popover:',
      '--popover-foreground:',
      '--input:',
      '--sidebar:',
      '--sidebar-foreground:',
      '--letter-spacing-2x:',
      '--shadow-xs:',
    ]) {
      expect(globalsCssSource).not.toContain(token)
    }

    for (const step of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      expect(globalsCssSource).not.toContain(`--spacing-${step}:`)
    }

    for (const step of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
      expect(globalsCssSource).not.toContain(`--space-${step}:`)
    }
  })
})
