'use client'

import { useActorRef, useSelector } from '@xstate/react'
import { MenuIcon, PanelLeftCloseIcon, XIcon } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { IconButton } from '@/elements/button/IconButton'
import { Sheet } from '@/elements/sheet/Sheet'
import { Tabs } from '@/elements/tabs/Tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import { CommandSearchInput } from '@/layouts/command-search/CommandSearch'
import { Column, Flex, Row } from '@/layouts/flex/Flex'
import { Header } from '@/layouts/header/Header'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import { breakpointMedia } from '@/theme/helpers/responsive/breakpoints'
import { ThemeToggle } from '@/theme/ThemeToggle'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import { Sidebar, useSidebar } from '../sidebar/Sidebar'
import { sidebarColorStyles } from '../sidebar/Sidebar.css'
import type { SidebarVariant } from '../sidebar/sidebar.props'
import { AppShellContext, type AppShellContextValue, useAppShell } from './app-shell.context'
import {
  appShellBody,
  appShellBodyWithSecondary,
  appShellBodyWithSecondaryRight,
  appShellContent,
  appShellSecondaryLeft,
  appShellSecondaryResizeHandle,
  appShellSecondaryResizeHandleLeft,
  appShellSecondaryResizeHandleRight,
  appShellSecondaryRight,
} from './app-shell.css'
import type { AppShellProps } from './app-shell.props'
import {
  type AppShellDrawerTab,
  AppShellMachineEventType,
  appShellMachine,
  getAppShellNavigationState,
} from './app-shell-machine'

export type {
  AppShellBodyProps,
  AppShellContentPadding,
  AppShellContentProps,
  AppShellHeaderEndProps,
  AppShellHeaderInnerProps,
  AppShellHeaderProps,
  AppShellHeaderStartProps,
  AppShellMainProps,
  AppShellProps,
  AppShellRootProps,
  AppShellScrollMode,
  AppShellSearchProps,
  AppShellSecondaryContentProps,
  AppShellSecondaryProps,
  AppShellSecondarySide,
  AppShellSecondarySidebarProps,
  AppShellSecondaryTriggerProps,
  AppShellSidebarProps,
  AppShellSidebarTriggerProps,
} from './app-shell.props'

// ─── Root ─────────────────────────────────────────────────────────────

