'use client'

import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import type { Color, Radius } from '@/theme/tokens'
import { FloatingArrowSvg } from '../surface/FloatingArrowSvg'
import { floatingArrowBase } from '../surface/surface.class'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  navigationMenuArrowByVariant,
  navigationMenuBackdropBase,
  navigationMenuColor,
  navigationMenuContentBase,
  navigationMenuContentBaseCls,
  navigationMenuContentBySize,
  navigationMenuIconBase,
  navigationMenuIconBaseCls,
  navigationMenuIconBySize,
  navigationMenuItemBaseCls,
  navigationMenuLinkBase,
  navigationMenuLinkBaseCls,
  navigationMenuLinkBySize,
  navigationMenuLinkDescriptionBase,
  navigationMenuLinkDescriptionBySize,
  navigationMenuLinkIconBaseCls,
  navigationMenuLinkTitleBase,
  navigationMenuListBaseCls,
  navigationMenuListVerticalCls,
  navigationMenuPopupBase,
  navigationMenuPopupBaseCls,
  navigationMenuPopupByVariant,
  navigationMenuPopupHighContrast,
  navigationMenuPositionerBase,
  navigationMenuRootBase,
  navigationMenuRootBaseCls,
  navigationMenuRootVerticalCls,
  navigationMenuSimpleLinkBase,
  navigationMenuTriggerBase,
  navigationMenuTriggerBaseCls,
  navigationMenuTriggerBySize,
  navigationMenuViewportBase,
  navigationMenuViewportBaseCls,
} from './NavigationMenu.class'
import { type NavigationMenuSize, type NavigationMenuVariant, navigationMenuPropDefs } from './navigation-menu.props'

type NavigationMenuValue = string | null

