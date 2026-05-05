'use client'

import * as React from 'react'
import { DynamicLucideIcon } from '../button/dynamic-icon'

export type TabIconPosition = 'left' | 'right' | 'only'

export type TabIconItem = {
  value: string
  icon: string
  label?: string
}

export type TabIconsConfig = {
  position: TabIconPosition
  icons: TabIconItem[]
}

function defaultIconLabel(icon: string) {
  return icon
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(segment => segment.toUpperCase())
    .join(' ')
}

function extractText(node: React.ReactNode): string | undefined {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) {
    const text = node.map(extractText).filter(Boolean).join(' ').trim()
    return text || undefined
  }
  if (React.isValidElement(node)) return extractText((node.props as { children?: React.ReactNode }).children)
  return undefined
}

export function getTabIconItem(icons: TabIconsConfig | undefined, value: string) {
  return icons?.icons.find(item => item.value === value)
}

export function renderTabLabelWithIcon({
  children,
  value,
  icons,
}: {
  children: React.ReactNode
  value: string
  icons: TabIconsConfig | undefined
}) {
  const iconItem = getTabIconItem(icons, value)
  if (!iconItem) {
    if (process.env.NODE_ENV !== 'production' && icons) {
      console.warn(`[tab-icons] Missing icon mapping for tab value "${value}"`)
    }
    return {
      ariaLabel: undefined,
      content: children,
      iconOnly: false,
      tooltipContent: undefined,
    }
  }

  const icon = <DynamicLucideIcon name={iconItem.icon} className="h-4 w-4 shrink-0" />
  const fallbackLabel = iconItem.label ?? extractText(children) ?? defaultIconLabel(iconItem.icon)

  if (icons?.position === 'only') {
    return {
      ariaLabel: fallbackLabel,
      content: (
        <>
          {icon}
          <span className="sr-only">{fallbackLabel}</span>
        </>
      ),
      iconOnly: true,
      tooltipContent: fallbackLabel,
    }
  }

  if (icons?.position === 'right') {
    return {
      ariaLabel: undefined,
      content: (
        <span className="inline-flex items-center gap-1.5">
          <span>{children}</span>
          {icon}
        </span>
      ),
      iconOnly: false,
      tooltipContent: undefined,
    }
  }

  return {
    ariaLabel: undefined,
    content: (
      <span className="inline-flex items-center gap-1.5">
        {icon}
        <span>{children}</span>
      </span>
    ),
    iconOnly: false,
    tooltipContent: undefined,
  }
}
