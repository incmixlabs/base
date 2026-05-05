'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'
import { tableShellBodyClass, tableShellFooterClass, tableShellRootClass } from './table-shell.css'

export interface TableShellProps extends React.HTMLAttributes<HTMLDivElement> {
  footer?: React.ReactNode
}

export function TableShell({ className, children, footer, ...props }: TableShellProps) {
  return (
    <div className={cn(tableShellRootClass, className)} {...props}>
      <div className={tableShellBodyClass}>{children}</div>
      {footer ? <div className={tableShellFooterClass}>{footer}</div> : null}
    </div>
  )
}
