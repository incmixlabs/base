'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Responsive } from '@/theme/props/prop-def'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { spaceRem } from '@/theme/token-maps'
import { breakpoints as tokenBreakpoints } from '@/theme/tokens'
import {
  tableCaptionBase,
  tableCellBase,
  tableColumnHeaderCellBase,
  tableCompactRoot,
  tableFooterBase,
  tableHeadBase,
  tableHeaderVariant,
  tableRootBase,
  tableRowBase,
  tableRowHeaderCellBase,
  tableRowVariant,
  tableSizeVariants,
  tableStripedRoot,
  tableVariantRoot,
} from './table.css'
import type {
  TableBodyProps,
  TableCaptionProps,
  TableCellJustify,
  TableCellProps,
  TableColumnHeaderCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableLayout,
  TableOwnProps as TablePropDefs,
  TableRootProps,
  TableRowAlign,
  TableRowHeaderCellProps,
  TableRowProps,
  TableSize,
  TableVariant,
} from './table.props'
import { tablePropDefs } from './table.props'

export type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableColumnHeaderCellProps,
  TableComponentProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableProps,
  TableRootProps,
  TableRowHeaderCellProps,
  TableRowProps,
  TableSize,
  TableVariant,
} from './table.props'

type ResponsiveBreakpoint = 'initial' | keyof typeof tokenBreakpoints

type SpacingToken = keyof typeof spaceRem
const responsiveOrder = Object.keys(tokenBreakpoints) as (keyof typeof tokenBreakpoints)[]

const tableLayoutClassNames: Record<TableLayout, string> = {
  auto: 'table-auto',
  fixed: 'table-fixed',
}

const tableRowAlignClassNames: Record<TableRowAlign, string> = {
  start: '[&>td]:align-top [&>th]:align-top',
  center: '[&>td]:align-middle [&>th]:align-middle',
  end: '[&>td]:align-bottom [&>th]:align-bottom',
  baseline: '[&>td]:align-baseline [&>th]:align-baseline',
}

const tableCellJustifyClassNames: Record<TableCellJustify, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
}

function resolveResponsiveValue<T>(
  value: Responsive<T> | undefined,
  activeBreakpoint: ResponsiveBreakpoint,
): T | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'object' && value !== null && 'initial' in value) {
    let resolved = value.initial

    for (const breakpoint of responsiveOrder) {
      const candidate = value[breakpoint]
      if (candidate === undefined) continue
      if (isBreakpointAtOrBelowActive(breakpoint, activeBreakpoint)) {
        resolved = candidate
      }
    }

    return resolved
  }
  return value as T
}

function isBreakpointAtOrBelowActive(
  breakpoint: keyof typeof tokenBreakpoints,
  activeBreakpoint: ResponsiveBreakpoint,
): boolean {
  if (activeBreakpoint === 'initial') return false
  return responsiveOrder.indexOf(breakpoint) <= responsiveOrder.indexOf(activeBreakpoint)
}

function getActiveResponsiveBreakpoint(): ResponsiveBreakpoint {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'initial'

  let active: ResponsiveBreakpoint = 'initial'
  for (const breakpoint of responsiveOrder) {
    if (window.matchMedia(`screen and (min-width: ${tokenBreakpoints[breakpoint]})`).matches) {
      active = breakpoint
    }
  }
  return active
}

function subscribeToBreakpoints(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}

  const mediaQueries = responsiveOrder.map(breakpoint =>
    window.matchMedia(`screen and (min-width: ${tokenBreakpoints[breakpoint]})`),
  )

  for (const mediaQuery of mediaQueries) {
    mediaQuery.addEventListener('change', onStoreChange)
  }

  return () => {
    for (const mediaQuery of mediaQueries) {
      mediaQuery.removeEventListener('change', onStoreChange)
    }
  }
}

function toSpacingValue(value: string | undefined): string | undefined {
  if (!value) return undefined
  if (value in spaceRem) {
    return spaceRem[value as SpacingToken]
  }
  return value
}

function resolveRootSize(size: TablePropDefs['Root']['size'], activeBreakpoint: ResponsiveBreakpoint): TableSize {
  const initial = resolveResponsiveValue(size, activeBreakpoint)
  return (normalizeEnumPropValue(tablePropDefs.Root.size, initial) ?? tablePropDefs.Root.size.default) as TableSize
}

function resolveRootVariant(variant: TablePropDefs['Root']['variant']): TableVariant {
  return (normalizeEnumPropValue(tablePropDefs.Root.variant, variant) ??
    tablePropDefs.Root.variant.default) as TableVariant
}

