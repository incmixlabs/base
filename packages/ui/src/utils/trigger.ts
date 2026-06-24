import * as React from 'react'
import { cn } from '@/lib/utils'

type TriggerChildProps = React.HTMLAttributes<HTMLElement> & {
  className?: string
}

export function composeCancellableHandlers<E extends React.SyntheticEvent>(
  childHandler?: (event: E) => void,
  baseHandler?: (event: E) => void,
) {
  return (event: E) => {
    childHandler?.(event)
    if (!event.defaultPrevented) baseHandler?.(event)
  }
}

const composedHandlerKeys = [
  'onClick',
  'onKeyDown',
  'onPointerDown',
  'onPointerUp',
  'onMouseDown',
  'onMouseUp',
  'onFocus',
  'onBlur',
] as const

function mergeComposedHandlers(
  childProps: React.HTMLAttributes<HTMLElement>,
  baseProps: React.HTMLAttributes<HTMLElement>,
) {
  const merged = { ...baseProps } as React.HTMLAttributes<HTMLElement>
  for (const key of composedHandlerKeys) {
    merged[key] = composeCancellableHandlers(
      childProps[key] as ((event: React.SyntheticEvent) => void) | undefined,
      baseProps[key] as ((event: React.SyntheticEvent) => void) | undefined,
    ) as never
  }
  return merged
}

export function createComposedCloseRender(childElement: React.ReactElement<TriggerChildProps>, className?: string) {
  return (closeProps: React.HTMLAttributes<HTMLElement>) => {
    const { className: closeClassName, ...safeCloseProps } = closeProps
    const childProps = childElement.props
    const safeHandlers = safeCloseProps as React.HTMLAttributes<HTMLElement>

    return React.cloneElement(childElement, {
      ...(mergeComposedHandlers(childProps, safeHandlers) as object),
      className: cn(closeClassName, childElement.props.className, className),
    })
  }
}

export function createComposedTriggerRender(childElement: React.ReactElement<TriggerChildProps>, className?: string) {
  return (triggerProps: React.HTMLAttributes<HTMLElement>) => {
    const { className: triggerClassName, ...safeTriggerProps } = triggerProps
    const childProps = childElement.props
    const safeHandlers = safeTriggerProps as React.HTMLAttributes<HTMLElement>

    return React.cloneElement(childElement, {
      ...(mergeComposedHandlers(childProps, safeHandlers) as object),
      className: cn(triggerClassName, childElement.props.className, 'outline-none', className),
    })
  }
}
