'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { PanelLeftIcon } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import * as React from 'react'
import { Badge } from '@/elements/badge/Badge'
import { Button } from '@/elements/button/Button'
import { Separator } from '@/elements/separator/Separator'
import { Sheet } from '@/elements/sheet/Sheet'
import { Skeleton } from '@/elements/skeleton/Skeleton'
import { Surface } from '@/elements/surface/Surface'
import { Tooltip } from '@/elements/tooltip/Tooltip'
import { TextField } from '@/form/TextField'
import { useIsMobile } from '@/hooks/use-mobile'
import { readCookie, writeCookie } from '@/hooks/useCookie'
import { Row } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import {
  sidebarBodyText,
  sidebarColorStyles,
  sidebarContentSurface,
  sidebarGroupAnchorStyles,
  sidebarGroupLabelText,
  sidebarMenuBadgeText,
  sidebarMenuButtonHasActiveChild,
  sidebarMenuButtonSizeStyles,
  sidebarMenuButtonTone,
  sidebarMenuButtonToneHighlight,
  sidebarMenuButtonVariantStyles,
  sidebarMenuSubButtonSizeStyles,
  sidebarMenuSubButtonTone,
  sidebarMenuSubButtonToneHighlight,
  sidebarMenuSubFloatingPanel,
  sidebarPanelSurface,
  sidebarSkeletonTone,
} from './Sidebar.css'
import type {
  SidebarCollapsible,
  SidebarColor,
  SidebarGroupProps,
  SidebarMenuActionProps,
  SidebarMenuButtonProps,
  SidebarMenuButtonSize,
  SidebarMenuButtonVariant,
  SidebarMenuSkeletonProps,
  SidebarMenuSubButtonProps,
  SidebarMenuSubButtonSize,
  SidebarProviderProps,
  SidebarRootProps,
  SidebarSide,
  SidebarVariant,
} from './sidebar.props'
import { sidebarMenuButtonPropDefs, sidebarMenuSubButtonPropDefs, sidebarRootPropDefs } from './sidebar.props'
import { SidebarHoverHighlight, useSidebarHoverHighlight } from './sidebar-hover-highlight'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

function readSidebarCookie(): boolean | null {
  const value = readCookie(SIDEBAR_COOKIE_NAME)

  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

function safeEnumValue<Def extends { values: readonly string[]; default: string }>(
  def: Def,
  value: unknown,
): Def['values'][number] {
  return (normalizeEnumPropValue(def, value) ?? def.default) as Def['values'][number]
}

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

/**
 * TW4 wraps group-data-* in :where() (zero specificity) so it can't override
 * competing base utility classes. This context lets child components read the
 * active collapsible value and apply styles via inline style / conditional cn.
 */
const CollapsibleContext = React.createContext('')

/** Returns true when sidebar is collapsed in icon mode. */
function useIconCollapsed() {
  return React.useContext(CollapsibleContext) === 'icon'
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)

  React.useEffect(() => {
    if (openProp !== undefined) return

    const cookieOpen = readSidebarCookie()
    if (cookieOpen !== null) {
      _setOpen(cookieOpen)
    }
  }, [openProp])
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      try {
        writeCookie(SIDEBAR_COOKIE_NAME, String(openState), {
          path: '/',
          maxAge: SIDEBAR_COOKIE_MAX_AGE,
          sameSite: 'lax',
        })
      } catch (error) {
        console.warn('Failed to set sidebar cookie:', error)
      }
    },
    [setOpenProp, open],
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(prev => !prev)
    } else {
      setOpen(prev => !prev)
    }
  }, [isMobile, setOpen])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <Row
        data-slot="sidebar-wrapper"
        minHeight="100svh"
        width="100%"
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn('group/sidebar-wrapper has-[[data-variant=inset]]:bg-sidebar', className)}
        {...props}
      >
        {children}
      </Row>
    </SidebarContext.Provider>
  )
}

