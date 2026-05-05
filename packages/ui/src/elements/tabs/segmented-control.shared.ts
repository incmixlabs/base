export function buildSegmentedControlSizeMap<S extends string, T>(
  sizes: readonly S[],
  createValue: (size: S) => T,
): Record<S, T> {
  return Object.fromEntries(sizes.map(size => [size, createValue(size)])) as Record<S, T>
}

export function selectSegmentedControlVariantSizeMap<S extends string, T, V extends string>(
  variant: V,
  primaryVariant: V,
  primaryMap: Record<S, T>,
  fallbackMap: Record<S, T>,
): Record<S, T> {
  return variant === primaryVariant ? primaryMap : fallbackMap
}

export function createTabsSizeConfigs<S extends string>(
  sizes: readonly S[],
  rootBySize: Record<S, string>,
  surfaceTriggerBySize: Record<S, string>,
  lineTriggerBySize: Record<S, string>,
  surfaceContentBySize: Record<S, string>,
  lineContentBySize: Record<S, string>,
): {
  surfaceSizes: Record<S, { list: string; trigger: string; content: string }>
  lineSizes: Record<S, { list: string; trigger: string; content: string }>
} {
  return {
    surfaceSizes: buildSegmentedControlSizeMap(sizes, size => ({
      list: rootBySize[size],
      trigger: surfaceTriggerBySize[size],
      content: surfaceContentBySize[size],
    })),
    lineSizes: buildSegmentedControlSizeMap(sizes, size => ({
      list: rootBySize[size],
      trigger: lineTriggerBySize[size],
      content: lineContentBySize[size],
    })),
  }
}
