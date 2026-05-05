import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { tableHeaderCellClass, tableHeaderSurfaceClass } from '@/table/shared/table-header.shared.css'

export const treeTableBorderColorVar = createVar()
export const treeTableHoverColorVar = createVar()
export const treeTableSelectedColorVar = createVar()
export const treeTableSurfaceColorVar = createVar()
export const treeTableTextColorVar = createVar()
export const treeTablePrimaryColorVar = createVar()

export const treeTableShellVariant = styleVariants({
  surface: {
    border: `1px solid ${treeTableBorderColorVar}`,
    borderRadius: 'var(--radius-4)',
    background: treeTableSurfaceColorVar,
    boxShadow: 'var(--shadow-xs)',
  },
  ghost: {},
})

export const treeTheadClass = style({})

export const treeTheadVariant = styleVariants({
  surface: [tableHeaderSurfaceClass],
  ghost: {},
})

export const treeToolbarClass = style({
  borderBottom: `1px solid ${treeTableBorderColorVar}`,
})

export const treeTheadCellClass = style([tableHeaderCellClass])

export const treeRowClass = style({
  borderBottom: `1px solid ${treeTableBorderColorVar}`,
  selectors: {
    '&:hover': {
      backgroundColor: treeTableHoverColorVar,
    },
    '&[data-state="selected"]': {
      backgroundColor: treeTableSelectedColorVar,
    },
  },
})

export const treeCellClass = style({
  color: treeTableTextColorVar,
})

export const treeSortButtonClass = style({
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${treeTablePrimaryColorVar}`,
    },
  },
})

export const treeSortIconActiveClass = style({
  color: treeTablePrimaryColorVar,
  opacity: 1,
})

export const treeResizeHandleClass = style({
  selectors: {
    '&:hover': {
      backgroundColor: treeTableBorderColorVar,
    },
    '&:focus-visible': {
      backgroundColor: treeTablePrimaryColorVar,
    },
  },
})

export const treeResizeHandleActiveClass = style({
  backgroundColor: treeTablePrimaryColorVar,
  opacity: 1,
})

export const treeStateTextClass = style({
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
  color: `color-mix(in oklch, ${treeTableTextColorVar} 68%, transparent)`,
})

globalStyle(
  `[data-tree-first-cell-content]:has(input, textarea, select, [role="combobox"]) [data-table-row-actions-slot]`,
  {
    display: 'none',
  },
)

globalStyle(`[data-tree-first-cell-value]:has(input, textarea, select, [role="combobox"])`, {
  overflow: 'visible',
  whiteSpace: 'normal',
})
