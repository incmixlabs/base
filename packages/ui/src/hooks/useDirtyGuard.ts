'use client'

import * as React from 'react'

type DirtyGuardAction = () => Promise<void> | void

export interface UseDirtyGuardOptions {
  isDirty: boolean | (() => boolean)
}

export interface DirtyGuardController<TContext = unknown> {
  open: boolean
  pendingContext: TContext | null
  confirmOrRun: (action: DirtyGuardAction, context?: TContext) => Promise<void>
  confirm: () => Promise<void>
  cancel: () => void
  onOpenChange: (open: boolean) => void
}

export function useDirtyGuard<TContext = unknown>({ isDirty }: UseDirtyGuardOptions): DirtyGuardController<TContext> {
  const [open, setOpen] = React.useState(false)
  const [pendingContext, setPendingContext] = React.useState<TContext | null>(null)
  const pendingActionRef = React.useRef<DirtyGuardAction | null>(null)
  const isDirtyRef = React.useRef(isDirty)

  React.useEffect(() => {
    isDirtyRef.current = isDirty
  }, [isDirty])

  const resolveIsDirty = React.useCallback(() => {
    return typeof isDirtyRef.current === 'function' ? isDirtyRef.current() : isDirtyRef.current
  }, [])

  const cancel = React.useCallback(() => {
    pendingActionRef.current = null
    setPendingContext(null)
    setOpen(false)
  }, [])

  const confirm = React.useCallback(async () => {
    const action = pendingActionRef.current
    pendingActionRef.current = null
    setPendingContext(null)
    setOpen(false)
    await action?.()
  }, [])

  const confirmOrRun = React.useCallback(
    async (action: DirtyGuardAction, context?: TContext) => {
      if (!resolveIsDirty()) {
        await action()
        return
      }

      pendingActionRef.current = action
      setPendingContext(context ?? null)
      setOpen(true)
    },
    [resolveIsDirty],
  )

  const onOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setOpen(true)
        return
      }
      cancel()
    },
    [cancel],
  )

  return {
    open,
    pendingContext,
    confirmOrRun,
    confirm,
    cancel,
    onOpenChange,
  }
}
