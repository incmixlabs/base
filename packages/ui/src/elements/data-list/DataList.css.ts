import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { space } from '@/theme/token-maps'
import { buildContainerResponsiveVariants, typographyBreakpointKeys } from '@/typography/responsive'

const columnGapVar = createVar()
const labelMinWidthVar = createVar()
const leadingTrimStartVar = createVar()
const leadingTrimEndVar = createVar()
const valueTrimStartVar = createVar()
const valueTrimEndVar = createVar()
const firstValueTrimStartVar = createVar()
const lastValueTrimEndVar = createVar()
const valueTrimOffset = '-0.25em'
const valueTrimNone = '0px'

const dataListSizeStyles = {
  xs: {
    gap: space['2'],
    vars: {
      [columnGapVar]: space['4'],
      [labelMinWidthVar]: '80px',
    },
  },
  sm: {
    gap: space['3'],
    vars: {
      [columnGapVar]: space['4'],
      [labelMinWidthVar]: '100px',
    },
  },
  md: {
    gap: space['4'],
    vars: {
      [columnGapVar]: space['4'],
      [labelMinWidthVar]: '120px',
    },
  },
  lg: {
    gap: space['5'],
    vars: {
      [columnGapVar]: space['5'],
      [labelMinWidthVar]: '140px',
    },
  },
} as const

export const dataListRootBase = style({
  containerType: 'inline-size',
  overflowWrap: 'anywhere',
  fontFamily: 'var(--default-font-family)',
  fontWeight: 'var(--font-weight-regular)',
  fontStyle: 'normal',
  textAlign: 'start',
  vars: {
    [leadingTrimStartVar]: 'initial',
    [leadingTrimEndVar]: 'initial',
  },
})

export const dataListRootBySize = styleVariants(dataListSizeStyles)

export const dataListRootSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(bp => [
    bp,
    styleVariants(
      // VE's responsive helper typing only models flat style objects, but these size styles
      // also carry nested `vars`, so we widen here before building the container variants.
      buildContainerResponsiveVariants(
        dataListSizeStyles as unknown as Record<string, Record<string, string>>,
        bp,
      ) as Record<keyof typeof dataListSizeStyles, { '@container': Record<string, Record<string, string>> }>,
    ),
  ]),
) as Record<(typeof typographyBreakpointKeys)[number], Record<keyof typeof dataListSizeStyles, string>>

export const dataListRootByOrientation = styleVariants({
  horizontal: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
  },
  vertical: {
    display: 'flex',
    flexDirection: 'column',
  },
})

export const dataListRootByTrim = styleVariants({
  normal: {
    vars: {
      [leadingTrimStartVar]: 'initial',
      [leadingTrimEndVar]: 'initial',
    },
  },
  start: {
    vars: {
      [leadingTrimStartVar]: 'calc(var(--default-leading-trim-start) - var(--line-height) / 2)',
      [leadingTrimEndVar]: 'initial',
    },
  },
  end: {
    vars: {
      [leadingTrimStartVar]: 'initial',
      [leadingTrimEndVar]: 'calc(var(--default-leading-trim-end) - var(--line-height) / 2)',
    },
  },
  both: {
    vars: {
      [leadingTrimStartVar]: 'calc(var(--default-leading-trim-start) - var(--line-height) / 2)',
      [leadingTrimEndVar]: 'calc(var(--default-leading-trim-end) - var(--line-height) / 2)',
    },
  },
})

export const dataListItemBase = style({
  vars: {
    [valueTrimStartVar]: valueTrimOffset,
    [valueTrimEndVar]: valueTrimOffset,
    [firstValueTrimStartVar]: valueTrimNone,
    [lastValueTrimEndVar]: valueTrimNone,
  },
  selectors: {
    '&:first-child': {
      marginTop: leadingTrimStartVar,
    },
    '&:last-child': {
      marginBottom: leadingTrimEndVar,
    },
  },
})

export const dataListItemByOrientation = styleVariants({
  horizontal: {
    display: 'grid',
    gridTemplateColumns: 'inherit',
    gridColumn: 'span 2',
    gap: columnGapVar,
    alignItems: 'baseline',
    '@supports': {
      '(grid-template-columns: subgrid)': {
        gridTemplateColumns: 'subgrid',
      },
    },
  },
  vertical: {
    display: 'flex',
    flexDirection: 'column',
    gap: space['1'],
  },
})

export const dataListItemByAlign = styleVariants({
  baseline: {
    alignItems: 'baseline',
    vars: {
      [valueTrimStartVar]: valueTrimOffset,
      [valueTrimEndVar]: valueTrimOffset,
      [firstValueTrimStartVar]: valueTrimNone,
      [lastValueTrimEndVar]: valueTrimNone,
    },
  },
  start: {
    alignItems: 'start',
    vars: {
      [valueTrimStartVar]: valueTrimNone,
      [valueTrimEndVar]: valueTrimOffset,
      [firstValueTrimStartVar]: valueTrimNone,
      [lastValueTrimEndVar]: valueTrimNone,
    },
  },
  center: {
    alignItems: 'center',
    vars: {
      [valueTrimStartVar]: valueTrimOffset,
      [valueTrimEndVar]: valueTrimOffset,
      [firstValueTrimStartVar]: valueTrimOffset,
      [lastValueTrimEndVar]: valueTrimOffset,
    },
  },
  end: {
    alignItems: 'end',
    vars: {
      [valueTrimStartVar]: valueTrimOffset,
      [valueTrimEndVar]: valueTrimNone,
      [firstValueTrimStartVar]: valueTrimNone,
      [lastValueTrimEndVar]: valueTrimNone,
    },
  },
  stretch: {
    alignItems: 'stretch',
    vars: {
      [valueTrimStartVar]: valueTrimNone,
      [valueTrimEndVar]: valueTrimNone,
      [firstValueTrimStartVar]: valueTrimNone,
      [lastValueTrimEndVar]: valueTrimNone,
    },
  },
})

export const dataListLabelBase = style({
  display: 'flex',
  fontWeight: 'var(--font-weight-medium)',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  selectors: {
    '&::before': {
      content: '"\\200D"',
    },
  },
})

export const dataListLabelByOrientation = styleVariants({
  horizontal: {
    minWidth: labelMinWidthVar,
  },
  vertical: {
    minWidth: 0,
  },
})

export const dataListValueBase = style({
  display: 'flex',
  margin: 0,
  minWidth: 0,
  marginTop: valueTrimStartVar,
  marginBottom: valueTrimEndVar,
  selectors: {
    '&::before': {
      content: '"\\200D"',
    },
    [`${dataListItemBase}:first-child &`]: {
      marginTop: firstValueTrimStartVar,
    },
    [`${dataListItemBase}:last-child &`]: {
      marginBottom: lastValueTrimEndVar,
    },
  },
})
