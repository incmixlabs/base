import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildSemanticLaneVars, buildStaticSemanticLaneCss } from './semantic-lane-vars'
import { SEMANTIC_COLOR_DEFAULTS } from './tokens'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DESIGN_TOKENS_CSS_PATH = resolve(__dirname, 'design-tokens.css')

function extractCssSection(css: string, startMarker: string, endMarker: string) {
  const start = css.indexOf(startMarker)
  const end = css.indexOf(endMarker, start)

  if (start === -1 || end === -1) {
    throw new Error(`Unable to extract CSS section between "${startMarker}" and "${endMarker}"`)
  }

  const lineStart = css.lastIndexOf('\n', start) + 1
  const endLineStart = css.lastIndexOf('\n', end) + 1
  return css.slice(lineStart, endLineStart).trimEnd()
}

describe('semantic lane vars', () => {
  it('emits the primary lane with the preserved stronger border mapping', () => {
    const vars = buildSemanticLaneVars(SEMANTIC_COLOR_DEFAULTS)

    expect(vars['--color-primary-border']).toBe('var(--teal-9)')
    expect(vars['--color-primary-border-subtle']).toBe('var(--teal-7)')
    expect(vars['--color-primary-primary']).toBe('var(--teal-9)')
    expect(vars['--color-primary-primary-alpha']).toBe('color-mix(in oklch, var(--teal-9) 12%, transparent)')
  })

  it('emits alias lanes through the canonical surface lanes and skips self-alias writes', () => {
    const vars = buildSemanticLaneVars({
      ...SEMANTIC_COLOR_DEFAULTS,
      accent: 'neutral',
      info: 'white',
      success: 'black',
    })

    expect(vars['--color-accent-border']).toBe('var(--color-neutral-border)')
    expect(vars['--color-accent-background']).toBe('var(--color-neutral-background)')
    expect(vars['--color-info-text']).toBe('var(--color-light-text)')
    expect(vars['--color-success-primary']).toBe('var(--color-dark-primary)')
    expect(vars['--color-slate-border']).toBe('var(--gray-7)')
  })

  it('derives lane vars from configurable variant steps', () => {
    const vars = buildSemanticLaneVars(SEMANTIC_COLOR_DEFAULTS, {
      soft: 5,
      softHover: 6,
      surface: 2,
      surfaceHover: 7,
      solid: 8,
      solidHover: 9,
      border: 8,
      borderSubtle: 7,
      text: 10,
      lightText: 12,
      darkText: 11,
    })

    expect(vars['--color-info-surface']).toBe('var(--blue-2)')
    expect(vars['--color-info-surface-hover']).toBe('var(--blue-7)')
    expect(vars['--color-info-soft']).toBe('var(--blue-5)')
    expect(vars['--color-info-primary']).toBe('var(--blue-8)')
    expect(vars['--color-info-text']).toBe('var(--blue-10)')
  })

  it('matches the checked-in root semantic CSS block', () => {
    const css = readFileSync(DESIGN_TOKENS_CSS_PATH, 'utf8')
    const expected = extractCssSection(
      css,
      '/* Primary Colors (semantic teal lane, independent from theme accent) */',
      '/* Panel glass highlight (light/dark adaptive) */',
    )

    expect(buildStaticSemanticLaneCss('light', 'root')).toBe(expected)
  })

  it('matches the checked-in dark semantic CSS blocks for both dark entry points', () => {
    const css = readFileSync(DESIGN_TOKENS_CSS_PATH, 'utf8')

    const expectedMediaBlock = extractCssSection(
      css,
      '/* Primary Colors (semantic teal lane) — Dark */',
      '--color-panel-highlight:',
    )

    const classBlockStart = css.indexOf(':is(.dark, .dark-theme) {')
    if (classBlockStart === -1) {
      throw new Error('Unable to locate class-based dark mode block')
    }
    const classBlockCss = css.slice(classBlockStart)
    const classMarker = '  /* Primary Colors (semantic teal lane) — Dark */'
    const expectedClassBlock = extractCssSection(classBlockCss, classMarker, '--color-panel-highlight:')

    expect(buildStaticSemanticLaneCss('dark', 'media-dark')).toBe(expectedMediaBlock)
    expect(buildStaticSemanticLaneCss('dark', 'class-dark')).toBe(expectedClassBlock)
  })
})
