import { describe, expect, it } from 'vitest'
import { hasSameTouchMetadata } from './useAutoFormRuntime'

describe('useAutoFormRuntime touch-sync suppression', () => {
  it('treats unchanged touch metadata as a no-op sync', () => {
    expect(
      hasSameTouchMetadata(
        {
          touched: { firstName: true },
          dirtyFields: { firstName: true },
          isDirty: true,
        },
        {
          touched: { firstName: true },
          dirtyFields: { firstName: true },
          isDirty: true,
        },
      ),
    ).toBe(true)
  })

  it('detects changed touched metadata and requires a sync', () => {
    expect(
      hasSameTouchMetadata(
        {
          touched: { firstName: true },
          dirtyFields: {},
          isDirty: false,
        },
        {
          touched: {},
          dirtyFields: {},
          isDirty: false,
        },
      ),
    ).toBe(false)
  })

  it('detects changed dirty metadata and requires a sync', () => {
    expect(
      hasSameTouchMetadata(
        {
          touched: {},
          dirtyFields: {},
          isDirty: false,
        },
        {
          touched: {},
          dirtyFields: { firstName: true },
          isDirty: true,
        },
      ),
    ).toBe(false)
  })
})
