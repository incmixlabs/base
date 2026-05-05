'use client'

import { cn } from '@/lib/utils'
import { AppShell } from '../app-shell/AppShell'
import type {
  CommandSearchItem,
  CommandSearchRouteGroup,
  CommandSearchRoutePage,
} from '../command-search/CommandSearch'
import { Sidebar } from './Sidebar'
import { SidebarWrapperContent, type SidebarWrapperProps } from './SidebarWrapper'

export interface SidebarWrapperShellProps extends SidebarWrapperProps {
  headerStart?: React.ReactNode
  headerEnd?: React.ReactNode
  showThemeToggle?: boolean
  searchItems?: CommandSearchItem[]
  searchRoutes?: CommandSearchRouteGroup[]
  onSelectRoute?: (page: CommandSearchRoutePage, group: CommandSearchRouteGroup) => void
  searchTriggerLabel?: string
  searchTriggerClassName?: string
  secondary?: React.ReactNode
  secondaryTitle?: React.ReactNode
  secondaryWidth?: string
  secondaryPanelClassName?: string
  defaultSecondaryOpen?: boolean
  mainClassName?: string
}

export function SidebarWrapperShell({
  data,
  remoteUrl,
  team,
  user,
  search,
  renderLink,
  side,
  variant,
  collapsible,
  color,
  defaultOpen = true,
  open,
  onOpenChange,
  renderItem,
  renderGroup,
  hoverHighlight = true,
  showRail = true,
  className,
  headerStart,
  headerEnd,
  showThemeToggle,
  searchItems,
  searchRoutes,
  searchTriggerLabel = 'Search...',
  searchTriggerClassName,
  secondary,
  secondaryTitle = 'Secondary panel',
  secondaryWidth = '9rem',
  secondaryPanelClassName,
  defaultSecondaryOpen = true,
  mainClassName,
  children,
}: SidebarWrapperShellProps) {
  return (
    <AppShell.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      defaultSecondaryOpen={defaultSecondaryOpen}
      secondaryLabel={typeof secondaryTitle === 'string' ? secondaryTitle : 'Secondary panel'}
      className={cn('bg-background', className)}
    >
      <AppShell.Body className="min-w-0">
        <AppShell.Sidebar variant={variant} collapsible={collapsible} color={color} side={side}>
          <SidebarWrapperContent
            data={data}
            remoteUrl={remoteUrl}
            team={team}
            user={user}
            search={search}
            renderLink={renderLink}
            renderItem={renderItem}
            renderGroup={renderGroup}
            hoverHighlight={hoverHighlight}
          />
          {showRail ? <Sidebar.Rail /> : null}
        </AppShell.Sidebar>

        <AppShell.Main className={cn('overflow-x-hidden', mainClassName)}>
          <AppShell.Header>
            <AppShell.HeaderInner>
              <AppShell.HeaderStart>
                <AppShell.SidebarTrigger />
                {headerStart}
              </AppShell.HeaderStart>
              <AppShell.HeaderEnd showThemeToggle={showThemeToggle}>
                {searchItems || searchRoutes ? (
                  <AppShell.Search triggerLabel={searchTriggerLabel} className={searchTriggerClassName} />
                ) : null}
                {headerEnd}
              </AppShell.HeaderEnd>
            </AppShell.HeaderInner>
          </AppShell.Header>
          {children}
        </AppShell.Main>

        {secondary ? (
          <AppShell.Secondary
            side="right"
            width={secondaryWidth}
            className={cn('py-6 ps-3', secondaryPanelClassName)}
            aria-label={typeof secondaryTitle === 'string' ? secondaryTitle : 'Secondary panel'}
          >
            <div className="sticky top-14 h-[calc(100svh-3.5rem-1.5rem)] overflow-y-auto pe-3">{secondary}</div>
          </AppShell.Secondary>
        ) : null}
      </AppShell.Body>
    </AppShell.Root>
  )
}

SidebarWrapperShell.displayName = 'SidebarWrapperShell'
