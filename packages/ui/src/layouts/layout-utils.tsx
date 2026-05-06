'use client'

import * as React from 'react'
import { composeRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import { getHeightProps, getMarginProps, getPaddingProps, getWidthProps, resolveSpacingValue } from '@/theme/helpers'
import { gapResponsiveClasses, gapResponsiveVars } from '@/theme/helpers/gap-responsive.css'
import type { HeightProps } from '@/theme/props/height.props'
import {
  type LayoutCompositionMode,
  layoutCompositionColumnValues,
  layoutCompositionPropDefs,
  layoutCompositionRowValues,
} from '@/theme/props/layout-composition.props'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { WidthProps } from '@/theme/props/width.props'
import type {
  AlignContent,
  AlignItems,
  AlignSelf,
  Color,
  Display,
  FlexDirection,
  FlexWrap,
  HueName,
  HueStep,
  JustifyContent,
  JustifyItems,
  JustifySelf,
  Overflow,
  PaletteColorToken,
  Position,
  Radius,
  Responsive,
  SemanticColorVarToken,
  Spacing,
  ThemeColorToken,
} from '@/theme/tokens'
import { designTokens, resolveThemeColorToken } from '@/theme/tokens'
import {
  gridColumns,
  gridColumnsResponsive,
  gridRows,
  gridRowsResponsive,
  gridTemplateAreasCustomResponsive,
  gridTemplateColumnsCustomResponsive,
  gridTemplateRowsCustomResponsive,
} from './grid/Grid.css'

// Re-export shared types for convenience
export type {
  AlignContent,
  AlignItems,
  AlignSelf,
  Color,
  Display,
  FlexDirection,
  FlexWrap,
  HueName,
  HueStep,
  JustifyContent,
  JustifyItems,
  JustifySelf,
  Overflow,
  PaletteColorToken,
  Position,
  Radius,
  Responsive,
  SemanticColorVarToken,
  Spacing,
  ThemeColorToken,
}

const borderUtilityPattern =
  /^border$|^border-(?:0|2|4|8|\[[^\]]+\])$|^border-(?:[trblxy]|[bs][es])$|^border-(?:[trblxy]|[bs][es])-(?:0|2|4|8|\[[^\]]+\])$/

export function hasBorderWidthUtility(className?: string): boolean {
  if (!className) return false

  return className.split(/\s+/).some(token => {
    const utility = token.split(':').pop()
    return utility ? borderUtilityPattern.test(utility) : false
  })
}

export function getMergedSlotClassName(children: React.ReactNode, className?: string): string | undefined {
  if (!React.isValidElement(children)) return className

  const childClassName = (children.props as { className?: string }).className
  return cn(className, childClassName) || undefined
}

// ============================================================================
// Layout-specific Types
// ============================================================================

// Grid types
export type GridFlow = 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'

// Container types
export type ContainerSize = '1' | '2' | '3' | '4'
export type ContainerAlign = 'left' | 'center' | 'right'

// Section types
export type SectionSize = '1' | '2' | '3' | '4'

// ============================================================================
// Spacing Scale Mapping
// ============================================================================

/** spacingScale export. */
export const spacingScale: Record<Spacing, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '8',
  '8': '10',
  '9': '12',
}

// Imported from shared theme package (single source of truth).
// Cast preserves the original Spacing-keyed type for layout consumers.
import { SPACING_TO_PIXELS } from '@incmix/theme'

export const spacingToPixels = SPACING_TO_PIXELS as Record<string, string>

type LayoutSpacingProp = Responsive<Spacing | string>

interface LayoutPaddingProps {
  p?: LayoutSpacingProp
  px?: LayoutSpacingProp
  py?: LayoutSpacingProp
  pt?: LayoutSpacingProp
  pr?: LayoutSpacingProp
  pb?: LayoutSpacingProp
  pl?: LayoutSpacingProp
}

interface LayoutMarginProps {
  m?: LayoutSpacingProp
  mx?: LayoutSpacingProp
  my?: LayoutSpacingProp
  mt?: LayoutSpacingProp
  mr?: LayoutSpacingProp
  mb?: LayoutSpacingProp
  ml?: LayoutSpacingProp
}

function getSpacingPixelValue(prop: LayoutSpacingProp | undefined): string | undefined {
  if (!prop || typeof prop !== 'string') return undefined
  return resolveSpacingValue(prop.trim(), spacingToPixels)
}

