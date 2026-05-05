/**
 * Generate OKLCh palette tokens from @radix-ui/colors CSS files.
 *
 * Reads hex values from node_modules/@radix-ui/colors/{hue}.css and
 * {hue}-dark.css, converts them to oklch(), and writes the palette
 * sections of design-tokens.css.
 *
 * Usage:  node packages/ui/scripts/generate-hue-palette.mjs
 *
 * The script outputs two CSS blocks (light mode and dark mode) to stdout.
 * The dark mode block is used for both @media and .dark selector contexts.
 * Pipe to a file or copy-paste into design-tokens.css.
 */

import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'

const require = createRequire(import.meta.url)
const RADIX_DIR = dirname(require.resolve('@radix-ui/colors/package.json'))

// ── Config ──────────────────────────────────────────────────────────────────

/** Hue order loaded from src/theme/tokens.ts (single source of truth) */
const TOKENS_TS_PATH = resolve(process.cwd(), 'packages/ui/src/theme/tokens.ts')
const HUES = readHuesFromTokensSource(TOKENS_TS_PATH)

/** Radix steps we use — numbers match our --{color}-{step} tokens */
const STEPS = [3, 4, 5, 6, 7, 8, 9, 10, 11]

/** Contrast token per hue (white text on solid, or dark for bright hues) */
const CONTRAST = {
  orange: 'oklch(0.25 0 0)',
  tomato: 'oklch(1 0 0)',
  red: 'oklch(1 0 0)',
  crimson: 'oklch(1 0 0)',
  pink: 'oklch(1 0 0)',
  plum: 'oklch(1 0 0)',
  purple: 'oklch(1 0 0)',
  violet: 'oklch(1 0 0)',
  indigo: 'oklch(1 0 0)',
  blue: 'oklch(1 0 0)',
  sky: 'oklch(0.25 0 0)',
  cyan: 'oklch(1 0 0)',
  teal: 'oklch(1 0 0)',
  green: 'oklch(1 0 0)',
  lime: 'oklch(1 0 0)',
  mint: 'oklch(0.25 0 0)',
  yellow: 'oklch(0.25 0 0)',
  amber: 'oklch(0.25 0 0)',
  brown: 'oklch(1 0 0)',
  gray: 'oklch(1 0 0)',
}

/** Dark-mode contrast — same as light for now */
const CONTRAST_DARK = { ...CONTRAST }

function readHuesFromTokensSource(filePath) {
  const source = readFileSync(filePath, 'utf8')
  const match = source.match(/export const HUES = \[(.*?)\] as const/s)
  if (!match?.[1]) {
    throw new Error(`Unable to read HUES from ${filePath}`)
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map(entry => entry[1])
}

// ── Hex → OKLCh conversion ─────────────────────────────────────────────────

function hexToOklch(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error(`Invalid hex color format: ${hex}`)
  }
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  // sRGB → linear RGB
  const toLinear = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  // Linear RGB → LMS (using OKLab matrix)
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  // Cube root
  const lc = Math.cbrt(l_)
  const mc = Math.cbrt(m_)
  const sc = Math.cbrt(s_)

  // LMS → OKLab
  const L = 0.2104542553 * lc + 0.793617785 * mc - 0.0040720468 * sc
  const a = 1.9779984951 * lc - 2.428592205 * mc + 0.4505937099 * sc
  const bOk = 0.0259040371 * lc + 0.7827717662 * mc - 0.808675766 * sc

  // OKLab → OKLCh
  const C = Math.sqrt(a * a + bOk * bOk)
  let H = (Math.atan2(bOk, a) * 180) / Math.PI
  if (H < 0) H += 360

  return `oklch(${round(L)} ${round(C)} ${Math.round(H)})`
}

function round(n) {
  // Up to 3 decimal places, strip trailing zeros
  return parseFloat(n.toFixed(3)).toString()
}

// ── Parse Radix CSS ─────────────────────────────────────────────────────────

function parseRadixCSS(filePath) {
  const css = readFileSync(filePath, 'utf8')
  const vars = {}
  const re = /--(\w+)-(\d+):\s*(#[0-9a-fA-F]{6})/g
  for (const match of css.matchAll(re)) {
    vars[parseInt(match[2], 10)] = match[3]
  }
  return vars
}

// ── Generate CSS lines ──────────────────────────────────────────────────────

function generateBlock(mode, indent) {
  const lines = []
  const suffix = mode === 'dark' ? '-dark' : ''
  const contrast = mode === 'dark' ? CONTRAST_DARK : CONTRAST

  for (const hue of HUES) {
    const file = resolve(RADIX_DIR, `${hue}${suffix}.css`)
    let vars
    try {
      vars = parseRadixCSS(file)
    } catch {
      console.error(`WARNING: Could not read ${file}`)
      continue
    }

    for (const step of STEPS) {
      const hex = vars[step]
      if (!hex) {
        console.error(`WARNING: Missing step ${step} for ${hue} (${mode})`)
        continue
      }
      lines.push(`${indent}--${hue}-${step}: ${hexToOklch(hex)};`)
    }
    const contrastValue = contrast[hue] ?? 'oklch(1 0 0)'
    lines.push(`${indent}--${hue}-contrast: ${contrastValue};`)
    lines.push('')
  }

  return lines.join('\n')
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log(`  /* ================================================================
     Palette Tokens — ${HUES.length} colors × ${STEPS.length + 1} shades (derived from Radix Colors)
     Shades: 3-5 (extended soft range), 6 (soft bg), 7 (soft-hover), 8 (border), 9 (solid), 10 (solid-hover), 11 (text), contrast
     Numbers match Radix Colors step numbers (3-11)

     Auto-generated — do not edit by hand.
     Run:  node packages/ui/scripts/generate-hue-palette.mjs
     ================================================================ */`)

console.log('\n  /* ── Light mode ── */')
console.log(generateBlock('light', '  '))

console.log('\n  /* ── Dark mode (for @media and .dark blocks) ── */')
console.log(generateBlock('dark', '  '))
