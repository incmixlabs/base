import { transform as sucraseTransform } from 'sucrase'

export const transform = (code: string): string => {
  return sucraseTransform(code, {
    transforms: ['jsx', 'typescript', 'imports'],
    production: true,
  })
    .code.replace('"use strict";', '')
    .trim()
}

// Regex to match JSX, function declarations, arrow functions, or class definitions
const EXPORT_DEFAULT_PATTERN = /^((\(|<)[^\n]*|function[\s(]|class[\s{]|[a-zA-Z_$][\w$]*\s*=>)/

export const normalizeCode = (code: string): string => {
  if (EXPORT_DEFAULT_PATTERN.test(code.trim())) {
    return `export default ${code}`
  }
  return code
}
