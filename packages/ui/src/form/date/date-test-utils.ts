import { expect } from 'vitest'

export function hasClassTokens(element: HTMLElement, className: string) {
  return className.split(/\s+/).every(token => element.classList.contains(token))
}

export function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}