// ============================================================================
// Responsive Class Helpers
// ============================================================================

/** getResponsiveClasses export. */
export function getResponsiveClasses<T extends string>(
  prop: Responsive<T> | undefined,
  prefix: string,
  valueMap?: Record<string, string>,
): string {
  if (prop === undefined) return ''

  const mapValue = (val: T) => (valueMap ? valueMap[val] || val : val)
  const formatValue = (val: T) => {
    const stringValue = String(val)
    const isNegative = stringValue.startsWith('-')
    const absolute = (isNegative ? stringValue.slice(1) : stringValue) as T
    const mapped = mapValue(absolute)
    return isNegative ? `-${prefix}-${mapped}` : `${prefix}-${mapped}`
  }

  if (typeof prop === 'string') {
    return formatValue(prop)
  }

  const classes: string[] = []
  if (prop.initial) classes.push(formatValue(prop.initial))
  if (prop.xs) classes.push(`xs:${formatValue(prop.xs)}`)
  if (prop.sm) classes.push(`sm:${formatValue(prop.sm)}`)
  if (prop.md) classes.push(`md:${formatValue(prop.md)}`)
  if (prop.lg) classes.push(`lg:${formatValue(prop.lg)}`)
  if (prop.xl) classes.push(`xl:${formatValue(prop.xl)}`)

  return classes.join(' ')
}

/** getSpacingClasses export. */
export function getSpacingClasses(prop: LayoutSpacingProp | undefined, prefix: string): string {
  return getResponsiveClasses(prop as Responsive<string> | undefined, prefix, spacingScale)
}

const responsiveValueKeys = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const
type ResponsiveValueKey = (typeof responsiveValueKeys)[number]

export function normalizeResponsiveEnumPropValue<T extends string>(
  def: { values: readonly T[]; default?: T },
  prop: Responsive<T | string> | undefined,
): Responsive<T> | undefined {
  if (prop === undefined) return undefined

  if (typeof prop === 'string') {
    return normalizeEnumPropValue(def, prop)
  }

  const normalized: Partial<Record<ResponsiveValueKey, T>> = {}
  for (const key of responsiveValueKeys) {
    const value = prop[key]
    if (value === undefined) continue

    const normalizedValue = normalizeEnumPropValue(def, value)
    if (normalizedValue !== undefined) normalized[key] = normalizedValue
  }

  return Object.keys(normalized).length > 0 ? (normalized as Responsive<T>) : undefined
}

export function normalizeResponsiveEnumOrStringPropValue<T extends string>(
  def: { values: readonly T[]; default?: T | string },
  prop: Responsive<T | string> | undefined,
): Responsive<T | string> | undefined {
  if (prop === undefined) return undefined

  const normalizeStringValue = (value: string) => normalizeEnumPropValue(def, value) ?? value.trim()

  if (typeof prop === 'string') {
    return normalizeStringValue(prop)
  }

  const normalized: Partial<Record<ResponsiveValueKey, T | string>> = {}
  for (const key of responsiveValueKeys) {
    const value = prop[key]
    if (value === undefined) continue

    normalized[key] = typeof value === 'string' ? normalizeStringValue(value) : value
  }

  return Object.keys(normalized).length > 0 ? (normalized as Responsive<T | string>) : undefined
}

export function filterResponsiveTokenValues<T extends string>(
  prop: Responsive<T | string> | undefined,
  isValid: (value: string) => value is T,
): Responsive<T> | undefined {
  if (!prop) return undefined

  if (typeof prop === 'string') {
    return isValid(prop) ? prop : undefined
  }

  const filtered: Partial<Record<ResponsiveValueKey, T>> = {}
  for (const key of responsiveValueKeys) {
    const value = prop[key]
    if (value && isValid(value)) filtered[key] = value
  }

  return Object.keys(filtered).length > 0 ? (filtered as Responsive<T>) : undefined
}

// ============================================================================
// Generic Factory for Mapped Class Helpers
// ============================================================================

/**
 * Creates a responsive class helper function from a value-to-class mapping.
 * This reduces repetition for functions like getDisplayClasses, getPositionClasses, etc.
 */