function SidebarRoot({
  side = sidebarRootPropDefs.side.default,
  variant = sidebarRootPropDefs.variant.default,
  collapsible = sidebarRootPropDefs.collapsible.default,
  color = sidebarRootPropDefs.color.default,
  className,
  style,
  hidden,
  children,
  dir,
  ...props
}: SidebarRootProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  const safeSide = safeEnumValue(sidebarRootPropDefs.side, side) as SidebarSide
  const safeVariant = safeEnumValue(sidebarRootPropDefs.variant, variant) as SidebarVariant
  const safeCollapsible = safeEnumValue(sidebarRootPropDefs.collapsible, collapsible) as SidebarCollapsible
  const safeColor = safeEnumValue(sidebarRootPropDefs.color, color) as SidebarColor

  if (safeCollapsible === 'none') {
    return (
      <Surface
        data-slot="sidebar"
        variant={safeVariant}
        color={safeColor}
        radius="none"
        hidden={hidden}
        style={style}
        className={cn(
          'text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col',
          sidebarColorStyles[safeVariant][safeColor],
          sidebarPanelSurface,
          className,
        )}
        {...props}
      >
        {children}
      </Surface>
    )
  }

  if (isMobile) {
    return (
      <Sheet.Root open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <Sheet.Content
          dir={dir}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          hidden={hidden}
          className={cn('bg-sidebar text-sidebar-foreground w-[var(--sidebar-width)] p-0 [&>button]:hidden', className)}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
              ...style,
            } as React.CSSProperties
          }
          side={safeSide}
        >
          <Sheet.Header className="sr-only">
            <Sheet.Title>Sidebar</Sheet.Title>
            <Sheet.Description>Displays the mobile sidebar.</Sheet.Description>
          </Sheet.Header>
          <Surface
            data-slot="sidebar-inner"
            variant={safeVariant}
            color={safeColor}
            radius="none"
            style={style}
            className={cn(
              'text-sidebar-foreground flex size-full flex-col',
              sidebarColorStyles[safeVariant][safeColor],
              sidebarPanelSurface,
            )}
          >
            {children}
          </Surface>
        </Sheet.Content>
      </Sheet.Root>
    )
  }

  const isCollapsed = state === 'collapsed'
  const collapsibleValue = isCollapsed ? safeCollapsible : ''
  const isIcon = collapsibleValue === 'icon'
  const isOffcanvas = collapsibleValue === 'offcanvas'

  return (
    <CollapsibleContext.Provider value={collapsibleValue}>
      <div
        className="group peer text-sidebar-foreground"
        data-state={state}
        data-collapsible={collapsibleValue}
        data-side={safeSide}
        data-slot="sidebar"
        hidden={hidden}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          data-slot="sidebar-gap"
          className={cn(
            'transition-[width] duration-200 ease-linear relative bg-transparent',
            safeSide === 'right' && 'rotate-180',
          )}
          style={{
            width: isOffcanvas ? 0 : isIcon ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)',
          }}
        />
        <div
          data-slot="sidebar-container"
          data-side={safeSide}
          className={cn(
            'fixed inset-y-0 z-10 flex h-svh transition-[left,right,width] duration-200 ease-linear',
            safeSide === 'left' && 'left-0',
            safeSide === 'right' && 'right-0',
            className,
          )}
          style={{
            width: isIcon ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)',
            ...(isOffcanvas && safeSide === 'left' ? { left: 'calc(var(--sidebar-width) * -1)' } : {}),
            ...(isOffcanvas && safeSide === 'right' ? { right: 'calc(var(--sidebar-width) * -1)' } : {}),
            ...style,
          }}
          {...props}
        >
          <Surface
            data-sidebar="sidebar"
            data-slot="sidebar-inner"
            variant={safeVariant}
            color={safeColor}
            radius="none"
            style={style}
            className={cn(
              'text-sidebar-foreground flex size-full flex-col',
              sidebarColorStyles[safeVariant][safeColor],
              sidebarPanelSurface,
            )}
          >
            {children}
          </Surface>
        </div>
      </div>
    </CollapsibleContext.Provider>
  )
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="sm"
      className={cn(className)}
      onClick={event => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon className="rtl:rotate-180" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'appearance-none border-0 bg-transparent hover:after:bg-sidebar-border absolute inset-y-0 z-20 flex w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] ltr:-translate-x-1/2 rtl:-translate-x-1/2',
        'in-data-[side=left]:cursor-w-resize rtl:in-data-[side=left]:cursor-e-resize in-data-[side=right]:cursor-e-resize rtl:in-data-[side=right]:cursor-w-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize rtl:[[data-side=left][data-state=collapsed]_&]:cursor-w-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize rtl:[[data-side=right][data-state=collapsed]_&]:cursor-e-resize',
        'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 rtl:group-data-[collapsible=offcanvas]:-translate-x-0 group-data-[collapsible=offcanvas]:after:start-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-end-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-start-2',
        className,
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn('bg-background relative flex w-full flex-1 flex-col', className)}
      {...props}
    />
  )
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof TextField>) {
  const iconMode = useIconCollapsed()
  return (
    <div
      data-slot="sidebar-input"
      // Wrapper needed because TextField's hardcoded w-full prevents margin/padding on the TextField itself
      className={cn('px-2', className)}
      style={iconMode ? { display: 'none' } : undefined}
    >
      <TextField
        data-sidebar="input"
        size="sm"
        variant="surface"
        className="min-w-0 overflow-hidden rounded-md"
        {...props}
      />
    </div>
  )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn('bg-sidebar-border mx-2 w-auto', className)}
      {...props}
    />
  )
}

