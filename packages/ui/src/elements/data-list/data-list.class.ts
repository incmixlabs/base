export type DataListSize = 'xs' | 'sm' | 'md' | 'lg'
export type DataListOrientation = 'horizontal' | 'vertical'
export type DataListTrim = 'normal' | 'start' | 'end' | 'both'
export type DataListAlign = 'baseline' | 'start' | 'center' | 'end' | 'stretch' | 'between'

export const dataListRootBase = 'af-datalist-root-base'

export const dataListRootBySize = {
  xs: 'af-datalist-size-xs',
  sm: 'af-datalist-size-sm',
  md: 'af-datalist-size-md',
  lg: 'af-datalist-size-lg',
} as const

export const dataListRootSizeResponsive = {
  xs: {
    xs: 'cq-xs:af-datalist-size-xs',
    sm: 'cq-xs:af-datalist-size-sm',
    md: 'cq-xs:af-datalist-size-md',
    lg: 'cq-xs:af-datalist-size-lg',
  },
  sm: {
    xs: 'cq-sm:af-datalist-size-xs',
    sm: 'cq-sm:af-datalist-size-sm',
    md: 'cq-sm:af-datalist-size-md',
    lg: 'cq-sm:af-datalist-size-lg',
  },
  md: {
    xs: 'cq-md:af-datalist-size-xs',
    sm: 'cq-md:af-datalist-size-sm',
    md: 'cq-md:af-datalist-size-md',
    lg: 'cq-md:af-datalist-size-lg',
  },
  lg: {
    xs: 'cq-lg:af-datalist-size-xs',
    sm: 'cq-lg:af-datalist-size-sm',
    md: 'cq-lg:af-datalist-size-md',
    lg: 'cq-lg:af-datalist-size-lg',
  },
  xl: {
    xs: 'cq-xl:af-datalist-size-xs',
    sm: 'cq-xl:af-datalist-size-sm',
    md: 'cq-xl:af-datalist-size-md',
    lg: 'cq-xl:af-datalist-size-lg',
  },
} as const

export const dataListRootByOrientation = {
  horizontal: 'af-datalist-root-horizontal',
  vertical: 'af-datalist-root-vertical',
} as const

export const dataListRootByTrim = {
  normal: 'af-datalist-root-trim-normal',
  start: 'af-datalist-root-trim-start',
  end: 'af-datalist-root-trim-end',
  both: 'af-datalist-root-trim-both',
} as const

export const dataListItemBase = 'af-datalist-item-base'

export const dataListItemByOrientation = {
  horizontal: 'af-datalist-item-horizontal',
  vertical: 'af-datalist-item-vertical',
} as const

export const dataListItemByAlign = {
  baseline: 'af-datalist-item-align-baseline',
  start: 'af-datalist-item-align-start',
  center: 'af-datalist-item-align-center',
  end: 'af-datalist-item-align-end',
  stretch: 'af-datalist-item-align-stretch',
} as const

export const dataListLabelBase = 'af-datalist-label-base'

export const dataListLabelByOrientation = {
  horizontal: 'af-datalist-label-horizontal',
  vertical: 'af-datalist-label-vertical',
} as const

export const dataListValueBase = 'af-datalist-value-base'
