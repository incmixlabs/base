'use client'

import '../theme/typography-tokens.css'

// Layout Components
export {
  AppShell,
  type AppShellHeaderProps,
  type AppShellProps,
  AppShellRoot,
  type AppShellRootComponentProps,
  type AppShellRootProps,
  type AppShellSecondaryProps,
  type AppShellSecondarySidebarProps,
  type AppShellSidebarProps,
} from './app-shell/AppShell'
export { AppShellWrapper, type AppShellWrapperProps } from './app-shell/AppShellWrapper'
export { useAppShell } from './app-shell/app-shell.context'
export { AspectRatio, type AspectRatioProps } from './aspect-ratio/AspectRatio'
export { Box, type BoxProps } from './box/Box'
export {
  CommandSearchInput,
  type CommandSearchInputProps,
  type CommandSearchItem,
  CommandSearchProvider,
  type CommandSearchProviderProps,
  type CommandSearchRouteGroup,
  type CommandSearchRoutePage,
  type Item,
  type Route,
  type Section as CommandSearchSection,
  useKBar,
} from './command-search/CommandSearch'
export {
  CommandWrapper,
  type CommandWrapperData,
  type CommandWrapperItem,
  type CommandWrapperProps,
  type CommandWrapperRenderItem,
  type CommandWrapperSection,
} from './command-search/CommandWrapper'
export { Container, type ContainerProps } from './container/Container'
export {
  createDashboardItemsFromPreset,
  type DashboardBreakpointConfig,
  type DashboardColumnConfig,
  DashboardLayout,
  type DashboardLayoutBreakpoint,
  type DashboardLayoutChangeDetails,
  type DashboardLayoutItem,
  type DashboardLayoutMode,
  DashboardLayoutModeControl,
  type DashboardLayoutModeControlProps,
  type DashboardLayoutPacking,
  type DashboardLayoutPreset,
  type DashboardLayoutProps,
  type DashboardLayoutRenderState,
  DashboardPresetPicker,
  type DashboardPresetPickerProps,
  DashboardPresetPreview,
  type DashboardPresetPreviewProps,
  type DashboardResizeHandle,
  type DashboardResponsiveLayoutItems,
  type DashboardResponsiveLayoutOptions,
  dashboardLayoutBreakpoints,
  dashboardLayoutPresets,
  getDashboardBreakpointForWidth,
  getDashboardColumnsForBreakpoint,
  getDashboardColumnsForWidth,
  getDashboardLayoutBreakpoint,
  normalizeDashboardLayoutItems,
  normalizeDashboardResponsiveLayouts,
  packDashboardLayoutItems,
  updateDashboardLayoutsWithItems,
} from './dashboard/DashboardLayout'
export {
  type DashboardRglBreakpoint,
  type DashboardRglBreakpoints,
  type DashboardRglCols,
  type DashboardRglLayoutItem,
  type DashboardRglLayouts,
  type DashboardRglMigrationOptions,
  type DashboardRglResizeHandle,
  dashboardBreakpointsFromRglBreakpoints,
  dashboardColumnsFromRglCols,
  dashboardLayoutItemFromRglItem,
  dashboardLayoutItemsFromRglLayout,
  dashboardLayoutItemsFromRglLayouts,
  dashboardResponsiveLayoutItemsFromRglLayouts,
  dashboardRglDefaultBreakpoints,
  dashboardRglDefaultCols,
  getDashboardBreakpointFromRglBreakpoint,
  getDashboardRglBreakpointForWidth,
  getDashboardRglLayoutBreakpoint,
  rglLayoutFromDashboardItems,
  rglLayoutItemFromDashboardItem,
  updateRglLayoutsWithDashboardItems,
} from './dashboard/rgl-migration'
export { Column, type ColumnProps, Flex, type FlexProps, Row, type RowProps } from './flex/Flex'
export { Grid, type GridProps } from './grid/Grid'
export { Header, type HeaderProps } from './header/Header'
// Layout Utilities and Types
export {
  type AlignItems,
  type ContainerAlign,
  type ContainerSize,
  type Display,
  type FlexDirection,
  type FlexWrap,
  type GridFlow,
  getAlignItemsClasses,
  getDisplayClasses,
  getFlexDirectionClasses,
  getFlexWrapClasses,
  getGridFlowClasses,
  getJustifyContentClasses,
  getResponsiveClasses,
  getSharedLayoutClasses,
  getSharedLayoutStyles,
  getSpacingClasses,
  type JustifyContent,
  type Overflow,
  type Position,
  // Types
  type Responsive,
  type SectionSize,
  type SharedLayoutProps,
  // Utilities
  Slot,
  type Spacing,
  spacingScale,
} from './layout-utils'
export { Masonry, type MasonryProps } from './masonry/Masonry'
export { Section, type SectionProps } from './section/Section'
export { Sidebar, useIconCollapsed, useSidebar } from './sidebar/Sidebar'
export {
  SidebarWrapper,
  type SidebarWrapperData,
  type SidebarWrapperGroup,
  type SidebarWrapperItem,
  type SidebarWrapperProps,
  type SidebarWrapperSearch,
  type SidebarWrapperSubItem,
  type SidebarWrapperTeam,
  type SidebarWrapperUser,
} from './sidebar/SidebarWrapper'
export { SidebarWrapperShell, type SidebarWrapperShellProps } from './sidebar/SidebarWrapperShell'
export { UtilityPanel, type UtilityPanelProps } from './utility-panel/UtilityPanel'
