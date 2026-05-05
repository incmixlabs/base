import type { IconButtonProps } from '@/elements/button/IconButton'
import { textFieldSizes, textFieldVariants } from './text-field.props'

export const numberInputVariants = ['button', 'icon'] as const
export type NumberInputVariant = (typeof numberInputVariants)[number]

export type NumberInputButtonSize = NonNullable<IconButtonProps['size']>

export interface NumberInputIconButtonProps
  extends Pick<IconButtonProps, 'className' | 'color' | 'highContrast' | 'radius' | 'size' | 'title' | 'variant'> {}

export { textFieldSizes as numberInputSizes, textFieldVariants as numberInputInputVariants }
