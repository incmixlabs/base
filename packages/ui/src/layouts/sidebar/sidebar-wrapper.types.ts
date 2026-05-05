import type * as React from 'react'
import type { SidebarCollapsible, SidebarColor, SidebarSide, SidebarVariant } from './sidebar.props'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

export type SidebarWrapperSubItem = {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  isActive?: boolean
}

export type SidebarWrapperItem = {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  // TODO(#150): Once MenuWrapper introduces a shared badge data type
  // (e.g. { text: string; color?: Color; variant?: BadgeVariant }),
  // replace ReactNode with a typed object so badges are fully data-driven.
  badge?: React.ReactNode
  tooltip?: string
  isActive?: boolean
  children?: SidebarWrapperSubItem[]
}

export type SidebarWrapperGroup = {
  group: string
  icon?: React.ComponentType<{ className?: string }>
  anchor?: 'top' | 'bottom'
  items: SidebarWrapperItem[]
  /** When true the group items can be collapsed by clicking the group label. */
  collapsible?: boolean
  /** Initial open state when collapsible. Defaults to true. */
  defaultOpen?: boolean
}

export type SidebarWrapperData = SidebarWrapperGroup[]

// ---------------------------------------------------------------------------
// Team / user data (rendered by the wrapper as header/footer)
// TODO(#150): SidebarWrapperTeam and SidebarWrapperUser share the same shape
// (icon, title, subtitle, action). Refactor both to use a shared generic menu
// item type (e.g. WrapperMenuItem<icon, title, subtitle, items>) once
// MenuWrapper is implemented.
// TODO(#150): Replace onClick with MenuWrapper data (items array) so the
// wrapper renders a DropdownMenu from data. Stories should pass mock menu
// items and the dropdown should work out of the box.
// ---------------------------------------------------------------------------

export type SidebarWrapperTeam = {
  /** Team or organisation name. */
  name: string
  /** Subtitle — plan tier, workspace label, etc. */
  subtitle?: string
  /** Icon component rendered inside a logo container. */
  logo?: React.ComponentType<{ className?: string }>
  /** Called when the team switcher row is clicked. */
  onClick?: () => void
}

export type SidebarWrapperUser = {
  /** Display name. */
  name: string
  /** Email or secondary text. */
  email?: string
  /** Avatar: a URL string (rendered as <img>) or initials string (rendered in a circle). */
  avatar?: string
  /** Called when the user row is clicked. */
  onClick?: () => void
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export type SidebarWrapperSearch = {
  /** Placeholder text for the search input. */
  placeholder?: string
  /** Callback when search value changes. */
  onChange?: (value: string) => void
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export type SidebarWrapperProps = {
  /** Sidebar navigation data — array of groups with items. */
  data?: SidebarWrapperData
  /** Remote URL to fetch sidebar data from. When provided, shows skeleton while loading. */
  remoteUrl?: string
  /** Team / org switcher rendered in the sidebar header. */
  team?: SidebarWrapperTeam
  /** User section rendered at the bottom of the sidebar. */
  user?: SidebarWrapperUser
  /** Search input rendered below the team header. */
  search?: SidebarWrapperSearch
  /** Which side to anchor the sidebar. */
  side?: SidebarSide
  /** Visual variant passed to the underlying Surface. */
  variant?: SidebarVariant
  /** Collapse behaviour on desktop. */
  collapsible?: SidebarCollapsible
  /** Semantic colour lane. */
  color?: SidebarColor
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean
  /** Controlled open state. */
  open?: boolean
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Override rendering of individual menu items. Return a single root element for the item row. */
  renderItem?: (item: SidebarWrapperItem, defaultRender: React.ReactNode) => React.ReactNode
  /** Override link rendering for router-aware consumers. Return the root link element without children; content is injected by the sidebar primitives. */
  renderLink?: (item: SidebarWrapperItem | SidebarWrapperSubItem) => React.ReactElement
  /** Override rendering of groups. */
  renderGroup?: (group: SidebarWrapperGroup, defaultRender: React.ReactNode) => React.ReactNode
  /** Animate a shared hover/focus background behind menu items. */
  hoverHighlight?: boolean
  /** Show the sidebar rail for drag-to-toggle. Defaults to true. */
  showRail?: boolean
  /** Additional className for the outer provider wrapper. */
  className?: string
  /** Optional sibling layout content (for example, Sidebar.Inset) rendered inside the same provider. */
  children?: React.ReactNode
}
