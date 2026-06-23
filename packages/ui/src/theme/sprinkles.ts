import { cn } from '@/lib/utils'
import { getResponsiveSpacingUtilityClasses, getSpacingUtilityClass, radiusClassByToken } from './helpers'
import type { Radius, Spacing } from './tokens'

type SprinkleBreakpoint = 'initial' | 'sm' | 'md' | 'lg'
type ResponsiveSprinkleValue<T extends string> = T | Partial<Record<SprinkleBreakpoint, T>>

const responsivePrefixByBreakpoint = {
  initial: '',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
} as const satisfies Record<SprinkleBreakpoint, string>

const displayClassByValue = {
  none: 'hidden',
  block: 'block',
  'inline-block': 'inline-block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
} as const

const flexDirectionClassByValue = {
  row: 'flex-row',
  column: 'flex-col',
} as const

const alignItemsClassByValue = {
  stretch: 'items-stretch',
  'flex-start': 'items-start',
  center: 'items-center',
  'flex-end': 'items-end',
} as const

const justifyContentClassByValue = {
  'flex-start': 'justify-start',
  center: 'justify-center',
  'flex-end': 'justify-end',
  'space-between': 'justify-between',
} as const

const fontSizeClassByValue = {
  xs: 'text-[var(--font-size-xs)]',
  sm: 'text-[var(--font-size-sm)]',
  md: 'text-[var(--font-size-md)]',
  lg: 'text-[var(--font-size-lg)]',
  xl: 'text-[var(--font-size-xl)]',
  '2x': 'text-[var(--font-size-2x)]',
  '3x': 'text-[var(--font-size-3x)]',
  '4x': 'text-[var(--font-size-4x)]',
  '5x': 'text-[var(--font-size-5x)]',
} as const

const lineHeightClassByValue = {
  xs: 'leading-[var(--line-height-xs)]',
  sm: 'leading-[var(--line-height-sm)]',
  md: 'leading-[var(--line-height-md)]',
  lg: 'leading-[var(--line-height-lg)]',
  xl: 'leading-[var(--line-height-xl)]',
  '2x': 'leading-[var(--line-height-2x)]',
  '3x': 'leading-[var(--line-height-3x)]',
  '4x': 'leading-[var(--line-height-4x)]',
  '5x': 'leading-[var(--line-height-5x)]',
} as const

const letterSpacingClassByValue = {
  xs: 'tracking-[var(--letter-spacing-xs)]',
  sm: 'tracking-[var(--letter-spacing-sm)]',
  md: 'tracking-[var(--letter-spacing-md)]',
  lg: 'tracking-[var(--letter-spacing-lg)]',
  xl: 'tracking-[var(--letter-spacing-xl)]',
  '2x': 'tracking-[var(--letter-spacing-2x)]',
  '3x': 'tracking-[var(--letter-spacing-3x)]',
  '4x': 'tracking-[var(--letter-spacing-4x)]',
  '5x': 'tracking-[var(--letter-spacing-5x)]',
} as const

const shadowClassByValue = {
  '0': 'shadow-none',
  '1': 'shadow-[var(--shadow-1)]',
  '2': 'shadow-[var(--shadow-2)]',
  '3': 'shadow-[var(--shadow-3)]',
  '4': 'shadow-[var(--shadow-4)]',
  '5': 'shadow-[var(--shadow-5)]',
  '6': 'shadow-[var(--shadow-6)]',
} as const

const sizeClassByValue = {
  auto: 'auto',
  '100%': 'full',
} as const

const colorClassByValue = {
  background: 'background',
  foreground: 'foreground',
  muted: 'muted',
  mutedForeground: 'muted-foreground',
  border: 'border',
  primary: 'primary',
  primaryForeground: 'primary-foreground',
  accent: 'accent',
  accentForeground: 'accent-foreground',
  secondary: 'secondary',
  neutral: '[var(--color-neutral-primary)]',
  info: '[var(--color-info-primary)]',
  success: '[var(--color-success-primary)]',
  warning: '[var(--color-warning-primary)]',
  error: '[var(--color-error-primary)]',
} as const

