import type { ReactNode } from 'react'

export type SidebarNavItemSpec = {
  id: string
  label: string
  icon?: string
  href?: string
  tooltip?: string
  badge?: ReactNode
  active?: boolean
}

export type SidebarNavGroupSpec = {
  id: string
  label?: string
  anchor?: 'top' | 'bottom'
  items: readonly SidebarNavItemSpec[]
}

export type SidebarModel = {
  title: string
  groups: readonly SidebarNavGroupSpec[]
}

export type SidebarSpec = SidebarModel

export function buildSidebarModel(spec: SidebarSpec): SidebarModel {
  return {
    title: spec.title,
    groups: spec.groups.map(group => ({
      id: group.id,
      label: group.label,
      anchor: group.anchor,
      items: group.items.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        href: item.href,
        tooltip: item.tooltip ?? item.label,
        badge: item.badge,
        active: item.active,
      })),
    })),
  }
}
