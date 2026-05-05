'use client'

import { SplitButton } from './SplitButton'
import type { SplitButtonWrapperProps } from './split-button-wrapper.types'

export function SplitButtonWrapper({
  data,
  value,
  defaultValue,
  onValueChange,
  onAction,
  size,
  variant,
  color,
  radius,
  loading,
  disabled,
  highContrast,
  inverse,
  menuSize,
  menuAlign,
  renderItem,
  className,
}: SplitButtonWrapperProps) {
  return (
    <SplitButton
      items={data.items}
      value={value}
      defaultValue={defaultValue ?? data.items[0]?.id}
      onValueChange={onValueChange}
      onAction={onAction}
      renderItem={renderItem}
      size={size}
      variant={variant}
      color={color}
      radius={radius}
      loading={loading}
      disabled={disabled}
      highContrast={highContrast}
      inverse={inverse}
      iconStart={data.iconStart}
      iconEnd={data.iconEnd}
      menuSize={menuSize}
      menuAlign={menuAlign}
      className={className}
    />
  )
}

SplitButtonWrapper.displayName = 'SplitButtonWrapper'

export type {
  SplitButtonWrapperData,
  SplitButtonWrapperItem,
  SplitButtonWrapperProps,
  SplitButtonWrapperRenderItem,
} from './split-button-wrapper.types'
