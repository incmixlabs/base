import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import {
  resolveInteractiveFillColor,
  resolveInteractiveForegroundToken,
  resolveInteractiveUnfilledColor,
  semanticColorKeys,
  semanticColorVar,
} from '@/theme/props/color.prop'
import { toggleGroupVar, toggleSizeVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'
import type { toggleVariants } from './toggle.props'
import { togglePropDefs } from './toggle.props'

type ToggleVariant = (typeof toggleVariants)[number]
type ToggleSize = (typeof togglePropDefs.size.values)[number]

const toggleIconSizeVar = createVar()

export const toggleIconScope = style({})

globalStyle(`${toggleIconScope} svg`, {
  width: toggleIconSizeVar,
  height: toggleIconSizeVar,
  flexShrink: 0,
})

export const toggleBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  appearance: 'none',
  userSelect: 'none',
  cursor: 'pointer',
  padding: 0,
  margin: 0,
  lineHeight: 1,
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderWidth: '1px',
  transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out',
  selectors: {
    '&:focus-visible': {
      outline: 'none',
      boxShadow: '0 0 0 2px var(--ring)',
    },
    '&:disabled': {
      pointerEvents: 'none',
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
})

interface ToggleSizeStyle {
  height: string
  minWidth: string
  paddingInline: string
  fontSize: string
  gap: string
  vars: Record<string, string>
  selectors: Record<string, Record<string, string | number>>
}

function getToggleSizeStyle(size: ToggleSize): ToggleSizeStyle {
  const token = getControlSizeValues(size)

  return {
    height: toggleSizeVar(size, 'height', token.height),
    minWidth: toggleSizeVar(size, 'height', token.height),
    paddingInline: toggleSizeVar(size, 'paddingInline', token.paddingX),
    fontSize: toggleSizeVar(size, 'fontSize', token.fontSize),
    gap: toggleSizeVar(size, 'gap', token.gap),
    vars: {
      [toggleIconSizeVar]: toggleSizeVar(size, 'iconSize', token.iconSize),
    },
    selectors: {
      '&:has(> svg:only-child)': {
        width: toggleSizeVar(size, 'height', token.height),
        paddingInline: 0,
      },
    },
  }
}

export const toggleSizeVariants = styleVariants(
  togglePropDefs.size.values.reduce<Record<ToggleSize, ToggleSizeStyle>>(
    (variants, size) => {
      variants[size] = getToggleSizeStyle(size)
      return variants
    },
    {} as Record<ToggleSize, ToggleSizeStyle>,
  ),
)

function resolveToggleBaseColor(color: Color) {
  if (color === 'light' || color === 'dark' || color === 'inverse') return color
  return null
}

function resolveToggleSelectedColor(color: Color) {
  if (color === 'light') return 'dark' as const
  if (color === 'dark') return 'light' as const
  if (color === 'inverse') return 'neutral' as const
  return resolveInteractiveFillColor(color)
}

const createToggleColorVariants = (color: Color) => ({
  soft: (() => {
    const baseFillColor = resolveToggleBaseColor(color)
    const fillColor = resolveToggleSelectedColor(color)
    const unfilledColor = resolveInteractiveUnfilledColor(color)
    const foregroundToken = resolveInteractiveForegroundToken(color)
    return style({
      color: semanticColorVar(baseFillColor ?? unfilledColor, baseFillColor ? 'text' : foregroundToken),
      backgroundColor: baseFillColor ? semanticColorVar(baseFillColor, 'soft') : 'transparent',
      borderColor: semanticColorVar(baseFillColor ?? unfilledColor, baseFillColor ? 'text' : 'border'),
      selectors: {
        '&:hover:not(:disabled):not([data-pressed]):not([aria-pressed="true"])': {
          backgroundColor: semanticColorVar(baseFillColor ?? unfilledColor, 'soft-hover'),
        },
        '&:active:not(:disabled):not([data-pressed]):not([aria-pressed="true"])': {
          backgroundColor: semanticColorVar(baseFillColor ?? unfilledColor, 'primary-alpha'),
        },
        '&[aria-pressed="true"], &[data-pressed]': {
          color: semanticColorVar(fillColor, 'text'),
          backgroundColor: semanticColorVar(fillColor, 'soft'),
          borderColor: semanticColorVar(fillColor, 'text'),
        },
        '&[aria-pressed="true"]:hover:not(:disabled), &[data-pressed]:hover:not(:disabled)': {
          backgroundColor: semanticColorVar(fillColor, 'soft-hover'),
          borderColor: semanticColorVar(fillColor, 'text'),
        },
        '&[aria-pressed="true"]:active:not(:disabled), &[data-pressed]:active:not(:disabled)': {
          backgroundColor: semanticColorVar(fillColor, 'primary-alpha'),
          borderColor: semanticColorVar(fillColor, 'text'),
        },
      },
    })
  })(),
  solid: (() => {
    const baseFillColor = resolveToggleBaseColor(color)
    const fillColor = resolveToggleSelectedColor(color)
    const unfilledColor = resolveInteractiveUnfilledColor(color)
    const foregroundToken = resolveInteractiveForegroundToken(color)
    return style({
      color: semanticColorVar(baseFillColor ?? unfilledColor, baseFillColor ? 'contrast' : foregroundToken),
      backgroundColor: baseFillColor ? semanticColorVar(baseFillColor, 'primary') : 'transparent',
      borderColor: semanticColorVar(baseFillColor ?? unfilledColor, baseFillColor ? 'text' : 'border'),
      selectors: {
        '&:hover:not(:disabled):not([data-pressed]):not([aria-pressed="true"])': {
          ...(baseFillColor
            ? { filter: 'brightness(0.96)' }
            : { backgroundColor: semanticColorVar(unfilledColor, 'soft') }),
        },
        '&:active:not(:disabled):not([data-pressed]):not([aria-pressed="true"])': {
          ...(baseFillColor
            ? { filter: 'brightness(0.92)' }
            : { backgroundColor: semanticColorVar(unfilledColor, 'soft-hover') }),
        },
        '&[aria-pressed="true"], &[data-pressed]': {
          color: semanticColorVar(fillColor, 'contrast'),
          backgroundColor: semanticColorVar(fillColor, 'primary'),
          borderColor: semanticColorVar(fillColor, 'text'),
        },
        '&[aria-pressed="true"]:hover:not(:disabled), &[data-pressed]:hover:not(:disabled)': {
          filter: 'brightness(0.96)',
        },
        '&[aria-pressed="true"]:active:not(:disabled), &[data-pressed]:active:not(:disabled)': {
          filter: 'brightness(0.92)',
        },
      },
    })
  })(),
})

export const toggleColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createToggleColorVariants(color)]),
) as Record<Color, Record<ToggleVariant, string>>

