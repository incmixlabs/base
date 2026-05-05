export function getPathInObject(obj: unknown, path: string[]): unknown {
  let current = obj as Record<string, unknown>
  for (const key of path) {
    current = current[key] as Record<string, unknown>

    if (current === undefined) {
      return undefined
    }
  }
  return current
}