type NavigationMenuContextValue = {
  size: NavigationMenuSize
  variant: NavigationMenuVariant
  color: Color
  highContrast: boolean
  radius?: Radius
  orientation: 'horizontal' | 'vertical'
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue>({
  size: navigationMenuPropDefs.Root.size.default,
  variant: navigationMenuPropDefs.Root.variant.default,
  color: SemanticColor.slate,
  highContrast: navigationMenuPropDefs.Root.highContrast.default,
  radius: undefined,
  orientation: 'horizontal',
})

type PrimitiveRootProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
type PrimitiveListProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
type PrimitiveItemProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
type PrimitiveTriggerProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
type PrimitiveIconProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Icon>
type PrimitiveContentProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
type PrimitivePortalProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Portal>
type PrimitivePositionerProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Positioner>
type PrimitiveViewportProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
type PrimitiveArrowProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Arrow>
type PrimitivePopupProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Popup>
type PrimitiveBackdropProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Backdrop>

// ============================================================================
// Root
// ============================================================================

export interface NavigationMenuRootProps
  extends Omit<
    PrimitiveRootProps,
    'className' | 'children' | 'defaultValue' | 'onValueChange' | 'orientation' | 'style' | 'value'
  > {
  /** Controlled active item value. When nullish, the menu is closed. */
  value?: NavigationMenuValue
  /** Initial active item value for uncontrolled usage. */
  defaultValue?: NavigationMenuValue
  /** Called when the active item value changes. */
  onValueChange?: (value: NavigationMenuValue) => void
  /** Navigation menu orientation. */
  orientation?: 'horizontal' | 'vertical'
  /** Control and panel size. */
  size?: NavigationMenuSize
  /** Floating panel visual variant. */
  variant?: NavigationMenuVariant
  /** Accent color for triggers and links. */
  color?: Color
  /** Higher contrast active and focused states. */
  highContrast?: boolean
  /** Border radius token for controls and floating panel. */
  radius?: Radius
  /** Additional class names. */
  className?: string
  /** Inline styles. */
  style?: React.CSSProperties
  /** Navigation menu content. */
  children: React.ReactNode
}

const NavigationMenuRoot = React.forwardRef<HTMLElement, NavigationMenuRootProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      size = navigationMenuPropDefs.Root.size.default,
      variant = navigationMenuPropDefs.Root.variant.default,
      color = SemanticColor.slate,
      highContrast = navigationMenuPropDefs.Root.highContrast.default,
      radius,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const safeSize = (normalizeEnumPropValue(navigationMenuPropDefs.Root.size, size) ??
      navigationMenuPropDefs.Root.size.default) as NavigationMenuSize
    const safeVariant = (normalizeEnumPropValue(navigationMenuPropDefs.Root.variant, variant) ??
      navigationMenuPropDefs.Root.variant.default) as NavigationMenuVariant
    const safeColor = (normalizeEnumPropValue(navigationMenuPropDefs.Root.color, color) ?? SemanticColor.slate) as Color
    const safeHighContrast =
      normalizeBooleanPropValue(navigationMenuPropDefs.Root.highContrast, highContrast) ??
      navigationMenuPropDefs.Root.highContrast.default
    const safeRadius = normalizeEnumPropValue(navigationMenuPropDefs.Root.radius, radius) as Radius | undefined
    const isControlled = value !== undefined

    const handleValueChange = React.useCallback(
      (nextValue: NavigationMenuValue) => {
        const resolvedValue = nextValue ?? null
        onValueChange?.(resolvedValue)
      },
      [onValueChange],
    )

    const contextValue = React.useMemo<NavigationMenuContextValue>(
      () => ({
        size: safeSize,
        variant: safeVariant,
        color: safeColor,
        highContrast: safeHighContrast,
        radius: safeRadius,
        orientation,
      }),
      [orientation, safeColor, safeHighContrast, safeRadius, safeSize, safeVariant],
    )

    return (
      <NavigationMenuContext.Provider value={contextValue}>
        <NavigationMenuPrimitive.Root
          ref={ref}
          value={isControlled ? value : undefined}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          orientation={orientation}
          data-orientation={orientation}
          className={cn(
            navigationMenuRootBaseCls,
            navigationMenuRootBase,
            orientation === 'vertical' && navigationMenuRootVerticalCls,
            safeHighContrast && 'af-high-contrast',
            className,
          )}
          style={style}
          {...props}
        >
          {children}
        </NavigationMenuPrimitive.Root>
      </NavigationMenuContext.Provider>
    )
  },
)

NavigationMenuRoot.displayName = 'NavigationMenu.Root'

// ============================================================================
// List
// ============================================================================

export interface NavigationMenuListProps extends Omit<PrimitiveListProps, 'className' | 'children'> {
  /** Additional class names. */
  className?: string
  /** Menu items. */
  children: React.ReactNode
}

const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = React.useContext(NavigationMenuContext)
    return (
      <NavigationMenuPrimitive.List
        ref={ref}
        className={cn(
          navigationMenuListBaseCls,
          orientation === 'vertical' && navigationMenuListVerticalCls,
          className,
        )}
        {...props}
      >
        {children}
      </NavigationMenuPrimitive.List>
    )
  },
)

NavigationMenuList.displayName = 'NavigationMenu.List'

// ============================================================================
// Item
// ============================================================================

export interface NavigationMenuItemProps extends Omit<PrimitiveItemProps, 'className' | 'children'> {
  /** Additional class names. */
  className?: string
  /** Trigger/link and optional content. */
  children: React.ReactNode
}

const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <NavigationMenuPrimitive.Item ref={ref} className={cn(navigationMenuItemBaseCls, className)} {...props}>
        {children}
      </NavigationMenuPrimitive.Item>
    )
  },
)

NavigationMenuItem.displayName = 'NavigationMenu.Item'

// ============================================================================
// Icon
// ============================================================================

export interface NavigationMenuIconProps extends Omit<PrimitiveIconProps, 'className' | 'children'> {
  /** Additional class names. */
  className?: string
  /** Icon content. Defaults to a chevron. */
  children?: React.ReactNode
}