export const toggleHighContrastByVariant: Record<ToggleVariant, string> = {
  solid: style({
    boxShadow: 'var(--shadow-3)',
  }),
  soft: style({}),
}

export const toggleGroupRoot = style({
  display: 'inline-flex',
  alignItems: 'center',
  selectors: {
    '&[data-orientation="vertical"]': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
})

export const toggleGroupRootLoose = style({
  gap: toggleGroupVar('gap', '0.125rem'),
  selectors: {
    '&[data-orientation="vertical"]': {
      gap: toggleGroupVar('gap', '0.125rem'),
    },
  },
})

export const toggleGroupItemFlush = style({
  selectors: {
    '&:not(:first-child)': {
      marginLeft: '-1px',
    },
    [`${toggleGroupRoot}[data-orientation="vertical"] &`]: {
      marginLeft: 0,
    },
    [`${toggleGroupRoot}[data-orientation="vertical"] &:not(:first-child)`]: {
      marginTop: '-1px',
    },
    '&:not(:first-child):not(:last-child)': {
      borderRadius: 0,
    },
    '&:first-child:not(:last-child)': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '&:last-child:not(:first-child)': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    [`${toggleGroupRoot}[data-orientation="vertical"] &:first-child:not(:last-child)`]: {
      borderTopRightRadius: 'var(--element-border-radius)',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    [`${toggleGroupRoot}[data-orientation="vertical"] &:last-child:not(:first-child)`]: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 'var(--element-border-radius)',
      borderBottomRightRadius: 'var(--element-border-radius)',
    },
  },
})
