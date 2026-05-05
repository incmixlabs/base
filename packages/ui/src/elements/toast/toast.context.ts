import type { Toast as ToastPrimitive } from '@base-ui/react/toast'
import * as React from 'react'
import type { ToastNotifyOptions } from './Toast'

export interface ToastApi {
  toasts: ReturnType<typeof ToastPrimitive.useToastManager>['toasts']
  notify: (options: ToastNotifyOptions) => string
  close: (toastId: string) => void
  update: ReturnType<typeof ToastPrimitive.useToastManager>['update']
  promise: ReturnType<typeof ToastPrimitive.useToastManager>['promise']
}

export const ToastApiContext = React.createContext<ToastApi | null>(null)

export function useToastApiContext(consumerName: string): ToastApi {
  const context = React.useContext(ToastApiContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`Toast.Provider\``)
  }
  return context
}

export function useToast() {
  return useToastApiContext('useToast')
}
