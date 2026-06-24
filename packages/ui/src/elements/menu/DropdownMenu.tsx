'use client'

import './menu.css'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { Check, ChevronDown, ChevronRight, ChevronsUpDown, Circle } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { getRadiusStyles, getSizeStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import type { Color, Radius } from '@/theme/tokens'
import { getShortcutAccessibleLabel } from './menu.a11y'
import {
  menuContentBase,
  menuContentByVariant,
  menuIndicatorBaseCls,
  menuItemBase,
  menuItemBaseCls,
  menuItemMotion,
  menuItemTextBold,
  menuItemTextItalic,
  menuItemTextStrikethrough,
  menuLabelBase,
  menuLabelBaseCls,
  menuPanelTransition,
  menuPanelVariants,
  menuPopupBaseCls,
  menuPopupOverflowVisibleCls,
  menuPositionerBase,
  menuSeparatorBase,
  menuShortcutBase,
  menuShortcutBaseCls,
  menuSubTriggerIcon,
  menuSubTriggerIconCls,
  menuViewportBase,
  menuViewportBaseCls,
} from './menu.class'
import type { MenuSize, MenuVariant } from './menu.props'
import { MenuHighlight } from './menu-highlight'

// Context for sharing props
interface DropdownMenuContextValue {
  size: MenuSize
  variant: MenuVariant
  color: Color
  radius: Radius
  animated: boolean
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  size: 'md',
  variant: 'solid',
  color: SemanticColor.slate,
  radius: 'md',
  animated: false,
})

const DropdownMenuOpenContext = React.createContext<boolean>(false)

type ItemTextStyleProps = {
  children: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  bold?: boolean
  italic?: boolean
  strikethrough?: boolean
}

function DropdownMenuItemLabel({ children, title, subtitle, bold, italic, strikethrough }: ItemTextStyleProps) {
  const primary = title ?? children
  const hasSubtitle = subtitle !== undefined && subtitle !== null

  return (
    <span className="flex min-w-0 flex-1 flex-col">
      <span
        className={cn(
          'truncate',
          bold && menuItemTextBold,
          italic && menuItemTextItalic,
          strikethrough && menuItemTextStrikethrough,
        )}
      >
        {primary}
      </span>
      {hasSubtitle ? <span className="truncate text-xs text-foreground/70">{subtitle}</span> : null}
    </span>
  )
}

// ============================================================================
// Root
// ============================================================================

export interface DropdownMenuRootProps {
  children: React.ReactNode
  /** Whether menu is open */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
}

const DropdownMenuRoot: React.FC<DropdownMenuRootProps> = ({ children, open: openProp, defaultOpen, onOpenChange }) => {
  const isControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const isOpen = isControlled ? openProp : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  return (
    <DropdownMenuOpenContext.Provider value={isOpen}>
      <MenuPrimitive.Root open={openProp} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
        {children}
      </MenuPrimitive.Root>
    </DropdownMenuOpenContext.Provider>
  )
}

DropdownMenuRoot.displayName = 'DropdownMenu.Root'

// ============================================================================
// Trigger
// ============================================================================

export type DropdownMenuArrow = 'down' | 'updown'

export interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
  showTriggerIcon?: boolean
  /** Arrow icon style. `'down'` renders a chevron-down (default), `'updown'` renders an up-down arrows icon. */
  arrow?: DropdownMenuArrow
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ children, className, showTriggerIcon = false, arrow = 'down', ...props }, ref) => {
    if (React.isValidElement(children)) {
      type TriggerChildProps = React.HTMLAttributes<HTMLElement> & {
        className?: string
        children?: React.ReactNode
      }
      const childElement = children as React.ReactElement<TriggerChildProps>
      const triggerChildren = showTriggerIcon ? (
        <>
          {childElement.props.children}
          <DropdownMenuTriggerIcon arrow={arrow} />
        </>
      ) : (
        childElement.props.children
      )

      return (
        <MenuPrimitive.Trigger
          ref={ref}
          render={(triggerProps: React.HTMLAttributes<HTMLElement>) => {
            // `@base-ui` forwards trigger render props to the host element.
            // Strip non-DOM props to avoid React unknown-prop warnings.
            const {
              className: triggerClassName,
              color: _ignoredColor,
              size: _ignoredSize,
              ...safeTriggerProps
            } = triggerProps as React.HTMLAttributes<HTMLElement> & { color?: unknown; size?: unknown }
            const childProps = childElement.props
            const safeHandlers = safeTriggerProps as React.HTMLAttributes<HTMLElement>
            const compose =
              <E,>(baseHandler?: (event: E) => void, childHandler?: (event: E) => void) =>
              (event: E) => {
                baseHandler?.(event)
                childHandler?.(event)
              }

            return React.cloneElement(childElement, {
              ...(safeTriggerProps as object),
              onClick: compose(safeHandlers.onClick, childProps.onClick),
              onKeyDown: compose(safeHandlers.onKeyDown, childProps.onKeyDown),
              className: cn(triggerClassName, childElement.props.className, 'outline-none', className),
              children: triggerChildren,
            })
          }}
          {...props}
        />
      )
    }

    return (
      <MenuPrimitive.Trigger ref={ref} className={cn('outline-none', className)} {...props}>
        {children}
        {showTriggerIcon ? <DropdownMenuTriggerIcon arrow={arrow} /> : null}
      </MenuPrimitive.Trigger>
    )
  },
)

DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger'

// ============================================================================
// TriggerIcon
// ============================================================================

export interface DropdownMenuTriggerIconProps {
  className?: string
  /** Arrow icon style. `'down'` renders a chevron-down (default), `'updown'` renders an up-down arrows icon. */
  arrow?: DropdownMenuArrow
}

const DropdownMenuTriggerIcon = ({ className, arrow = 'down' }: DropdownMenuTriggerIconProps) => {
  const Icon = arrow === 'updown' ? ChevronsUpDown : ChevronDown
  return <Icon aria-hidden className={cn('ml-1 h-4 w-4 opacity-70', className)} />
}

DropdownMenuTriggerIcon.displayName = 'DropdownMenu.TriggerIcon'

// ============================================================================
// Content
// ============================================================================

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the menu */
  size?: MenuSize
  /** Visual variant */
  variant?: MenuVariant
  /** Accent color */
  color?: Color
  /** Border radius token */
  radius?: Radius
  /** Side of trigger to open */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Alignment relative to trigger */
  align?: 'start' | 'center' | 'end'
  /** Side offset from trigger */
  sideOffset?: number
  /** Portal container element (overrides default theme container) */
  container?: HTMLElement | null
  /** Animate highlight to follow focused/hovered items */
  animated?: boolean
  /** Maximum height constraint */
  maxHeight?: React.CSSProperties['maxHeight']
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (
    {
      size = 'md',
      variant = 'solid',
      color = SemanticColor.slate,
      radius: radiusProp,
      className,
      style,
      children,
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      container: containerProp,
      animated = false,
      maxHeight = 'var(--available-height)',
      ...props
    },
    ref,
  ) => {
    const radius = useThemeRadius(radiusProp)
    const themePortalContainer = useThemePortalContainer()
    const portalContainer = containerProp ?? themePortalContainer
    const isOpen = React.useContext(DropdownMenuOpenContext)

    const viewport = <div className={cn(menuViewportBaseCls, menuViewportBase)}>{children}</div>

    return (
      <DropdownMenuContext.Provider value={{ size, variant, color, radius, animated }}>
        <AnimatePresence>
          {isOpen && (
            <MenuPrimitive.Portal keepMounted container={portalContainer}>
              <MenuPrimitive.Positioner
                className={menuPositionerBase}
                side={side}
                align={align}
                sideOffset={sideOffset}
              >
                <MenuPrimitive.Popup
                  ref={ref}
                  render={
                    <m.div
                      key="dropdown-menu-popup"
                      variants={menuPanelVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={menuPanelTransition}
                    />
                  }
                  className={cn(
                    menuPopupBaseCls,
                    'af-PopperContent',
                    'origin-[var(--transform-origin)]',
                    menuContentBase,
                    menuContentByVariant[variant],
                    `surface-color-${color}`,
                    className,
                  )}
                  style={{ maxHeight, ...getRadiusStyles(radius), ...getSizeStyles(size), ...style }}
                  data-animated={animated ? '' : undefined}
                  {...props}
                >
                  {animated ? <MenuHighlight>{viewport}</MenuHighlight> : viewport}
                </MenuPrimitive.Popup>
              </MenuPrimitive.Positioner>
            </MenuPrimitive.Portal>
          )}
        </AnimatePresence>
      </DropdownMenuContext.Provider>
    )
  },
)

