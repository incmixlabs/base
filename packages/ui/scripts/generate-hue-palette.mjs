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

import { buildPaletteVars, HUE_CSS_STEPS, HUE_NAMES } from './palette-generation.mjs'

// ── Generate CSS lines ──────────────────────────────────────────────────────

function generateBlock(mode, indent) {
  const lines = []

  const vars = buildPaletteVars(mode, HUE_CSS_STEPS)
  for (const hue of HUE_NAMES) {
    for (const step of HUE_CSS_STEPS) {
      lines.push(`${indent}--${hue}-${step}: ${vars[`--${hue}-${step}`]};`)
    }
    lines.push(`${indent}--${hue}-contrast: ${vars[`--${hue}-contrast`]};`)
    lines.push('')
  }

  return lines.join('\n')
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log(`  /* ================================================================
     Palette Tokens — ${HUE_NAMES.length} colors × ${HUE_CSS_STEPS.length + 1} shades (derived from Radix Colors)
     Shades: 3-5 (extended soft range), 6 (soft bg), 7 (soft-hover), 8 (border), 9 (solid), 10 (solid-hover), 11 (text), contrast
     Numbers match Radix Colors step numbers (3-11)

     Auto-generated — do not edit by hand.
     Run:  node packages/ui/scripts/generate-hue-palette.mjs
     ================================================================ */`)

console.log('\n  /* ── Light mode ── */')
console.log(generateBlock('light', '  '))

console.log('\n  /* ── Dark mode (for @media and .dark blocks) ── */')
console.log(generateBlock('dark', '  '))