export function AppShellRoot({
  color: colorProp,
  overlay: overlayProp = false,
  defaultSecondaryOpen = true,
  navLabel = 'Navigation',
  secondaryLabel = 'Filters',
  drawerWidth = '18rem',
  className,
  children,
  ...props
}: AppShellProps.Root) {
  const theme = useOptionalThemeProviderContext()
  const color = colorProp ?? theme?.sidebarColor ?? 'slate'
  const isMobile = useIsMobile()
  const [isCompact, setIsCompact] = React.useState(false)
  const requestedOverlay = overlayProp || isMobile || isCompact
  const [sidebarContent, setSidebarContent] = React.useState<React.ReactNode>(null)
  const [secondaryContent, setSecondaryContent] = React.useState<React.ReactNode>(null)
  const appShellActor = useActorRef(appShellMachine, {
    input: {
      overlay: requestedOverlay,
      defaultSecondaryOpen,
    },
  })
  const shellState = useSelector(appShellActor, snapshot => snapshot.context)

  React.useEffect(() => {
    const mql = window.matchMedia(breakpointMedia.down('md'))
    const onChange = () => {
      setIsCompact(mql.matches)
    }
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Close drawer when transitioning from overlay to inline (e.g. resizing from mobile to desktop)
  React.useEffect(() => {
    appShellActor.send({ type: AppShellMachineEventType.SetOverlay, overlay: requestedOverlay })
  }, [appShellActor, requestedOverlay])

  React.useEffect(() => {
    if (shellState.overlay || shellState.primarySidebarVisible) return

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

      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        event.stopPropagation()
        appShellActor.send({ type: AppShellMachineEventType.ShowPrimary })
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [appShellActor, shellState.overlay, shellState.primarySidebarVisible])

  const setSecondaryOpen = React.useCallback(
    (value: boolean | ((current: boolean) => boolean)) => {
      const current = appShellActor.getSnapshot().context.secondaryOpen
      appShellActor.send({
        type: AppShellMachineEventType.SetSecondaryOpen,
        open: typeof value === 'function' ? value(current) : value,
      })
    },
    [appShellActor],
  )

  const setPrimarySidebarVisible = React.useCallback(
    (value: boolean | ((current: boolean) => boolean)) => {
      const current = appShellActor.getSnapshot().context.primarySidebarVisible
      const next = typeof value === 'function' ? value(current) : value
      appShellActor.send({
        type: next ? AppShellMachineEventType.ShowPrimary : AppShellMachineEventType.HidePrimary,
      })
    },
    [appShellActor],
  )

  const setDrawerOpen = React.useCallback(
    (open: boolean) => {
      appShellActor.send({ type: AppShellMachineEventType.SetDrawerOpen, open })
    },
    [appShellActor],
  )

  const setDrawerTab = React.useCallback(
    (tab: AppShellDrawerTab) => {
      appShellActor.send({ type: AppShellMachineEventType.SetDrawerTab, tab })
    },
    [appShellActor],
  )

  const setSecondaryRegistered = React.useCallback(
    (registered: boolean) => {
      appShellActor.send(
        registered
          ? { type: AppShellMachineEventType.RegisterSecondary, side: 'right' }
          : { type: AppShellMachineEventType.UnregisterSecondary },
      )
    },
    [appShellActor],
  )

  const setSecondarySide = React.useCallback(
    (side: AppShellProps.SecondarySide) => {
      appShellActor.send({ type: AppShellMachineEventType.SetSecondarySide, side })
    },
    [appShellActor],
  )

  const rememberPrimaryOpen = React.useCallback(
    (open: boolean) => {
      appShellActor.send({ type: AppShellMachineEventType.RememberPrimaryOpen, open })
    },
    [appShellActor],
  )

  const clearRememberedPrimaryOpen = React.useCallback(() => {
    appShellActor.send({ type: AppShellMachineEventType.ClearRememberedPrimaryOpen })
  }, [appShellActor])

  const markPrimaryOpenInitialized = React.useCallback(() => {
    appShellActor.send({ type: AppShellMachineEventType.MarkPrimaryOpenInitialized })
  }, [appShellActor])

  const toggleSecondary = React.useCallback(() => {
    if (appShellActor.getSnapshot().context.overlay) {
      appShellActor.send({ type: AppShellMachineEventType.OpenDrawer, tab: 'secondary' })
    } else {
      appShellActor.send({ type: AppShellMachineEventType.ToggleSecondary })
    }
  }, [appShellActor])

  const value = React.useMemo<AppShellContextValue>(
    () => ({
      color,
      overlay: shellState.overlay,
      secondaryOpen: shellState.secondaryOpen,
      setSecondaryOpen,
      toggleSecondary,
      drawerOpen: shellState.drawerOpen,
      setDrawerOpen,
      drawerTab: shellState.drawerTab,
      setDrawerTab,
      sidebarContent,
      setSidebarContent,
      secondaryContent,
      setSecondaryContent,
      secondaryRegistered: shellState.secondaryRegistered,
      setSecondaryRegistered,
      secondarySide: shellState.secondarySide,
      setSecondarySide,
      primarySidebarVisible: shellState.primarySidebarVisible,
      setPrimarySidebarVisible,
      primaryOpenBeforeSecondary: shellState.primaryOpenBeforeSecondary,
      primaryOpenInitialized: shellState.primaryOpenInitialized,
      rememberPrimaryOpen,
      clearRememberedPrimaryOpen,
      markPrimaryOpenInitialized,
      navLabel,
      secondaryLabel,
      drawerWidth,
    }),
    [
      color,
      shellState,
      toggleSecondary,
      sidebarContent,
      secondaryContent,
      setSecondaryOpen,
      setDrawerOpen,
      setDrawerTab,
      setSecondaryRegistered,
      setSecondarySide,
      setPrimarySidebarVisible,
      rememberPrimaryOpen,
      clearRememberedPrimaryOpen,
      markPrimaryOpenInitialized,
      navLabel,
      secondaryLabel,
      drawerWidth,
    ],
  )

  return (
    <AppShellContext.Provider value={value}>
      <Sidebar.Provider
        data-slot="app-shell"
        className={cn('flex h-svh flex-col overflow-hidden', className)}
        {...props}
      >
        {children}
        {shellState.overlay && <AppShellDrawer />}
      </Sidebar.Provider>
    </AppShellContext.Provider>
  )
}

// ─── Drawer (internal) ───────────────────────────────────────────────

function AppShellDrawer() {
  const {
    drawerOpen,
    setDrawerOpen,
    drawerTab,
    setDrawerTab,
    sidebarContent,
    secondaryContent,
    navLabel,
    secondaryLabel,
    drawerWidth,
  } = useAppShell()

  const hasSecondary = secondaryContent != null

  return (
    <Sheet.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
      <Sheet.Content side="left" style={{ maxWidth: drawerWidth }}>
        <Row align="center" justify="between" px="3" pt="3" pb="1">
          <Sheet.Title className="sr-only">
            {hasSecondary && drawerTab === 'secondary' ? secondaryLabel : navLabel}
          </Sheet.Title>
          <div />
          <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)} aria-label="Close drawer">
            <XIcon />
          </Button>
        </Row>
        {hasSecondary ? (
          <Column minHeight="0" flexGrow="1" flexBasis="0">
            <Tabs.Root
              value={drawerTab}
              onValueChange={value => {
                if (value === 'nav' || value === 'secondary') setDrawerTab(value)
              }}
              size="sm"
              variant="line"
            >
              <Tabs.List className="px-3" justify="start">
                <Tabs.Trigger value="nav">{navLabel}</Tabs.Trigger>
                <Tabs.Trigger value="secondary">{secondaryLabel}</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="nav" className="flex-1 overflow-auto">
                {sidebarContent}
              </Tabs.Content>
              <Tabs.Content value="secondary" className="flex-1 overflow-auto">
                {secondaryContent}
              </Tabs.Content>
            </Tabs.Root>
          </Column>
        ) : (
          <Flex flexGrow="1" flexBasis="0" overflow="auto">
            {sidebarContent}
          </Flex>
        )}
      </Sheet.Content>
    </Sheet.Root>
  )
}

// ─── Header ─────────────────────────────────────────────────────────

export function AppShellHeader({ sticky = true, className, ...props }: AppShellProps.Header) {
  return <Header sticky={sticky} className={className} {...props} />
}

export function AppShellHeaderInner({ className, ...props }: AppShellProps.HeaderInner) {
  return (
    <Flex
      data-slot="app-shell-header-inner"
      align="center"
      justify="between"
      gap="3"
      className={cn('h-14 w-full min-w-0 px-4', className)}
      {...props}
    />
  )
}

export function AppShellHeaderStart({ className, ...props }: AppShellProps.HeaderStart) {
  return (
    <Flex
      data-slot="app-shell-header-start"
      align="center"
      gap="3"
      className={cn('min-w-0 flex-1 overflow-hidden [&>*]:min-w-0', className)}
      {...props}
    />
  )
}

export function AppShellHeaderEnd({ showThemeToggle, className, children, ...props }: AppShellProps.HeaderEnd) {
  const theme = useOptionalThemeProviderContext()

  return (
    <Flex
      data-slot="app-shell-header-end"
      align="center"
      gap="2"
      className={cn('min-w-0 shrink-0', className)}
      {...props}
    >
      {children}
      {showThemeToggle && theme ? <ThemeToggle size="sm" variant="ghost" /> : null}
    </Flex>
  )
}

// ─── Body ───────────────────────────────────────────────────────────

export function AppShellBody({ className, children, ...props }: AppShellProps.Body) {
  const { overlay, secondaryOpen, secondaryRegistered, secondarySide } = useAppShell()
  const hasInlineSecondary = !overlay && secondaryOpen && secondaryRegistered

  return (
    <div
      data-slot="app-shell-body"
      className={cn(
        'grid min-h-0 w-full min-w-0 flex-1 overflow-hidden',
        appShellBody,
        hasInlineSecondary && (secondarySide === 'right' ? appShellBodyWithSecondaryRight : appShellBodyWithSecondary),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────

export function AppShellSidebar({
  collapsible = 'icon',
  color: colorProp,
  variant: variantProp,
  className,
  children,
  ...props
}: AppShellProps.Sidebar) {
  const theme = useOptionalThemeProviderContext()
  const {
    overlay,
    setSidebarContent,
    color: shellColor,
    secondaryRegistered,
    primarySidebarVisible,
    primaryOpenBeforeSecondary,
    primaryOpenInitialized,
    rememberPrimaryOpen,
    clearRememberedPrimaryOpen,
    markPrimaryOpenInitialized,
  } = useAppShell()
  const { open, setOpen } = useSidebar()
  const color = colorProp ?? shellColor
  const variant = (variantProp ?? theme?.sidebarVariant ?? 'soft') as SidebarVariant
  const hasInlineSecondaryMode = !overlay && secondaryRegistered
  const effectiveCollapsible = hasInlineSecondaryMode ? 'icon' : collapsible

  // Wrap children with color styles so sidebar CSS variables are available in the drawer
  React.useLayoutEffect(() => {
    if (overlay) {
      setSidebarContent(<div className={sidebarColorStyles[variant]?.[color]}>{children}</div>)
    }
    return () => {
      if (overlay) setSidebarContent(null)
    }
  }, [overlay, children, setSidebarContent, variant, color])

  React.useEffect(() => {
    // Leaving inline-secondary mode restores the primary expanded/collapsed
    // state that was captured before secondary forced the primary rail to mini.
    // Clearing the remembered value is the guard that prevents re-restoring.
    if (!hasInlineSecondaryMode && primaryOpenBeforeSecondary !== null) {
      setOpen(primaryOpenBeforeSecondary)
      clearRememberedPrimaryOpen()
      return
    }

    // Primary-only icon sidebars should start expanded once so pages without a
    // secondary panel support full -> mini -> hidden. The initialized flag keeps
    // user-driven mini/collapsed changes from being immediately undone.
    if (!overlay && !hasInlineSecondaryMode && effectiveCollapsible === 'icon' && !primaryOpenInitialized) {
      markPrimaryOpenInitialized()
      if (!open) setOpen(true)
      return
    }

    // Entering inline-secondary mode reserves space for the secondary panel, so
    // the primary sidebar is forced to mini. Remembering the previous open state
    // also acts as the guard that keeps this branch from re-entering.
    if (hasInlineSecondaryMode && primaryOpenBeforeSecondary === null) {
      rememberPrimaryOpen(open)
      if (open) setOpen(false)
      return
    }
  }, [
    clearRememberedPrimaryOpen,
    effectiveCollapsible,
    hasInlineSecondaryMode,
    markPrimaryOpenInitialized,
    open,
    overlay,
    primaryOpenBeforeSecondary,
    primaryOpenInitialized,
    rememberPrimaryOpen,
    setOpen,
  ])

  if (overlay) return null

  return (
    <Sidebar.Root
      data-slot="app-shell-sidebar"
      collapsible={effectiveCollapsible}
      color={color}
      variant={variant}
      hidden={!primarySidebarVisible}
      className={className}
      {...props}
    >
      {effectiveCollapsible === 'icon' ? (
        <>
          <AppShellSecondaryToggleButton />
          {children}
          <AppShellPrimaryCollapseButton />
        </>
      ) : (
        children
      )}
    </Sidebar.Root>
  )
}

function AppShellSecondaryToggleButton() {
  const { open } = useSidebar()
  const { secondaryOpen, secondaryRegistered, setSecondaryOpen } = useAppShell()

  if (open || !secondaryRegistered) return null
  const label = secondaryOpen ? 'Close secondary panel' : 'Open secondary panel'
  const handleClick = () => {
    setSecondaryOpen(current => !current)
  }

  return (
    <Sidebar.Group>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            data-slot="app-shell-secondary-toggle"
            tooltip={label}
            aria-label={label}
            onClick={handleClick}
          >
            <MenuIcon className="size-4" aria-hidden="true" />
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  )
}

function AppShellPrimaryCollapseButton() {
  const { open } = useSidebar()
  const { setPrimarySidebarVisible } = useAppShell()

  if (open) return null

  return (
    <Sidebar.Group anchor="bottom">
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            data-slot="app-shell-primary-collapse"
            tooltip="Close navigation"
            aria-label="Close navigation"
            onClick={() => setPrimarySidebarVisible(false)}
          >
            <PanelLeftCloseIcon className="size-4" aria-hidden="true" />
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  )
}

// ─── Secondary Panel ────────────────────────────────────────────────

const SECONDARY_WIDTH = '16rem'
const SECONDARY_RESIZE_MIN_WIDTH = 256
const SECONDARY_RESIZE_MAX_WIDTH = 760
const SECONDARY_RESIZE_KEYBOARD_STEP = 16
const SECONDARY_RESIZE_KEYBOARD_LARGE_STEP = 32

function clampSecondaryWidth(width: number, minWidth: number, maxWidth: number) {
  return Math.min(maxWidth, Math.max(minWidth, width))
}

function parseCssLengthToPixels(value: string) {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)(px|rem)$/)
  if (!match) return null

  const amount = Number(match[1])
  if (!Number.isFinite(amount)) return null

  return match[2] === 'rem' ? amount * 16 : amount
}

export function AppShellSecondary({
  width = SECONDARY_WIDTH,
  resize = false,
  resizeMinWidth = SECONDARY_RESIZE_MIN_WIDTH,
  resizeMaxWidth = SECONDARY_RESIZE_MAX_WIDTH,
  side = 'right',
  scroll = 'hidden',
  className,
  children,
  style,
  ...props
}: AppShellProps.Secondary) {
  const { overlay, secondaryOpen, setSecondaryContent, setSecondaryOpen, setSecondaryRegistered, setSecondarySide } =
    useAppShell()
  const secondaryRef = React.useRef<HTMLElement | null>(null)
  const cleanupResizeRef = React.useRef<(() => void) | null>(null)
  const hasUserResizedRef = React.useRef(false)
  const parsedWidth = React.useMemo(() => parseCssLengthToPixels(width), [width])
  const initialResizeWidth = React.useMemo(
    () => (parsedWidth == null ? null : clampSecondaryWidth(parsedWidth, resizeMinWidth, resizeMaxWidth)),
    [parsedWidth, resizeMaxWidth, resizeMinWidth],
  )
  const [resizedWidth, setResizedWidth] = React.useState<number | null>(() => initialResizeWidth)
  const [isResizing, setIsResizing] = React.useState(false)
  const currentResizeWidth = resizedWidth ?? initialResizeWidth ?? resizeMinWidth
  const resolvedWidth = resizedWidth == null ? width : `${resizedWidth}px`
  const resolvedStyle = resize ? { ...style, width: resolvedWidth, flexShrink: 0 } : { width, flexShrink: 0, ...style }

  const applySecondaryWidth = React.useCallback(
    (nextWidth: number) => {
      const width = clampSecondaryWidth(nextWidth, resizeMinWidth, resizeMaxWidth)
      hasUserResizedRef.current = true
      secondaryRef.current?.style.setProperty('width', `${width}px`)
      setResizedWidth(width)
    },
    [resizeMaxWidth, resizeMinWidth],
  )

  const stopResize = React.useCallback(() => {
    cleanupResizeRef.current?.()
    cleanupResizeRef.current = null
  }, [])

  const beginResize = React.useCallback(
    (startX: number) => {
      if (!resize || overlay) return
      const element = secondaryRef.current
      if (!element) return

      stopResize()

      const startWidth = element.getBoundingClientRect().width
      const previousCursor = document.body.style.cursor
      const previousUserSelect = document.body.style.userSelect

      const updateWidth = (clientX: number) => {
        const movement = clientX - startX
        const delta = side === 'right' ? -movement : movement
        applySecondaryWidth(startWidth + delta)
      }

      const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault()
        updateWidth(event.clientX)
      }

      const handleTouchMove = (event: TouchEvent) => {
        const touch = event.touches[0]
        if (!touch) return
        event.preventDefault()
        updateWidth(touch.clientX)
      }

      const cleanup = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', cleanup)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', cleanup)
        document.removeEventListener('touchcancel', cleanup)
        document.body.style.cursor = previousCursor
        document.body.style.userSelect = previousUserSelect
        setIsResizing(false)
      }

      cleanupResizeRef.current = cleanup
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      setIsResizing(true)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', cleanup)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', cleanup)
      document.addEventListener('touchcancel', cleanup)
    },
    [applySecondaryWidth, overlay, resize, side, stopResize],
  )

  const handleResizeMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      event.preventDefault()
      event.stopPropagation()
      beginResize(event.clientX)
    },
    [beginResize],
  )

  const handleResizeTouchStart = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0]
      if (!touch) return
      event.preventDefault()
      event.stopPropagation()
      beginResize(touch.clientX)
    },
    [beginResize],
  )

  const handleResizeKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== KEYBOARD_KEYS.arrowLeft && event.key !== KEYBOARD_KEYS.arrowRight) return

      event.preventDefault()
      event.stopPropagation()

      const measuredWidth = secondaryRef.current?.getBoundingClientRect().width
      const baseWidth = measuredWidth && measuredWidth > 0 ? measuredWidth : currentResizeWidth
      const movement =
        (event.key === KEYBOARD_KEYS.arrowRight ? 1 : -1) *
        (event.shiftKey ? SECONDARY_RESIZE_KEYBOARD_LARGE_STEP : SECONDARY_RESIZE_KEYBOARD_STEP)
      const delta = side === 'right' ? -movement : movement
      applySecondaryWidth(baseWidth + delta)
    },
    [applySecondaryWidth, currentResizeWidth, side],
  )

  React.useEffect(() => {
    if (!resize) {
      hasUserResizedRef.current = false
      setResizedWidth(null)
      return
    }

    setResizedWidth(currentWidth =>
      currentWidth == null || !hasUserResizedRef.current
        ? initialResizeWidth
        : clampSecondaryWidth(currentWidth, resizeMinWidth, resizeMaxWidth),
    )
  }, [initialResizeWidth, resize, resizeMaxWidth, resizeMinWidth])

  React.useEffect(() => stopResize, [stopResize])

  const secondaryNode = (
    <aside
      ref={secondaryRef}
      data-slot="app-shell-secondary"
      className={cn(
        'relative z-20 pointer-events-auto flex h-full min-h-0 flex-col overflow-x-hidden',
        scroll === 'auto' ? 'overflow-y-auto' : 'overflow-y-hidden',
        side === 'right' ? appShellSecondaryRight : appShellSecondaryLeft,
        className,
      )}
      style={resolvedStyle}
      {...props}
    >
      {!overlay && resize ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize secondary panel"
          aria-valuemin={resizeMinWidth}
          aria-valuemax={resizeMaxWidth}
          aria-valuenow={Math.round(currentResizeWidth)}
          tabIndex={0}
          data-resizing={isResizing ? '' : undefined}
          className={cn(
            appShellSecondaryResizeHandle,
            side === 'right' ? appShellSecondaryResizeHandleRight : appShellSecondaryResizeHandleLeft,
          )}
          onMouseDown={handleResizeMouseDown}
          onTouchStart={handleResizeTouchStart}
          onKeyDown={handleResizeKeyDown}
        />
      ) : null}
      {!overlay ? (
        <Flex
          data-slot="app-shell-secondary-collapse"
          align="center"
          className="sticky top-0 z-10 h-8 shrink-0 bg-background px-2"
        >
          <IconButton
            variant="ghost"
            size="sm"
            icon="panel-left-close"
            title="Collapse secondary panel"
            aria-label="Collapse secondary panel"
            onClick={() => setSecondaryOpen(false)}
          />
        </Flex>
      ) : null}
      {children}
    </aside>
  )

  React.useLayoutEffect(() => {
    setSecondaryRegistered(true)
    setSecondarySide(side)
    return () => {
      setSecondaryRegistered(false)
      setSecondarySide('right')
    }
  }, [side, setSecondaryRegistered, setSecondarySide])

  React.useLayoutEffect(() => {
    if (overlay) {
      setSecondaryContent(secondaryNode)
    }
    return () => {
      if (overlay) setSecondaryContent(null)
    }
  }, [overlay, secondaryNode, setSecondaryContent])

  if (overlay) return null
  if (!secondaryOpen) return null

  return secondaryNode
}