DropdownMenuContent.displayName = 'DropdownMenu.Content'

// ============================================================================
// Item
// ============================================================================

export interface DropdownMenuItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>,
    'color' | 'children' | 'className' | 'title' | 'subtitle' | 'onClick'
  > {
  /** Color override for this item */
  color?: Color
  /** Primary title; defaults to children when omitted */
  title?: React.ReactNode
  /** Secondary subtitle rendered below title */
  subtitle?: React.ReactNode
  /** Keyboard shortcut to display */
  shortcut?: string
  /** Whether the item is disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
  /** Item content */
  children: React.ReactNode
  /** Render item label in bold */
  bold?: boolean
  /** Render item label in italic */
  italic?: boolean
  /** Render item label with strikethrough */
  strikethrough?: boolean
  /** Click handler */
  onClick?: () => void
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  (
    { color, title, subtitle, shortcut, disabled, className, children, bold, italic, strikethrough, onClick, ...props },
    ref,
  ) => {
    const context = React.useContext(DropdownMenuContext)
    const itemColor = color || context.color
    const ariaLabel = getShortcutAccessibleLabel(title ?? children, shortcut)

    return (
      <MenuPrimitive.Item
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        className={cn(menuItemBaseCls, menuItemBase, menuItemMotion, `surface-color-${itemColor}`, className)}
        style={{ ...getSizeStyles(context.size), ...props.style }}
        {...props}
      >
        <DropdownMenuItemLabel
          title={title}
          subtitle={subtitle}
          bold={bold}
          italic={italic}
          strikethrough={strikethrough}
        >
          {children}
        </DropdownMenuItemLabel>
        {shortcut && <span className={cn(menuShortcutBaseCls, menuShortcutBase)}>{shortcut}</span>}
      </MenuPrimitive.Item>
    )
  },
)

DropdownMenuItem.displayName = 'DropdownMenu.Item'

// ============================================================================
// CheckboxItem
// ============================================================================

export interface DropdownMenuCheckboxItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>,
    'color' | 'children' | 'className' | 'checked' | 'onCheckedChange'
  > {
  /** Whether the item is checked */
  checked?: boolean
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Color override */
  color?: Color
  /** Keyboard shortcut */
  shortcut?: string
  /** Whether disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
  /** Item content */
  children: React.ReactNode
  /** Render item label in bold */
  bold?: boolean
  /** Render item label in italic */
  italic?: boolean
  /** Render item label with strikethrough */
  strikethrough?: boolean
}

const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  (
    { checked, onCheckedChange, color, shortcut, disabled, className, children, bold, italic, strikethrough, ...props },
    ref,
  ) => {
    const context = React.useContext(DropdownMenuContext)
    const itemColor = color || context.color
    const ariaLabel = getShortcutAccessibleLabel(children, shortcut)

    return (
      <MenuPrimitive.CheckboxItem
        ref={ref}
        aria-label={ariaLabel}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(menuItemBaseCls, menuItemBase, menuItemMotion, `surface-color-${itemColor}`, className)}
        style={{ ...getSizeStyles(context.size), ...props.style }}
        {...props}
      >
        <span className={cn(menuIndicatorBaseCls)}>
          <MenuPrimitive.CheckboxItemIndicator>
            <Check strokeWidth={2.5} />
          </MenuPrimitive.CheckboxItemIndicator>
        </span>
        <DropdownMenuItemLabel bold={bold} italic={italic} strikethrough={strikethrough}>
          {children}
        </DropdownMenuItemLabel>
        {shortcut && <span className={cn(menuShortcutBaseCls, menuShortcutBase)}>{shortcut}</span>}
      </MenuPrimitive.CheckboxItem>
    )
  },
)

DropdownMenuCheckboxItem.displayName = 'DropdownMenu.CheckboxItem'

// ============================================================================
// RadioGroup
// ============================================================================

export interface DropdownMenuRadioGroupProps {
  /** Current value */
  value?: string
  /** Callback when value changes */
  onValueChange?: (value: string) => void
  /** Radio items */
  children: React.ReactNode
}

const DropdownMenuRadioGroup = React.forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
  ({ value, onValueChange, children, ...props }, ref) => {
    return (
      <MenuPrimitive.RadioGroup ref={ref} value={value} onValueChange={onValueChange} {...props}>
        {children}
      </MenuPrimitive.RadioGroup>
    )
  },
)

