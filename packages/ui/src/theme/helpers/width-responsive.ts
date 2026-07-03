import { getResponsiveUtilityClassNames } from './token-class-maps'

export const widthResponsiveVars = {
  width: {
    initial: '--width-initial',
    xs: '--width-xs',
    sm: '--width-sm',
    md: '--width-md',
    lg: '--width-lg',
    xl: '--width-xl',
  },
  minWidth: {
    initial: '--min-width-initial',
    xs: '--min-width-xs',
    sm: '--min-width-sm',
    md: '--min-width-md',
    lg: '--min-width-lg',
    xl: '--min-width-xl',
  },
  maxWidth: {
    initial: '--max-width-initial',
    xs: '--max-width-xs',
    sm: '--max-width-sm',
    md: '--max-width-md',
    lg: '--max-width-lg',
    xl: '--max-width-xl',
  },
} as const

export const widthResponsiveClasses = {
  width: {
    initial: 'w-[var(--width-initial)]',
    xs: 'xs:w-[var(--width-xs)]',
    sm: 'sm:w-[var(--width-sm)]',
    md: 'md:w-[var(--width-md)]',
    lg: 'lg:w-[var(--width-lg)]',
    xl: 'xl:w-[var(--width-xl)]',
  },
  minWidth: {
    initial: 'min-w-[var(--min-width-initial)]',
    xs: 'xs:min-w-[var(--min-width-xs)]',
    sm: 'sm:min-w-[var(--min-width-sm)]',
    md: 'md:min-w-[var(--min-width-md)]',
    lg: 'lg:min-w-[var(--min-width-lg)]',
    xl: 'xl:min-w-[var(--min-width-xl)]',
  },
  maxWidth: {
    initial: 'max-w-[var(--max-width-initial)]',
    xs: 'xs:max-w-[var(--max-width-xs)]',
    sm: 'sm:max-w-[var(--max-width-sm)]',
    md: 'md:max-w-[var(--max-width-md)]',
    lg: 'lg:max-w-[var(--max-width-lg)]',
    xl: 'xl:max-w-[var(--max-width-xl)]',
  },
} as const

const spacingWidthUtilities = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
} as const

export const widthUtilityClassByProperty = {
  width: {
    auto: 'w-auto',
    full: 'w-full',
    '100%': 'w-full',
    screen: 'w-screen',
    svw: 'w-svw',
    lvw: 'w-lvw',
    dvw: 'w-dvw',
    min: 'w-min',
    max: 'w-max',
    fit: 'w-fit',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    '1/4': 'w-1/4',
    '2/4': 'w-2/4',
    '3/4': 'w-3/4',
    ...Object.fromEntries(Object.values(spacingWidthUtilities).map(value => [value, `w-${value}`])),
  },
  minWidth: {
    '0': 'min-w-0',
    full: 'min-w-full',
    '100%': 'min-w-full',
    min: 'min-w-min',
    max: 'min-w-max',
    fit: 'min-w-fit',
  },
  maxWidth: {
    '0': 'max-w-0',
    none: 'max-w-none',
    full: 'max-w-full',
    '100%': 'max-w-full',
    min: 'max-w-min',
    max: 'max-w-max',
    fit: 'max-w-fit',
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    screen: 'max-w-screen',
    prose: 'max-w-prose',
  },
} as const

export const widthUtilityClassNames = Object.values(widthUtilityClassByProperty).flatMap(propertyMap =>
  Object.values(propertyMap),
)

export const widthResponsiveUtilityClassNames = getResponsiveUtilityClassNames(widthUtilityClassNames)
