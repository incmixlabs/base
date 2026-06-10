'use client'

import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from 'canvas-confetti'
import confetti from 'canvas-confetti'
import * as React from 'react'
import { Button } from '../button/Button'

export type { ConfettiGlobalOptions, ConfettiOptions }

type ConfettiApi = {
  fire: (options?: ConfettiOptions) => Promise<void>
}

export type ConfettiRef = ConfettiApi | null

export interface ConfettiProps extends React.ComponentPropsWithRef<'canvas'> {
  options?: ConfettiOptions
  globalOptions?: ConfettiGlobalOptions
  manualStart?: boolean
  manualstart?: boolean
}

const defaultGlobalOptions: ConfettiGlobalOptions = {
  resize: true,
  useWorker: true,
}

const ConfettiContext = React.createContext<ConfettiApi | null>(null)

export function useConfetti(): ConfettiApi {
  const context = React.useContext(ConfettiContext)

  if (!context) {
    throw new Error('`useConfetti` must be used within `Confetti`.')
  }

  return context
}

const ConfettiComponent = React.forwardRef<ConfettiRef, ConfettiProps>(
  ({ options, globalOptions = defaultGlobalOptions, manualStart, manualstart, children, ...canvasProps }, ref) => {
    const instanceRef = React.useRef<ConfettiInstance | null>(null)
    const shouldStartManually = manualStart ?? manualstart ?? false

    const canvasRef = React.useCallback(
      (node: HTMLCanvasElement | null) => {
        if (node) {
          if (instanceRef.current) return

          instanceRef.current = confetti.create(node, {
            resize: true,
            ...globalOptions,
          })
          return
        }

        instanceRef.current?.reset()
        instanceRef.current = null
      },
      [globalOptions],
    )

    const fire = React.useCallback(
      async (confettiOptions?: ConfettiOptions) => {
        try {
          await instanceRef.current?.({
            ...options,
            ...confettiOptions,
          })
        } catch (error) {
          console.error('Confetti error:', error)
        }
      },
      [options],
    )

    const api = React.useMemo<ConfettiApi>(
      () => ({
        fire,
      }),
      [fire],
    )

    React.useImperativeHandle(ref, () => api, [api])

    React.useEffect(() => {
      if (shouldStartManually) return

      void fire()
    }, [shouldStartManually, fire])

    return (
      <ConfettiContext.Provider value={api}>
        <canvas ref={canvasRef} {...canvasProps} />
        {children}
      </ConfettiContext.Provider>
    )
  },
)

ConfettiComponent.displayName = 'Confetti'

export const Confetti = ConfettiComponent

export type ConfettiButtonOptions = ConfettiOptions & ConfettiGlobalOptions & { canvas?: HTMLCanvasElement }

export interface ConfettiButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  options?: ConfettiButtonOptions
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function ConfettiButton({ options, children, onClick, ...props }: ConfettiButtonProps) {
  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (event.defaultPrevented) return

      try {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2

        await confetti({
          ...options,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
        })
      } catch (error) {
        console.error('Confetti button error:', error)
      }
    },
    [onClick, options],
  )

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  )
}

ConfettiButton.displayName = 'ConfettiButton'
