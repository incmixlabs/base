'use client'

import * as React from 'react'
import type { DirtyGuardController } from '@/hooks/useDirtyGuard'
import type { Color } from '@/theme/tokens'
import { Button } from '../button/Button'
import { AlertDialog, type AlertDialogProps } from './AlertDialog'

type DirtyGuardDialogContent<TContext> = React.ReactNode | ((context: TContext | null) => React.ReactNode)

export interface DirtyGuardDialogProps<TContext = unknown> {
  guard?: DirtyGuardController<TContext>
  open?: boolean
  context?: TContext | null
  title?: DirtyGuardDialogContent<TContext>
  description?: DirtyGuardDialogContent<TContext>
  cancelLabel?: React.ReactNode
  confirmLabel?: React.ReactNode
  confirmColor?: Color
  size?: AlertDialogProps.Content['size']
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => Promise<void> | void
  onConfirmError?: (error: unknown) => void
}

function renderDirtyGuardContent<TContext>(content: DirtyGuardDialogContent<TContext>, context: TContext | null) {
  return typeof content === 'function' ? content(context) : content
}

export function DirtyGuardDialog<TContext = unknown>({
  guard,
  open,
  context,
  title = 'Abandon changes?',
  description = 'You have unsaved changes. Are you sure you want to abandon them?',
  cancelLabel = 'Keep editing',
  confirmLabel = 'Abandon changes',
  confirmColor = 'error',
  size = 'sm',
  onOpenChange,
  onConfirm,
  onConfirmError,
}: DirtyGuardDialogProps<TContext>) {
  const resolvedOpen = guard?.open ?? open ?? false
  const resolvedContext = guard?.pendingContext ?? context ?? null

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      guard?.onOpenChange(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [guard, onOpenChange],
  )

  const handleConfirm = React.useCallback(async () => {
    if (guard) {
      await guard.confirm()
    }
    await onConfirm?.()
  }, [guard, onConfirm])

  const handleConfirmClick = React.useCallback(() => {
    void handleConfirm().catch(error => {
      if (onConfirmError) {
        onConfirmError(error)
        return
      }
      console.error('DirtyGuardDialog confirm failed:', error)
    })
  }, [handleConfirm, onConfirmError])

  return (
    <AlertDialog.Root open={resolvedOpen} onOpenChange={handleOpenChange}>
      <AlertDialog.Content size={size}>
        <AlertDialog.Title>{renderDirtyGuardContent(title, resolvedContext)}</AlertDialog.Title>
        <AlertDialog.Description>{renderDirtyGuardContent(description, resolvedContext)}</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button size="xs" variant="outline" color="slate">
              {cancelLabel}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button size="xs" color={confirmColor} onClick={handleConfirmClick}>
              {confirmLabel}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
