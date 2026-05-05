'use client'

import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import { X } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { Icon } from '@/elements/button/Icon'
import { IconButton } from '@/elements/button/IconButton'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { useRootThemePortalContainer } from '@/theme/theme-provider.context'
import type { Color, Radius } from '@/theme/tokens'
import {
  calloutColorVariants,
  calloutHighContrastByVariant,
  calloutIconBaseCls,
  calloutIconVars,
  calloutInverseByVariant,
  calloutRootBase,
  calloutRootBaseCls,
  calloutSizeVars,
  calloutTextBase,
  calloutTextBySize,
} from '../callout/Callout.css'
import { getRadiusStyles, useThemeRadius } from '../utils'
import { type ToastApi, ToastApiContext, useToastApiContext } from './toast.context'
import { type ToastDismissable, type ToastViewportSide, toastRootPropDefs, toastViewportPropDefs } from './toast.props'

type CalloutVariant = 'soft' | 'surface' | 'solid' | 'outline' | 'split'
type CalloutSize = (typeof toastRootPropDefs.size.values)[number]

interface ToastVisualData {
  icon?: React.ReactNode | string
  actionLabel?: React.ReactNode
  actionOnClick?: React.MouseEventHandler<HTMLButtonElement>
  size?: CalloutSize
  variant?: CalloutVariant
  color?: Color
  radius?: Radius
  highContrast?: boolean
  inverse?: boolean
  dismissable?: ToastDismissable
}

export interface ToastNotifyOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode | string
  actionLabel?: React.ReactNode
  actionOnClick?: React.MouseEventHandler<HTMLButtonElement>
  size?: CalloutSize
  variant?: CalloutVariant
  color?: Color
  radius?: Radius
  highContrast?: boolean
  inverse?: boolean
  dismissable?: ToastDismissable
  timeout?: number
  priority?: 'low' | 'high'
  onClose?: () => void
}

export interface ToastProviderProps {
  children?: React.ReactNode
  timeout?: number
  limit?: number
}

const ToastApiProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const manager = ToastPrimitive.useToastManager()

  const notify = React.useCallback(
    (options: ToastNotifyOptions) => {
      const {
        title,
        description,
        icon,
        actionLabel,
        actionOnClick,
        size,
        variant,
        color,
        radius,
        highContrast,
        inverse,
        dismissable,
        timeout,
        priority,
        onClose,
      } = options

      const data: ToastVisualData = {
        icon,
        actionLabel,
        actionOnClick,
        size,
        variant,
        color,
        radius,
        highContrast,
        inverse,
        dismissable,
      }

      const resolvedDismissable =
        (normalizeEnumPropValue(toastRootPropDefs.dismissable, dismissable) as ToastDismissable | undefined) ??
        toastRootPropDefs.dismissable.default
      const hasInteractiveControls = resolvedDismissable !== 'none' || Boolean(actionLabel)
      const resolvedTimeout = Number.isFinite(timeout) ? timeout : hasInteractiveControls ? 0 : undefined
      const resolvedTimeoutMs =
        typeof resolvedTimeout === 'number' && Number.isFinite(resolvedTimeout)
          ? Math.max(resolvedTimeout, 0) * 1000
          : undefined

      return manager.add({
        title,
        description,
        timeout: resolvedTimeoutMs,
        priority,
        onClose,
        data,
      })
    },
    [manager],
  )

  const value = React.useMemo<ToastApi>(
    () => ({
      toasts: manager.toasts,
      notify,
      close: manager.close,
      update: manager.update,
      promise: manager.promise,
    }),
    [manager.toasts, notify, manager.close, manager.update, manager.promise],
  )

  return <ToastApiContext.Provider value={value}>{children}</ToastApiContext.Provider>
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, timeout = 5, limit = 3 }) => {
  const safeTimeout = Number.isFinite(timeout) ? Math.max(timeout, 0) : 5
  const safeLimit = Number.isFinite(limit) ? Math.max(Math.floor(limit), 1) : 3

  return (
    <ToastPrimitive.Provider timeout={safeTimeout * 1000} limit={safeLimit}>
      <ToastApiProvider>{children}</ToastApiProvider>
    </ToastPrimitive.Provider>
  )
}

ToastProvider.displayName = 'Toast.Provider'

export interface ToastViewportProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> {
  side?: ToastViewportSide
  className?: string
}

function getToastVisualData(data: unknown): ToastVisualData {
  if (!data || typeof data !== 'object') {
    return {}
  }

  const value = data as Record<string, unknown>

  return {
    icon: value.icon as React.ReactNode,
    actionLabel: value.actionLabel as React.ReactNode,
    actionOnClick:
      typeof value.actionOnClick === 'function'
        ? (value.actionOnClick as React.MouseEventHandler<HTMLButtonElement>)
        : undefined,
    size: typeof value.size === 'string' ? (value.size as CalloutSize) : undefined,
    variant: typeof value.variant === 'string' ? (value.variant as CalloutVariant) : undefined,
    color: typeof value.color === 'string' ? (value.color as Color) : undefined,
    radius: typeof value.radius === 'string' ? (value.radius as Radius) : undefined,
    highContrast: typeof value.highContrast === 'boolean' ? value.highContrast : undefined,
    inverse: typeof value.inverse === 'boolean' ? value.inverse : undefined,
    dismissable: typeof value.dismissable === 'string' ? (value.dismissable as ToastDismissable) : undefined,
  }
}

