export function splitClassNames(className: string | undefined) {
  return (className ?? '').split(/\s+/).filter(Boolean)
}

export function hasClassTokens(element: HTMLElement, className: string) {
  return splitClassNames(className).every(token => element.classList.contains(token))
}

export function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokenSet = new Set(splitClassNames(className))
  for (const token of tokens) {
    if (!classTokenSet.has(token)) {
      throw new Error(`Expected class list to contain "${token}". Received: "${className ?? ''}"`)
    }
  }
}
