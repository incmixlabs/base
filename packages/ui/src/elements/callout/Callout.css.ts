import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import {
  surfaceColorVariants,
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
} from '@/elements/surface/surface.css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { calloutSizeVar } from '@/theme/runtime/component-vars'
import { panelSizeTokens } from '@/theme/token-maps'
import type { Color } from '@/theme/tokens'
import { calloutRootPropDefs } from './callout.props'

const paddingVar = createVar()
const rowGapVar = createVar()
const columnGapVar = createVar()
const iconHeightVar = createVar()
const iconSvgVar = createVar()

export const calloutRootBase = style({
  padding: paddingVar,
  borderRadius: 'var(--element-border-radius)',
  rowGap: rowGapVar,
  columnGap: columnGapVar,
})
export const calloutRootBaseCls =
  'box-border grid border [grid-template-columns:auto_1fr] items-start justify-start text-left'

export const calloutIconBaseCls = 'flex items-center justify-center shrink-0'
export const calloutIconVars = style({
  height: iconHeightVar,
})

globalStyle(`${calloutIconVars} > svg`, {
  width: iconSvgVar,
  height: iconSvgVar,
})

export const calloutTextBase = style({
  margin: 0,
})

type CalloutSize = (typeof calloutRootPropDefs.size.values)[number]
const calloutSizes = calloutRootPropDefs.size.values

function getCalloutSizeVars(size: CalloutSize) {
  const token = panelSizeTokens[size]
  return {
    vars: {
      [paddingVar]: calloutSizeVar(size, 'padding', token.padding),
      [rowGapVar]: calloutSizeVar(size, 'rowGap', token.gap),
      [columnGapVar]: calloutSizeVar(size, 'columnGap', token.gap),
      [iconHeightVar]: calloutSizeVar(size, 'iconHeight', token.lineHeight),
      [iconSvgVar]: calloutSizeVar(size, 'iconSize', token.iconSize),
    },
  }
}

function getCalloutTextSize(size: CalloutSize) {
  const token = panelSizeTokens[size]
  return {
    fontSize: calloutSizeVar(size, 'fontSize', token.fontSize),
    lineHeight: calloutSizeVar(size, 'lineHeight', token.lineHeight),
  }
}

export const calloutSizeVars = styleVariants({
  ...Object.fromEntries(calloutSizes.map(size => [size, getCalloutSizeVars(size)])),
} as Record<CalloutSize, ReturnType<typeof getCalloutSizeVars>>)

export const calloutTextBySize = styleVariants({
  ...Object.fromEntries(calloutSizes.map(size => [size, getCalloutTextSize(size)])),
} as Record<CalloutSize, ReturnType<typeof getCalloutTextSize>>)

type CalloutVariant = 'soft' | 'surface' | 'solid' | 'outline' | 'split'

const createVariantStyles = (color: Color) => {
  const usesThemeShell = color === 'light' || color === 'dark'
  const visibleBorderColor = usesThemeShell ? semanticColorVar('inverse', 'border') : semanticColorVar(color, 'border')
  const splitShellTextColor = semanticColorVar('neutral', 'text')
  const splitShellBackgroundColor = usesThemeShell ? semanticColorVar('neutral', 'surface') : 'var(--background)'
  const splitRailBackgroundColor = usesThemeShell
    ? semanticColorVar('inverse', 'surface')
    : semanticColorVar(color, 'primary')
  const splitRailForegroundColor = usesThemeShell
    ? semanticColorVar('inverse', 'text')
    : semanticColorVar(color, 'contrast')
  const splitHoverBackgroundColor = usesThemeShell
    ? semanticColorVar('neutral', 'soft')
    : semanticColorVar(color, 'soft')

  const split = style({
    padding: 0,
    columnGap: 0,
    rowGap: 0,
    overflow: 'hidden',
    color: splitShellTextColor,
    backgroundColor: splitShellBackgroundColor,
    borderColor: visibleBorderColor,
    alignItems: 'stretch',
  })

  globalStyle(`${split} [data-slot="callout-icon"]`, {
    alignSelf: 'stretch',
    height: 'auto',
    paddingInline: paddingVar,
    paddingBlock: paddingVar,
    backgroundColor: splitRailBackgroundColor,
    color: splitRailForegroundColor,
    boxShadow: `inset -1px 0 0 ${visibleBorderColor}`,
  })

  globalStyle(`${split} [data-slot="callout-text"]`, {
    display: 'flex',
    alignItems: 'center',
    paddingInline: paddingVar,
    paddingBlock: paddingVar,
  })

  globalStyle(`${split}.${surfaceHoverEnabledClass}:hover [data-slot="callout-text"]`, {
    backgroundColor: splitHoverBackgroundColor,
  })

  const soft = style([
    surfaceColorVariants[color].soft,
    {
      borderColor: visibleBorderColor,
    },
  ])

  const surface = style([
    surfaceColorVariants[color].surface,
    {
      borderColor: visibleBorderColor,
    },
  ])

  const solid = style([
    surfaceColorVariants[color].solid,
    {
      borderColor: visibleBorderColor,
    },
  ])

  const outline = style([
    surfaceColorVariants[color].outline,
    {
      borderColor: visibleBorderColor,
    },
  ])

  return {
    soft,
    surface,
    solid,
    outline,
    split,
  } satisfies Record<CalloutVariant, string>
}

export const calloutColorVariants: Record<Color, Record<CalloutVariant, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createVariantStyles(color)]),
) as Record<Color, Record<CalloutVariant, string>>

const createInverseStyles = (color: Color): Record<CalloutVariant, string> => ({
  soft: style({
    color: semanticColorVar(color, 'contrast'),
  }),
  surface: style({}),
  solid: style({}),
  outline: style({}),
  split: style({}),
})

export const calloutInverseByVariant: Record<Color, Record<CalloutVariant, string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createInverseStyles(color)]),
) as Record<Color, Record<CalloutVariant, string>>

export const calloutHoverByVariant: Record<CalloutVariant, string> = {
  soft: surfaceHoverEnabledClass,
  surface: surfaceHoverEnabledClass,
  solid: surfaceHoverEnabledClass,
  outline: surfaceHoverEnabledClass,
  split: surfaceHoverEnabledClass,
}

export const calloutHighContrastByVariant: Record<CalloutVariant, string> = {
  soft: surfaceHighContrastByVariant.soft,
  surface: surfaceHighContrastByVariant.surface,
  solid: surfaceHighContrastByVariant.solid,
  outline: surfaceHighContrastByVariant.outline,
  split: style({
    boxShadow: `inset 0 0 0 2px ${semanticColorVar('neutral', 'text')}`,
  }),
}
