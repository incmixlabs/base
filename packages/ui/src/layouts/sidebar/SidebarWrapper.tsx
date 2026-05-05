'use client'

import { ChevronRight, ChevronsUpDown, Search } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { Badge } from '@/elements/badge/Badge'
import { Image } from '@/elements/image/Image'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Sidebar, useIconCollapsed, useSidebar } from './Sidebar'
import {
  sidebarGroupedMenuButton,
  sidebarGroupedMenuSubHeader,
  sidebarGroupedMenuSubHeaderIcon,
  sidebarGroupedMenuSubPanel,
  sidebarInitialsText,
  sidebarMetaText,
  sidebarTitleText,
} from './Sidebar.css'
import type {
  SidebarWrapperData,
  SidebarWrapperGroup,
  SidebarWrapperItem,
  SidebarWrapperProps,
  SidebarWrapperSearch,
  SidebarWrapperSubItem,
  SidebarWrapperTeam,
  SidebarWrapperUser,
} from './sidebar-wrapper.types'

// ---------------------------------------------------------------------------
// Internal: team header
// ---------------------------------------------------------------------------

function TeamHeader({ team }: { team: SidebarWrapperTeam }) {
  const Logo = team.logo
  const iconMode = useIconCollapsed()
  const teamInitials = team.name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <Sidebar.Group>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            size="lg"
            className="gap-3"
            onClick={team.onClick}
            aria-label={team.name}
            tooltip={team.name}
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {Logo ? (
                <Logo className="size-4" />
              ) : (
                <span className={cn(sidebarInitialsText, 'font-medium')}>{teamInitials}</span>
              )}
            </div>
            {!iconMode && (
              <div className="flex flex-col leading-tight">
                <span className={cn(sidebarTitleText, 'truncate font-semibold')}>{team.name}</span>
                {team.subtitle && (
                  <span className={cn(sidebarMetaText, 'truncate text-sidebar-foreground/70')}>{team.subtitle}</span>
                )}
              </div>
            )}
            {team.onClick && !iconMode && <ChevronsUpDown className="ms-auto size-4 text-sidebar-foreground/50" />}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  )
}

// ---------------------------------------------------------------------------
// Internal: search
// ---------------------------------------------------------------------------

function SearchSection({ search }: { search: SidebarWrapperSearch }) {
  return (
    <Sidebar.Group>
      <Sidebar.Input
        placeholder={search.placeholder ?? 'Search...'}
        leftIcon={<Search />}
        onChange={e => search.onChange?.((e.target as HTMLInputElement).value)}
      />
    </Sidebar.Group>
  )
}

// ---------------------------------------------------------------------------
// Internal: user footer
// ---------------------------------------------------------------------------

