export function formatBytes(bytes: number | undefined): string {
  if (bytes === undefined || !Number.isFinite(bytes) || bytes < 0) return '-'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let index = 0
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`
}

export function formatDimensions(dimensions: { width?: number; height?: number } | undefined): string {
  if (
    dimensions?.width === undefined ||
    dimensions.height === undefined ||
    !Number.isFinite(dimensions.width) ||
    !Number.isFinite(dimensions.height) ||
    dimensions.width < 0 ||
    dimensions.height < 0
  ) {
    return '-'
  }
  return `${dimensions.width} x ${dimensions.height}`
}
