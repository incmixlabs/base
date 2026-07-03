export type DataListSize = 'xs' | 'sm' | 'md' | 'lg'
export type DataListOrientation = 'horizontal' | 'vertical'
export type DataListTrim = 'normal' | 'start' | 'end' | 'both'
export type DataListAlign = 'baseline' | 'start' | 'center' | 'end' | 'stretch' | 'between'

const dataListSizeValues = ['xs', 'sm', 'md', 'lg'] as const
const dataListTrimValues = ['normal', 'start', 'end', 'both'] as const
const dataListResponsiveBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const
type DataListResponsiveBreakpoint = (typeof dataListResponsiveBreakpoints)[number]

const dataListLineHeightRemBySize = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '1.625rem',
} as const satisfies Record<DataListSize, string>

type DataListResponsiveSizeMap<TMap extends Record<DataListSize, string>> = Record<DataListResponsiveBreakpoint, TMap>

function dataListResponsiveSizeMap<const TMap extends Record<DataListSize, string>>(
  map: TMap,
): DataListResponsiveSizeMap<TMap> {
  return Object.fromEntries(
    dataListResponsiveBreakpoints.map(breakpoint => [
      breakpoint,
      Object.fromEntries(
        dataListSizeValues.map(size => [
          size,
          map[size]
            .split(/\s+/)
            .filter(Boolean)
            .map(token => `cq-${breakpoint}:${token}`)
            .join(' '),
        ]),
      ),
    ]),
  ) as DataListResponsiveSizeMap<TMap>
}

function dataListTrimStartClass(size: DataListSize) {
  return `[&>[data-slot='data-list-item']:first-child]:mt-[calc(var(--default-leading-trim-start)-${dataListLineHeightRemBySize[size]}*var(--theme-typography-text-leading,1)/2)]`
}

function dataListTrimEndClass(size: DataListSize) {
  return `[&>[data-slot='data-list-item']:last-child]:mb-[calc(var(--default-leading-trim-end)-${dataListLineHeightRemBySize[size]}*var(--theme-typography-text-leading,1)/2)]`
}

export const dataListRootContainer = '[container-type:inline-size]'
export const dataListRootBase =
  'w-full [overflow-wrap:anywhere] [font-family:var(--default-font-family)] font-normal [font-style:var(--default-font-style)] text-start'

export const dataListRootBySize = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5',
} as const

export const dataListRootSizeResponsive = dataListResponsiveSizeMap(dataListRootBySize)

export const dataListRootByOrientation = {
  horizontal: 'grid grid-cols-[auto_1fr]',
  vertical: 'flex flex-col',
} as const

export const dataListRootByTrim = {
  normal: Object.fromEntries(dataListSizeValues.map(size => [size, ''])),
  start: Object.fromEntries(dataListSizeValues.map(size => [size, dataListTrimStartClass(size)])),
  end: Object.fromEntries(dataListSizeValues.map(size => [size, dataListTrimEndClass(size)])),
  both: Object.fromEntries(
    dataListSizeValues.map(size => [size, `${dataListTrimStartClass(size)} ${dataListTrimEndClass(size)}`]),
  ),
} as Record<DataListTrim, Record<DataListSize, string>>

export const dataListRootTrimResponsive = Object.fromEntries(
  dataListTrimValues.map(trim => [trim, dataListResponsiveSizeMap(dataListRootByTrim[trim])]),
) as Record<DataListTrim, DataListResponsiveSizeMap<Record<DataListSize, string>>>

export const dataListItemByOrientation = {
  horizontal: 'grid [grid-template-columns:inherit] col-span-2',
  vertical: 'flex flex-col gap-1',
} as const

export const dataListItemGapBySize = {
  xs: 'gap-4',
  sm: 'gap-4',
  md: 'gap-4',
  lg: 'gap-5',
} as const

export const dataListItemGapResponsive = dataListResponsiveSizeMap(dataListItemGapBySize)

export const dataListItemByAlign = {
  baseline:
    "items-baseline [&>[data-slot='data-list-value']]:mt-[-0.25em] [&>[data-slot='data-list-value']]:mb-[-0.25em] [&:first-child>[data-slot='data-list-value']]:mt-0 [&:last-child>[data-slot='data-list-value']]:mb-0",
  start:
    "items-start [&>[data-slot='data-list-value']]:mt-0 [&>[data-slot='data-list-value']]:mb-[-0.25em] [&:first-child>[data-slot='data-list-value']]:mt-0 [&:last-child>[data-slot='data-list-value']]:mb-0",
  center: "items-center [&>[data-slot='data-list-value']]:mt-[-0.25em] [&>[data-slot='data-list-value']]:mb-[-0.25em]",
  end: "items-end [&>[data-slot='data-list-value']]:mt-[-0.25em] [&>[data-slot='data-list-value']]:mb-0 [&:first-child>[data-slot='data-list-value']]:mt-0 [&:last-child>[data-slot='data-list-value']]:mb-0",
  stretch: "items-stretch [&>[data-slot='data-list-value']]:mt-0 [&>[data-slot='data-list-value']]:mb-0",
} as const

export const dataListLabelBase =
  "flex font-medium [color:color-mix(in_oklch,var(--color-neutral-text)_68%,transparent)] before:content-['\\200D']"

export const dataListLabelByOrientation = {
  vertical: 'min-w-0',
} as const

export const dataListLabelMinWidthBySize = {
  xs: 'min-w-[80px]',
  sm: 'min-w-[100px]',
  md: 'min-w-[120px]',
  lg: 'min-w-[140px]',
} as const

export const dataListLabelMinWidthResponsive = dataListResponsiveSizeMap(dataListLabelMinWidthBySize)

export const dataListValueBase = "flex min-w-0 mx-0 before:content-['\\200D']"
