'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'
import { headerRoot, headerSticky } from './Header.css'

export interface HeaderProps extends React.ComponentProps<'header'> {
  sticky?: boolean
}

export function Header({ sticky = true, className, ...props }: HeaderProps) {
  return (
    <header data-slot="app-shell-header" className={cn(headerRoot, sticky && headerSticky, className)} {...props} />
  )
}