DropdownMenuRadioGroup.displayName = 'DropdownMenu.RadioGroup'

// ============================================================================
// RadioItem
// ============================================================================

export interface DropdownMenuRadioItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>,
    'color' | 'children' | 'className' | 'value'
  > {
  /** Value of this radio item */
  value: string
  /** Color override */
  color?: Color
  /** Whether disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
  /** Item content */
  children: React.ReactNode
  /** Render item label in bold */
  bold?: boolean
  /** Render item label in italic */
  italic?: boolean
  /** Render item label with strikethrough */
  strikethrough?: boolean
}

const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ value, color, disabled, className, children, bold, italic, strikethrough, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext)
    const itemColor = color || context.color

    return (
      <MenuPrimitive.RadioItem
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(menuItemBaseCls, menuItemBase, menuItemMotion, `surface-color-${itemColor}`, className)}
        style={{ ...getSizeStyles(context.size), ...props.style }}
        {...props}
      >
        <span className={cn(menuIndicatorBaseCls)}>
          <MenuPrimitive.RadioItemIndicator>
            <Circle className="fill-current" strokeWidth={0} />
          </MenuPrimitive.RadioItemIndicator>
        </span>
        <DropdownMenuItemLabel bold={bold} italic={italic} strikethrough={strikethrough}>
          {children}
        </DropdownMenuItemLabel>
      </MenuPrimitive.RadioItem>
    )
  },
)

DropdownMenuRadioItem.displayName = 'DropdownMenu.RadioItem'

// ============================================================================
// Label
// ============================================================================

export interface DropdownMenuLabelProps {
  /** Additional class names */
  className?: string
  /** Label content */
  children: React.ReactNode
}

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(menuLabelBaseCls, menuLabelBase, className)} {...props}>
        {children}
      </div>
    )
  },
)

DropdownMenuLabel.displayName = 'DropdownMenu.Label'

// ============================================================================
// Group
// ============================================================================

export interface DropdownMenuGroupProps {
  /** Additional class names */
  className?: string
  /** Group content */
  children: React.ReactNode
}

const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <MenuPrimitive.Group ref={ref} className={className} {...props}>
        {children}
      </MenuPrimitive.Group>
    )
  },
)

DropdownMenuGroup.displayName = 'DropdownMenu.Group'

// ============================================================================
// Separator
// ============================================================================

export interface DropdownMenuSeparatorProps {
  /** Additional class names */
  className?: string
}

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return <MenuPrimitive.Separator ref={ref} className={cn(menuSeparatorBase, className)} {...props} />
  },
)

DropdownMenuSeparator.displayName = 'DropdownMenu.Separator'

// ============================================================================
// Sub (Submenu)
// ============================================================================

const DropdownMenuSubOpenContext = React.createContext<boolean>(false)

export interface DropdownMenuSubProps {
  /** Whether the submenu is open */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Submenu content */
  children: React.ReactNode
}

const DropdownMenuSub: React.FC<DropdownMenuSubProps> = ({ open: openProp, onOpenChange, children }) => {
  const isControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isOpen = isControlled ? openProp : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!isControlled) setUncontrolledOpen(open)
      onOpenChange?.(open)
    },
    [isControlled, onOpenChange],
  )

  return (
    <DropdownMenuSubOpenContext.Provider value={isOpen}>
      <MenuPrimitive.SubmenuRoot open={openProp} onOpenChange={handleOpenChange}>
        {children}
      </MenuPrimitive.SubmenuRoot>
    </DropdownMenuSubOpenContext.Provider>
  )
}

DropdownMenuSub.displayName = 'DropdownMenu.Sub'

// ============================================================================
// SubTrigger
// ============================================================================

export interface DropdownMenuSubTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuTrigger>,
    'children' | 'className' | 'color'
  > {
  /** Color override */
  color?: Color
  /** Whether disabled */
  disabled?: boolean
  /** Additional class names */
  className?: string
  /** Trigger content */
  children: React.ReactNode
  /** Render item label in bold */
  bold?: boolean
  /** Render item label in italic */
  italic?: boolean
  /** Render item label with strikethrough */
  strikethrough?: boolean
}

