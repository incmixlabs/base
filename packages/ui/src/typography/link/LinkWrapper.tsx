'use client'

import * as React from 'react'
import type { Responsive, Spacing } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { containerBreakpointKeys } from '@/theme/tokens'
import { Link, type LinkProps } from './Link'
import { linkWrapperGap, linkWrapperGapResponsive, linkWrapperInner, linkWrapperQueryHost } from './LinkWrapper.css'

export type LinkWrapperItem = {
  id: string
  label: React.ReactNode
  href: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  color?: LinkProps['color']
  underline?: LinkProps['underline']
  size?: LinkProps['size']
  weight?: LinkProps['weight']
  wrap?: LinkProps['wrap']
  trim?: LinkProps['trim']
  truncate?: LinkProps['truncate']
  highContrast?: LinkProps['highContrast']
  className?: string
  onSelect?: () => void
}

export type LinkWrapperData = LinkWrapperItem[]
export type LinkWrapperRenderItem = (item: LinkWrapperItem, defaultRender: React.ReactNode) => React.ReactNode

export interface LinkWrapperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  data: LinkWrapperData
  direction?: 'row' | 'column'
  gap?: Responsive<Spacing>
  onItemSelect?: (item: LinkWrapperItem) => void
  renderItem?: LinkWrapperRenderItem
}

type LinkWrapperGapValue = keyof typeof linkWrapperGap

function resolveGapClass(value: Spacing): string {
  return (linkWrapperGap[value as LinkWrapperGapValue] ?? linkWrapperGap['2']) as string
}

function getResponsiveGapClasses(gap: Responsive<Spacing> | undefined): string {
  if (!gap) return ''
  if (typeof gap === 'string') return resolveGapClass(gap)

  const classes = [resolveGapClass(gap.initial ?? '2')]
  for (const breakpoint of containerBreakpointKeys) {
    const nextGap = gap[breakpoint]
    if (nextGap) {
      classes.push(
        (linkWrapperGapResponsive[breakpoint][nextGap as LinkWrapperGapValue] ?? resolveGapClass(nextGap)) as string,
      )
    }
  }
  return classes.join(' ')
}

export function LinkWrapper({
  data,
  direction = 'column',
  gap = '2',
  onItemSelect,
  renderItem,
  className,
  style,
  ...props
}: LinkWrapperProps) {
  const content = data.map(item => {
    const resolvedRel =
      item.target === '_blank'
        ? Array.from(new Set(['noopener', 'noreferrer', ...(item.rel?.split(/\s+/).filter(Boolean) ?? [])])).join(' ')
        : item.rel

    const defaultRender = (
      <Link
        href={item.href}
        target={item.target}
        rel={resolvedRel}
        color={item.color}
        underline={item.underline}
        size={item.size}
        weight={item.weight}
        wrap={item.wrap}
        trim={item.trim}
        truncate={item.truncate}
        highContrast={item.highContrast}
        className={item.className}
        onClick={() => {
          item.onSelect?.()
          onItemSelect?.(item)
        }}
      >
        {item.label}
      </Link>
    )

    const rendered = renderItem ? renderItem(item, defaultRender) : defaultRender
    return <React.Fragment key={item.id}>{rendered}</React.Fragment>
  })

  const directionClasses = direction === 'row' ? 'flex-row flex-wrap items-center' : 'flex-col'

  if (typeof gap === 'string') {
    return (
      <div className={cn(linkWrapperInner, directionClasses, resolveGapClass(gap), className)} style={style} {...props}>
        {content}
      </div>
    )
  }

  return (
    <div {...props} className={cn(linkWrapperQueryHost, className)} style={style}>
      <div className={cn(linkWrapperInner, directionClasses, getResponsiveGapClasses(gap))}>{content}</div>
    </div>
  )
}
