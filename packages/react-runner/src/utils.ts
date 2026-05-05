import type { ReactElement } from 'react'
import React, { createElement, isValidElement } from 'react'
import { normalizeCode, transform } from './transform'
import type { RunnerOptions, Scope } from './types'

export const createRequire = (imports: Record<string, unknown>): ((module: string) => unknown) => {
  return (module: string) => {
    if (!(module in imports)) {
      throw new Error(`Module not found: '${module}'`)
    }
    return imports[module]
  }
}

export const evalCode = (code: string, scope: Scope): Record<string, unknown> => {
  const scopeKeys = Object.keys(scope)
  const scopeValues = Object.values(scope)

  // Create a function that has access to React and the scope
  const fn = new Function('React', 'require', 'exports', ...scopeKeys, code)

  const exports: Record<string, unknown> = {}
  const require = createRequire(scope.import || {})

  fn(React, require, exports, ...scopeValues)

  return exports
}

export const generateElement = (options: RunnerOptions): ReactElement | null => {
  const { code, scope = {}, componentProps } = options

  const transformedCode = transform(normalizeCode(code))
  const exports = evalCode(transformedCode, scope)
  const result = exports.default

  // If it's already a valid React element, return it
  if (isValidElement(result)) {
    return result
  }

  // If it's a function component, create an element from it
  if (typeof result === 'function') {
    return createElement(result as React.ComponentType<Record<string, unknown>>, componentProps)
  }

  // If it's a string, return a text node
  if (typeof result === 'string') {
    return createElement(React.Fragment, null, result)
  }

  return null
}

export const importCode = (code: string, scope: Scope): Record<string, unknown> => {
  const transformedCode = transform(code)
  return evalCode(transformedCode, scope)
}
