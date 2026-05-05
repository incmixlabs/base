import type { ReactElement } from 'react'
import { Component } from 'react'
import type { RunnerOptions, Scope } from './types'
import { generateElement } from './utils'

export interface RunnerProps extends RunnerOptions {
  onRendered?: (error: Error | null) => void
}

interface RunnerState {
  element: ReactElement | null
  error: Error | null
  prevCode: string
  prevScope: Scope | undefined
  prevComponentProps: Record<string, unknown> | undefined
}

export class Runner extends Component<RunnerProps, RunnerState> {
  state: RunnerState = {
    element: null,
    error: null,
    prevCode: '',
    prevScope: undefined,
    prevComponentProps: undefined,
  }

  static getDerivedStateFromProps(props: RunnerProps, state: RunnerState): Partial<RunnerState> | null {
    // Only regenerate if code or scope changed
    if (
      props.code === state.prevCode &&
      props.scope === state.prevScope &&
      props.componentProps === state.prevComponentProps
    ) {
      return null
    }

    try {
      const element = generateElement({
        code: props.code,
        scope: props.scope,
        componentProps: props.componentProps,
      })

      return {
        element,
        error: null,
        prevCode: props.code,
        prevScope: props.scope,
        prevComponentProps: props.componentProps,
      }
    } catch (error) {
      return {
        element: null,
        error: error instanceof Error ? error : new Error(String(error)),
        prevCode: props.code,
        prevScope: props.scope,
        prevComponentProps: props.componentProps,
      }
    }
  }

  static getDerivedStateFromError(error: Error): Partial<RunnerState> {
    return { error, element: null }
  }

  shouldComponentUpdate(nextProps: RunnerProps, nextState: RunnerState): boolean {
    return (
      nextProps.code !== this.props.code ||
      nextProps.scope !== this.props.scope ||
      nextProps.componentProps !== this.props.componentProps ||
      nextState.element !== this.state.element ||
      nextState.error !== this.state.error
    )
  }

  componentDidMount(): void {
    this.props.onRendered?.(this.state.error)
  }

  componentDidUpdate(prevProps: RunnerProps, prevState: RunnerState): void {
    // Call onRendered when a new run completes or error state changes
    if (
      prevState.error !== this.state.error ||
      prevProps.code !== this.props.code ||
      prevProps.scope !== this.props.scope ||
      prevProps.componentProps !== this.props.componentProps
    ) {
      this.props.onRendered?.(this.state.error)
    }
  }

  componentDidCatch(error: Error): void {
    this.props.onRendered?.(error)
  }

  render(): ReactElement | null {
    if (this.state.error) {
      return null
    }
    return this.state.element
  }
}