export function AppShellSecondarySidebar({
  title,
  description,
  className,
  contentClassName,
  children,
  ...props
}: AppShellProps.SecondarySidebar) {
  return (
    <AppShellSecondary className={className} {...props}>
      <AppShellSecondaryContent gap="4">
        <Column gap="4" pt="0">
          <Flex align="center" gap="2" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </Flex>
          {description ? (
            <div>
              <div style={{ color: 'var(--color-slate-text)' }} className="text-xs">
                {description}
              </div>
            </div>
          ) : null}
        </Column>
        <div className={cn('min-h-0 flex-1 overflow-x-hidden overflow-y-auto', contentClassName)}>{children}</div>
      </AppShellSecondaryContent>
    </AppShellSecondary>
  )
}

export function AppShellSecondaryContent({ className, ...props }: AppShellProps.SecondaryContent) {
  return (
    <Flex
      px="4"
      pb="4"
      {...props}
      direction="column"
      minHeight="0"
      flexGrow="1"
      flexBasis="0"
      overflow="hidden"
      className={className}
      data-slot="app-shell-secondary-content"
    />
  )
}

// ─── Triggers ───────────────────────────────────────────────────────

function useAppShellNavigationTrigger(onClick?: React.ComponentProps<typeof IconButton>['onClick']) {
  const {
    overlay,
    setDrawerOpen,
    setDrawerTab,
    secondaryRegistered,
    toggleSecondary,
    secondaryOpen,
    setSecondaryOpen,
    primarySidebarVisible,
    setPrimarySidebarVisible,
    primaryOpenBeforeSecondary,
    primaryOpenInitialized,
    secondarySide,
    drawerOpen,
    drawerTab,
  } = useAppShell()
  const { toggleSidebar, setOpen } = useSidebar()
  const { bothInlinePanelsCollapsed, icon, label, primarySidebarHidden } = getAppShellNavigationState({
    overlay,
    secondaryOpen,
    secondaryRegistered,
    secondarySide,
    primarySidebarVisible,
    drawerOpen,
    drawerTab,
    primaryOpenBeforeSecondary,
    primaryOpenInitialized,
  })

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (overlay) {
        setDrawerOpen(true)
        setDrawerTab('nav')
        return
      }

      if (bothInlinePanelsCollapsed) {
        setPrimarySidebarVisible(true)
        setSecondaryOpen(true)
        return
      }

      if (primarySidebarHidden) {
        setPrimarySidebarVisible(true)
        setOpen(!secondaryRegistered)
        return
      }

      if (secondaryRegistered) {
        toggleSecondary()
        return
      }

      toggleSidebar()
    },
    [
      overlay,
      secondaryRegistered,
      primarySidebarHidden,
      bothInlinePanelsCollapsed,
      setDrawerOpen,
      setDrawerTab,
      setPrimarySidebarVisible,
      setSecondaryOpen,
      setOpen,
      toggleSecondary,
      toggleSidebar,
      onClick,
    ],
  )

  return { bothInlinePanelsCollapsed, handleClick, icon, label }
}

