'use client'

import type * as React from 'react'
import type {
  CommandSearchItem,
  CommandSearchRouteGroup,
  CommandSearchRoutePage,
} from '@/layouts/command-search/CommandSearch'
import { CommandSearchProvider } from '@/layouts/command-search/CommandSearch'
import { AppShell, type AppShellRootProps } from './AppShell'

// ─── Types ──────────────────────────────────────────────────────────

export interface AppShellWrapperProps extends Omit<AppShellRootProps, 'children'> {
  /** Sidebar content — rendered inside AppShell.Sidebar */
  sidebar?: React.ReactNode
  /** Secondary panel content — rendered inside AppShell.Secondary */
  secondary?: React.ReactNode
  /** Header content — rendered between the triggers and the search */
  header?: React.ReactNode
  /** Search items for the command palette */
  searchItems?: CommandSearchItem[]
  /** Route groups for the command palette (alternative to searchItems) */
  searchRoutes?: CommandSearchRouteGroup[]
  /** Callback when a search route is selected */
  onSelectRoute?: (page: CommandSearchRoutePage, group: CommandSearchRouteGroup) => void
  /** Main content area */
  children?: React.ReactNode
}

// ─── Component ──────────────────────────────────────────────────────

export function AppShellWrapper({
  sidebar,
  secondary,
  header,
  searchItems,
  searchRoutes,
  onSelectRoute,
  children,
  ...rootProps
}: AppShellWrapperProps) {
  return (
    <CommandSearchProvider items={searchItems} routes={searchRoutes} onSelectRoute={onSelectRoute}>
      <AppShell.Root {...rootProps}>
        <AppShell.Body>
          {sidebar && <AppShell.Sidebar>{sidebar}</AppShell.Sidebar>}

          <AppShell.Main>
            <AppShell.Header>
              <AppShell.HeaderInner>
                <AppShell.HeaderStart>
                  <AppShell.SidebarTrigger />
                  {header}
                </AppShell.HeaderStart>
                <AppShell.HeaderEnd>
                  <AppShell.Search />
                </AppShell.HeaderEnd>
              </AppShell.HeaderInner>
            </AppShell.Header>

            <AppShell.Content>{children}</AppShell.Content>
          </AppShell.Main>

          {secondary && (
            <AppShell.Secondary side="right" scroll="auto">
              {secondary}
            </AppShell.Secondary>
          )}
        </AppShell.Body>
      </AppShell.Root>
    </CommandSearchProvider>
  )
}

AppShellWrapper.displayName = 'AppShellWrapper'
