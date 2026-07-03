export const heightResponsiveVars = {
  height: {
    initial: '--height-initial',
    xs: '--height-xs',
    sm: '--height-sm',
    md: '--height-md',
    lg: '--height-lg',
    xl: '--height-xl',
  },
  minHeight: {
    initial: '--min-height-initial',
    xs: '--min-height-xs',
    sm: '--min-height-sm',
    md: '--min-height-md',
    lg: '--min-height-lg',
    xl: '--min-height-xl',
  },
  maxHeight: {
    initial: '--max-height-initial',
    xs: '--max-height-xs',
    sm: '--max-height-sm',
    md: '--max-height-md',
    lg: '--max-height-lg',
    xl: '--max-height-xl',
  },
} as const

export const heightResponsiveClasses = {
  height: {
    initial: 'h-[var(--height-initial)]',
    xs: 'xs:h-[var(--height-xs)]',
    sm: 'sm:h-[var(--height-sm)]',
    md: 'md:h-[var(--height-md)]',
    lg: 'lg:h-[var(--height-lg)]',
    xl: 'xl:h-[var(--height-xl)]',
  },
  minHeight: {
    initial: 'min-h-[var(--min-height-initial)]',
    xs: 'xs:min-h-[var(--min-height-xs)]',
    sm: 'sm:min-h-[var(--min-height-sm)]',
    md: 'md:min-h-[var(--min-height-md)]',
    lg: 'lg:min-h-[var(--min-height-lg)]',
    xl: 'xl:min-h-[var(--min-height-xl)]',
  },
  maxHeight: {
    initial: 'max-h-[var(--max-height-initial)]',
    xs: 'xs:max-h-[var(--max-height-xs)]',
    sm: 'sm:max-h-[var(--max-height-sm)]',
    md: 'md:max-h-[var(--max-height-md)]',
    lg: 'lg:max-h-[var(--max-height-lg)]',
    xl: 'xl:max-h-[var(--max-height-xl)]',
  },
} as const

const spacingHeightUtilities = {
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

export const heightUtilityClassByProperty = {
  height: {
    auto: 'h-auto',
    full: 'h-full',
    '100%': 'h-full',
    screen: 'h-screen',
    svh: 'h-svh',
    lvh: 'h-lvh',
    dvh: 'h-dvh',
    min: 'h-min',
    max: 'h-max',
    fit: 'h-fit',
    ...Object.fromEntries(Object.values(spacingHeightUtilities).map(value => [value, `h-${value}`])),
  },
  minHeight: {
    '0': 'min-h-0',
    full: 'min-h-full',
    '100%': 'min-h-full',
    screen: 'min-h-screen',
    '100vh': 'min-h-screen',
    svh: 'min-h-svh',
    '100svh': 'min-h-svh',
    lvh: 'min-h-lvh',
    '100lvh': 'min-h-lvh',
    dvh: 'min-h-dvh',
    '100dvh': 'min-h-dvh',
    min: 'min-h-min',
    max: 'min-h-max',
    fit: 'min-h-fit',
  },
  maxHeight: {
    '0': 'max-h-0',
    none: 'max-h-none',
    full: 'max-h-full',
    '100%': 'max-h-full',
    screen: 'max-h-screen',
    '100vh': 'max-h-screen',
    svh: 'max-h-svh',
    '100svh': 'max-h-svh',
    lvh: 'max-h-lvh',
    '100lvh': 'max-h-lvh',
    dvh: 'max-h-dvh',
    '100dvh': 'max-h-dvh',
    min: 'max-h-min',
    max: 'max-h-max',
    fit: 'max-h-fit',
  },
} as const

export const heightUtilityClassNames = Object.values(heightUtilityClassByProperty).flatMap(propertyMap =>
  Object.values(propertyMap),
)