/** Toggle for the secondary panel (inline) or open drawer to secondary tab (overlay) */
export function AppShellSecondaryTrigger({ className, onClick, ...props }: AppShellProps.SecondaryTrigger) {
  const { toggleSecondary, secondaryOpen, overlay } = useAppShell()

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      toggleSecondary()
    },
    [onClick, toggleSecondary],
  )

  // In overlay mode, the hamburger icon already opens the drawer with tabs — no separate trigger needed
  if (overlay) return null

  return (
    <IconButton
      data-slot="app-shell-secondary-trigger"
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleClick}
      icon={!secondaryOpen ? 'panel-left-open' : 'panel-left-close'}
      title="Toggle secondary panel"
      aria-label="Toggle secondary panel"
      {...props}
    />
  )
}

/** Toggle for the sidebar (inline collapse) or open drawer to nav tab (overlay) */
export function AppShellSidebarTrigger({ className, onClick, ...props }: AppShellProps.SidebarTrigger) {
  const { bothInlinePanelsCollapsed, handleClick, icon, label } = useAppShellNavigationTrigger(onClick)

  return (
    <IconButton
      data-slot="app-shell-sidebar-trigger"
      variant="ghost"
      size="sm"
      className={cn(bothInlinePanelsCollapsed && '-ml-2 md:-ml-3', className)}
      icon={icon}
      onClick={handleClick}
      title={label}
      aria-label={label}
      {...props}
    />
  )
}