function createMappedClassHelper<T extends string>(
  map: Record<T, string>,
): (prop: Responsive<T> | undefined) => string {
  return prop => {
    if (prop === undefined) return ''
    if (typeof prop === 'string') return map[prop] || ''

    const classes: string[] = []
    if (prop.initial) classes.push(map[prop.initial])
    if (prop.xs) classes.push(`xs:${map[prop.xs]}`)
    if (prop.sm) classes.push(`sm:${map[prop.sm]}`)
    if (prop.md) classes.push(`md:${map[prop.md]}`)
    if (prop.lg) classes.push(`lg:${map[prop.lg]}`)
    if (prop.xl) classes.push(`xl:${map[prop.xl]}`)
    return classes.join(' ')
  }
}

// ============================================================================
// Display & Position Class Helpers
// ============================================================================

const displayMap: Record<Display, string> = {
  none: 'hidden',
  inline: 'inline',
  'inline-block': 'inline-block',
  block: 'block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-grid': 'inline-grid',
  contents: 'contents',
}

const positionMap: Record<Position, string> = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
}

/** getDisplayClasses export. */
export const getDisplayClasses = createMappedClassHelper(displayMap)
/** getPositionClasses export. */
export const getPositionClasses = createMappedClassHelper(positionMap)

// ============================================================================
// Flex Class Helpers
// ============================================================================

const flexDirectionMap: Record<FlexDirection, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
}

const flexWrapMap: Record<FlexWrap, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
}

const alignItemsMap: Record<AlignItems, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
}

const alignContentMap: Record<AlignContent, string> = {
  start: 'content-start',
  center: 'content-center',
  end: 'content-end',
  between: 'content-between',
  around: 'content-around',
  evenly: 'content-evenly',
  stretch: 'content-stretch',
}

const justifyContentMap: Record<JustifyContent, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const alignSelfMap: Record<AlignSelf, string> = {
  auto: 'self-auto',
  start: 'self-start',
  center: 'self-center',
  end: 'self-end',
  baseline: 'self-baseline',
  stretch: 'self-stretch',
}

const justifySelfMap: Record<JustifySelf, string> = {
  auto: 'justify-self-auto',
  start: 'justify-self-start',
  center: 'justify-self-center',
  end: 'justify-self-end',
  stretch: 'justify-self-stretch',
}

const justifyItemsMap: Record<JustifyItems, string> = {
  start: 'justify-items-start',
  center: 'justify-items-center',
  end: 'justify-items-end',
  stretch: 'justify-items-stretch',
}

const flexGrowMap: Record<'0' | '1', string> = {
  '0': 'grow-0',
  '1': 'grow',
}

const flexShrinkMap: Record<'0' | '1', string> = {
  '0': 'shrink-0',
  '1': 'shrink',
}

/** getFlexDirectionClasses export. */
export const getFlexDirectionClasses = createMappedClassHelper(flexDirectionMap)
/** getFlexWrapClasses export. */
export const getFlexWrapClasses = createMappedClassHelper(flexWrapMap)
/** getAlignItemsClasses export. */
export const getAlignItemsClasses = createMappedClassHelper(alignItemsMap)
/** getAlignContentClasses export. */
export const getAlignContentClasses = createMappedClassHelper(alignContentMap)
/** getJustifyContentClasses export. */
export const getJustifyContentClasses = createMappedClassHelper(justifyContentMap)
/** getAlignSelfClasses export. */
export const getAlignSelfClasses = createMappedClassHelper(alignSelfMap)
/** getJustifySelfClasses export. */
export const getJustifySelfClasses = createMappedClassHelper(justifySelfMap)
/** getJustifyItemsClasses export. */
export const getJustifyItemsClasses = createMappedClassHelper(justifyItemsMap)
/** getFlexGrowClasses export. */
export const getFlexGrowClasses = createMappedClassHelper(flexGrowMap)
/** getFlexShrinkClasses export. */
export const getFlexShrinkClasses = createMappedClassHelper(flexShrinkMap)

// ============================================================================
// Grid Class Helpers
// ============================================================================

const gridFlowMap: Record<GridFlow, string> = {
  row: 'grid-flow-row',
  column: 'grid-flow-col',
  dense: 'grid-flow-dense',
  'row-dense': 'grid-flow-row-dense',
  'column-dense': 'grid-flow-col-dense',
}

/** getGridFlowClasses export. */
export const getGridFlowClasses = createMappedClassHelper(gridFlowMap)

// Grid columns - map to layout classes
const gridColumnsMap = Object.fromEntries(layoutCompositionColumnValues.map(value => [value, value])) as Record<
  GridColumns,
  GridColumns
>

