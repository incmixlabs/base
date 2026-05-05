import * as React from 'react'
import type { Color } from '@/theme/tokens'
import type { AppShellProps } from './app-shell.props'
import type { AppShellDrawerTab } from './app-shell-machine'

export interface AppShellContextValue {
  /** Shared color for sidebar, secondary, search */
  color: Color
  /** Whether panels render as overlays (mobile or forced via prop) */
  overlay: boolean
  /** Whether the secondary panel is open (inline mode) */
  secondaryOpen: boolean
  setSecondaryOpen: (value: boolean | ((current: boolean) => boolean)) => void
  toggleSecondary: () => void
  /** Drawer state (used in overlay mode) */
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  drawerTab: AppShellDrawerTab
  setDrawerTab: (tab: AppShellDrawerTab) => void
  /** Content slots registered by Sidebar/Secondary via useLayoutEffect */
  sidebarContent: React.ReactNode
  setSidebarContent: React.Dispatch<React.SetStateAction<React.ReactNode>>
  secondaryContent: React.ReactNode
  setSecondaryContent: React.Dispatch<React.SetStateAction<React.ReactNode>>
  secondaryRegistered: boolean
  setSecondaryRegistered: (registered: boolean) => void
  secondarySide: AppShellProps.SecondarySide
  setSecondarySide: (side: AppShellProps.SecondarySide) => void
  primarySidebarVisible: boolean
  setPrimarySidebarVisible: (value: boolean | ((current: boolean) => boolean)) => void
  primaryOpenBeforeSecondary: boolean | null
  primaryOpenInitialized: boolean
  rememberPrimaryOpen: (open: boolean) => void
  clearRememberedPrimaryOpen: () => void
  markPrimaryOpenInitialized: () => void
  /** Tab labels for the drawer */
  navLabel: string
  secondaryLabel: string
  /** Max width of the overlay drawer */
  drawerWidth: string
}

export const AppShellContext = React.createContext<AppShellContextValue | null>(null)

export function useAppShell() {
  const ctx = React.useContext(AppShellContext)
  if (!ctx) throw new Error('useAppShell must be used within AppShell.Root')
  return ctx
}