export const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ side = toastViewportPropDefs.side.default, className, ...props }, ref) => {
    const { toasts } = useToastApiContext('Toast.Viewport')
    const safeSide =
      (normalizeEnumPropValue(toastViewportPropDefs.side, side) as ToastViewportSide | undefined) ??
      toastViewportPropDefs.side.default

    const portalContainer = useRootThemePortalContainer()

    return (
      <ToastPrimitive.Portal container={portalContainer}>
        <ToastPrimitive.Viewport
          ref={ref}
          className={cn(
            'fixed z-50 flex w-[min(92vw,26rem)] flex-col gap-2 outline-none',
            safeSide === 'top' ? 'top-0 right-0' : 'bottom-0 right-0',
            className,
          )}
          {...props}
        >
          {toasts.map(toast => {
            const data = getToastVisualData(toast.data)

            return (
              <ToastPrimitive.Root
                key={toast.id}
                toast={toast}
                className={cn(
                  'transition-all duration-300 ease-out',
                  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
                  safeSide === 'top'
                    ? 'data-[starting-style]:-translate-y-2 data-[ending-style]:-translate-y-2'
                    : 'data-[starting-style]:translate-y-2 data-[ending-style]:translate-y-2',
                )}
              >
                <ToastCard toast={toast} data={data} side={safeSide} />
              </ToastPrimitive.Root>
            )
          })}
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    )
  },
)

ToastViewport.displayName = 'Toast.Viewport'

function renderToastIcon(icon: React.ReactNode | string, size: CalloutSize) {
  const iconSize = size === '2x' ? 'xl' : size
  return typeof icon === 'string' ? <Icon icon={icon} size={iconSize} aria-hidden="true" /> : icon
}

const ToastCard = ({
  toast,
  data,
  side,
}: {
  toast: ReturnType<typeof ToastPrimitive.useToastManager>['toasts'][number]
  data: ToastVisualData
  side: ToastViewportSide
}) => {
  const safeSize =
    (normalizeEnumPropValue(toastRootPropDefs.size, data.size) as CalloutSize | undefined) ??
    toastRootPropDefs.size.default
  const safeVariant =
    (normalizeEnumPropValue(toastRootPropDefs.variant, data.variant) as CalloutVariant | undefined) ??
    toastRootPropDefs.variant.default
  const safeColor =
    (normalizeEnumPropValue(toastRootPropDefs.color, data.color) as Color | undefined) ?? SemanticColor.neutral
  const safeDismissable =
    (normalizeEnumPropValue(toastRootPropDefs.dismissable, data.dismissable) as ToastDismissable | undefined) ??
    toastRootPropDefs.dismissable.default
  const supportsInverse = safeVariant === 'soft' || safeVariant === 'solid'
  const safeRadius = normalizeEnumPropValue(toastRootPropDefs.radius, data.radius) as Radius | undefined
  const radius = useThemeRadius(safeRadius ?? 'lg')

  return (
    <ToastPrimitive.Content
      className={cn(
        'pointer-events-auto transition-all duration-300 ease-out',
        side === 'top'
          ? 'translate-y-[calc(var(--toast-index)*-0.5rem)]'
          : 'translate-y-[calc(var(--toast-index)*0.5rem)]',
        'scale-[calc(1-var(--toast-index)*0.04)] opacity-[calc(1-var(--toast-index)*0.15)]',
        'data-[expanded]:translate-y-[var(--toast-offset-y)] data-[expanded]:scale-100 data-[expanded]:opacity-100',
        'data-[behind]:pointer-events-none data-[expanded]:pointer-events-auto',
      )}
    >
      <div
        className={cn(
          calloutRootBaseCls,
          calloutRootBase,
          calloutSizeVars[safeSize],
          calloutColorVariants[safeColor][safeVariant],
          data.inverse && supportsInverse && calloutInverseByVariant[safeColor][safeVariant],
          data.highContrast && calloutHighContrastByVariant[safeVariant],
          'relative shadow-sm',
          safeDismissable !== 'none' && 'pr-11',
        )}
        style={getRadiusStyles(radius)}
      >
        {data.icon ? (
          <div data-slot="callout-icon" className={cn(calloutIconBaseCls, calloutIconVars, calloutSizeVars[safeSize])}>
            {renderToastIcon(data.icon, safeSize)}
          </div>
        ) : null}

        <div className={cn('min-w-0 pl-2', !data.icon && 'col-span-2')}>
          {toast.title ? (
            <ToastPrimitive.Title className={cn(calloutTextBase, calloutTextBySize[safeSize], 'font-semibold')}>
              {toast.title}
            </ToastPrimitive.Title>
          ) : null}

          {toast.description ? (
            <ToastPrimitive.Description className={cn(calloutTextBase, calloutTextBySize[safeSize], 'opacity-80')}>
              {toast.description}
            </ToastPrimitive.Description>
          ) : null}

          {data.actionLabel ? (
            <div className="mt-2 pl-2 flex justify-end">
              <ToastPrimitive.Action
                onClick={data.actionOnClick}
                render={
                  <Button variant="outline" size="sm" color={safeColor} highContrast>
                    {data.actionLabel}
                  </Button>
                }
              />
            </div>
          ) : null}
        </div>

        {safeDismissable !== 'none' ? (
          <ToastPrimitive.Close
            render={
              <IconButton
                variant="ghost"
                size="sm"
                radius="full"
                aria-label="Dismiss"
                className={cn('absolute right-2', safeDismissable === 'center' ? 'top-1/2 -translate-y-1/2' : 'top-2')}
              />
            }
          >
            <X />
          </ToastPrimitive.Close>
        ) : null}
      </div>
    </ToastPrimitive.Content>
  )
}