const borderColorClassByValue = {
  ...colorClassByValue,
  primary: '[var(--color-primary-border)]',
  secondary: '[var(--color-secondary-border)]',
  accent: '[var(--color-accent-border)]',
  neutral: '[var(--color-neutral-border)]',
  info: '[var(--color-info-border)]',
  success: '[var(--color-success-border)]',
  warning: '[var(--color-warning-border)]',
  error: '[var(--color-error-border)]',
} as const

type MappedValue<T extends Record<string, string>> = keyof T & string

function responsiveMappedClasses<T extends Record<string, string>>(
  value: ResponsiveSprinkleValue<MappedValue<T>> | undefined,
  map: T,
  formatClass: (classValue: string) => string = classValue => classValue,
): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') {
    const classValue = map[value]
    return classValue ? formatClass(classValue) : undefined
  }

  const classes: string[] = []
  for (const breakpoint of Object.keys(responsivePrefixByBreakpoint) as SprinkleBreakpoint[]) {
    const breakpointValue = value[breakpoint]
    if (!breakpointValue) continue

    const classValue = map[breakpointValue]
    if (classValue) classes.push(`${responsivePrefixByBreakpoint[breakpoint]}${formatClass(classValue)}`)
  }

  return classes.length > 0 ? classes.join(' ') : undefined
}

function responsiveSpacingClasses(
  prefix: Parameters<typeof getSpacingUtilityClass>[0],
  value: ResponsiveSprinkleValue<Spacing> | undefined,
): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return getSpacingUtilityClass(prefix, value)
  return getResponsiveSpacingUtilityClasses(prefix, value)
}

type DisplayValue = MappedValue<typeof displayClassByValue>
type FlexDirectionValue = MappedValue<typeof flexDirectionClassByValue>
type AlignItemsValue = MappedValue<typeof alignItemsClassByValue>
type JustifyContentValue = MappedValue<typeof justifyContentClassByValue>
type ColorValue = MappedValue<typeof colorClassByValue>
type BorderColorValue = MappedValue<typeof borderColorClassByValue>
type FontSizeValue = MappedValue<typeof fontSizeClassByValue>
type LineHeightValue = MappedValue<typeof lineHeightClassByValue>
type LetterSpacingValue = MappedValue<typeof letterSpacingClassByValue>
type ShadowValue = MappedValue<typeof shadowClassByValue>
type SizeValue = MappedValue<typeof sizeClassByValue>

