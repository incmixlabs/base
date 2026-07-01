import { themeSizeTokens } from '@incmix/theme'
import { treeViewSizes } from './tree-view.constants'

type TreeViewSize = (typeof treeViewSizes)[number]

const cls = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(' ')

const paddingInlineByToken = {
  '0.5rem': 'px-2',
  '0.625rem': 'px-2.5',
  '0.75rem': 'px-3',
  '0.875rem': 'px-3.5',
  '1.25rem': 'px-5',
} as const

const paddingBlockByToken = {
  '0.25rem': 'py-1',
  '0.4375rem': 'py-[0.4375rem]',
  '0.5rem': 'py-2',
  '1.5625rem': 'py-[1.5625rem]',
} as const

const gapByToken = {
  '0.25rem': 'gap-1',
  '0.375rem': 'gap-1.5',
  '0.5rem': 'gap-2',
  '0.625rem': 'gap-2.5',
  '0.6875rem': 'gap-[0.6875rem]',
  '0.875rem': 'gap-3.5',
} as const

const iconByToken = {
  '0.75rem': 'h-3 w-3',
  '0.875rem': 'h-3.5 w-3.5',
  '1rem': 'h-4 w-4',
  '1.25rem': 'h-5 w-5',
  '1.5rem': 'h-6 w-6',
  '1.75rem': 'h-7 w-7',
} as const

const typographyBySize = {
  xs: 'text-xs leading-4',
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
  lg: 'text-lg leading-[1.625rem]',
  xl: 'text-xl leading-7',
  '2x': 'text-2xl leading-[1.875rem]',
} as const satisfies Record<TreeViewSize, string>

function paddingInlineClass(value: string) {
  return paddingInlineByToken[value as keyof typeof paddingInlineByToken] ?? `[padding-inline:${value}]`
}

function paddingBlockClass(value: string) {
  return paddingBlockByToken[value as keyof typeof paddingBlockByToken] ?? `[padding-block:${value}]`
}

function gapClass(value: string) {
  return gapByToken[value as keyof typeof gapByToken] ?? `[gap:${value}]`
}

function iconClass(value: string) {
  return iconByToken[value as keyof typeof iconByToken] ?? `[height:${value}] [width:${value}]`
}

function indentGuideOffsetClass(size: TreeViewSize) {
  const token = themeSizeTokens[size]
  return `[margin-inline-start:calc(${token.iconSize}/2_+_${token.paddingX})]`
}

export const treeViewRootBase = 'relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto'

export const treeViewItemBase =
  'group/tree-view-item relative flex w-full cursor-pointer select-none items-center rounded-md border-0 bg-transparent text-left font-[inherit] text-inherit transition-colors duration-[120ms] ease-[var(--af-ease-standard)] hover:bg-slate-soft focus-visible:bg-primary-soft-hover focus-visible:text-primary focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-primary-solid)] data-[selected]:bg-primary-soft-hover data-[selected]:text-primary data-[active]:bg-primary-soft-hover data-[active]:text-primary data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[drag-over]:bg-[color-mix(in_oklch,var(--color-primary-solid)_20%,transparent)] data-[drag-over]:[box-shadow:inset_3px_0_0_var(--color-primary-solid)]'

export const treeViewItemSizeVariants = Object.fromEntries(
  treeViewSizes.map(size => {
    const token = themeSizeTokens[size]
    return [
      size,
      cls(
        paddingInlineClass(token.paddingX),
        paddingBlockClass(token.paddingY),
        gapClass(token.gap),
        typographyBySize[size],
      ),
    ]
  }),
) as Record<TreeViewSize, string>

export const treeViewChevron =
  'shrink-0 text-neutral opacity-70 transition-transform duration-[160ms] ease-[var(--af-ease-standard)]'

export const treeViewChevronOpen = 'rotate-90'

export const treeViewLeafSpacer = 'shrink-0'

export const treeViewIcon = 'shrink-0'

export const treeViewIconSizeVariants = Object.fromEntries(
  treeViewSizes.map(size => [size, iconClass(themeSizeTokens[size].iconSize)]),
) as Record<TreeViewSize, string>

export const treeViewActions =
  'ms-auto flex items-center opacity-0 transition-opacity duration-[120ms] ease-[var(--af-ease-standard)] hover:opacity-100 group-hover/tree-view-item:opacity-100 group-focus/tree-view-item:opacity-100 group-focus-visible/tree-view-item:opacity-100 group-data-[selected]/tree-view-item:opacity-100 group-data-[active]/tree-view-item:opacity-100'

export const treeViewBranchContent =
  'grid overflow-hidden transition-[grid-template-rows,opacity] duration-[var(--af-motion-medium)] ease-[var(--af-ease-standard)] motion-reduce:transition-none'

export const treeViewBranchContentOpen = 'grid-rows-[1fr] opacity-100'

export const treeViewBranchContentClosed = 'grid-rows-[0fr] opacity-0 pointer-events-none'

export const treeViewBranchContentInner = 'min-h-0 overflow-hidden'

export const treeViewIndentGuide = 'border-s border-neutral'

export const treeViewIndentGuideSizeVariants = Object.fromEntries(
  treeViewSizes.map(size => [size, indentGuideOffsetClass(size)]),
) as Record<TreeViewSize, string>

export const treeViewClassNames = [
  treeViewRootBase,
  treeViewItemBase,
  ...Object.values(treeViewItemSizeVariants),
  treeViewChevron,
  treeViewChevronOpen,
  treeViewLeafSpacer,
  treeViewIcon,
  ...Object.values(treeViewIconSizeVariants),
  treeViewActions,
  treeViewBranchContent,
  treeViewBranchContentOpen,
  treeViewBranchContentClosed,
  treeViewBranchContentInner,
  treeViewIndentGuide,
  ...Object.values(treeViewIndentGuideSizeVariants),
]
