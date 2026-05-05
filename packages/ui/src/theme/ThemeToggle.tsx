'use client'

import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import * as React from 'react'
import { flushSync } from 'react-dom'
import { IconButton, type IconButtonProps } from '@/elements/button/IconButton'
import { cn } from '@/lib/utils'
import { useThemeContext } from './theme-provider.context'
import type { Appearance } from './tokens'

type ThemeMode = 'light' | 'dark' | 'inherit'
type Direction = 'ltr' | 'rtl' | 'ttb' | 'btt'
type IconAnimationDirection = 'forward' | 'backward'

const THEME_TOGGLE_TRANSITION_ATTR = 'data-theme-toggle-transition'

function getClipKeyframes(direction: Direction): [string, string] {
  switch (direction) {
    case 'ltr':
      return ['inset(0 100% 0 0)', 'inset(0 0 0 0)']
    case 'rtl':
      return ['inset(0 0 0 100%)', 'inset(0 0 0 0)']
    case 'ttb':
      return ['inset(0 0 100% 0)', 'inset(0 0 0 0)']
    case 'btt':
      return ['inset(100% 0 0 0)', 'inset(0 0 0 0)']
  }
}

function getEffectiveMode(mode: ThemeMode, resolved: 'light' | 'dark'): 'light' | 'dark' {
  return mode === 'inherit' ? resolved : mode
}

function getTargetEffectiveMode(mode: ThemeMode, fallback: 'light' | 'dark'): 'light' | 'dark' {
  if (mode !== 'inherit') return mode

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return fallback
}

const iconVariants = {
  initial: (direction: IconAnimationDirection) => ({
    opacity: 0,
    rotate: direction === 'forward' ? -120 : 120,
    scale: 0.78,
  }),
  animate: {
    opacity: 1,
    rotate: 0,
    scale: 1,
  },
  exit: (direction: IconAnimationDirection) => ({
    opacity: 0,
    rotate: direction === 'forward' ? 120 : -120,
    scale: 0.78,
  }),
}

const iconTransition = { duration: 0.28, ease: 'easeInOut' as const }

function ThemeIcon({ mode, direction }: { mode: 'light' | 'dark'; direction: IconAnimationDirection }) {
  const Icon = mode === 'dark' ? Moon : Sun

  return (
    <span
      aria-hidden="true"
      data-theme-toggle-icon={mode}
      data-theme-toggle-motion={direction}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        color: 'inherit',
      }}
    >
      <AnimatePresence initial={false}>
        <m.span
          key={mode}
          custom={direction}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={iconTransition}
          style={{
            display: 'inline-flex',
            gridArea: '1 / 1',
            color: 'inherit',
            transformOrigin: '50% 50%',
          }}
        >
          <Icon aria-hidden focusable={false} />
        </m.span>
      </AnimatePresence>
    </span>
  )
}

export interface ThemeToggleProps extends Omit<IconButtonProps, 'children' | 'onClick'> {
  modes?: ThemeMode[]
  direction?: Direction
  duration?: number
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function ThemeToggle({
  modes = ['light', 'dark'],
  direction = 'ltr',
  duration = 700,
  variant = 'ghost',
  color = 'neutral',
  size = 'md',
  onClick,
  className,
  ...props
}: ThemeToggleProps) {
  const theme = useThemeContext()

  const currentMode = theme.appearance as ThemeMode
  const effectiveMode = getEffectiveMode(currentMode, theme.resolvedAppearance)
  const [displayedIconMode, setDisplayedIconMode] = React.useState<'light' | 'dark'>(effectiveMode)
  const [iconAnimationDirection, setIconAnimationDirection] = React.useState<IconAnimationDirection>('forward')
  const effectiveModeRef = React.useRef<'light' | 'dark'>(effectiveMode)
  const iconTransitionPendingRef = React.useRef(false)

  React.useEffect(() => {
    effectiveModeRef.current = effectiveMode
    if (iconTransitionPendingRef.current) return
    setDisplayedIconMode(effectiveMode)
  }, [effectiveMode])

  const nextMode = React.useCallback((): ThemeMode => {
    let i = modes.indexOf(currentMode)
    if (i === -1) {
      i = modes.indexOf(theme.resolvedAppearance)
    }
    if (i === -1) return modes[0] ?? 'light'
    return modes[(i + 1) % modes.length] ?? 'light'
  }, [modes, currentMode, theme.resolvedAppearance])

  const toggle = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      if (e.defaultPrevented) return

      const next = nextMode()
      const immediateIconMode = getTargetEffectiveMode(next, theme.resolvedAppearance)

      const applyTheme = () => {
        theme.onAppearanceChange(next as Appearance)
      }

      const completeIconSwap = (finalMode = effectiveModeRef.current) => {
        iconTransitionPendingRef.current = false
        setIconAnimationDirection(finalMode === 'dark' ? 'forward' : 'backward')
        setDisplayedIconMode(finalMode)
      }

      if (typeof document.startViewTransition !== 'function') {
        applyTheme()
        completeIconSwap(immediateIconMode)
        return
      }

      iconTransitionPendingRef.current = true

      const [fromClip, toClip] = getClipKeyframes(direction)

      document.documentElement.setAttribute(THEME_TOGGLE_TRANSITION_ATTR, '')
      const transition = document.startViewTransition(() => {
        flushSync(applyTheme)
      })

      const pageAnimationFinished = transition.ready.then(() => {
        return document.documentElement.animate(
          { clipPath: [fromClip, toClip] },
          {
            duration,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          },
        ).finished
      })

      void Promise.allSettled([pageAnimationFinished, transition.finished])
        .then(() => completeIconSwap())
        .finally(() => {
          document.documentElement.removeAttribute(THEME_TOGGLE_TRANSITION_ATTR)
        })
    },
    [onClick, nextMode, theme, direction, duration],
  )

  return (
    <>
      <IconButton
        variant={variant}
        color={color}
        size={size}
        aria-label="Toggle theme"
        className={cn(className)}
        onClick={toggle}
        {...props}
      >
        <ThemeIcon mode={displayedIconMode} direction={iconAnimationDirection} />
      </IconButton>
      <style>{`:root[${THEME_TOGGLE_TRANSITION_ATTR}]::view-transition-old(root),:root[${THEME_TOGGLE_TRANSITION_ATTR}]::view-transition-new(root){animation:none;mix-blend-mode:normal;}`}</style>
    </>
  )
}

ThemeToggle.displayName = 'ThemeToggle'
