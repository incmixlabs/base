import type * as React from 'react'
import type { IconButton } from '@/elements/button/IconButton'
import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import type { CommandSearchInputProps } from '../command-search/CommandSearch'
import type { FlexProps } from '../flex/Flex'
import type { HeaderProps } from '../header/Header'
import type { SidebarCollapsible, SidebarSide, SidebarVariant } from '../sidebar/sidebar.props'

const appShellSecondarySides = ['left', 'right'] as const
const appShellScrollModes = ['auto', 'hidden'] as const
const appShellContentPaddingModes = ['default', 'none'] as const

export type AppShellSecondarySide = (typeof appShellSecondarySides)[number]
export type AppShellScrollMode = (typeof appShellScrollModes)[number]
export type AppShellContentPadding = (typeof appShellContentPaddingModes)[number]
export type AppShellColor = Color

export interface AppShellRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Whether the wrapped Sidebar.Provider starts open. */
  defaultOpen?: boolean
  /** Controlled primary sidebar open state. */
  open?: boolean
  /** Controlled primary sidebar open-state callback. */
  onOpenChange?: (open: boolean) => void
  /**
   * Semantic color applied to sidebar, secondary panel, and search.
   * Individual components can override with their own color prop.
   * Defaults to ThemeProvider sidebarColor, then 'slate'.
   */
  color?: AppShellColor
  /**
   * Force overlay mode; sidebar and secondary render in a drawer instead of inline.
   * On mobile, overlay is always true regardless of this prop.
   * @default false
   */
  overlay?: boolean
  /** Whether the secondary panel starts open. Applies only in inline mode. */
  defaultSecondaryOpen?: boolean
  /** Label for the navigation tab in the drawer. */
  navLabel?: string
  /** Label for the secondary tab in the drawer. */
  secondaryLabel?: string
  /** Max width of the overlay drawer. */
  drawerWidth?: string
}

export interface AppShellHeaderProps extends HeaderProps {}
export type AppShellHeaderInnerProps = FlexProps
export type AppShellHeaderStartProps = FlexProps
export type AppShellHeaderEndProps = FlexProps & {
  showThemeToggle?: boolean
}
export interface AppShellBodyProps extends React.ComponentPropsWithoutRef<'div'> {}

export interface AppShellSidebarProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'color'> {
  children?: React.ReactNode
  side?: SidebarSide
  collapsible?: SidebarCollapsible
  color?: AppShellColor
  variant?: SidebarVariant
}

export interface AppShellSecondaryProps extends React.ComponentPropsWithoutRef<'aside'> {
  /** Width of the secondary panel. */
  width?: string
  /** Whether the secondary panel can be resized by dragging its inner edge. */
  resize?: boolean
  /** Minimum resize width in pixels. */
  resizeMinWidth?: number
  /** Maximum resize width in pixels. */
  resizeMaxWidth?: number
  /** Which side of the main content the panel sits on in inline mode. */
  side?: AppShellSecondarySide
  /** Controls whether the secondary panel itself scrolls. */
  scroll?: AppShellScrollMode
}

export interface AppShellSecondarySidebarProps extends Omit<AppShellSecondaryProps, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  contentClassName?: string
}

export type AppShellSecondaryContentProps = FlexProps
export type AppShellSidebarTriggerProps = React.ComponentProps<typeof IconButton>
export type AppShellSecondaryTriggerProps = React.ComponentProps<typeof IconButton>
export interface AppShellMainProps extends React.ComponentPropsWithoutRef<'main'> {}

export interface AppShellContentProps extends React.ComponentPropsWithoutRef<'div'> {
  padding?: AppShellContentPadding
  scroll?: AppShellScrollMode
}

export interface AppShellSearchProps extends CommandSearchInputProps {}

export namespace AppShellProps {
  export type Root = AppShellRootProps
  export type Header = AppShellHeaderProps
  export type HeaderInner = AppShellHeaderInnerProps
  export type HeaderStart = AppShellHeaderStartProps
  export type HeaderEnd = AppShellHeaderEndProps
  export type Body = AppShellBodyProps
  export type Sidebar = AppShellSidebarProps
  export type Secondary = AppShellSecondaryProps
  export type SecondarySidebar = AppShellSecondarySidebarProps
  export type SecondarySide = AppShellSecondarySide
  export type SecondaryContent = AppShellSecondaryContentProps
  export type SidebarTrigger = AppShellSidebarTriggerProps
  export type SecondaryTrigger = AppShellSecondaryTriggerProps
  export type Main = AppShellMainProps
  export type Content = AppShellContentProps
  export type Search = AppShellSearchProps
  export type Color = AppShellColor
  export type ScrollMode = AppShellScrollMode
  export type ContentPadding = AppShellContentPadding
}

const appShellRootPropDefs = {
  defaultOpen: {
    type: 'boolean',
    default: true,
  },
  open: {
    type: 'boolean',
  },
  color: {
    ...colorPropDef.color,
    default: 'slate',
  },
  overlay: {
    type: 'boolean',
    default: false,
  },
  defaultSecondaryOpen: {
    type: 'boolean',
    default: true,
  },
  navLabel: {
    type: 'string',
    default: 'Navigation',
  },
  secondaryLabel: {
    type: 'string',
    default: 'Filters',
  },
  drawerWidth: {
    type: 'string',
    default: '18rem',
  },
  onOpenChange: {
    type: 'callback',
    typeFullName: '(open: boolean) => void',
  },
} satisfies {
  defaultOpen: PropDef<boolean>
  open: PropDef<boolean>
  color: PropDef<Color>
  overlay: PropDef<boolean>
  defaultSecondaryOpen: PropDef<boolean>
  navLabel: PropDef<string>
  secondaryLabel: PropDef<string>
  drawerWidth: PropDef<string>
  onOpenChange: PropDef<(open: boolean) => void>
}

const appShellSecondaryPropDefs = {
  width: {
    type: 'string',
    default: '16rem',
  },
  resize: {
    type: 'boolean',
    default: false,
  },
  resizeMinWidth: {
    type: 'number',
    default: 256,
  },
  resizeMaxWidth: {
    type: 'number',
    default: 760,
  },
  side: {
    type: 'enum',
    values: appShellSecondarySides,
    default: 'right',
  },
  scroll: {
    type: 'enum',
    values: appShellScrollModes,
    default: 'hidden',
  },
} satisfies {
  width: PropDef<string>
  resize: PropDef<boolean>
  resizeMinWidth: PropDef<number>
  resizeMaxWidth: PropDef<number>
  side: PropDef<(typeof appShellSecondarySides)[number]>
  scroll: PropDef<(typeof appShellScrollModes)[number]>
}

const appShellContentPropDefs = {
  padding: {
    type: 'enum',
    values: appShellContentPaddingModes,
    default: 'default',
  },
  scroll: {
    type: 'enum',
    values: appShellScrollModes,
    default: 'auto',
  },
} satisfies {
  padding: PropDef<(typeof appShellContentPaddingModes)[number]>
  scroll: PropDef<(typeof appShellScrollModes)[number]>
}

const appShellPropDefs = {
  Root: appShellRootPropDefs,
  Secondary: appShellSecondaryPropDefs,
  Content: appShellContentPropDefs,
} as const

export { appShellPropDefs }
