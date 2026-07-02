import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HUE_NAMES as THEME_HUE_NAMES } from '../../theme/src/hue-names.js'

const require = createRequire(import.meta.url)
const RADIX_DIR = dirname(require.resolve('@radix-ui/colors/package.json'))
const __dirname = dirname(fileURLToPath(import.meta.url))

export const RUNTIME_PALETTE_STEPS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

export const HUE_CSS_STEPS = ['3', '4', '5', '6', '7', '8', '9', '10', '11']

export const HUE_NAMES = THEME_HUE_NAMES

export const CONTRAST_BY_HUE = {
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

function round(value) {
  return parseFloat(value.toFixed(3)).toString()
}

export function hexToOklch(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error(`Invalid hex color format: ${hex}`)
  }

  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const toLinear = channel => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const lc = Math.cbrt(l)
  const mc = Math.cbrt(m)
  const sc = Math.cbrt(s)

  const lightness = 0.2104542553 * lc + 0.793617785 * mc - 0.0040720468 * sc
  const a = 1.9779984951 * lc - 2.428592205 * mc + 0.4505937099 * sc
  const bOk = 0.0259040371 * lc + 0.7827717662 * mc - 0.808675766 * sc

  const chroma = Math.sqrt(a * a + bOk * bOk)
  let hue = (Math.atan2(bOk, a) * 180) / Math.PI
  if (hue < 0) hue += 360

  return `oklch(${round(lightness)} ${round(chroma)} ${Math.round(hue)})`
}

export function parseRadixScale(hue, mode) {
  const suffix = mode === 'dark' ? '-dark' : ''
  const filePath = resolve(RADIX_DIR, `${hue}${suffix}.css`)
  const css = readFileSync(filePath, 'utf8')
  const vars = {}
  const re = /--(\w+)-(\d+):\s*(#[0-9a-fA-F]{6})/g

  for (const match of css.matchAll(re)) {
    vars[match[2]] = match[3]
  }

  return vars
}

export function buildPaletteVars(mode, steps = RUNTIME_PALETTE_STEPS) {
  const vars = {}

  for (const hue of HUE_NAMES) {
    const scale = parseRadixScale(hue, mode)
    for (const step of steps) {
      const hex = scale[step]
      if (!hex) {
        throw new Error(`Missing Radix color token ${hue}${step} (${mode})`)
      }
      vars[`--${hue}-${step}`] = hexToOklch(hex)
    }
    const contrast = CONTRAST_BY_HUE[hue]
    if (!contrast) {
      throw new Error(`Missing contrast color for hue "${hue}" in CONTRAST_BY_HUE`)
    }
    vars[`--${hue}-contrast`] = contrast
  }

  return vars
}