function UserFooter({ user }: { user: SidebarWrapperUser }) {
  const iconMode = useIconCollapsed()
  const isUrl = user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/'))
  const initials =
    !isUrl && user.avatar
      ? user.avatar
      : user.name
          .split(' ')
          .filter(Boolean)
          .map(w => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()

  return (
    <Sidebar.Group anchor="bottom">
      <Sidebar.Separator />
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            size="lg"
            className="gap-3"
            onClick={user.onClick}
            aria-label={user.name}
            tooltip={user.name}
          >
            {isUrl ? (
              <Image src={user.avatar} alt={user.name} className="size-8 rounded-full" />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                <span className={cn(sidebarInitialsText, 'font-medium')}>{initials}</span>
              </div>
            )}
            {!iconMode && (
              <div className="flex flex-col leading-tight">
                <span className={cn(sidebarTitleText, 'truncate font-semibold')}>{user.name}</span>
                {user.email && (
                  <span className={cn(sidebarMetaText, 'truncate text-sidebar-foreground/70')}>{user.email}</span>
                )}
              </div>
            )}
            {user.onClick && !iconMode && <ChevronsUpDown className="ms-auto size-4 text-sidebar-foreground/50" />}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  )
}

// ---------------------------------------------------------------------------
// Internal: collapsible menu item with children
// ---------------------------------------------------------------------------

function CollapsibleMenuItem({
  item,
  renderLink,
  renderItem,
}: {
  item: SidebarWrapperItem
  renderLink?: SidebarWrapperProps['renderLink']
  renderItem?: SidebarWrapperProps['renderItem']
}) {
  const [open, setOpen] = React.useState(() => item.children?.some(c => c.isActive) ?? false)
  const iconMode = useIconCollapsed()

  const hasActiveChild = item.children?.some(c => c.isActive) ?? false

  React.useEffect(() => {
    if (hasActiveChild) setOpen(true)
  }, [hasActiveChild])

  const hasBadge = item.badge !== undefined && !iconMode
  const Icon = item.icon

  const defaultRender = (
    <Sidebar.MenuItem>
      {hasBadge ? (
        <div className="flex items-center">
          <Sidebar.MenuButton
            tooltip={item.tooltip ?? item.label}
            hasActiveChild={hasActiveChild}
            isActive={item.isActive}
            aria-expanded={open}
            className="flex-1 min-w-0 font-medium"
            onClick={() => {
              item.onClick?.()
              setOpen(prev => !prev)
            }}
          >
            {Icon && <Icon className="size-4 shrink-0" />}
            <span>{item.label}</span>
            {!iconMode && (
              <ChevronRight
                className={cn(
                  'ms-auto size-4 shrink-0 transition-transform duration-150',
                  open ? 'rotate-90' : 'rotate-0',
                )}
              />
            )}
          </Sidebar.MenuButton>
          <Badge size="xs" variant="soft" className="shrink-0 me-1">
            {item.badge}
          </Badge>
        </div>
      ) : (
        <Sidebar.MenuButton
          tooltip={item.tooltip ?? item.label}
          hasActiveChild={hasActiveChild}
          isActive={item.isActive}
          aria-expanded={open}
          className="font-medium"
          onClick={() => {
            item.onClick?.()
            setOpen(prev => !prev)
          }}
        >
          {Icon && <Icon className="size-4 shrink-0" />}
          <span>{item.label}</span>
          {!iconMode && (
            <ChevronRight
              className={cn(
                'ms-auto size-4 shrink-0 transition-transform duration-150',
                open ? 'rotate-90' : 'rotate-0',
              )}
            />
          )}
        </Sidebar.MenuButton>
      )}
      <Sidebar.MenuSub open={iconMode ? undefined : open}>
        {item.children?.map((sub, idx) => (
          <SubMenuItem key={`${sub.label}-${idx}`} item={sub} renderLink={renderLink} />
        ))}
      </Sidebar.MenuSub>
    </Sidebar.MenuItem>
  )

  return renderItem ? renderItem(item, defaultRender) : defaultRender
}

// ---------------------------------------------------------------------------
// Internal: leaf menu item (no children)
// ---------------------------------------------------------------------------

function LeafMenuItem({
  item,
  renderLink,
  renderItem,
}: {
  item: SidebarWrapperItem
  renderLink?: SidebarWrapperProps['renderLink']
  renderItem?: SidebarWrapperProps['renderItem']
}) {
  const Icon = item.icon
  const iconMode = useIconCollapsed()

  const buttonProps: Record<string, unknown> = {}
  if (item.href) {
    buttonProps.render = renderLink?.(item) ?? (
      // biome-ignore lint/a11y/useAnchorContent: children injected by Base UI useRender
      <a href={item.href} aria-label={item.label} />
    )
  }
  if (item.onClick) {
    buttonProps.onClick = item.onClick
  }

  const hasBadge = item.badge !== undefined && !iconMode
  const defaultRender = (
    <Sidebar.MenuItem className={hasBadge ? 'flex items-center' : undefined}>
      <Sidebar.MenuButton
        tooltip={item.tooltip ?? item.label}
        isActive={item.isActive}
        className={cn('font-medium', hasBadge && 'flex-1 min-w-0')}
        {...buttonProps}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span>{item.label}</span>
      </Sidebar.MenuButton>
      {hasBadge && (
        <Badge size="xs" variant="soft" className="shrink-0 me-1">
          {item.badge}
        </Badge>
      )}
    </Sidebar.MenuItem>
  )

  return renderItem ? renderItem(item, defaultRender) : defaultRender
}

// ---------------------------------------------------------------------------
// Internal: sub-menu item
// ---------------------------------------------------------------------------

function SubMenuItem({
  item,
  renderLink,
}: {
  item: SidebarWrapperSubItem
  renderLink?: SidebarWrapperProps['renderLink']
}) {
  const Icon = item.icon
  const linkProps: Record<string, unknown> = {}
  if (item.href) {
    if (renderLink) {
      linkProps.render = renderLink(item)
    } else {
      linkProps.href = item.href
    }
  } else if (item.onClick) {
    linkProps.render = <button type="button" />
  }
  if (item.onClick) {
    linkProps.onClick = (e: React.MouseEvent) => {
      if (!item.href) e.preventDefault()
      item.onClick?.()
    }
  }

  return (
    <Sidebar.MenuSubItem>
      <Sidebar.MenuSubButton size="sm" isActive={item.isActive} {...linkProps}>
        {Icon && <Icon className="size-4 shrink-0" />}
        <span>{item.label}</span>
      </Sidebar.MenuSubButton>
    </Sidebar.MenuSubItem>
  )
}

function GroupedIconPopupItem({
  item,
  itemKey,
  renderLink,
  renderItem,
  onSelect,
}: {
  item: SidebarWrapperItem
  itemKey: string
  renderLink?: SidebarWrapperProps['renderLink']
  renderItem?: SidebarWrapperProps['renderItem']
  onSelect: () => void
}) {
  const ItemIcon = item.icon
  const linkProps: Record<string, unknown> = {}
  if (item.href) {
    if (renderLink) {
      linkProps.render = renderLink(item)
    } else {
      linkProps.href = item.href
    }
  } else if (item.onClick) {
    linkProps.render = <button type="button" />
  }
  if (item.href || item.onClick) {
    linkProps.onClick = (event: React.MouseEvent) => {
      if (!item.href) event.preventDefault()
      item.onClick?.()
      onSelect()
    }
  }

  const leafRender = (
    <Sidebar.MenuSubItem key={itemKey}>
      <Sidebar.MenuSubButton size="md" isActive={item.isActive} className="px-2 py-1.5 font-medium" {...linkProps}>
        {ItemIcon ? <ItemIcon className="size-4 shrink-0" /> : null}
        <span>{item.label}</span>
      </Sidebar.MenuSubButton>
    </Sidebar.MenuSubItem>
  )

  const parentRow = renderItem ? renderItem(item, leafRender) : leafRender

  if (!item.children || item.children.length === 0) {
    return parentRow
  }

  const defaultRender = (
    <React.Fragment key={itemKey}>
      {parentRow}
      {item.children.map((child, childIdx) => (
        <Sidebar.MenuSubItem key={`${itemKey}-child-${child.label}-${childIdx}`}>
          <Sidebar.MenuSubButton
            size="sm"
            isActive={child.isActive}
            className="px-2 py-1.5 ps-8"
            render={
              child.onClick && !child.href ? <button type="button" /> : child.href ? renderLink?.(child) : undefined
            }
            href={child.href && !renderLink ? child.href : undefined}
            onClick={
              child.href || child.onClick
                ? (event: React.MouseEvent) => {
                    if (!child.href) event.preventDefault()
                    child.onClick?.()
                    onSelect()
                  }
                : undefined
            }
          >
            {child.icon ? <child.icon className="size-4 shrink-0" /> : null}
            <span>{child.label}</span>
          </Sidebar.MenuSubButton>
        </Sidebar.MenuSubItem>
      ))}
    </React.Fragment>
  )

  return defaultRender
}

// ---------------------------------------------------------------------------
// Internal: skeleton loading state
// ---------------------------------------------------------------------------

function SidebarWrapperSkeleton() {
  return (
    <Sidebar.Group>
      <Sidebar.Menu>
        {Array.from({ length: 6 }).map((_, i) => (
          <Sidebar.MenuItem key={i}>
            <Sidebar.MenuSkeleton showIcon />
          </Sidebar.MenuItem>
        ))}
      </Sidebar.Menu>
    </Sidebar.Group>
  )
}

// ---------------------------------------------------------------------------
// Internal: group renderer
// ---------------------------------------------------------------------------

function GroupRenderer({
  group,
  renderLink,
  renderItem,
  renderGroup,
  hoverHighlight,
}: {
  group: SidebarWrapperGroup
  renderLink?: SidebarWrapperProps['renderLink']
  renderItem?: SidebarWrapperProps['renderItem']
  renderGroup?: SidebarWrapperProps['renderGroup']
  hoverHighlight?: SidebarWrapperProps['hoverHighlight']
}) {
  const hasActiveItem = group.items.some(item => item.isActive || item.children?.some(c => c.isActive))
  const [open, setOpen] = React.useState(() => group.defaultOpen ?? hasActiveItem ?? true)
  const iconMode = useIconCollapsed()
  const [iconMenuOpen, setIconMenuOpen] = React.useState(false)
  const iconMenuRef = React.useRef<HTMLLIElement | null>(null)

  // Auto-expand when an item becomes active (e.g. navigation)
  React.useEffect(() => {
    if (hasActiveItem) setOpen(true)
  }, [hasActiveItem])

  React.useEffect(() => {
    if (!iconMode) {
      setIconMenuOpen(false)
    }
  }, [iconMode])

  React.useEffect(() => {
    if (!iconMode || !iconMenuOpen) return

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node | null
      if (target && iconMenuRef.current?.contains(target)) return
      setIconMenuOpen(false)
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (target && iconMenuRef.current?.contains(target)) return
      setIconMenuOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIconMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [iconMode, iconMenuOpen])

  const items = (
    <Sidebar.Menu hoverHighlight={hoverHighlight}>
      {group.items.map((item, idx) =>
        item.children && item.children.length > 0 ? (
          <CollapsibleMenuItem
            key={`${item.label}-${idx}`}
            item={item}
            renderLink={renderLink}
            renderItem={renderItem}
          />
        ) : (
          <LeafMenuItem key={`${item.label}-${idx}`} item={item} renderLink={renderLink} renderItem={renderItem} />
        ),
      )}
    </Sidebar.Menu>
  )

  const Icon = group.icon
  const iconMenuRender =
    iconMode && Icon ? (
      <Sidebar.Group anchor={group.anchor}>
        <Sidebar.Menu>
          <Sidebar.MenuItem ref={iconMenuRef}>
            <Sidebar.MenuButton
              tooltip={group.group}
              isActive={hasActiveItem}
              aria-haspopup="menu"
              aria-expanded={iconMenuOpen}
              onClick={() => setIconMenuOpen(prev => !prev)}
              className={sidebarGroupedMenuButton}
            >
              <Icon className="size-4 shrink-0" />
              <span>{group.group}</span>
            </Sidebar.MenuButton>
            <Sidebar.MenuSub
              className={sidebarGroupedMenuSubPanel}
              style={{
                visibility: iconMenuOpen ? 'visible' : 'hidden',
                pointerEvents: iconMenuOpen ? 'auto' : 'none',
                opacity: iconMenuOpen ? 1 : 0,
              }}
            >
              <li role="presentation">
                <Flex align="center" gap="2" className={sidebarGroupedMenuSubHeader}>
                  <Icon className={cn('size-4 shrink-0', sidebarGroupedMenuSubHeaderIcon)} aria-hidden="true" />
                  <span className="font-semibold">{group.group}</span>
                </Flex>
              </li>
              {group.items.map((item, idx) => (
                <GroupedIconPopupItem
                  key={`${item.label}-${idx}`}
                  item={item}
                  itemKey={`${item.label}-${idx}`}
                  renderLink={renderLink}
                  renderItem={renderItem}
                  onSelect={() => setIconMenuOpen(false)}
                />
              ))}
            </Sidebar.MenuSub>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
    ) : null

  const defaultRender = (
    <Sidebar.Group anchor={group.anchor}>
      <Sidebar.GroupLabel>
        {group.collapsible && !iconMode ? (
          <button
            type="button"
            className="flex w-full items-center gap-1"
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
          >
            {Icon ? <Icon className="size-4 shrink-0 text-sidebar-foreground/70" /> : null}
            <span className="flex-1 text-left">{group.group}</span>
            <ChevronRight
              className={cn(
                'size-3.5 shrink-0 text-sidebar-foreground/50 transition-transform duration-150',
                open ? 'rotate-90' : 'rotate-0',
              )}
            />
          </button>
        ) : (
          <span className="flex items-center gap-2">
            {Icon ? <Icon className="size-4 shrink-0 text-sidebar-foreground/70" /> : null}
            <span>{group.group}</span>
          </span>
        )}
      </Sidebar.GroupLabel>
      {group.collapsible && !iconMode ? (
        <AnimatePresence initial={false}>
          {open ? (
            <m.div
              key="sidebar-wrapper-group-items"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1, pointerEvents: 'auto' as const }}
              exit={{ height: 0, opacity: 0, pointerEvents: 'none' as const }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              {items}
            </m.div>
          ) : null}
        </AnimatePresence>
      ) : (
        items
      )}
    </Sidebar.Group>
  )

  const resolvedDefaultRender = iconMenuRender ?? defaultRender

  return renderGroup ? renderGroup(group, resolvedDefaultRender) : resolvedDefaultRender
}

// ---------------------------------------------------------------------------
// Internal: inner content
// ---------------------------------------------------------------------------

function SidebarWrapperContentInner({
  resolvedData,
  loading,
  error,
  team,
  user,
  search,
  renderLink,
  renderItem,
  renderGroup,
  hoverHighlight,
}: {
  resolvedData: SidebarWrapperData | undefined
  loading: boolean
  error: string | null
} & Pick<
  SidebarWrapperProps,
  'team' | 'user' | 'search' | 'renderLink' | 'renderItem' | 'renderGroup' | 'hoverHighlight'
>) {
  const iconMode = useIconCollapsed()
  const showLoading = loading
  const showResolved = !loading

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {(team || search) && (
        <div className="shrink-0">
          {team && <TeamHeader team={team} />}
          {search && <SearchSection search={search} />}
        </div>
      )}

      <Sidebar.Content className="relative min-h-0 flex-1" style={!iconMode ? { overflowX: 'hidden' } : undefined}>
        <div
          aria-hidden={!showLoading}
          className={cn(
            'transition-opacity duration-300',
            showLoading ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0',
          )}
        >
          <SidebarWrapperSkeleton />
        </div>
        <div
          className={cn(
            'transition-[opacity,transform] duration-300',
            showResolved
              ? 'opacity-100 translate-y-0 animate-in fade-in-0 slide-in-from-top-1'
              : 'opacity-0 translate-y-1',
            !showResolved && 'pointer-events-none',
          )}
        >
          {error ? (
            <Sidebar.Group>
              <Sidebar.GroupLabel className="text-error">{error}</Sidebar.GroupLabel>
            </Sidebar.Group>
          ) : (
            <>
              {resolvedData?.map((group, idx) => (
                <GroupRenderer
                  key={`${group.group}-${idx}`}
                  group={group}
                  renderLink={renderLink}
                  renderItem={renderItem}
                  renderGroup={renderGroup}
                  hoverHighlight={hoverHighlight}
                />
              ))}
              {user && <UserFooter user={user} />}
            </>
          )}
        </div>
      </Sidebar.Content>
    </div>
  )
}