export interface Sprinkles {
  display?: ResponsiveSprinkleValue<DisplayValue>
  flexDirection?: ResponsiveSprinkleValue<FlexDirectionValue>
  alignItems?: ResponsiveSprinkleValue<AlignItemsValue>
  justifyContent?: ResponsiveSprinkleValue<JustifyContentValue>
  gap?: ResponsiveSprinkleValue<Spacing>
  rowGap?: ResponsiveSprinkleValue<Spacing>
  columnGap?: ResponsiveSprinkleValue<Spacing>
  padding?: ResponsiveSprinkleValue<Spacing>
  paddingTop?: ResponsiveSprinkleValue<Spacing>
  paddingBottom?: ResponsiveSprinkleValue<Spacing>
  paddingLeft?: ResponsiveSprinkleValue<Spacing>
  paddingRight?: ResponsiveSprinkleValue<Spacing>
  margin?: ResponsiveSprinkleValue<Spacing>
  marginTop?: ResponsiveSprinkleValue<Spacing>
  marginBottom?: ResponsiveSprinkleValue<Spacing>
  marginLeft?: ResponsiveSprinkleValue<Spacing>
  marginRight?: ResponsiveSprinkleValue<Spacing>
  color?: ResponsiveSprinkleValue<ColorValue>
  backgroundColor?: ResponsiveSprinkleValue<ColorValue>
  borderRadius?: ResponsiveSprinkleValue<Radius>
  borderColor?: ResponsiveSprinkleValue<BorderColorValue>
  fontSize?: ResponsiveSprinkleValue<FontSizeValue>
  lineHeight?: ResponsiveSprinkleValue<LineHeightValue>
  letterSpacing?: ResponsiveSprinkleValue<LetterSpacingValue>
  boxShadow?: ResponsiveSprinkleValue<ShadowValue>
  width?: ResponsiveSprinkleValue<SizeValue>
  height?: ResponsiveSprinkleValue<SizeValue>
  p?: ResponsiveSprinkleValue<Spacing>
  pt?: ResponsiveSprinkleValue<Spacing>
  pb?: ResponsiveSprinkleValue<Spacing>
  pl?: ResponsiveSprinkleValue<Spacing>
  pr?: ResponsiveSprinkleValue<Spacing>
  px?: ResponsiveSprinkleValue<Spacing>
  py?: ResponsiveSprinkleValue<Spacing>
  m?: ResponsiveSprinkleValue<Spacing>
  mt?: ResponsiveSprinkleValue<Spacing>
  mb?: ResponsiveSprinkleValue<Spacing>
  ml?: ResponsiveSprinkleValue<Spacing>
  mr?: ResponsiveSprinkleValue<Spacing>
  mx?: ResponsiveSprinkleValue<Spacing>
  my?: ResponsiveSprinkleValue<Spacing>
  bg?: ResponsiveSprinkleValue<ColorValue>
}

export function sprinkles(props: Sprinkles): string {
  return cn(
    responsiveMappedClasses(props.display, displayClassByValue),
    responsiveMappedClasses(props.flexDirection, flexDirectionClassByValue),
    responsiveMappedClasses(props.alignItems, alignItemsClassByValue),
    responsiveMappedClasses(props.justifyContent, justifyContentClassByValue),
    responsiveSpacingClasses('gap', props.gap),
    responsiveSpacingClasses('gap-y', props.rowGap),
    responsiveSpacingClasses('gap-x', props.columnGap),
    responsiveSpacingClasses('p', props.padding ?? props.p),
    responsiveSpacingClasses('pt', props.paddingTop ?? props.pt),
    responsiveSpacingClasses('pb', props.paddingBottom ?? props.pb),
    responsiveSpacingClasses('pl', props.paddingLeft ?? props.pl),
    responsiveSpacingClasses('pr', props.paddingRight ?? props.pr),
    responsiveSpacingClasses('px', props.px),
    responsiveSpacingClasses('py', props.py),
    responsiveSpacingClasses('m', props.margin ?? props.m),
    responsiveSpacingClasses('mt', props.marginTop ?? props.mt),
    responsiveSpacingClasses('mb', props.marginBottom ?? props.mb),
    responsiveSpacingClasses('ml', props.marginLeft ?? props.ml),
    responsiveSpacingClasses('mr', props.marginRight ?? props.mr),
    responsiveSpacingClasses('mx', props.mx),
    responsiveSpacingClasses('my', props.my),
    responsiveMappedClasses(props.color, colorClassByValue, classValue => `text-${classValue}`),
    responsiveMappedClasses(props.backgroundColor ?? props.bg, colorClassByValue, classValue => `bg-${classValue}`),
    responsiveMappedClasses(props.borderColor, borderColorClassByValue, classValue => `border-${classValue}`),
    responsiveMappedClasses(props.borderRadius, radiusClassByToken),
    responsiveMappedClasses(props.fontSize, fontSizeClassByValue),
    responsiveMappedClasses(props.lineHeight, lineHeightClassByValue),
    responsiveMappedClasses(props.letterSpacing, letterSpacingClassByValue),
    responsiveMappedClasses(props.boxShadow, shadowClassByValue),
    responsiveMappedClasses(props.width, sizeClassByValue, classValue => `w-${classValue}`),
    responsiveMappedClasses(props.height, sizeClassByValue, classValue => `h-${classValue}`),
  )
}