function resolveRootLayout(
  layout: TablePropDefs['Root']['layout'],
  activeBreakpoint: ResponsiveBreakpoint,
): TableLayout {
  const initial = resolveResponsiveValue(layout, activeBreakpoint)
  return (normalizeEnumPropValue(tablePropDefs.Root.layout, initial) ??
    tablePropDefs.Root.layout.default) as TableLayout
}

function resolveRowAlign(
  align: TablePropDefs['Row']['align'],
  activeBreakpoint: ResponsiveBreakpoint,
): TableRowAlign | undefined {
  const initial = resolveResponsiveValue(align, activeBreakpoint)
  return normalizeEnumPropValue(tablePropDefs.Row.align, initial) as TableRowAlign | undefined
}

function resolveCellJustify(
  justify: TablePropDefs['Cell']['justify'],
  activeBreakpoint: ResponsiveBreakpoint,
): TableCellJustify | undefined {
  const initial = resolveResponsiveValue(justify, activeBreakpoint)
  return normalizeEnumPropValue(tablePropDefs.Cell.justify, initial) as TableCellJustify | undefined
}

function getCellInlineStyles({
  width,
  minWidth,
  maxWidth,
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  activeBreakpoint,
  style,
}: Pick<TablePropDefs['Cell'], 'width' | 'minWidth' | 'maxWidth' | 'p' | 'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl'> & {
  activeBreakpoint: ResponsiveBreakpoint
  style?: React.CSSProperties
}): React.CSSProperties {
  const widthValue = resolveResponsiveValue(width, activeBreakpoint)
  const minWidthValue = resolveResponsiveValue(minWidth, activeBreakpoint)
  const maxWidthValue = resolveResponsiveValue(maxWidth, activeBreakpoint)

  const pValue = toSpacingValue(resolveResponsiveValue(p, activeBreakpoint) as string | undefined)
  const pxValue = toSpacingValue(resolveResponsiveValue(px, activeBreakpoint) as string | undefined)
  const pyValue = toSpacingValue(resolveResponsiveValue(py, activeBreakpoint) as string | undefined)
  const ptValue = toSpacingValue(resolveResponsiveValue(pt, activeBreakpoint) as string | undefined)
  const prValue = toSpacingValue(resolveResponsiveValue(pr, activeBreakpoint) as string | undefined)
  const pbValue = toSpacingValue(resolveResponsiveValue(pb, activeBreakpoint) as string | undefined)
  const plValue = toSpacingValue(resolveResponsiveValue(pl, activeBreakpoint) as string | undefined)

  return {
    width: widthValue as string | undefined,
    minWidth: minWidthValue as string | undefined,
    maxWidth: maxWidthValue as string | undefined,
    padding: pValue,
    paddingInline: pxValue,
    paddingBlock: pyValue,
    paddingTop: ptValue,
    paddingRight: prValue,
    paddingBottom: pbValue,
    paddingLeft: plValue,
    ...style,
  }
}

interface TableContextValue {
  size: TableSize
  variant: TableVariant
  activeBreakpoint: ResponsiveBreakpoint
}

const TableContext = React.createContext<TableContextValue>({
  size: tablePropDefs.Root.size.default as TableSize,
  variant: tablePropDefs.Root.variant.default as TableVariant,
  activeBreakpoint: 'initial',
})

const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  (
    {
      size,
      variant,
      layout,
      striped = tablePropDefs.Root.striped.default,
      compact = tablePropDefs.Root.compact.default,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const activeBreakpoint = React.useSyncExternalStore<ResponsiveBreakpoint>(
      subscribeToBreakpoints,
      getActiveResponsiveBreakpoint,
      () => 'initial' as ResponsiveBreakpoint,
    )

    const safeSize = resolveRootSize(size, activeBreakpoint)
    const safeVariant = resolveRootVariant(variant)
    const safeLayout = resolveRootLayout(layout, activeBreakpoint)

    return (
      <TableContext.Provider value={{ size: safeSize, variant: safeVariant, activeBreakpoint }}>
        <div
          className={cn(
            'w-full min-w-0 max-w-full overflow-x-auto overflow-y-hidden',
            tableVariantRoot[safeVariant],
            striped ? tableStripedRoot : null,
          )}
        >
          <table
            ref={ref}
            className={cn(
              'w-max min-w-full border-collapse text-left align-middle [border-spacing:0]',
              tableRootBase,
              tableSizeVariants[safeSize],
              tableLayoutClassNames[safeLayout],
              compact ? tableCompactRoot : null,
              className,
            )}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    )
  },
)