const NavigationMenuIcon = React.forwardRef<HTMLSpanElement, NavigationMenuIconProps>(
  ({ className, children, ...props }, ref) => {
    const { size } = React.useContext(NavigationMenuContext)
    return (
      <NavigationMenuPrimitive.Icon
        ref={ref}
        className={cn(navigationMenuIconBaseCls, navigationMenuIconBase, navigationMenuIconBySize[size], className)}
        {...props}
      >
        {children ?? <ChevronDown aria-hidden className="h-full w-full" />}
      </NavigationMenuPrimitive.Icon>
    )
  },
)

NavigationMenuIcon.displayName = 'NavigationMenu.Icon'

// ============================================================================
// Trigger
// ============================================================================

export interface NavigationMenuTriggerProps extends Omit<PrimitiveTriggerProps, 'className' | 'children'> {
  /** Additional class names. */
  className?: string
  /** Trigger label/content. */
  children: React.ReactNode
  /** Whether to append the disclosure icon. */
  showIcon?: boolean
}

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  ({ className, children, showIcon = true, ...props }, ref) => {
    const { size, color, highContrast } = React.useContext(NavigationMenuContext)
    return (
      <NavigationMenuPrimitive.Trigger
        ref={ref}
        className={cn(
          navigationMenuTriggerBaseCls,
          navigationMenuTriggerBase,
          navigationMenuTriggerBySize[size],
          navigationMenuColor[color],
          highContrast && 'af-high-contrast',
          className,
        )}
        {...props}
      >
        {children}
        {showIcon ? <NavigationMenuIcon /> : null}
      </NavigationMenuPrimitive.Trigger>
    )
  },
)

NavigationMenuTrigger.displayName = 'NavigationMenu.Trigger'

// ============================================================================
// Content
// ============================================================================

export interface NavigationMenuContentProps extends Omit<PrimitiveContentProps, 'className' | 'children'> {
  /** Additional class names. */
  className?: string
  /** Active item panel content. */
  children: React.ReactNode
}

const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ className, children, ...props }, ref) => {
    const { size } = React.useContext(NavigationMenuContext)
    return (
      <NavigationMenuPrimitive.Content
        ref={ref}
        className={cn(
          navigationMenuContentBaseCls,
          navigationMenuContentBase,
          navigationMenuContentBySize[size],
          className,
        )}
        {...props}
      >
        {children}
      </NavigationMenuPrimitive.Content>
    )
  },
)

NavigationMenuContent.displayName = 'NavigationMenu.Content'

// ============================================================================
// Link
// ============================================================================

export interface NavigationMenuLinkProps extends Omit<PrimitiveLinkProps, 'className' | 'children' | 'title'> {
  /** Additional class names. */
  className?: string
  /** Link content. Used as the title when title is omitted. */
  children?: React.ReactNode
  /** Structured link title. */
  title?: React.ReactNode
  /** Optional supporting text. */
  description?: React.ReactNode
  /** Optional leading icon. */
  icon?: React.ReactNode
}

const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, children, title, description, icon, ...props }, ref) => {
    const { size, color, highContrast } = React.useContext(NavigationMenuContext)
    const hasStructuredContent = title !== undefined || description !== undefined || icon !== undefined
    const primary = title ?? children

    return (
      <NavigationMenuPrimitive.Link
        ref={ref}
        className={cn(
          hasStructuredContent
            ? [navigationMenuLinkBaseCls, navigationMenuLinkBase, navigationMenuLinkBySize[size]]
            : [navigationMenuTriggerBaseCls, navigationMenuSimpleLinkBase, navigationMenuTriggerBySize[size]],
          navigationMenuColor[color],
          highContrast && 'af-high-contrast',
          className,
        )}
        {...props}
      >
        {hasStructuredContent ? (
          <>
            {icon ? <span className={navigationMenuLinkIconBaseCls}>{icon}</span> : null}
            <span className="flex min-w-0 flex-1 flex-col">
              <span className={navigationMenuLinkTitleBase}>{primary}</span>
              {description ? (
                <span className={cn(navigationMenuLinkDescriptionBase, navigationMenuLinkDescriptionBySize[size])}>
                  {description}
                </span>
              ) : null}
            </span>
          </>
        ) : (
          children
        )}
      </NavigationMenuPrimitive.Link>
    )
  },
)

