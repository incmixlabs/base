'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'
import type { TableSize } from '@/table/basic/Table'
import { tableSizeTokens } from '@/table/table.tokens'
import { tableFooterCellClass, tableFooterRootClass, tableFooterTableClass } from './table-footer.css'

export type TableFooterCell = {
  key: React.Key
  content?: React.ReactNode
  colSpan?: number
  width?: string
}

export interface TableFooterProps {
  cells: readonly TableFooterCell[]
  size?: TableSize
  className?: string
}

export function TableFooter({ cells, size = 'sm', className }: TableFooterProps) {
  const tokens = tableSizeTokens[size]

  return (
    <div className={cn(tableFooterRootClass, className)}>
      <table className={tableFooterTableClass}>
        <tfoot>
          <tr>
            {cells.map(cell => (
              <td
                key={cell.key}
                colSpan={cell.colSpan}
                className={tableFooterCellClass}
                style={{
                  paddingInline: tokens.paddingX,
                  paddingBlock: `calc(${tokens.paddingY} + 0.25rem)`,
                  fontSize: tokens.fontSize,
                  lineHeight: tokens.lineHeight,
                  ...(cell.width ? { width: cell.width } : null),
                }}
              >
                {cell.content}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
