import { createThemeResolver, type ThemeResolver, type ThemeTokenPath } from './resolver.js'

export const emailSafeStyleProperties = [
  'backgroundColor',
  'border',
  'borderColor',
  'borderRadius',
  'color',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maxWidth',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'textAlign',
  'textTransform',
] as const

export type EmailSafeStyleProperty = (typeof emailSafeStyleProperties)[number]

export type TokenStyleValue = string | { token: ThemeTokenPath } | { tokens: ThemeTokenPath[]; join?: string }

export type TokenStyleDefinition = Partial<Record<EmailSafeStyleProperty, TokenStyleValue>>

export type EmailInlineStyle = Partial<Record<EmailSafeStyleProperty, string>>

const emailSafeStylePropertySet = new Set<string>(emailSafeStyleProperties)

export function transposeTokenStyle(
  definition: TokenStyleDefinition,
  options: {
    resolver?: ThemeResolver
    strict?: boolean
  } = {},
): EmailInlineStyle {
  const resolver = options.resolver ?? createThemeResolver()
  const strict = options.strict ?? true
  const style: EmailInlineStyle = {}

  for (const [property, value] of Object.entries(definition)) {
    if (!emailSafeStylePropertySet.has(property)) {
      if (strict) throw new Error(`Unsupported email inline style property: ${property}`)
      continue
    }

    if (value === undefined) {
      continue
    }

    if (typeof value === 'object' && value !== null) {
      const resolved = resolveTokenStyleValue(value, resolver, strict)
      if (resolved === undefined) continue
      style[property as EmailSafeStyleProperty] = resolved
      continue
    }

    style[property as EmailSafeStyleProperty] = value
  }

  return style
}

function resolveTokenStyleValue(
  value: Extract<TokenStyleValue, object>,
  resolver: ThemeResolver,
  strict: boolean,
): string | undefined {
  const hasToken = 'token' in value
  const hasTokens = 'tokens' in value

  if (hasToken === hasTokens) {
    if (strict) {
      throw new Error("Invalid token style value: expected exactly one of 'token' or 'tokens'")
    }
    return undefined
  }

  if (hasToken) {
    const resolved = resolver(value.token)
    if (resolved === undefined) {
      if (strict) throw new Error(`Unresolved theme token: ${value.token}`)
      return undefined
    }
    return resolved
  }

  if (!Array.isArray(value.tokens) || value.tokens.length === 0) {
    if (strict) {
      throw new Error("Invalid token style value: 'tokens' must be a non-empty array")
    }
    return undefined
  }

  const resolvedTokens: string[] = []
  for (const token of value.tokens) {
    const resolved = resolver(token)
    if (resolved === undefined) {
      if (strict) throw new Error(`Unresolved theme token: ${token}`)
      return undefined
    }
    resolvedTokens.push(resolved)
  }
  return resolvedTokens.join(value.join ?? ' ')
}