// Grid rows - map to layout classes
const gridRowsMap = Object.fromEntries(layoutCompositionRowValues.map(value => [value, value])) as Record<
  GridRows,
  GridRows
>

export type GridColumns = (typeof layoutCompositionColumnValues)[number]
export type GridRows = (typeof layoutCompositionRowValues)[number]

function getGridClasses<T extends string>(
  prop: Responsive<T> | undefined,
  baseClasses: Record<T, string>,
  responsiveClasses: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', Record<T, string>>,
): string {
  if (prop === undefined) return ''

  if (typeof prop === 'string') {
    return baseClasses[prop] || ''
  }

  const classes: string[] = []
  if (prop.initial) {
    const initialClass = baseClasses[prop.initial]
    if (initialClass) classes.push(initialClass)
  }

  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const
  for (const bp of breakpoints) {
    const value = prop[bp]
    if (value && responsiveClasses[bp][value]) {
      classes.push(responsiveClasses[bp][value])
    }
  }

  return classes.join(' ')
}

/** isGridColumnsValue export. */
export function isGridColumnsValue(value: string): value is GridColumns {
  return value in gridColumnsMap
}

/** isGridRowsValue export. */
export function isGridRowsValue(value: string): value is GridRows {
  return value in gridRowsMap
}

/** getGridColumnsClasses export. */
export function getGridColumnsClasses(prop: Responsive<GridColumns> | undefined): string {
  return getGridClasses(prop, gridColumns, gridColumnsResponsive)
}

/** getGridRowsClasses export. */
export function getGridRowsClasses(prop: Responsive<GridRows> | undefined): string {
  return getGridClasses(prop, gridRows, gridRowsResponsive)
}

export function isSpacingValue(value: string): value is Spacing {
  return Object.hasOwn(spacingToPixels, value)
}

// ============================================================================
// Layout Composition Helpers
// ============================================================================

export type LayoutMode = LayoutCompositionMode

export interface LayoutCompositionProps {
  layout?: LayoutMode
  direction?: Responsive<FlexDirection>
  align?: Responsive<AlignItems>
  justify?: Responsive<JustifyContent>
  wrap?: Responsive<FlexWrap>
  gap?: Responsive<Spacing | string>
  gapX?: Responsive<Spacing | string>
  gapY?: Responsive<Spacing | string>
  areas?: Responsive<string>
  columns?: Responsive<GridColumns | string>
  rows?: Responsive<GridRows | string>
  flow?: Responsive<GridFlow>
  alignContent?: Responsive<AlignContent>
  justifyItems?: Responsive<JustifyItems>
}

export function extractLayoutCompositionProps<T extends LayoutCompositionProps>(props: T) {
  const {
    layout,
    direction,
    align,
    justify,
    wrap,
    gap,
    gapX,
    gapY,
    areas,
    columns,
    rows,
    flow,
    alignContent,
    justifyItems,
    ...rest
  } = props

  return {
    layoutProps: {
      layout,
      direction,
      align,
      justify,
      wrap,
      gap,
      gapX,
      gapY,
      areas,
      columns,
      rows,
      flow,
      alignContent,
      justifyItems,
    },
    rest,
  }
}

function isFlexLayoutMode(layout: LayoutMode | undefined) {
  return layout === 'flex' || layout === 'row' || layout === 'column'
}

function isGridLayoutMode(layout: LayoutMode | undefined) {
  return layout === 'grid'
}

function normalizeLayoutCompositionProps(props: LayoutCompositionProps): LayoutCompositionProps {
  return {
    ...props,
    layout: normalizeEnumPropValue(layoutCompositionPropDefs.layout, props.layout),
    direction: normalizeResponsiveEnumPropValue(layoutCompositionPropDefs.direction, props.direction),
    align: normalizeResponsiveEnumPropValue(layoutCompositionPropDefs.align, props.align),
    justify: normalizeResponsiveEnumPropValue(layoutCompositionPropDefs.justify, props.justify),
    wrap: normalizeResponsiveEnumPropValue(layoutCompositionPropDefs.wrap, props.wrap),
    gap: normalizeResponsiveEnumOrStringPropValue(layoutCompositionPropDefs.gap, props.gap),
    gapX: normalizeResponsiveEnumOrStringPropValue(layoutCompositionPropDefs.gapX, props.gapX),
    gapY: normalizeResponsiveEnumOrStringPropValue(layoutCompositionPropDefs.gapY, props.gapY),
    columns: normalizeResponsiveEnumOrStringPropValue(layoutCompositionPropDefs.columns, props.columns),
    rows: normalizeResponsiveEnumOrStringPropValue(layoutCompositionPropDefs.rows, props.rows),
    flow: normalizeResponsiveEnumPropValue(layoutCompositionPropDefs.flow, props.flow),
    alignContent: normalizeResponsiveEnumPropValue(layoutCompositionPropDefs.alignContent, props.alignContent),
    justifyItems: normalizeResponsiveEnumPropValue(layoutCompositionPropDefs.justifyItems, props.justifyItems),
  }
}

const responsiveGridTemplateBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const
type ResponsiveGridTemplateBreakpoint = (typeof responsiveGridTemplateBreakpoints)[number]
type GridTemplateCustomProperty = '--grid-template-areas' | '--grid-template-columns' | '--grid-template-rows'
type LayoutCompositionStyles = React.CSSProperties &
  Partial<Record<GridTemplateCustomProperty, string>> &
  Partial<Record<`${GridTemplateCustomProperty}-${ResponsiveGridTemplateBreakpoint}`, string>>
type LayoutGapProperty = 'gap' | 'gapX' | 'gapY'
type LayoutGapCssProperty = 'gap' | 'columnGap' | 'rowGap'

function getGridColumnTemplate(value: GridColumns) {
  return value === 'none' ? 'none' : `repeat(${value}, minmax(0, 1fr))`
}

function getGridRowTemplate(value: GridRows) {
  return value === 'none' ? 'none' : `repeat(${value}, minmax(0, 1fr))`
}

const emptyLayoutCompositionStyles: React.CSSProperties = {}

function isResponsiveValue<T>(
  value: Responsive<T> | undefined,
): value is Partial<Record<'initial' | ResponsiveGridTemplateBreakpoint, T>> {
  return !!value && typeof value === 'object'
}

function hasCustomResponsiveGridTemplateValue<T extends string>(
  prop: Responsive<T | string> | undefined,
  isValidTokenValue: (value: string) => value is T,
): boolean {
  if (!isResponsiveValue(prop)) return false

  if (prop.initial && !isValidTokenValue(prop.initial)) return true

  return responsiveGridTemplateBreakpoints.some(bp => {
    const value = prop[bp]
    return !!value && !isValidTokenValue(value)
  })
}

function hasCustomResponsiveSpacingValue(prop: Responsive<Spacing | string> | undefined): boolean {
  if (!isResponsiveValue(prop)) return false

  if (prop.initial && !isSpacingValue(prop.initial)) return true

  return responsiveGridTemplateBreakpoints.some(bp => {
    const value = prop[bp]
    return !!value && !isSpacingValue(value)
  })
}

function getResponsiveGridTemplateValueClasses<T extends string>(
  prop: Responsive<T | string> | undefined,
  isValidTokenValue: (value: string) => value is T,
  tokenClassResolver: (prop: Responsive<T> | undefined) => string,
  customResponsiveClasses: Record<ResponsiveGridTemplateBreakpoint, string>,
): string {
  const useCustomResponsiveClasses = hasCustomResponsiveGridTemplateValue(prop, isValidTokenValue)
  if (!useCustomResponsiveClasses) {
    return tokenClassResolver(filterResponsiveTokenValues(prop, isValidTokenValue))
  }

  if (!isResponsiveValue(prop)) return ''

  const classes: string[] = []
  for (const bp of responsiveGridTemplateBreakpoints) {
    if (prop[bp]) classes.push(customResponsiveClasses[bp])
  }

  return classes.join(' ')
}

export function getResponsiveSpacingValueClasses(
  prop: Responsive<Spacing | string> | undefined,
  prefix: 'gap' | 'gap-x' | 'gap-y',
  gapProperty: LayoutGapProperty,
): string {
  if (hasCustomResponsiveSpacingValue(prop)) return gapResponsiveClasses[gapProperty]
  return getSpacingClasses(filterResponsiveTokenValues(prop, isSpacingValue), prefix)
}

function getResponsiveGridTemplateAreaClasses(
  prop: Responsive<string> | undefined,
  customResponsiveClasses: Record<ResponsiveGridTemplateBreakpoint, string>,
): string {
  if (!isResponsiveValue(prop)) return ''

  const classes: string[] = []
  for (const bp of responsiveGridTemplateBreakpoints) {
    if (prop[bp]) classes.push(customResponsiveClasses[bp])
  }

  return classes.join(' ')
}

