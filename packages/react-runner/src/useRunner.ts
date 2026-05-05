import type { ReactElement } from 'react'
import { createElement, useEffect, useRef, useState } from 'react'
import { Runner } from './Runner'
import type { RunnerOptions } from './types'

export interface UseRunnerProps extends RunnerOptions {
  disableCache?: boolean
}

export interface UseRunnerReturn {
  element: ReactElement | null
  error: Error | null
}

export const useRunner = (props: UseRunnerProps): UseRunnerReturn => {
  const { code, scope, componentProps, disableCache } = props
  const lastSuccessfulElementRef = useRef<ReactElement | null>(null)

  const [state, setState] = useState<UseRunnerReturn>(() => ({
    element: null,
    error: null,
  }))

  useEffect(() => {
    const runnerElement = createElement(Runner, {
      code,
      scope,
      componentProps,
      onRendered: (error: Error | null) => {
        if (error) {
          setState({
            element: disableCache ? null : lastSuccessfulElementRef.current,
            error,
          })
        } else {
          lastSuccessfulElementRef.current = runnerElement
          setState({
            element: runnerElement,
            error: null,
          })
        }
      },
    })

    setState({
      element: runnerElement,
      error: null,
    })
  }, [code, scope, componentProps, disableCache])

  return state
}
