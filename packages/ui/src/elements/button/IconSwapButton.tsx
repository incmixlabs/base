'use client'

import * as React from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'
import { cn } from '@/lib/utils'
import { capitalize } from '@/utils/strings'
import { Icon } from './Icon'
import { IconButton, type IconButtonProps } from './IconButton'
import {
  iconSwapButtonIcon,
  iconSwapButtonMotionBackward,
  iconSwapButtonMotionForward,
  iconSwapButtonRotator,
} from './IconSwapButton.css'

export type IconSwapButtonProps<TIcons extends readonly [string, string]> = Omit<
  IconButtonProps,
  'icon' | 'children' | 'onToggle'
> & {
  icons: TIcons
  value: TIcons[number]
  onToggle: (next: TIcons[number], event: React.MouseEvent<HTMLButtonElement>) => void
}

const IconSwapButtonImpl = React.forwardRef(function IconSwapButton<const TIcons extends readonly [string, string]>(
  {
    icons,
    value,
    onToggle,
    onClick,
    fill = false,
    size = 'md',
    title,
    'aria-label': ariaLabelProp,
    ...props
  }: IconSwapButtonProps<TIcons>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const currentIndex = value === icons[1] ? 1 : 0
  const nextIndex = currentIndex === 0 ? 1 : 0
  const currentIcon = icons[currentIndex]
  const nextValue = icons[nextIndex]
  const previousIndexRef = React.useRef(currentIndex)
  const [animationDirection, setAnimationDirection] = React.useState<'forward' | 'backward' | null>(null)
  const tooltipTitle = React.useMemo<IconButtonProps['title']>(() => {
    if (typeof title !== 'function') return title

    return data => title({ ...data, icon: currentIcon })
  }, [currentIcon, title])
  const tooltipText = typeof title === 'string' ? title.trim() : ''
  const ariaLabel = ariaLabelProp ?? (tooltipText.length > 0 ? tooltipText : capitalize(currentIcon))
  const iconButtonIconProps = {
    color: 'currentColor',
    strokeWidth: 2.25,
  } as const

  useIsomorphicLayoutEffect(() => {
    if (previousIndexRef.current === currentIndex) return

    setAnimationDirection(currentIndex > previousIndexRef.current ? 'forward' : 'backward')
    previousIndexRef.current = currentIndex
  }, [currentIndex])

  return (
    <IconButton
      {...props}
      ref={ref}
      size={size}
      fill={fill}
      title={tooltipTitle}
      aria-label={ariaLabel}
      aria-pressed={currentIndex === 1}
      onClick={event => {
        onClick?.(event)
        if (event.defaultPrevented) return
        onToggle(nextValue, event)
      }}
    >
      {/* Animate the stable wrapper, but let the final SVG keep its natural orientation and currentColor. */}
      <span
        aria-hidden="true"
        className={cn(
          iconSwapButtonRotator,
          animationDirection === 'forward' && iconSwapButtonMotionForward,
          animationDirection === 'backward' && iconSwapButtonMotionBackward,
        )}
        data-icon-swap-rotator=""
        data-icon-swap-icon={currentIcon}
        data-icon-swap-motion={animationDirection ?? undefined}
        onAnimationEnd={() => setAnimationDirection(null)}
      >
        <Icon
          icon={currentIcon}
          size={size}
          fill={fill}
          className={iconSwapButtonIcon}
          iconProps={iconButtonIconProps}
          style={{ color: 'inherit' }}
        />
      </span>
    </IconButton>
  )
})

IconSwapButtonImpl.displayName = 'IconSwapButton'

export const IconSwapButton = IconSwapButtonImpl as <const TIcons extends readonly [string, string]>(
  props: IconSwapButtonProps<TIcons> & React.RefAttributes<HTMLButtonElement>,
) => React.ReactElement | null