function getGridTemplateStyleValue<T extends string>(
  value: string,
  isValidTokenValue: (value: string) => value is T,
  tokenValueResolver: (value: T) => string,
): string {
  return isValidTokenValue(value) ? tokenValueResolver(value) : value
}

function assignResponsiveGridTemplateStyles<T extends string>(
  getStyles: () => LayoutCompositionStyles,
  prop: Responsive<T | string> | undefined,
  cssProperty: 'gridTemplateColumns' | 'gridTemplateRows',
  customProperty: Extract<GridTemplateCustomProperty, '--grid-template-columns' | '--grid-template-rows'>,
  isValidTokenValue: (value: string) => value is T,
  tokenValueResolver: (value: T) => string,
) {
  const useCustomResponsiveStyles = hasCustomResponsiveGridTemplateValue(prop, isValidTokenValue)

  if (typeof prop === 'string') {
    getStyles()[cssProperty] = getGridTemplateStyleValue(prop, isValidTokenValue, tokenValueResolver)
    return
  }

  if (!useCustomResponsiveStyles || !isResponsiveValue(prop)) return

  if (prop.initial) {
    getStyles()[cssProperty] = getGridTemplateStyleValue(prop.initial, isValidTokenValue, tokenValueResolver)
  }

  for (const bp of responsiveGridTemplateBreakpoints) {
    const value = prop[bp]
    if (value) {
      getStyles()[`${customProperty}-${bp}`] = getGridTemplateStyleValue(value, isValidTokenValue, tokenValueResolver)
    }
  }
}

function assignStyleValue(style: React.CSSProperties, property: string, value: string) {
  const customPropertyName = property.startsWith('var(') ? property.slice(4, -1) : property
  ;(style as Record<string, string>)[customPropertyName] = value
}

function assignResponsiveGridTemplateAreaStyles(
  getStyles: () => LayoutCompositionStyles,
  prop: Responsive<string> | undefined,
) {
  if (typeof prop === 'string') {
    getStyles().gridTemplateAreas = prop
    return
  }

  if (!isResponsiveValue(prop)) return

  if (prop.initial) getStyles().gridTemplateAreas = prop.initial

  for (const bp of responsiveGridTemplateBreakpoints) {
    const value = prop[bp]
    if (value) getStyles()[`--grid-template-areas-${bp}`] = value
  }
}

export function assignResponsiveSpacingStyles(
  getStyles: () => LayoutCompositionStyles,
  prop: Responsive<Spacing | string> | undefined,
  cssProperty: LayoutGapCssProperty,
  gapProperty: LayoutGapProperty,
) {
  if (typeof prop === 'string') {
    getStyles()[cssProperty] = resolveSpacingValue(prop.trim(), spacingToPixels)
    return
  }

  if (!hasCustomResponsiveSpacingValue(prop) || !isResponsiveValue(prop)) return

  let inheritedValue: string | undefined
  // Set each breakpoint variable, inheriting the previous value when a breakpoint is omitted.
  for (const breakpoint of responsiveValueKeys) {
    const value = prop[breakpoint]
    inheritedValue = value !== undefined ? resolveSpacingValue(value.trim(), spacingToPixels) : inheritedValue

    const variableName = gapResponsiveVars[gapProperty][breakpoint]
    if (inheritedValue !== undefined) assignStyleValue(getStyles(), variableName, inheritedValue)
  }
}

