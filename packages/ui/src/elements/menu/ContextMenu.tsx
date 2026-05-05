'use client'

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import type { Color } from '@/theme/tokens'
import { getShortcutAccessibleLabel } from './menu.a11y'
import type { MenuSize, MenuVariant } from './menu.props'
import {
  menuContentBase,
  menuContentBySize,
  menuContentByVariant,
  menuHighlightBgByVariant,
  menuIconBySize,
  menuIndicatorBaseCls,
  menuItemBase,
  menuItemBaseCls,
  menuItemBySize,
  menuItemByVariant,
  menuItemByVariantHighlight,
  menuItemColor,
  menuItemIndicatorBySize,
  menuItemMotion,
  menuItemTextBold,
  menuItemTextItalic,
  menuItemTextStrikethrough,
  menuItemWithIndicatorBySize,
  menuLabelBase,
  menuLabelBaseCls,
  menuLabelBySize,
  menuPanelTransition,
  menuPanelVariants,
  menuPopupBaseCls,
  menuSeparatorBase,
  menuSeparatorBySize,
  menuShortcutBase,
  menuShortcutBaseCls,
  menuShortcutBySize,
  menuSubTriggerIcon,
  menuSubTriggerIconCls,
  menuViewportBase,
  menuViewportBaseCls,
  menuViewportBySize,
} from './menu.shared.css'
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

function getMenuItemVariantCls(context: ContextMenuContextValue) {
  return context.animated ? menuItemByVariantHighlight[context.variant] : menuItemByVariant[context.variant]
}

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

export interface ContextMenuContentProps {
  /** Size of the menu */
  size?: MenuSize
  /** Visual variant */
  variant?: MenuVariant
  /** Accent color for item highlights */
  color?: Color
  /** Additional class names */
  className?: string
  /** Menu items */
  children: React.ReactNode
  /** Animate highlight to follow focused/hovered items */
  animated?: boolean
}

const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  (
    { size = 'md', variant = 'solid', color = SemanticColor.slate, className, children, animated = false, ...props },
    ref,
  ) => {
    const portalContainer = useThemePortalContainer()
    const isOpen = React.useContext(ContextMenuOpenContext)

    const viewport = (
      <div className={cn(menuViewportBaseCls, menuViewportBase, menuViewportBySize[size])}>{children}</div>
    )

    return (
      <ContextMenuContext.Provider value={{ size, variant, color, animated }}>
        <AnimatePresence>
          {isOpen && (
            <ContextMenuPrimitive.Portal keepMounted container={portalContainer}>
              <ContextMenuPrimitive.Positioner>
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
                    menuContentBySize[size],
                    className,
                  )}
                  {...props}
                >
                  {animated ? (
                    <MenuHighlight className={cn(menuHighlightBgByVariant[variant], menuItemColor[color])}>
                      {viewport}
                    </MenuHighlight>
                  ) : (
                    viewport
                  )}
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

export interface ContextMenuItemProps {
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
    const variantCls = getMenuItemVariantCls(context)

    return (
      <ContextMenuPrimitive.Item
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          menuItemBaseCls,
          menuItemBase,
          menuItemBySize[context.size],
          menuItemMotion,
          menuItemColor[itemColor],
          variantCls,
          className,
        )}
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
        {shortcut && (
          <span className={cn(menuShortcutBaseCls, menuShortcutBase, menuShortcutBySize[context.size])}>
            {shortcut}
          </span>
        )}
      </ContextMenuPrimitive.Item>
    )
  },
)

ContextMenuItem.displayName = 'ContextMenu.Item'

// ============================================================================
// CheckboxItem
// ============================================================================

export interface ContextMenuCheckboxItemProps {
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
    const variantCls = getMenuItemVariantCls(context)

