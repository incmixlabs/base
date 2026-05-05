'use client'

import * as React from 'react'
import type { Color } from '@/theme/tokens'
import type { ButtonProps } from './Button'
import { Button } from './Button'

export type ActionButtonData = {
  id: string
  label: React.ReactNode
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  disabled?: boolean
  variant?: ButtonProps['variant']
  color?: Color
  onSelect?: () => void
}

export interface ActionButtonProps<TAction extends ActionButtonData = ActionButtonData> {
  action: TAction
  defaultColor?: Color
  defaultVariant?: ButtonProps['variant']
  size?: ButtonProps['size']
  onActionSelect?: (action: TAction) => void
}

export function ActionButton<TAction extends ActionButtonData = ActionButtonData>({
  action,
  defaultColor = 'slate',
  defaultVariant = 'soft',
  size = 'xs',
  onActionSelect,
}: ActionButtonProps<TAction>) {
  const { onSelect: actionOnSelect } = action
  const handleSelect = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (action.disabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      actionOnSelect?.()
      onActionSelect?.(action)
    },
    [action, actionOnSelect, onActionSelect],
  )

  if (action.href) {
    return (
      <Button
        asChild
        size={size}
        variant={action.variant ?? defaultVariant}
        color={action.color ?? defaultColor}
        disabled={action.disabled}
      >
        <a
          href={action.disabled ? undefined : action.href}
          aria-disabled={action.disabled || undefined}
          tabIndex={action.disabled ? -1 : undefined}
          target={action.target}
          rel={action.rel}
          onClick={handleSelect}
        >
          {action.label}
        </a>
      </Button>
    )
  }

  return (
    <Button
      size={size}
      variant={action.variant ?? defaultVariant}
      color={action.color ?? defaultColor}
      disabled={action.disabled}
      onClick={handleSelect}
    >
      {action.label}
    </Button>
  )
}
