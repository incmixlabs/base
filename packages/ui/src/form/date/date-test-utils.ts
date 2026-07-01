import { expect } from 'vitest'

function classTokens(className: string | undefined) {
  return (className ?? '').split(/\s+/).filter(Boolean)
}

export function hasClassTokens(element: HTMLElement, className: string) {
  return classTokens(className).every(token => element.classList.contains(token))
}

export function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokenSet = new Set(classTokens(className))
  for (const token of tokens) {
    expect(classTokenSet).toContain(token)
  }
}