function SidebarContent({ className, style, ...props }: React.ComponentProps<'div'>) {
  const iconMode = useIconCollapsed()
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn('no-scrollbar flex min-h-0 flex-1 flex-col', sidebarContentSurface, className)}
      style={{ overflow: iconMode ? 'visible' : 'auto', ...style }}
      {...props}
    />
  )
}

function SidebarGroup({ anchor, className, style, ...props }: SidebarGroupProps) {
  const iconMode = useIconCollapsed()
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      data-anchor={anchor}
      className={cn(
        'relative flex min-w-0 flex-col',
        iconMode ? 'items-center' : 'w-full px-2 py-1.5',
        anchor && sidebarGroupAnchorStyles[anchor],
        className,
      )}
      style={{ ...(iconMode ? { width: 'var(--sidebar-width-icon)', padding: 0 } : {}), ...style }}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'> & React.ComponentProps<'div'>) {
  const iconMode = useIconCollapsed()
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          'text-sidebar-foreground/70 ring-sidebar-ring h-8 rounded-md px-2 font-medium transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 flex shrink-0 items-center outline-hidden [&>svg]:shrink-0',
          sidebarGroupLabelText,
          className,
        ),
        style: iconMode ? { display: 'none' } : undefined,
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-group-label',
      sidebar: 'group-label',
    },
  })
}

function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<'button'> & React.ComponentProps<'button'>) {
  const iconMode = useIconCollapsed()
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(
          'appearance-none border-0 bg-transparent text-sidebar-foreground ring-sidebar-ring hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-foreground)] absolute top-3.5 end-3 w-5 rounded-md p-0 focus-visible:ring-2 [&>svg]:size-4 flex aspect-square items-center justify-center outline-hidden transition-transform [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden',
          className,
        ),
        style: iconMode ? { display: 'none' } : undefined,
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-group-action',
      sidebar: 'group-action',
    },
  })
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn('w-full', sidebarBodyText, className)}
      {...props}
    />
  )
}

interface SidebarMenuProps extends React.ComponentProps<'ul'> {
  hoverHighlight?: boolean
}

function SidebarMenu({ className, style, hoverHighlight, ...props }: SidebarMenuProps) {
  const iconMode = useIconCollapsed()
  const list = (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn('m-0 list-none gap-0 p-0 flex min-w-0 flex-col', iconMode ? 'items-center' : 'w-full', className)}
      style={{ ...(iconMode ? { width: '2rem', margin: '0 auto' } : {}), ...style }}
      {...props}
    />
  )

  if (hoverHighlight) {
    return <SidebarHoverHighlight>{list}</SidebarHoverHighlight>
  }

  return list
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, style, ...props }, ref) => {
    const iconMode = useIconCollapsed()
    return (
      <li
        ref={ref}
        data-slot="sidebar-menu-item"
        data-sidebar="menu-item"
        className={cn('list-none group/menu-item relative', iconMode && 'flex w-full justify-center', className)}
        style={style}
        {...props}
      />
    )
  },
)