export function getLayoutCompositionClasses(props: LayoutCompositionProps): string {
  const {
    layout,
    direction,
    align,
    justify,
    wrap,
    gap,
    gapX,
    gapY,
    areas,
    columns,
    rows,
    flow,
    alignContent,
    justifyItems,
  } = normalizeLayoutCompositionProps(props)

  if (!layout) return ''
  if (layout === 'block') return getDisplayClasses('block')

  const isFlexLayout = isFlexLayoutMode(layout)
  const isGridLayout = isGridLayoutMode(layout)
  if (!isFlexLayout && !isGridLayout) return ''

  const resolvedDirection = layout === 'row' ? 'row' : layout === 'column' ? 'column' : direction
  const classes = [getDisplayClasses(isGridLayout ? 'grid' : 'flex')]
  const addClass = (className: string) => {
    if (className) classes.push(className)
  }

  if (isFlexLayout) {
    addClass(getFlexDirectionClasses(resolvedDirection))
    addClass(getFlexWrapClasses(wrap))
  }

  addClass(getAlignItemsClasses(align))
  addClass(getJustifyContentClasses(justify))
  addClass(getAlignContentClasses(alignContent))

  if (isGridLayout) {
    addClass(getGridFlowClasses(flow))
    addClass(getJustifyItemsClasses(justifyItems))
    addClass(getResponsiveGridTemplateAreaClasses(areas, gridTemplateAreasCustomResponsive))
    addClass(
      getResponsiveGridTemplateValueClasses(
        columns,
        isGridColumnsValue,
        getGridColumnsClasses,
        gridTemplateColumnsCustomResponsive,
      ),
    )
    addClass(
      getResponsiveGridTemplateValueClasses(
        rows,
        isGridRowsValue,
        getGridRowsClasses,
        gridTemplateRowsCustomResponsive,
      ),
    )
  }

  addClass(getResponsiveSpacingValueClasses(gap, 'gap', 'gap'))
  addClass(getResponsiveSpacingValueClasses(gapX, 'gap-x', 'gapX'))
  addClass(getResponsiveSpacingValueClasses(gapY, 'gap-y', 'gapY'))

  return classes.join(' ')
}

export function getLayoutCompositionStyles(props: LayoutCompositionProps): React.CSSProperties {
  const { layout, areas, columns, rows, gap, gapX, gapY } = normalizeLayoutCompositionProps(props)
  const isFlexLayout = isFlexLayoutMode(layout)
  const isGridLayout = isGridLayoutMode(layout)
  if (!isFlexLayout && !isGridLayout) return emptyLayoutCompositionStyles

  let styles: LayoutCompositionStyles | undefined
  const getStyles = () => {
    styles ??= {}
    return styles
  }

  if (isGridLayout) {
    assignResponsiveGridTemplateAreaStyles(getStyles, areas)
    assignResponsiveGridTemplateStyles(
      getStyles,
      columns,
      'gridTemplateColumns',
      '--grid-template-columns',
      isGridColumnsValue,
      getGridColumnTemplate,
    )
    assignResponsiveGridTemplateStyles(
      getStyles,
      rows,
      'gridTemplateRows',
      '--grid-template-rows',
      isGridRowsValue,
      getGridRowTemplate,
    )
  }

  assignResponsiveSpacingStyles(getStyles, gap, 'gap', 'gap')
  assignResponsiveSpacingStyles(getStyles, gapX, 'columnGap', 'gapX')
  assignResponsiveSpacingStyles(getStyles, gapY, 'rowGap', 'gapY')

  return styles ?? emptyLayoutCompositionStyles
}

// ============================================================================
// Slot Component
// ============================================================================

/** Slot export. */
export function Slot({
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }) {
  if (React.isValidElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>(children)) {
    const childRef = (children.props as { ref?: React.Ref<HTMLElement> }).ref
    return React.cloneElement(
      children as React.ReactElement,
      {
        ...props,
        ...children.props,
        ref: childRef ? composeRefs(ref, childRef) : ref,
        className: cn(props.className, children.props.className),
      } as Record<string, unknown>,
    )
  }
  return <>{children}</>
}

// ============================================================================
// Shared Layout Props
// ============================================================================

export interface SharedLayoutProps extends LayoutPaddingProps, LayoutMarginProps, HeightProps, WidthProps {
  // Sizing
  bg?: ThemeColorToken
  borderColor?: ThemeColorToken
  radius?: Radius

  // Position
  position?: Responsive<Position>
  inset?: Responsive<Spacing>
  top?: Responsive<Spacing>
  right?: Responsive<Spacing>
  bottom?: Responsive<Spacing>
  left?: Responsive<Spacing>

  // Overflow
  overflow?: Responsive<Overflow>
  overflowX?: Responsive<Overflow>
  overflowY?: Responsive<Overflow>

  // Flex item props
  flexGrow?: Responsive<'0' | '1'>
  flexShrink?: Responsive<'0' | '1'>
  flexBasis?: string

  // Self alignment
  alignSelf?: Responsive<AlignSelf>
  justifySelf?: Responsive<JustifySelf>

  // Grid item props
  gridArea?: string
  gridColumn?: string
  gridColumnStart?: string
  gridColumnEnd?: string
  gridRow?: string
  gridRowStart?: string
  gridRowEnd?: string
}

