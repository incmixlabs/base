export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return `${error.message}${error.stack ? `\n\nStack: ${error.stack}` : ''}`
  }
  return String(error)
}
