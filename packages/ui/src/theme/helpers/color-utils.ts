export interface HslTriplet {
  h: number
  s: number
  l: number
}

export function parseHslTriplet(input: string): HslTriplet | null {
  const match = input.trim().match(/^(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/)
  if (!match) return null
  return {
    h: Number(match[1]),
    s: Number(match[2]),
    l: Number(match[3]),
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function toHslTriplet(value: HslTriplet): string {
  const h = Math.round(value.h)
  const s = Math.round(clamp(value.s, 0, 100))
  const l = Math.round(clamp(value.l, 0, 100))
  return `${h} ${s}% ${l}%`
}

export function shiftLightness(input: string, delta: number): string {
  const parsed = parseHslTriplet(input)
  if (!parsed) return input
  return toHslTriplet({ ...parsed, l: clamp(parsed.l + delta, 0, 100) })
}

export function pickContrastText(base: string, background: string, foreground: string): string {
  const baseParsed = parseHslTriplet(base)
  const backgroundParsed = parseHslTriplet(background)
  const foregroundParsed = parseHslTriplet(foreground)
  if (!baseParsed || !backgroundParsed || !foregroundParsed) return foreground

  const baseBrightness = hslToYiqBrightness(baseParsed)
  const backgroundBrightness = hslToYiqBrightness(backgroundParsed)
  const foregroundBrightness = hslToYiqBrightness(foregroundParsed)
  const lightCandidate = backgroundBrightness >= foregroundBrightness ? background : foreground
  const darkCandidate = backgroundBrightness < foregroundBrightness ? background : foreground
  return baseBrightness < 145 ? lightCandidate : darkCandidate
}

export function toCssHsl(value: string): string {
  return `hsl(${value})`
}

export function toCssHslAlpha(value: string, alpha: number): string {
  return `hsl(${value} / ${alpha})`
}

function hslToRgb(hsl: HslTriplet): { r: number; g: number; b: number } {
  const s = clamp(hsl.s, 0, 100) / 100
  const l = clamp(hsl.l, 0, 100) / 100
  const h = ((hsl.h % 360) + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  const sr = r + m
  const sg = g + m
  const sb = b + m
  return { r: sr * 255, g: sg * 255, b: sb * 255 }
}

function hslToYiqBrightness(hsl: HslTriplet): number {
  const { r, g, b } = hslToRgb(hsl)
  return (r * 299 + g * 587 + b * 114) / 1000
}

function rgbToHslTriplet(r: number, g: number, b: number): string {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
  }

  h = Math.round(h * 60)
  if (h < 0) h += 360

  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  return toHslTriplet({ h, s: s * 100, l: l * 100 })
}

export function cssColorToHslTriplet(cssColor: string, scope?: HTMLElement | null): string | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null

  const host = scope ?? document.documentElement
  const doc = host.ownerDocument ?? document
  const probe = doc.createElement('span')
  probe.style.color = cssColor
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  host.appendChild(probe)
  const resolved = window.getComputedStyle(probe).color
  host.removeChild(probe)

  const channels = resolved.match(/[\d.]+/g)
  if (!channels || channels.length < 3) return null

  const r = Number(channels[0])
  const g = Number(channels[1])
  const b = Number(channels[2])
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return rgbToHslTriplet(r, g, b)
}
