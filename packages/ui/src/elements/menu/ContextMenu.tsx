'use client'

import './menu.css'

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
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

// Context for sharing props across components
interface ContextMenuContextValue {
  size: MenuSize
  variant: MenuVariant
  color: Color
  animated: boolean
}

const ContextMenuContext = React.createContext<ContextMenuContextValue>({
  size: 'md',
  variant: 'solid',
  color: SemanticColor.slate,
  animated: false,
})

const ContextMenuOpenContext = React.createContext<boolean>(false)

// ============================================================================

// ============================================================================
// Root
// ============================================================================

export interface ContextMenuRootProps {
  /** Whether the context menu is open */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const ContextMenuRoot: React.FC<ContextMenuRootProps> = ({ open: openProp, onOpenChange, children }) => {
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
    <ContextMenuOpenContext.Provider value={isOpen}>
      <ContextMenuPrimitive.Root open={openProp} onOpenChange={handleOpenChange}>
        {children}
      </ContextMenuPrimitive.Root>
    </ContextMenuOpenContext.Provider>
  )
}

ContextMenuRoot.displayName = 'ContextMenu.Root'

// ============================================================================
// Trigger
// ============================================================================

export interface ContextMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

const ContextMenuTrigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ContextMenuPrimitive.Trigger ref={ref} className={cn('outline-none', className)} {...props}>
        {children}
      </ContextMenuPrimitive.Trigger>
    )
  },
)

ContextMenuTrigger.displayName = 'ContextMenu.Trigger'

// ============================================================================
// Content
// ============================================================================

export interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the menu */
  size?: MenuSize
  /** Visual variant */
  variant?: MenuVariant
  /** Accent color for item highlights */
  color?: Color
  /** Border radius token */
  radius?: Radius
  /** Animate highlight to follow focused/hovered items */
  animated?: boolean
  /** Maximum height constraint */
  maxHeight?: React.CSSProperties['maxHeight']
}

const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  (
    {
      size = 'md',
      variant = 'solid',
      color = SemanticColor.slate,
      radius: radiusProp,
      className,
      style,
      children,
      animated = false,
      maxHeight = 'var(--available-height)',
      ...props
    },
    ref,
  ) => {
    const radius = useThemeRadius(radiusProp)
    const portalContainer = useThemePortalContainer()
    const isOpen = React.useContext(ContextMenuOpenContext)

    const viewport = <div className={cn(menuViewportBaseCls, menuViewportBase)}>{children}</div>

    return (
      <ContextMenuContext.Provider value={{ size, variant, color, animated }}>
        <AnimatePresence>
          {isOpen && (
            <ContextMenuPrimitive.Portal keepMounted container={portalContainer}>
              <ContextMenuPrimitive.Positioner className={menuPositionerBase}>
                <ContextMenuPrimitive.Popup
                  ref={ref}
                  render={
                    <m.div
                      key="context-menu-popup"
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
                </ContextMenuPrimitive.Popup>
              </ContextMenuPrimitive.Positioner>
            </ContextMenuPrimitive.Portal>
          )}
        </AnimatePresence>
      </ContextMenuContext.Provider>
    )
  },
)

ContextMenuContent.displayName = 'ContextMenu.Content'

// ============================================================================
// Item
// ============================================================================

export interface ContextMenuItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
    'color' | 'children' | 'className' | 'onClick'
  > {
  /** Color override for this item */
  color?: Color
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

const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ color, shortcut, disabled, className, children, bold, italic, strikethrough, onClick, ...props }, ref) => {
    const context = React.useContext(ContextMenuContext)
    const itemColor = color || context.color
    const ariaLabel = getShortcutAccessibleLabel(children, shortcut)

    return (
      <ContextMenuPrimitive.Item
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        className={cn(menuItemBaseCls, menuItemBase, menuItemMotion, `surface-color-${itemColor}`, className)}
        style={{ ...getSizeStyles(context.size), ...props.style }}
        {...props}
      >
        <span
          className={cn(
            'flex-1',
            bold && menuItemTextBold,
            italic && menuItemTextItalic,
            strikethrough && menuItemTextStrikethrough,
          )}
        >
          {children}
        </span>
        {shortcut && <span className={cn(menuShortcutBaseCls, menuShortcutBase)}>{shortcut}</span>}
      </ContextMenuPrimitive.Item>
    )
  },
)

ContextMenuItem.displayName = 'ContextMenu.Item'

// ============================================================================
// CheckboxItem
// ============================================================================

