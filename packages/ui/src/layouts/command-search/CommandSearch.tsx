'use client'

import { CommandDialog, Command as CommandMenu } from 'cmdk-base'
import { Search } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import {
  dialogBackdropBase,
  dialogBackdropBaseCls,
  dialogPopupBase,
  dialogPopupBaseCls,
} from '@/elements/dialog/dialog.css'
import { cn } from '@/lib/utils'
import type { Color } from '@/theme/tokens'
import { Kbd } from '@/typography/kbd/Kbd'
import {
  commandDialogContent,
  commandDialogRoot,
  commandEmptyState,
  commandGroup,
  commandInput,
  commandInputRow,
  commandItem,
  commandItemDescription,
  commandItemLabel,
  commandItemText,
  commandList,
  commandSearchIcon,
  commandSearchTrigger,
  shortcutKey,
  shortcutRow,
} from './CommandSearch.css'

export type CommandSearchItem = {
  id: string
  label: string
  description?: string
  keywords?: string[]
  shortcut?: string[]
  section?: string
  onSelect: () => void
}

export type CommandSearchRoutePage = {
  title: string
  slug: string
  description?: string
  preview?: boolean
  deprecated?: boolean
}

export type CommandSearchRouteGroup = {
  label?: string
  pages: CommandSearchRoutePage[]
}

// Generic navigation metadata types shared by consuming apps.
export type Item = {
  title: string
  href: string
  description?: string
  preview?: boolean
  deprecated?: boolean
}

export type Section = {
  title: string
  items: Item[]
}

export type Route = CommandSearchRouteGroup

export interface CommandSearchProviderProps {
  items?: CommandSearchItem[]
  routes?: CommandSearchRouteGroup[]
  onSelectRoute?: (page: CommandSearchRoutePage, group: CommandSearchRouteGroup) => void
  children: React.ReactNode
}

type CommandSearchContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  search: string
  setSearch: (search: string) => void
  toggle: () => void
}

type UseKBarResult = {
  query: {
    search: string
    setSearch: (search: string) => void
    toggle: () => void
    open: boolean
  }
}

type CommandGroupData = {
  label: string
  items: CommandSearchItem[]
}

const CommandSearchContext = React.createContext<CommandSearchContextValue | null>(null)
let commandSearchShortcutOwner: null | (() => void) = null
let commandSearchShortcutBound = false

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false

  return Boolean(target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))
}

function bindCommandSearchShortcut() {
  if (commandSearchShortcutBound || typeof document === 'undefined') return

  document.addEventListener('keydown', event => {
    if (event.key.toLocaleLowerCase() !== 'k' || (!event.metaKey && !event.ctrlKey)) return
    if (isEditableTarget(event.target)) return

    event.preventDefault()
    commandSearchShortcutOwner?.()
  })

  commandSearchShortcutBound = true
}

function useCommandSearchContext(): CommandSearchContextValue {
  const context = React.useContext(CommandSearchContext)

  if (!context) {
    throw new Error('Command search components must be used within CommandSearchProvider.')
  }

  return context
}

function toCommandGroups(items: CommandSearchItem[]): CommandGroupData[] {
  const groups = new Map<string, CommandSearchItem[]>()

  for (const item of items) {
    const label = item.section ?? 'Navigation'
    const group = groups.get(label)

    if (group) {
      group.push(item)
    } else {
      groups.set(label, [item])
    }
  }

  return Array.from(groups.entries()).map(([label, groupedItems]) => ({ label, items: groupedItems }))
}

function ShortcutKeys({ keys }: { keys?: string[] }) {
  if (!keys?.length) return null

  return (
    <div className={shortcutRow}>
      {keys.map(key => (
        <Kbd key={key} size="sm" variant="classic" className={shortcutKey}>
          {key}
        </Kbd>
      ))}
    </div>
  )
}

