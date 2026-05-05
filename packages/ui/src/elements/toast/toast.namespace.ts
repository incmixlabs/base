import {
  type ToastNotifyOptions,
  ToastProvider,
  type ToastProviderProps,
  ToastViewport,
  type ToastViewportProps,
} from './Toast'
import { useToast } from './toast.context'

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  useToast,
}

export namespace ToastProps {
  export type Provider = ToastProviderProps
  export type Viewport = ToastViewportProps
  export type NotifyOptions = ToastNotifyOptions
}