export interface ContextMenuCheckboxItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>,
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

const ContextMenuCheckboxItem = React.forwardRef<HTMLDivElement, ContextMenuCheckboxItemProps>(
  (
    { checked, onCheckedChange, color, shortcut, disabled, className, children, bold, italic, strikethrough, ...props },
    ref,
  ) => {
    const context = React.useContext(ContextMenuContext)
    const itemColor = color || context.color
    const ariaLabel = getShortcutAccessibleLabel(children, shortcut)

    return (
      <ContextMenuPrimitive.CheckboxItem
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
          <ContextMenuPrimitive.CheckboxItemIndicator>
            <Check strokeWidth={2.5} />
          </ContextMenuPrimitive.CheckboxItemIndicator>
        </span>
        <span
          className={cn(
            'flex-1',
            bold && menuItemTextBold,
            italic && menuItemTextItalic,
            strikethrough && menuItemTextStrikethrough,
          )}
        >
          {children}
        </span>
        {shortcut && <span className={cn(menuShortcutBaseCls, menuShortcutBase)}>{shortcut}</span>}
      </ContextMenuPrimitive.CheckboxItem>
    )
  },
)

ContextMenuCheckboxItem.displayName = 'ContextMenu.CheckboxItem'

// ============================================================================
// RadioGroup
// ============================================================================

export interface ContextMenuRadioGroupProps {
  /** Current value */
  value?: string
  /** Callback when value changes */
  onValueChange?: (value: string) => void
  /** Radio items */
  children: React.ReactNode
}

const ContextMenuRadioGroup = React.forwardRef<HTMLDivElement, ContextMenuRadioGroupProps>(
  ({ value, onValueChange, children, ...props }, ref) => {
    return (
      <ContextMenuPrimitive.RadioGroup ref={ref} value={value} onValueChange={onValueChange} {...props}>
        {children}
      </ContextMenuPrimitive.RadioGroup>
    )
  },
)

ContextMenuRadioGroup.displayName = 'ContextMenu.RadioGroup'

// ============================================================================
// RadioItem
// ============================================================================

export interface ContextMenuRadioItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>,
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

const ContextMenuRadioItem = React.forwardRef<HTMLDivElement, ContextMenuRadioItemProps>(
  ({ value, color, disabled, className, children, bold, italic, strikethrough, ...props }, ref) => {
    const context = React.useContext(ContextMenuContext)
    const itemColor = color || context.color

    return (
      <ContextMenuPrimitive.RadioItem
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(menuItemBaseCls, menuItemBase, menuItemMotion, `surface-color-${itemColor}`, className)}
        style={{ ...getSizeStyles(context.size), ...props.style }}
        {...props}
      >
        <span className={cn(menuIndicatorBaseCls)}>
          <ContextMenuPrimitive.RadioItemIndicator>
            <Circle className="fill-current" strokeWidth={0} />
          </ContextMenuPrimitive.RadioItemIndicator>
        </span>
        <span
          className={cn(
            'flex-1',
            bold && menuItemTextBold,
            italic && menuItemTextItalic,
            strikethrough && menuItemTextStrikethrough,
          )}
        >
          {children}
        </span>
      </ContextMenuPrimitive.RadioItem>
    )
  },
)

ContextMenuRadioItem.displayName = 'ContextMenu.RadioItem'

// ============================================================================
// Label
// ============================================================================

export interface ContextMenuLabelProps {
  /** Additional class names */
  className?: string
  /** Label content */
  children: React.ReactNode
}

const ContextMenuLabel = React.forwardRef<HTMLDivElement, ContextMenuLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(menuLabelBaseCls, menuLabelBase, className)} {...props}>
        {children}
      </div>
    )
  },
)

ContextMenuLabel.displayName = 'ContextMenu.Label'

// ============================================================================
// Group
// ============================================================================

export interface ContextMenuGroupProps {
  /** Additional class names */
  className?: string
  /** Group content */
  children: React.ReactNode
}

const ContextMenuGroup = React.forwardRef<HTMLDivElement, ContextMenuGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ContextMenuPrimitive.Group ref={ref} className={className} {...props}>
        {children}
      </ContextMenuPrimitive.Group>
    )
  },
)

ContextMenuGroup.displayName = 'ContextMenu.Group'

// ============================================================================
// Separator
// ============================================================================

export interface ContextMenuSeparatorProps {
  /** Additional class names */
  className?: string
}

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return <ContextMenuPrimitive.Separator ref={ref} className={cn(menuSeparatorBase, className)} {...props} />
  },
)

