import { type ContainerBreakpoint, containerBreakpointKeys, containerBreakpoints } from '@incmix/ui/theme'
import { type ComplexStyleRule, style, styleVariants } from '@vanilla-extract/css'

const responsiveBreakpoints = ['initial', ...containerBreakpointKeys] as const
type AutoFormResponsiveBreakpoint = (typeof responsiveBreakpoints)[number]
const colSpanValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const
type AutoFormColSpanValue = (typeof colSpanValues)[number]

function responsiveStyle(breakpoint: AutoFormResponsiveBreakpoint, styles: ComplexStyleRule): ComplexStyleRule {
  if (breakpoint === 'initial') {
    return styles
  }

  return {
    '@container': {
      [`(min-width: ${containerBreakpoints[breakpoint as ContainerBreakpoint]})`]: styles as never,
    },
  }
}

export const autoFormResponsiveContainer = style({
  containerType: 'inline-size',
})

export const autoFormActionSlot = style({
  paddingTop: '1rem',
})

function createResponsiveBreakpointVariants<T extends Record<string, ComplexStyleRule>>(
  builder: {
    [K in keyof T]: (breakpoint: AutoFormResponsiveBreakpoint) => T[K]
  },
) {
  return Object.fromEntries(
    responsiveBreakpoints.map(breakpoint => [
      breakpoint,
      styleVariants(
        Object.fromEntries(
          Object.entries(builder).map(([key, createStyles]) => [
            key,
            responsiveStyle(breakpoint, createStyles(breakpoint)),
          ]),
        ) as T,
      ),
    ]),
  ) as Record<AutoFormResponsiveBreakpoint, Record<keyof T, string>>
}

export const autoFormFieldWrapperLayoutClasses = createResponsiveBreakpointVariants({
  stacked: () => ({
    display: 'block',
  }),
  horizontal: () => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
    alignItems: 'start',
    columnGap: '1rem',
    rowGap: '0.5rem',
  }),
}) as Record<AutoFormResponsiveBreakpoint, Record<'stacked' | 'horizontal', string>>

export const autoFormFieldLabelPlacementClasses = createResponsiveBreakpointVariants({
  stacked: () => ({
    gridColumn: 'auto',
    order: 'unset',
    paddingTop: 0,
  }),
  start: () => ({
    gridColumn: 'span 4 / span 4',
    order: 'unset',
    paddingTop: '0.75rem',
  }),
  end: () => ({
    gridColumn: 'span 4 / span 4',
    order: '2',
    paddingTop: '0.75rem',
  }),
}) as Record<AutoFormResponsiveBreakpoint, Record<'stacked' | 'start' | 'end', string>>

export const autoFormFieldBodyPlacementClasses = createResponsiveBreakpointVariants({
  stacked: () => ({
    gridColumn: 'auto',
    order: 'unset',
    minWidth: 0,
  }),
  start: () => ({
    gridColumn: 'span 8 / span 8',
    order: 'unset',
    minWidth: 0,
  }),
  end: () => ({
    gridColumn: 'span 8 / span 8',
    order: '1',
    minWidth: 0,
  }),
}) as Record<AutoFormResponsiveBreakpoint, Record<'stacked' | 'start' | 'end', string>>

export const autoFormBooleanTopLabelClasses = createResponsiveBreakpointVariants({
  stacked: () => ({
    display: 'block',
  }),
  row: () => ({
    display: 'none',
  }),
}) as Record<AutoFormResponsiveBreakpoint, Record<'stacked' | 'row', string>>

export const autoFormBooleanSpacerLabelClasses = createResponsiveBreakpointVariants({
  stacked: () => ({
    display: 'none',
  }),
  row: () => ({
    display: 'block',
    visibility: 'hidden',
  }),
}) as Record<AutoFormResponsiveBreakpoint, Record<'stacked' | 'row', string>>

export const autoFormBooleanInlineLabelClasses = createResponsiveBreakpointVariants({
  stacked: () => ({
    display: 'none',
  }),
  row: () => ({
    display: 'inline-flex',
  }),
}) as Record<AutoFormResponsiveBreakpoint, Record<'stacked' | 'row', string>>

export const autoFormColumnSpanClasses = Object.fromEntries(
  responsiveBreakpoints.map(breakpoint => [
    breakpoint,
    styleVariants(
      Object.fromEntries(
        colSpanValues.map(colSpan => [
          colSpan,
          responsiveStyle(breakpoint, {
            gridColumn: `span ${colSpan} / span ${colSpan}`,
          }),
        ]),
      ) as Record<AutoFormColSpanValue, ComplexStyleRule>,
    ),
  ]),
) as Record<AutoFormResponsiveBreakpoint, Record<AutoFormColSpanValue, string>>