export function extractSharedLayoutProps<T extends SharedLayoutProps>(props: T) {
  const {
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    bg,
    borderColor,
    radius,
    position,
    inset,
    top,
    right,
    bottom,
    left,
    overflow,
    overflowX,
    overflowY,
    flexGrow,
    flexShrink,
    flexBasis,
    alignSelf,
    justifySelf,
    gridArea,
    gridColumn,
    gridColumnStart,
    gridColumnEnd,
    gridRow,
    gridRowStart,
    gridRowEnd,
    ...rest
  } = props

  return {
    layoutProps: {
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
      bg,
      borderColor,
      radius,
      position,
      inset,
      top,
      right,
      bottom,
      left,
      overflow,
      overflowX,
      overflowY,
      flexGrow,
      flexShrink,
      flexBasis,
      alignSelf,
      justifySelf,
      gridArea,
      gridColumn,
      gridColumnStart,
      gridColumnEnd,
      gridRow,
      gridRowStart,
      gridRowEnd,
    },
    rest,
  }
}

/** getSharedLayoutClasses export. */
export function getSharedLayoutClasses(props: SharedLayoutProps): string {
  const {
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    position,
    inset,
    top,
    right,
    bottom,
    left,
    overflow,
    overflowX,
    overflowY,
    flexGrow,
    flexShrink,
    alignSelf,
    justifySelf,
  } = props

  const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
  const paddingProps = getPaddingProps({ p, px, py, pt, pr, pb, pl })
  const widthProps = getWidthProps({ width, minWidth, maxWidth })
  const heightProps = getHeightProps({ height, minHeight, maxHeight })

  return cn(
    paddingProps.className,
    marginProps.className,
    widthProps.className,
    heightProps.className,
    // Position
    getPositionClasses(position),
    getSpacingClasses(inset, 'inset'),
    getSpacingClasses(top, 'top'),
    getSpacingClasses(right, 'right'),
    getSpacingClasses(bottom, 'bottom'),
    getSpacingClasses(left, 'left'),
    // Overflow
    getResponsiveClasses(overflow, 'overflow'),
    getResponsiveClasses(overflowX, 'overflow-x'),
    getResponsiveClasses(overflowY, 'overflow-y'),
    // Flex
    getFlexGrowClasses(flexGrow),
    getFlexShrinkClasses(flexShrink),
    // Self alignment
    getAlignSelfClasses(alignSelf),
    getJustifySelfClasses(justifySelf),
  )
}

/** getSharedLayoutStyles export. */
export function getSharedLayoutStyles(props: SharedLayoutProps): React.CSSProperties {
  const {
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    bg,
    borderColor,
    radius,
    flexBasis,
    gridArea,
    gridColumn,
    gridColumnStart,
    gridColumnEnd,
    gridRow,
    gridRowStart,
    gridRowEnd,
    inset,
    top,
    right,
    bottom,
    left,
  } = props

  const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
  const paddingProps = getPaddingProps({ p, px, py, pt, pr, pb, pl })
  const widthProps = getWidthProps({ width, minWidth, maxWidth })
  const heightProps = getHeightProps({ height, minHeight, maxHeight })

  return {
    ...paddingProps.style,
    ...marginProps.style,
    ...widthProps.style,
    ...heightProps.style,
    ...(bg && { backgroundColor: resolveThemeColorToken(bg) }),
    ...(borderColor && { borderColor: resolveThemeColorToken(borderColor) }),
    ...(radius && { borderRadius: designTokens.radius[radius] }),
    ...(flexBasis && { flexBasis }),
    ...(gridArea && { gridArea }),
    ...(gridColumn && { gridColumn }),
    ...(gridColumnStart && { gridColumnStart }),
    ...(gridColumnEnd && { gridColumnEnd }),
    ...(gridRow && { gridRow }),
    ...(gridRowStart && { gridRowStart }),
    ...(gridRowEnd && { gridRowEnd }),
    ...(getSpacingPixelValue(inset) && { inset: getSpacingPixelValue(inset) }),
    ...(getSpacingPixelValue(top) && { top: getSpacingPixelValue(top) }),
    ...(getSpacingPixelValue(right) && { right: getSpacingPixelValue(right) }),
    ...(getSpacingPixelValue(bottom) && { bottom: getSpacingPixelValue(bottom) }),
    ...(getSpacingPixelValue(left) && { left: getSpacingPixelValue(left) }),
  }
}