function CommandSearchDialog({ groups }: { groups: CommandGroupData[] }) {
  const { open, setOpen, search, setSearch, toggle } = useCommandSearchContext()

  return (
    <CommandDialog
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setSearch('')
        }
      }}
      label="Command search"
      overlayClassName={cn(dialogBackdropBaseCls, dialogBackdropBase)}
      contentClassName={cn(dialogPopupBaseCls, dialogPopupBase, commandDialogContent)}
      className={commandDialogRoot}
      loop
    >
      <div className={commandInputRow}>
        <Search className={commandSearchIcon} />
        <CommandMenu.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search..."
          aria-label="Search commands"
          className={commandInput}
        />
      </div>
      <CommandMenu.List className={commandList} label="Command search results">
        <CommandMenu.Empty className={commandEmptyState}>No results found.</CommandMenu.Empty>
        {groups.map(group => (
          <CommandMenu.Group key={group.label} heading={group.label} className={commandGroup}>
            {group.items.map(item => (
              <CommandMenu.Item
                key={item.id}
                value={item.label}
                keywords={[item.description, item.section, ...(item.keywords ?? []), ...(item.shortcut ?? [])].filter(
                  (value): value is string => Boolean(value),
                )}
                className={commandItem}
                onSelect={() => {
                  item.onSelect()
                  setSearch('')
                  toggle()
                }}
              >
                <div className={commandItemText}>
                  <span className={commandItemLabel}>{item.label}</span>
                  {item.description ? <span className={commandItemDescription}>{item.description}</span> : null}
                </div>
                <ShortcutKeys keys={item.shortcut} />
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        ))}
      </CommandMenu.List>
    </CommandDialog>
  )
}

export function CommandSearchProvider({ items, routes, onSelectRoute, children }: CommandSearchProviderProps) {
  if (items === undefined && routes && routes.length > 0 && !onSelectRoute) {
    throw new Error('CommandSearchProvider: `onSelectRoute` is required when `routes` are provided.')
  }

  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const onSelectRouteRef = React.useRef(onSelectRoute)
  const shortcutOwnerRef = React.useRef<() => void>(() => {})

  React.useEffect(() => {
    shortcutOwnerRef.current = () => {
      setOpen(current => {
        const nextOpen = !current
        if (!nextOpen) {
          setSearch('')
        }
        return nextOpen
      })
    }
  })

  React.useEffect(() => {
    onSelectRouteRef.current = onSelectRoute
  }, [onSelectRoute])

  React.useEffect(() => {
    bindCommandSearchShortcut()

    const owner = () => shortcutOwnerRef.current()
    commandSearchShortcutOwner = owner

    return () => {
      if (commandSearchShortcutOwner === owner) {
        commandSearchShortcutOwner = null
      }
    }
  }, [])

  const resolvedItems = React.useMemo<CommandSearchItem[]>(() => {
    if (items !== undefined) return items
    if (!routes || routes.length === 0) return []

    return routes.flatMap(group =>
      group.pages.map(page => ({
        id: page.slug,
        label: page.title,
        description: page.description ?? group.label,
        keywords: [page.slug, page.title],
        section: group.label,
        onSelect: () => onSelectRouteRef.current?.(page, group),
      })),
    )
  }, [items, routes])

  const groups = React.useMemo(() => toCommandGroups(resolvedItems), [resolvedItems])

  const contextValue = React.useMemo<CommandSearchContextValue>(
    () => ({
      open,
      setOpen,
      search,
      setSearch,
      toggle: () =>
        setOpen(current => {
          const nextOpen = !current
          if (!nextOpen) {
            setSearch('')
          }
          return nextOpen
        }),
    }),
    [open, search],
  )

  return (
    <CommandSearchContext.Provider value={contextValue}>
      <CommandSearchDialog groups={groups} />
      {children}
    </CommandSearchContext.Provider>
  )
}

export interface CommandSearchInputProps {
  triggerLabel?: string
  className?: string
  /**
   * Semantic color for the search button.
   * Note: 'neutral' is not forwarded to avoid the inverse fill alias on surface buttons.
   */
  color?: Color
}

function PlatformShortcut() {
  const [isMac, setIsMac] = React.useState(true)

  React.useEffect(() => {
    const detectMac = (): boolean => {
      if (
        'userAgentData' in navigator &&
        (navigator as { userAgentData?: { platform?: string } }).userAgentData?.platform
      ) {
        return (navigator as { userAgentData: { platform: string } }).userAgentData.platform === 'macOS'
      }
      return /Mac|iPhone|iPad/.test(navigator.userAgent)
    }
    setIsMac(detectMac())
  }, [])

  return (
    <Kbd variant="classic" size="sm" className="pointer-events-none hidden gap-1 px-2 opacity-100 sm:inline-flex">
      <span className="text-xs">{isMac ? '\u2318' : 'Ctrl'}</span>K
    </Kbd>
  )
}

export function CommandSearchInput({ triggerLabel = 'Search...', className, color }: CommandSearchInputProps) {
  const { query } = useKBar()
  // Don't pass 'neutral' to Button — its surface variant maps neutral → inverse (dark).
  const buttonColor = color && color !== 'neutral' ? color : undefined

  return (
    <Button
      type="button"
      variant="surface"
      size="sm"
      color={buttonColor}
      title={triggerLabel}
      aria-label={triggerLabel}
      className={cn(
        'w-9 min-w-9 justify-center rounded-xl border px-0 text-muted-foreground shadow-sm sm:w-auto sm:min-w-[240px] sm:justify-between sm:px-3',
        !color || color === 'neutral' ? commandSearchTrigger : null,
        className,
      )}
      onClick={query.toggle}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        <Search className="h-4 w-4" />
        <span className="hidden truncate sm:inline">{triggerLabel}</span>
      </span>
      <PlatformShortcut />
    </Button>
  )
}

export function useKBar(): UseKBarResult {
  const context = useCommandSearchContext()

  return React.useMemo(
    () => ({
      query: {
        search: context.search,
        setSearch: context.setSearch,
        toggle: context.toggle,
        open: context.open,
      },
    }),
    [context.open, context.search, context.setSearch, context.toggle],
  )
}
