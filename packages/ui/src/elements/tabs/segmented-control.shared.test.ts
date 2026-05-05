import { describe, expect, it } from 'vitest'
import {
  buildSegmentedControlSizeMap,
  createTabsSizeConfigs,
  selectSegmentedControlVariantSizeMap,
} from './segmented-control.shared'

describe('segmented-control.shared helpers', () => {
  it('buildSegmentedControlSizeMap creates keyed map for all sizes', () => {
    const sizes = ['sm', 'md'] as const
    const map = buildSegmentedControlSizeMap(sizes, size => `value-${size}`)

    expect(map).toEqual({
      sm: 'value-sm',
      md: 'value-md',
    })
  })

  it('selectSegmentedControlVariantSizeMap chooses primary map when variant matches', () => {
    const primary = { sm: 'primary-sm', md: 'primary-md' }
    const fallback = { sm: 'fallback-sm', md: 'fallback-md' }

    const selected = selectSegmentedControlVariantSizeMap('surface', 'surface', primary, fallback)
    expect(selected).toBe(primary)
  })

  it('selectSegmentedControlVariantSizeMap chooses fallback map when variant differs', () => {
    const primary = { sm: 'primary-sm', md: 'primary-md' }
    const fallback = { sm: 'fallback-sm', md: 'fallback-md' }

    const selected = selectSegmentedControlVariantSizeMap('line', 'surface', primary, fallback)
    expect(selected).toBe(fallback)
  })

  it('createTabsSizeConfigs builds variant-specific list/trigger/content maps', () => {
    const sizes = ['sm', 'md'] as const
    const rootBySize = { sm: 'list-sm', md: 'list-md' }
    const surfaceTriggerBySize = { sm: 'surface-trigger-sm', md: 'surface-trigger-md' }
    const lineTriggerBySize = { sm: 'line-trigger-sm', md: 'line-trigger-md' }
    const surfaceContentBySize = { sm: 'surface-content-sm', md: 'surface-content-md' }
    const lineContentBySize = { sm: 'line-content-sm', md: 'line-content-md' }

    const { surfaceSizes, lineSizes } = createTabsSizeConfigs(
      sizes,
      rootBySize,
      surfaceTriggerBySize,
      lineTriggerBySize,
      surfaceContentBySize,
      lineContentBySize,
    )

    expect(surfaceSizes.sm).toEqual({
      list: 'list-sm',
      trigger: 'surface-trigger-sm',
      content: 'surface-content-sm',
    })
    expect(lineSizes.md).toEqual({
      list: 'list-md',
      trigger: 'line-trigger-md',
      content: 'line-content-md',
    })
  })
})