TableRoot.displayName = 'Table.Root'

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TableContext)
  return <thead ref={ref} className={cn(tableHeaderVariant[variant], className)} {...props} />
})

TableHeader.displayName = 'Table.Header'

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => {
  return <tbody ref={ref} className={className} {...props} />
})

TableBody.displayName = 'Table.Body'

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(({ className, ...props }, ref) => {
  return <tfoot ref={ref} className={cn(tableFooterBase, className)} {...props} />
})

TableFooter.displayName = 'Table.Footer'

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ align, className, ...props }, ref) => {
  const { variant, activeBreakpoint } = React.useContext(TableContext)
  const safeAlign = resolveRowAlign(align, activeBreakpoint)
  return (
    <tr
      ref={ref}
      className={cn(
        tableRowBase,
        tableRowVariant[variant],
        safeAlign ? tableRowAlignClassNames[safeAlign] : null,
        className,
      )}
      {...props}
    />
  )
})

TableRow.displayName = 'Table.Row'

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ justify, width, minWidth, maxWidth, p, px, py, pt, pr, pb, pl, style, className, ...props }, ref) => {
    const { activeBreakpoint } = React.useContext(TableContext)
    const safeJustify = resolveCellJustify(justify, activeBreakpoint)
    return (
      <th
        ref={ref}
        className={cn(tableHeadBase, safeJustify ? tableCellJustifyClassNames[safeJustify] : null, className)}
        style={getCellInlineStyles({
          width,
          minWidth,
          maxWidth,
          p,
          px,
          py,
          pt,
          pr,
          pb,
          pl,
          activeBreakpoint,
          style,
        })}
        {...props}
      />
    )
  },
)

TableHead.displayName = 'Table.Head'

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ justify, width, minWidth, maxWidth, p, px, py, pt, pr, pb, pl, style, className, ...props }, ref) => {
    const { activeBreakpoint } = React.useContext(TableContext)
    const safeJustify = resolveCellJustify(justify, activeBreakpoint)
    return (
      <td
        ref={ref}
        className={cn(tableCellBase, safeJustify ? tableCellJustifyClassNames[safeJustify] : null, className)}
        style={getCellInlineStyles({
          width,
          minWidth,
          maxWidth,
          p,
          px,
          py,
          pt,
          pr,
          pb,
          pl,
          activeBreakpoint,
          style,
        })}
        {...props}
      />
    )
  },
)

TableCell.displayName = 'Table.Cell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(({ className, ...props }, ref) => {
  return <caption ref={ref} className={cn(tableCaptionBase, className)} {...props} />
})

TableCaption.displayName = 'Table.Caption'

const TableRowHeaderCell = React.forwardRef<HTMLTableCellElement, TableRowHeaderCellProps>(
  ({ justify, width, minWidth, maxWidth, p, px, py, pt, pr, pb, pl, style, className, ...props }, ref) => {
    const { activeBreakpoint } = React.useContext(TableContext)
    const safeJustify = resolveCellJustify(justify, activeBreakpoint)
    return (
      <th
        ref={ref}
        scope="row"
        className={cn(tableRowHeaderCellBase, safeJustify ? tableCellJustifyClassNames[safeJustify] : null, className)}
        style={getCellInlineStyles({
          width,
          minWidth,
          maxWidth,
          p,
          px,
          py,
          pt,
          pr,
          pb,
          pl,
          activeBreakpoint,
          style,
        })}
        {...props}
      />
    )
  },
)

TableRowHeaderCell.displayName = 'Table.RowHeaderCell'

const TableColumnHeaderCell = React.forwardRef<HTMLTableCellElement, TableColumnHeaderCellProps>(
  ({ justify, width, minWidth, maxWidth, p, px, py, pt, pr, pb, pl, style, className, ...props }, ref) => {
    const { activeBreakpoint } = React.useContext(TableContext)
    const safeJustify = resolveCellJustify(justify, activeBreakpoint)
    return (
      <th
        ref={ref}
        scope="col"
        className={cn(
          tableColumnHeaderCellBase,
          safeJustify ? tableCellJustifyClassNames[safeJustify] : null,
          className,
        )}
        style={getCellInlineStyles({
          width,
          minWidth,
          maxWidth,
          p,
          px,
          py,
          pt,
          pr,
          pb,
          pl,
          activeBreakpoint,
          style,
        })}
        {...props}
      />
    )
  },
)

TableColumnHeaderCell.displayName = 'Table.ColumnHeaderCell'

export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
  RowHeaderCell: TableRowHeaderCell,
  ColumnHeaderCell: TableColumnHeaderCell,
}