const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
  ({ color, disabled, className, children, bold, italic, strikethrough, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext)
    const itemColor = color || context.color

    return (
      <MenuPrimitive.SubmenuTrigger
        ref={ref}
        disabled={disabled}
        className={cn(menuItemBaseCls, menuItemBase, menuItemMotion, `surface-color-${itemColor}`, className)}
        style={{ ...getSizeStyles(context.size), ...props.style }}
        {...props}
      >
        <DropdownMenuItemLabel bold={bold} italic={italic} strikethrough={strikethrough}>
          {children}
        </DropdownMenuItemLabel>
        <ChevronRight className={cn(menuSubTriggerIconCls, menuSubTriggerIcon)} />
      </MenuPrimitive.SubmenuTrigger>
    )
  },
)

DropdownMenuSubTrigger.displayName = 'DropdownMenu.SubTrigger'

// ============================================================================
// SubContent
// ============================================================================

export interface DropdownMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names */
  className?: string
  /** Additional class names for the submenu viewport */
  viewportClassName?: string
  /** Allow content to overflow the popup boundary */
  overflowVisible?: boolean
  /** Submenu items */
  children: React.ReactNode
  /** Side offset */
  sideOffset?: number
  /** Side of trigger to open */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Maximum height constraint */
  maxHeight?: React.CSSProperties['maxHeight']
}

const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  (
    {
      className,
      viewportClassName,
      overflowVisible = false,
      children,
      sideOffset = 2,
      side = 'right',
      maxHeight = 'var(--available-height)',
      style,
      ...props
    },
    ref,
  ) => {
    const context = React.useContext(DropdownMenuContext)
    const portalContainer = useThemePortalContainer()
    const isSubOpen = React.useContext(DropdownMenuSubOpenContext)

    return (
      <AnimatePresence>
        {isSubOpen && (
          <MenuPrimitive.Portal keepMounted container={portalContainer}>
            <MenuPrimitive.Positioner className={menuPositionerBase} sideOffset={sideOffset} side={side} align="start">
              <MenuPrimitive.Popup
                ref={ref}
                render={
                  <m.div
                    key="dropdown-submenu-popup"
                    variants={menuPanelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={menuPanelTransition}
                  />
                }
                className={cn(
                  menuPopupBaseCls,
                  'origin-[var(--transform-origin)]',
                  overflowVisible && menuPopupOverflowVisibleCls,
                  menuContentBase,
                  menuContentByVariant[context.variant],
                  className,
                )}
                style={{ maxHeight, ...getRadiusStyles(context.radius), ...getSizeStyles(context.size), ...style }}
                data-animated={context.animated ? '' : undefined}
                {...props}
              >
                {context.animated ? (
                  <MenuHighlight>
                    <div className={cn(menuViewportBaseCls, menuViewportBase, viewportClassName)}>{children}</div>
                  </MenuHighlight>
                ) : (
                  <div className={cn(menuViewportBaseCls, menuViewportBase, viewportClassName)}>{children}</div>
                )}
              </MenuPrimitive.Popup>
            </MenuPrimitive.Positioner>
          </MenuPrimitive.Portal>
        )}
      </AnimatePresence>
    )
  },
)

DropdownMenuSubContent.displayName = 'DropdownMenu.SubContent'

// ============================================================================
// Export compound component
// ============================================================================

/** DropdownMenu export. */
export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  TriggerIcon: DropdownMenuTriggerIcon,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Group: DropdownMenuGroup,
  Separator: DropdownMenuSeparator,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
}

export namespace DropdownMenuProps {
  export type Arrow = DropdownMenuArrow
  export type Root = DropdownMenuRootProps
  export type Trigger = DropdownMenuTriggerProps
  export type TriggerIcon = DropdownMenuTriggerIconProps
  export type Content = DropdownMenuContentProps
  export type Item = DropdownMenuItemProps
  export type CheckboxItem = DropdownMenuCheckboxItemProps
  export type RadioGroup = DropdownMenuRadioGroupProps
  export type RadioItem = DropdownMenuRadioItemProps
  export type Label = DropdownMenuLabelProps
  export type Group = DropdownMenuGroupProps
  export type Separator = DropdownMenuSeparatorProps
  export type Sub = DropdownMenuSubProps
  export type SubTrigger = DropdownMenuSubTriggerProps
  export type SubContent = DropdownMenuSubContentProps
}