SidebarMenuItem.displayName = 'SidebarMenuItem'

function useHighlightHandlers() {
  const highlight = useSidebarHoverHighlight()
  const ref = React.useRef<HTMLElement>(null)

  const handlers = React.useMemo(() => {
    if (!highlight) return {}
    return {
      onPointerEnter: () => {
        if (ref.current) highlight.onItemEnter(ref.current)
      },
      onPointerLeave: () => highlight.onItemLeave(),
      onFocus: () => {
        if (ref.current) highlight.onItemFocus(ref.current)
      },
      onBlur: () => highlight.onItemBlur(),
    }
  }, [highlight])

  return { ref, handlers, active: Boolean(highlight) }
}

function SidebarMenuButton({
  render,
  isActive = false,
  hasActiveChild = false,
  variant = sidebarMenuButtonPropDefs.variant.default,
  size = sidebarMenuButtonPropDefs.size.default,
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar()
  const safeVariant = safeEnumValue(sidebarMenuButtonPropDefs.variant, variant) as SidebarMenuButtonVariant
  const safeSize = safeEnumValue(sidebarMenuButtonPropDefs.size, size) as SidebarMenuButtonSize
  const iconMode = useIconCollapsed()
  const { ref: highlightRef, handlers: highlightHandlers, active: hasHighlight } = useHighlightHandlers()
  const comp = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        ref: highlightRef as React.Ref<HTMLButtonElement>,
        type: 'button' as const,
        className: cn(
          'appearance-none border-0 cursor-pointer ring-sidebar-ring rounded-md text-start transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 focus-visible:ring-2 peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:shrink-0',
          iconMode ? 'grid place-items-center text-center [&>span:last-child]:hidden [&>svg]:m-0' : 'gap-2 p-2',
          hasHighlight ? sidebarMenuButtonToneHighlight : sidebarMenuButtonTone,
          hasActiveChild && sidebarMenuButtonHasActiveChild,
          sidebarMenuButtonVariantStyles[safeVariant],
          sidebarMenuButtonSizeStyles[safeSize],
          className,
        ),
        style: iconMode ? { width: '2rem', height: '2rem', padding: 0 } : undefined,
        ...highlightHandlers,
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-menu-button',
      sidebar: 'menu-button',
      size: safeSize,
      active: isActive,
    },
  })

  if (!tooltip || state !== 'collapsed' || isMobile) {
    return comp
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={comp} />
      <Tooltip.Content side="right">{tooltip}</Tooltip.Content>
    </Tooltip.Root>
  )
}

function SidebarMenuAction({ className, render, showOnHover = false, ...props }: SidebarMenuActionProps) {
  const iconMode = useIconCollapsed()
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(
          'appearance-none border-0 bg-transparent text-sidebar-foreground ring-sidebar-ring hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-hover-foreground)] peer-hover/menu-button:text-[var(--sidebar-hover-foreground)] absolute top-1.5 end-1 aspect-square w-5 rounded-md p-0 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 focus-visible:ring-2 [&>svg]:size-4 flex items-center justify-center outline-hidden transition-transform after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0',
          showOnHover &&
            'peer-data-active/menu-button:text-[var(--sidebar-hover-foreground)] group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100 md:opacity-0',
          className,
        ),
        style: iconMode ? { display: 'none' } : undefined,
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-menu-action',
      sidebar: 'menu-action',
    },
  })
}