function SidebarWrapperInner({
  resolvedData,
  loading,
  error,
  team,
  user,
  search,
  renderLink,
  renderItem,
  renderGroup,
  hoverHighlight,
  showRail = true,
  variant,
  collapsible,
  side,
  color,
}: {
  resolvedData: SidebarWrapperData | undefined
  loading: boolean
  error: string | null
} & Pick<
  SidebarWrapperProps,
  | 'team'
  | 'user'
  | 'search'
  | 'renderLink'
  | 'renderItem'
  | 'renderGroup'
  | 'hoverHighlight'
  | 'showRail'
  | 'variant'
  | 'collapsible'
  | 'side'
  | 'color'
>) {
  return (
    <Sidebar.Root variant={variant} collapsible={collapsible} side={side} color={color}>
      <SidebarWrapperContentInner
        resolvedData={resolvedData}
        loading={loading}
        error={error}
        team={team}
        user={user}
        search={search}
        renderLink={renderLink}
        renderItem={renderItem}
        renderGroup={renderGroup}
        hoverHighlight={hoverHighlight}
      />
      {showRail && <Sidebar.Rail />}
    </Sidebar.Root>
  )
}

function useResolvedSidebarWrapperData(data?: SidebarWrapperData, remoteUrl?: string) {
  const [remoteData, setRemoteData] = React.useState<SidebarWrapperData | undefined>(undefined)
  const [loading, setLoading] = React.useState(() => !!remoteUrl && data === undefined)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!remoteUrl || data !== undefined) {
      setRemoteData(undefined)
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    setRemoteData(undefined)
    setLoading(true)
    setError(null)

    fetch(remoteUrl, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch sidebar data: ${res.status}`)
        return res.json() as Promise<SidebarWrapperData>
      })
      .then(json => {
        setRemoteData(json)
        setLoading(false)
      })
      .catch(err => {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load sidebar data')
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [remoteUrl, data])

  return {
    resolvedData: data ?? remoteData,
    loading,
    error,
  }
}

function SidebarWrapperContent({
  data,
  remoteUrl,
  team,
  user,
  search,
  renderLink,
  renderItem,
  renderGroup,
  hoverHighlight,
}: Pick<
  SidebarWrapperProps,
  'data' | 'remoteUrl' | 'team' | 'user' | 'search' | 'renderLink' | 'renderItem' | 'renderGroup' | 'hoverHighlight'
>) {
  const { resolvedData, loading, error } = useResolvedSidebarWrapperData(data, remoteUrl)

  return (
    <SidebarWrapperContentInner
      resolvedData={resolvedData}
      loading={loading}
      error={error}
      team={team}
      user={user}
      search={search}
      renderLink={renderLink}
      renderItem={renderItem}
      renderGroup={renderGroup}
      hoverHighlight={hoverHighlight}
    />
  )
}

// ---------------------------------------------------------------------------
// Public: SidebarWrapper
// ---------------------------------------------------------------------------

function SidebarWrapper({
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
  hoverHighlight,
  showRail = true,
  className,
  children,
}: SidebarWrapperProps) {
  const { resolvedData, loading, error } = useResolvedSidebarWrapperData(data, remoteUrl)

  return (
    <Sidebar.Provider
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn('min-h-svh', className)}
    >
      <SidebarWrapperInner
        resolvedData={resolvedData}
        loading={loading}
        error={error}
        team={team}
        user={user}
        search={search}
        renderLink={renderLink}
        renderItem={renderItem}
        renderGroup={renderGroup}
        hoverHighlight={hoverHighlight}
        showRail={showRail}
        variant={variant}
        collapsible={collapsible}
        side={side}
        color={color}
      />
      {children}
    </Sidebar.Provider>
  )
}

SidebarWrapper.displayName = 'SidebarWrapper'
SidebarWrapperContent.displayName = 'SidebarWrapperContent'

export type {
  SidebarWrapperData,
  SidebarWrapperGroup,
  SidebarWrapperItem,
  SidebarWrapperProps,
  SidebarWrapperSearch,
  SidebarWrapperSubItem,
  SidebarWrapperTeam,
  SidebarWrapperUser,
} from './sidebar-wrapper.types'
// Internal-only export for SidebarWrapperShell. Intentionally not re-exported from layouts/index.ts.
export { SidebarWrapper, SidebarWrapperContent, useSidebar }