NavigationMenuLink.displayName = 'NavigationMenu.Link'

// ============================================================================
// Portal
// ============================================================================

export interface NavigationMenuPortalProps extends Omit<PrimitivePortalProps, 'children'> {
  /** Portal content. */
  children: React.ReactNode
}

const NavigationMenuPortal = React.forwardRef<HTMLDivElement, NavigationMenuPortalProps>(
  ({ children, container, ...props }, ref) => {
    const themePortalContainer = useThemePortalContainer()
    return (
      <NavigationMenuPrimitive.Portal ref={ref} container={container ?? themePortalContainer} {...props}>
        {children}
      </NavigationMenuPrimitive.Portal>
    )
  },
)

NavigationMenuPortal.displayName = 'NavigationMenu.Portal'

// ============================================================================
// Positioner
// ============================================================================

export interface NavigationMenuPositionerProps extends Omit<PrimitivePositionerProps, 'className' | 'children'> {
  /** Additional class names. */
  className?: string
  /** Positioned popup. */
  children: React.ReactNode
}

const NavigationMenuPositioner = React.forwardRef<HTMLDivElement, NavigationMenuPositionerProps>(
  ({ className, children, sideOffset = 10, ...props }, ref) => {
    return (
      <NavigationMenuPrimitive.Positioner
        ref={ref}
        sideOffset={sideOffset}
        className={cn(navigationMenuPositionerBase, className)}
        {...props}
      >
        {children}
      </NavigationMenuPrimitive.Positioner>
    )
  },
)

NavigationMenuPositioner.displayName = 'NavigationMenu.Positioner'

// ============================================================================
// Viewport
// ============================================================================

export interface NavigationMenuViewportProps extends Omit<PrimitiveViewportProps, 'className'> {
  /** Additional class names. */
  className?: string
}

const NavigationMenuViewport = React.forwardRef<HTMLDivElement, NavigationMenuViewportProps>(
  ({ className, ...props }, ref) => {
    return (
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        className={cn(navigationMenuViewportBaseCls, navigationMenuViewportBase, className)}
        {...props}
      />
    )
  },
)

NavigationMenuViewport.displayName = 'NavigationMenu.Viewport'

// ============================================================================
// Arrow
// ============================================================================

export interface NavigationMenuArrowProps extends Omit<PrimitiveArrowProps, 'className' | 'children'> {
  /** Additional class names. */
  className?: string
  /** Floating panel variant. Defaults to the root variant. */
  variant?: NavigationMenuVariant
  /** Arrow content. Defaults to the shared floating arrow SVG. */
  children?: React.ReactNode
}

const NavigationMenuArrow = React.forwardRef<HTMLDivElement, NavigationMenuArrowProps>(
  ({ className, variant, children, ...props }, ref) => {
    const context = React.useContext(NavigationMenuContext)
    const safeVariant = (normalizeEnumPropValue(navigationMenuPropDefs.Root.variant, variant ?? context.variant) ??
      navigationMenuPropDefs.Root.variant.default) as NavigationMenuVariant
    return (
      <NavigationMenuPrimitive.Arrow
        ref={ref}
        className={cn(floatingArrowBase, navigationMenuArrowByVariant[safeVariant], className)}
        {...props}
      >
        {children ?? <FloatingArrowSvg />}
      </NavigationMenuPrimitive.Arrow>
    )
  },
)

NavigationMenuArrow.displayName = 'NavigationMenu.Arrow'

// ============================================================================
// Popup
// ============================================================================