// ─── Main ───────────────────────────────────────────────────────────

export function AppShellMain({ className, ...props }: AppShellProps.Main) {
  return (
    <Sidebar.Inset
      data-slot="app-shell-main"
      className={cn('relative z-0 min-w-0 min-h-0 overflow-hidden', className)}
      {...props}
    />
  )
}

// ─── Content ────────────────────────────────────────────────────────

export function AppShellContent({
  className,
  padding = 'default',
  scroll = 'auto',
  style,
  ...props
}: AppShellProps.Content) {
  return (
    <div
      data-slot="app-shell-content"
      className={cn('min-w-0 flex-1 overflow-x-hidden overflow-y-auto', appShellContent, className)}
      style={{
        ...(padding === 'none' ? { padding: 0 } : null),
        ...(scroll === 'hidden' ? { overflow: 'hidden' } : null),
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Search ─────────────────────────────────────────────────────────

export function AppShellSearch({ color: colorProp, ...props }: AppShellProps.Search) {
  const { color: shellColor } = useAppShell()
  return <CommandSearchInput color={colorProp ?? shellColor} {...props} />
}

// ─── Export ─────────────────────────────────────────────────────────

export const AppShell = {
  Root: AppShellRoot,
  Header: AppShellHeader,
  HeaderInner: AppShellHeaderInner,
  HeaderStart: AppShellHeaderStart,
  HeaderEnd: AppShellHeaderEnd,
  Body: AppShellBody,
  Sidebar: AppShellSidebar,
  SidebarTrigger: AppShellSidebarTrigger,
  Secondary: AppShellSecondary,
  SecondarySidebar: AppShellSecondarySidebar,
  SecondaryContent: AppShellSecondaryContent,
  SecondaryTrigger: AppShellSecondaryTrigger,
  Main: AppShellMain,
  Content: AppShellContent,
  Search: AppShellSearch,
}

export type AppShellRootComponentProps = AppShellProps.Root
