import type { Color, Radius, Variant } from '@/theme/tokens'
import type { MenuSize } from '../menu/menu.props'
import type { SplitButtonItem, SplitButtonRenderItem } from './SplitButton'

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type SplitButtonWrapperItem = SplitButtonItem

export type SplitButtonWrapperData = {
  /** Dropdown items */
  items: SplitButtonWrapperItem[]
  /** Override icon at the start of button label */
  iconStart?: string
  /** Override icon at the end of button label */
  iconEnd?: string
}

export type SplitButtonWrapperRenderItem = SplitButtonRenderItem

export type SplitButtonWrapperProps = {
  /** Data-driven config for the split button */
  data: SplitButtonWrapperData
  /** Controlled selected item id */
  value?: string
  /** Default selected item id (uncontrolled) */
  defaultValue?: string
  /** Callback when selection changes */
  onValueChange?: (value: string) => void
  /** Callback when main button is clicked */
  onAction?: (item: SplitButtonWrapperItem) => void
  /** Button size */
  size?: ButtonSize
  /** Visual variant */
  variant?: Variant
  /** Color scheme */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Loading state */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** High contrast mode */
  highContrast?: boolean
  /** Inverse text treatment */
  inverse?: boolean
  /** Dropdown menu size */
  menuSize?: MenuSize
  /** Dropdown alignment */
  menuAlign?: 'start' | 'center' | 'end'
  /** Custom item renderer */
  renderItem?: SplitButtonWrapperRenderItem
  /** Additional class name */
  className?: string
}