export interface NavigationMenuPopupProps extends Omit<PrimitivePopupProps, 'className' | 'children' | 'style'> {
  /** Floating panel variant. Defaults to the root variant. */
  variant?: NavigationMenuVariant
  /** Higher contrast border treatment. Defaults to the root setting. */
  highContrast?: boolean
  /** Border radius token. Defaults to the root radius. */
  radius?: Radius
  /** Additional class names. */
  className?: string
  /** Inline styles. */
  style?: React.CSSProperties
  /** Popup content. Defaults to Arrow + Viewport. */
  children?: React.ReactNode
}

const NavigationMenuPopup = React.forwardRef<HTMLElement, NavigationMenuPopupProps>(
  ({ className, children, variant, highContrast, radius: radiusProp, style, ...props }, ref) => {
    const context = React.useContext(NavigationMenuContext)
    const safeVariant = (normalizeEnumPropValue(navigationMenuPropDefs.Root.variant, variant ?? context.variant) ??
      navigationMenuPropDefs.Root.variant.default) as NavigationMenuVariant
    const safeHighContrast =
      normalizeBooleanPropValue(navigationMenuPropDefs.Root.highContrast, highContrast ?? context.highContrast) ??
      navigationMenuPropDefs.Root.highContrast.default
    const safeRadius = normalizeEnumPropValue(navigationMenuPropDefs.Root.radius, radiusProp ?? context.radius) as
      | Radius
      | undefined
    const radius = useThemeRadius(safeRadius)

    return (
      <NavigationMenuPrimitive.Popup
        ref={ref}
        className={cn(
          navigationMenuPopupBaseCls,
          navigationMenuPopupBase,
          navigationMenuPopupByVariant[safeVariant],
          safeHighContrast && navigationMenuPopupHighContrast,
          className,
        )}
        style={{ ...getRadiusStyles(radius), ...style }}
        {...props}
      >
        {children ?? (
          <>
            <NavigationMenuArrow variant={safeVariant} />
            <NavigationMenuViewport />
          </>
        )}
      </NavigationMenuPrimitive.Popup>
    )
  },
)

NavigationMenuPopup.displayName = 'NavigationMenu.Popup'

// ============================================================================
// Backdrop
// ============================================================================

export interface NavigationMenuBackdropProps extends Omit<PrimitiveBackdropProps, 'className'> {
  /** Additional class names. */
  className?: string
}

const NavigationMenuBackdrop = React.forwardRef<HTMLDivElement, NavigationMenuBackdropProps>(
  ({ className, ...props }, ref) => {
    return (
      <NavigationMenuPrimitive.Backdrop ref={ref} className={cn(navigationMenuBackdropBase, className)} {...props} />
    )
  },
)

NavigationMenuBackdrop.displayName = 'NavigationMenu.Backdrop'

/** Navigation menu export. */
export const NavigationMenu = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Icon: NavigationMenuIcon,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Portal: NavigationMenuPortal,
  Positioner: NavigationMenuPositioner,
  Popup: NavigationMenuPopup,
  Viewport: NavigationMenuViewport,
  Arrow: NavigationMenuArrow,
  Backdrop: NavigationMenuBackdrop,
}

export namespace NavigationMenuProps {
  export type Root = NavigationMenuRootProps
  export type List = NavigationMenuListProps
  export type Item = NavigationMenuItemProps
  export type Trigger = NavigationMenuTriggerProps
  export type Icon = NavigationMenuIconProps
  export type Content = NavigationMenuContentProps
  export type Link = NavigationMenuLinkProps
  export type Portal = NavigationMenuPortalProps
  export type Positioner = NavigationMenuPositionerProps
  export type Popup = NavigationMenuPopupProps
  export type Viewport = NavigationMenuViewportProps
  export type Arrow = NavigationMenuArrowProps
  export type Backdrop = NavigationMenuBackdropProps
}

export type { NavigationMenuSize, NavigationMenuValue, NavigationMenuVariant }