ContextMenuSeparator.displayName = 'ContextMenu.Separator'

// ============================================================================
// Sub (Submenu)
// ============================================================================

export interface ContextMenuSubProps {
  /** Submenu content */
  children: React.ReactNode
}

const ContextMenuSub: React.FC<ContextMenuSubProps> = ({ children }) => {
  return <ContextMenuPrimitive.SubmenuRoot>{children}</ContextMenuPrimitive.SubmenuRoot>
}

ContextMenuSub.displayName = 'ContextMenu.Sub'

// ============================================================================
// SubTrigger
// ============================================================================

export interface ContextMenuSubTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubmenuTrigger>,
    'color' | 'children' | 'className'
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

const ContextMenuSubTrigger = React.forwardRef<HTMLDivElement, ContextMenuSubTriggerProps>(
  ({ color, disabled, className, children, bold, italic, strikethrough, ...props }, ref) => {
    const context = React.useContext(ContextMenuContext)
    const itemColor = color || context.color

    return (
      <ContextMenuPrimitive.SubmenuTrigger
        ref={ref}
        disabled={disabled}
        className={cn(menuItemBaseCls, menuItemBase, menuItemMotion, `surface-color-${itemColor}`, className)}
        style={{ ...getSizeStyles(context.size), ...props.style }}
        {...props}
      >
        <span
          className={cn(
            'flex-1',
            bold && menuItemTextBold,
            italic && menuItemTextItalic,
            strikethrough && menuItemTextStrikethrough,
          )}
        >
          {children}
        </span>
        <ChevronRight className={cn(menuSubTriggerIconCls, menuSubTriggerIcon)} />
      </ContextMenuPrimitive.SubmenuTrigger>
    )
  },
)

ContextMenuSubTrigger.displayName = 'ContextMenu.SubTrigger'

// ============================================================================
// SubContent
// ============================================================================

export interface ContextMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names */
  className?: string
  /** Submenu items */
  children: React.ReactNode
  /** Side offset */
  sideOffset?: number
  /** Maximum height constraint */
  maxHeight?: React.CSSProperties['maxHeight']
}

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
  ({ className, children, sideOffset = 2, maxHeight = 'var(--available-height)', style, ...props }, ref) => {
    const context = React.useContext(ContextMenuContext)
    const portalContainer = useThemePortalContainer()

    return (
      <ContextMenuPrimitive.Portal container={portalContainer}>
        <ContextMenuPrimitive.Positioner
          className={menuPositionerBase}
          sideOffset={sideOffset}
          side="right"
          align="start"
        >
          <ContextMenuPrimitive.Popup
            ref={ref}
            className={cn(menuPopupBaseCls, menuContentBase, menuContentByVariant[context.variant], className)}
            style={{ maxHeight, ...getSizeStyles(context.size), ...style }}
            data-animated={context.animated ? '' : undefined}
            {...props}
          >
            {context.animated ? (
              <MenuHighlight>
                <div className={cn(menuViewportBaseCls, menuViewportBase)}>{children}</div>
              </MenuHighlight>
            ) : (
              <div className={cn(menuViewportBaseCls, menuViewportBase)}>{children}</div>
            )}
          </ContextMenuPrimitive.Popup>
        </ContextMenuPrimitive.Positioner>
      </ContextMenuPrimitive.Portal>
    )
  },
)

ContextMenuSubContent.displayName = 'ContextMenu.SubContent'

// ============================================================================
// Export compound component
// ============================================================================

/** ContextMenu export. */
export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Label: ContextMenuLabel,
  Group: ContextMenuGroup,
  Separator: ContextMenuSeparator,
  Sub: ContextMenuSub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
}

export namespace ContextMenuProps {
  export type Root = ContextMenuRootProps
  export type Trigger = ContextMenuTriggerProps
  export type Content = ContextMenuContentProps
  export type Item = ContextMenuItemProps
  export type CheckboxItem = ContextMenuCheckboxItemProps
  export type RadioGroup = ContextMenuRadioGroupProps
  export type RadioItem = ContextMenuRadioItemProps
  export type Label = ContextMenuLabelProps
  export type Group = ContextMenuGroupProps
  export type Separator = ContextMenuSeparatorProps
  export type Sub = ContextMenuSubProps
  export type SubTrigger = ContextMenuSubTriggerProps
  export type SubContent = ContextMenuSubContentProps
}
