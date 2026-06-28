export type DataListSize = 'xs' | 'sm' | 'md' | 'lg'
export type DataListOrientation = 'horizontal' | 'vertical'
export type DataListTrim = 'normal' | 'start' | 'end' | 'both'
export type DataListAlign = 'baseline' | 'start' | 'center' | 'end' | 'stretch' | 'between'

const dataListSizeValues = ['xs', 'sm', 'md', 'lg'] as const
const dataListResponsiveBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const dataListLineHeightRemBySize = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '1.625rem',
} as const satisfies Record<DataListSize, string>

function dataListLineHeightClass(size: DataListSize) {
  return `[--af-datalist-line-height:calc(${dataListLineHeightRemBySize[size]}*var(--theme-typography-text-leading,1))]`
}

function dataListResponsiveSizeMap<const TMap extends Record<DataListSize, string>>(map: TMap) {
  return Object.fromEntries(
    dataListResponsiveBreakpoints.map(breakpoint => [
      breakpoint,
      Object.fromEntries(
        dataListSizeValues.map(size => [
          size,
          map[size]
            .split(/\s+/)
            .map(token => `cq-${breakpoint}:${token}`)
            .join(' '),
        ]),
      ),
    ]),
  ) as Record<(typeof dataListResponsiveBreakpoints)[number], TMap>
}

export const dataListRootContainer = '[container-type:inline-size]'
export const dataListRootBase =
  'w-full [overflow-wrap:anywhere] [font-family:var(--default-font-family)] font-normal [font-style:var(--default-font-style)] text-start'

export const dataListRootBySize = {
  xs: `gap-2 ${dataListLineHeightClass('xs')}`,
  sm: `gap-3 ${dataListLineHeightClass('sm')}`,
  md: `gap-4 ${dataListLineHeightClass('md')}`,
  lg: `gap-5 ${dataListLineHeightClass('lg')}`,
} as const

export const dataListRootSizeResponsive = dataListResponsiveSizeMap(dataListRootBySize)

export const dataListRootByOrientation = {
  horizontal: 'grid grid-cols-[auto_1fr]',
  vertical: 'flex flex-col',
} as const

export const dataListRootByTrim = {
  normal: '[--af-datalist-leading-trim-start:initial] [--af-datalist-leading-trim-end:initial]',
  start:
    '[--af-datalist-leading-trim-start:calc(var(--default-leading-trim-start)-var(--af-datalist-line-height)/2)] [--af-datalist-leading-trim-end:initial]',
  end: '[--af-datalist-leading-trim-start:initial] [--af-datalist-leading-trim-end:calc(var(--default-leading-trim-end)-var(--af-datalist-line-height)/2)]',
  both: '[--af-datalist-leading-trim-start:calc(var(--default-leading-trim-start)-var(--af-datalist-line-height)/2)] [--af-datalist-leading-trim-end:calc(var(--default-leading-trim-end)-var(--af-datalist-line-height)/2)]',
} as const

export const dataListItemBase =
  "[&:first-child]:mt-[var(--af-datalist-leading-trim-start)] [&:last-child]:mb-[var(--af-datalist-leading-trim-end)] [&:first-child>[data-slot='data-list-value']]:mt-[var(--af-datalist-first-value-trim-start)] [&:last-child>[data-slot='data-list-value']]:mb-[var(--af-datalist-last-value-trim-end)]"

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
    'items-baseline [--af-datalist-value-trim-start:-0.25em] [--af-datalist-value-trim-end:-0.25em] [--af-datalist-first-value-trim-start:0px] [--af-datalist-last-value-trim-end:0px]',
  start:
    'items-start [--af-datalist-value-trim-start:0px] [--af-datalist-value-trim-end:-0.25em] [--af-datalist-first-value-trim-start:0px] [--af-datalist-last-value-trim-end:0px]',
  center:
    'items-center [--af-datalist-value-trim-start:-0.25em] [--af-datalist-value-trim-end:-0.25em] [--af-datalist-first-value-trim-start:-0.25em] [--af-datalist-last-value-trim-end:-0.25em]',
  end: 'items-end [--af-datalist-value-trim-start:-0.25em] [--af-datalist-value-trim-end:0px] [--af-datalist-first-value-trim-start:0px] [--af-datalist-last-value-trim-end:0px]',
  stretch:
    'items-stretch [--af-datalist-value-trim-start:0px] [--af-datalist-value-trim-end:0px] [--af-datalist-first-value-trim-start:0px] [--af-datalist-last-value-trim-end:0px]',
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

export const dataListValueBase =
  "flex min-w-0 mx-0 mt-[var(--af-datalist-value-trim-start)] mb-[var(--af-datalist-value-trim-end)] before:content-['\\200D']"
