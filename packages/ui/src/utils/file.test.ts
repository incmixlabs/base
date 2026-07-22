import { describe, expect, it } from 'vitest'
import { formatBytes, formatDimensions } from './file'

describe('file utilities', () => {
  it('formats byte sizes', () => {
    expect(formatBytes(undefined)).toBe('-')
    expect(formatBytes(Number.NaN)).toBe('-')
    expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('-')
    expect(formatBytes(-1)).toBe('-')
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(10 * 1024 * 1024)).toBe('10 MB')
  })

  it('formats dimensions when both sides are present', () => {
    expect(formatDimensions(undefined)).toBe('-')
    expect(formatDimensions({ width: 640 })).toBe('-')
    expect(formatDimensions({ width: Number.NaN, height: 360 })).toBe('-')
    expect(formatDimensions({ width: 640, height: Number.POSITIVE_INFINITY })).toBe('-')
    expect(formatDimensions({ width: -1, height: 360 })).toBe('-')
    expect(formatDimensions({ width: 640, height: 360 })).toBe('640 x 360')
  })
})