    return (
      <ContextMenuPrimitive.CheckboxItem
        ref={ref}
        aria-label={ariaLabel}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          menuItemBaseCls,
          menuItemBase,
          menuItemBySize[context.size],
          menuItemMotion,
          menuItemWithIndicatorBySize[context.size],
          menuItemColor[itemColor],
          variantCls,
          className,
        )}
        {...props}
      >
        <span className={cn(menuIndicatorBaseCls, menuItemIndicatorBySize[context.size])}>
          <ContextMenuPrimitive.CheckboxItemIndicator>
            <Check className={menuIconBySize[context.size]} strokeWidth={2.5} />
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
        {shortcut && (
          <span className={cn(menuShortcutBaseCls, menuShortcutBase, menuShortcutBySize[context.size])}>
            {shortcut}
          </span>
        )}
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

export interface ContextMenuRadioItemProps {
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
    const variantCls = getMenuItemVariantCls(context)

    return (
      <ContextMenuPrimitive.RadioItem
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(
          menuItemBaseCls,
          menuItemBase,
          menuItemBySize[context.size],
          menuItemMotion,
          menuItemWithIndicatorBySize[context.size],
          menuItemColor[itemColor],
          variantCls,
          className,
        )}
        {...props}
      >
        <span className={cn(menuIndicatorBaseCls, menuItemIndicatorBySize[context.size])}>
          <ContextMenuPrimitive.RadioItemIndicator>
            <Circle className={cn(menuIconBySize[context.size], 'fill-current')} strokeWidth={0} />
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
    const context = React.useContext(ContextMenuContext)
    return (
      <div
        ref={ref}
        className={cn(menuLabelBaseCls, menuLabelBase, menuLabelBySize[context.size], className)}
        {...props}
      >
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
    const context = React.useContext(ContextMenuContext)
    return (
      <ContextMenuPrimitive.Separator
        ref={ref}
        className={cn(menuSeparatorBase, menuSeparatorBySize[context.size], className)}
        {...props}
      />
    )
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

export interface ContextMenuSubTriggerProps {
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
    const variantCls = getMenuItemVariantCls(context)

    return (
      <ContextMenuPrimitive.SubmenuTrigger
        ref={ref}
        disabled={disabled}
        className={cn(
          menuItemBaseCls,
          menuItemBase,
          menuItemBySize[context.size],
          menuItemMotion,
          menuItemColor[itemColor],
          variantCls,
          className,
        )}
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
        <ChevronRight className={cn(menuSubTriggerIconCls, menuSubTriggerIcon, menuIconBySize[context.size])} />
      </ContextMenuPrimitive.SubmenuTrigger>
    )
  },
)

ContextMenuSubTrigger.displayName = 'ContextMenu.SubTrigger'

// ============================================================================
// SubContent
// ============================================================================

export interface ContextMenuSubContentProps {
  /** Additional class names */
  className?: string
  /** Submenu items */
  children: React.ReactNode
  /** Side offset */
  sideOffset?: number
}

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
  ({ className, children, sideOffset = 2, ...props }, ref) => {
    const context = React.useContext(ContextMenuContext)
    const portalContainer = useThemePortalContainer()

    return (
      <ContextMenuPrimitive.Portal container={portalContainer}>
        <ContextMenuPrimitive.Positioner sideOffset={sideOffset} side="right" align="start">
          <ContextMenuPrimitive.Popup
            ref={ref}
            className={cn(
              menuPopupBaseCls,
              menuContentBase,
              menuContentByVariant[context.variant],
              menuContentBySize[context.size],
              className,
            )}
            {...props}
          >
            {context.animated ? (
              <MenuHighlight className={cn(menuHighlightBgByVariant[context.variant], menuItemColor[context.color])}>
                <div className={cn(menuViewportBaseCls, menuViewportBase, menuViewportBySize[context.size])}>
                  {children}
                </div>
              </MenuHighlight>
            ) : (
              <div className={cn(menuViewportBaseCls, menuViewportBase, menuViewportBySize[context.size])}>
                {children}
              </div>
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