function SidebarMenuBadge({ className, style, ...props }: React.ComponentProps<'div'>) {
  const iconMode = useIconCollapsed()
  return (
    <Badge
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      size="xs"
      variant="surface"
      radius="md"
      className={cn(
        'text-sidebar-foreground peer-hover/menu-button:text-[var(--sidebar-hover-foreground)] peer-data-active/menu-button:text-[var(--sidebar-hover-foreground)] pointer-events-none absolute end-1 h-5 min-w-5 rounded-md px-1 font-medium peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 flex items-center justify-center tabular-nums select-none',
        sidebarMenuBadgeText,
        className,
      )}
      style={{ ...(iconMode ? { display: 'none' } : {}), ...style }}
      {...(props as React.ComponentProps<typeof Badge>)}
    />
  )
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }: SidebarMenuSkeletonProps) {
  const width = '68%'

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn('h-8 gap-2 rounded-md px-2 flex items-center relative overflow-hidden', className)}
      {...props}
    >
      {showIcon && (
        <Skeleton className={cn('size-4 rounded-md', sidebarSkeletonTone)} data-sidebar="menu-skeleton-icon" />
      )}
      <Skeleton
        className={cn('h-4 max-w-[var(--skeleton-width)] flex-1', sidebarSkeletonTone)}
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
      <div aria-hidden className="af-shimmer-overlay" />
    </div>
  )
}

interface SidebarMenuSubProps extends React.ComponentProps<'ul'> {
  open?: boolean
}

function SidebarMenuSub({ className, style, open, ...props }: SidebarMenuSubProps) {
  const iconMode = useIconCollapsed()
  const animated = open !== undefined && !iconMode

  const list = (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        'm-0 list-none flex min-w-0 flex-col',
        iconMode
          ? 'absolute start-full top-0 z-50 min-w-40 translate-x-2 rounded-md border p-1 shadow-md invisible pointer-events-none opacity-0 group-hover/menu-item:visible group-hover/menu-item:pointer-events-auto group-hover/menu-item:opacity-100 group-focus-within/menu-item:visible group-focus-within/menu-item:pointer-events-auto group-focus-within/menu-item:opacity-100 peer-data-[active=true]/menu-button:visible peer-data-[active=true]/menu-button:pointer-events-auto peer-data-[active=true]/menu-button:opacity-100 peer-aria-expanded/menu-button:visible peer-aria-expanded/menu-button:pointer-events-auto peer-aria-expanded/menu-button:opacity-100'
          : 'border-sidebar-border mx-3.5 translate-x-px rtl:-translate-x-px gap-1 border-s px-2.5 py-0.5',
        iconMode && sidebarMenuSubFloatingPanel,
        className,
      )}
      style={style}
      {...props}
    />
  )

  if (!animated) return list

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="sidebar-menu-sub"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1, pointerEvents: 'auto' as const }}
          exit={{ height: 0, opacity: 0, pointerEvents: 'none' as const }}
          transition={{ duration: 0.25 }}
          style={{ overflow: 'hidden' }}
        >
          {list}
        </m.div>
      )}
    </AnimatePresence>
  )
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn('list-none group/menu-sub-item relative', className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  render,
  size = sidebarMenuSubButtonPropDefs.size.default,
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  const safeSize = safeEnumValue(sidebarMenuSubButtonPropDefs.size, size) as SidebarMenuSubButtonSize
  const { ref: highlightRef, handlers: highlightHandlers, active: hasHighlight } = useHighlightHandlers()
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        ref: highlightRef as React.Ref<HTMLAnchorElement>,
        className: cn(
          'ring-sidebar-ring no-underline hover:no-underline h-7 gap-2 rounded-md px-2 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:text-current flex min-w-0 -translate-x-px rtl:translate-x-px items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0',
          hasHighlight ? sidebarMenuSubButtonToneHighlight : sidebarMenuSubButtonTone,
          sidebarMenuSubButtonSizeStyles[safeSize],
          className,
        ),
        ...highlightHandlers,
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-menu-sub-button',
      sidebar: 'menu-sub-button',
      size: safeSize,
      active: isActive,
    },
  })
}

export const Sidebar = {
  Root: SidebarRoot,
  Content: SidebarContent,
  Group: SidebarGroup,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  GroupLabel: SidebarGroupLabel,
  Input: SidebarInput,
  Inset: SidebarInset,
  Menu: SidebarMenu,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuButton: SidebarMenuButton,
  MenuItem: SidebarMenuItem,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSub,
  MenuSubButton: SidebarMenuSubButton,
  MenuSubItem: SidebarMenuSubItem,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
}
export { useIconCollapsed, useSidebar }
