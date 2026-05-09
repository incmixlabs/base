import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  Tour,
  TourClose,
  TourDescription,
  TourFooter,
  TourHeader,
  TourNext,
  TourPortal,
  TourPrev,
  TourSkip,
  TourSpotlight,
  TourSpotlightRing,
  TourStep,
  TourStepCounter,
  TourTitle,
} from './Tour'

const originalScrollTo = window.scrollTo
const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect

beforeEach(() => {
  window.scrollTo = vi.fn()
  HTMLElement.prototype.getBoundingClientRect = vi.fn(function getBoundingClientRect(this: HTMLElement) {
    const index = this.id.endsWith('two') ? 1 : 0
    return {
      x: 40 + index * 80,
      y: 50 + index * 40,
      width: 120,
      height: 48,
      top: 50 + index * 40,
      right: 160 + index * 80,
      bottom: 98 + index * 40,
      left: 40 + index * 80,
      toJSON: () => ({}),
    } as DOMRect
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  window.scrollTo = originalScrollTo
  HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
})

function Demo({
  open = true,
  onOpenChange,
  onComplete,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onComplete?: () => void
}) {
  return (
    <div>
      <button id="target-one" type="button">
        Target one
      </button>
      <button id="target-two" type="button">
        Target two
      </button>
      <Tour
        open={open}
        onOpenChange={onOpenChange}
        onComplete={onComplete}
        stepFooter={
          <TourFooter>
            <TourStepCounter data-testid="counter" />
            <TourSkip />
            <TourPrev />
            <TourNext />
          </TourFooter>
        }
      >
        <TourPortal>
          <TourSpotlight data-testid="spotlight" />
          <TourSpotlightRing data-testid="ring" />
          <TourStep target="#target-one" side="bottom" align="start">
            <TourHeader>
              <TourTitle>First step</TourTitle>
              <TourDescription>First step description</TourDescription>
            </TourHeader>
            <TourClose />
          </TourStep>
          <TourStep target="#target-two" side="top" align="end">
            <TourHeader>
              <TourTitle>Second step</TourTitle>
              <TourDescription>Second step description</TourDescription>
            </TourHeader>
          </TourStep>
        </TourPortal>
      </Tour>
    </div>
  )
}

describe('Tour', () => {
  it('renders the active step, spotlight, and counter when open', async () => {
    render(<Demo />)

    expect(await screen.findByRole('dialog')).toHaveAttribute('data-slot', 'tour-step')
    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getByTestId('counter')).toHaveTextContent('1 / 2')
    expect(screen.getByTestId('spotlight').style.clipPath).toContain('polygon')
    expect(screen.getByTestId('ring')).toHaveStyle({ left: '36px', top: '46px', width: '128px', height: '56px' })
  })

  it('advances, goes back, and completes the tour from footer controls', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    const onOpenChange = vi.fn()

    render(<Demo onComplete={onComplete} onOpenChange={onOpenChange} />)

    await user.click(await screen.findByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Second step')).toBeInTheDocument()
    expect(screen.getByTestId('counter')).toHaveTextContent('2 / 2')

    await user.click(screen.getByRole('button', { name: 'Previous step' }))
    expect(screen.getByText('First step')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next step' }))
    await user.click(screen.getByRole('button', { name: 'Finish tour' }))

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1)
    })
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('closes when close is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(<Demo onOpenChange={onOpenChange} />)

    await user.click(await screen.findByRole('button', { name: 'Close tour' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders the built-in footer and applies root control props', async () => {
    const user = userEvent.setup()

    render(
      <div>
        <button id="target-one" type="button">
          Target one
        </button>
        <button id="target-two" type="button">
          Target two
        </button>
        <Tour
          open
          nextLabel="Continue"
          finishLabel="Done"
          prevLabel="Back"
          closeLabel="Exit tour"
          skipButtonProps={{ children: 'Leave' }}
        >
          <TourPortal>
            <TourStep target="#target-one">
              <TourHeader>
                <TourTitle>First step</TourTitle>
              </TourHeader>
              <TourClose />
            </TourStep>
            <TourStep target="#target-two">
              <TourHeader>
                <TourTitle>Second step</TourTitle>
              </TourHeader>
            </TourStep>
          </TourPortal>
        </Tour>
      </div>,
    )

    expect(await screen.findByRole('button', { name: 'Continue' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exit tour' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByRole('button', { name: 'Done' })).toBeInTheDocument()
  })

  it('ignores invalid selector targets', () => {
    expect(() => {
      render(
        <Tour open>
          <TourPortal>
            <TourStep target="[invalid">
              <TourHeader>
                <TourTitle>Invalid target</TourTitle>
              </TourHeader>
            </TourStep>
          </TourPortal>
        </Tour>,
      )
    }).not.toThrow()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('updates step metadata without reordering registered steps', async () => {
    const user = userEvent.setup()

    function RetargetableDemo({ firstTarget }: { firstTarget: string }) {
      return (
        <div>
          <button id="target-one" type="button">
            Target one
          </button>
          <button id="target-one-alt" type="button">
            Target one alternate
          </button>
          <button id="target-two" type="button">
            Target two
          </button>
          <Tour open>
            <TourPortal>
              <TourStep target={firstTarget}>
                <TourHeader>
                  <TourTitle>First step</TourTitle>
                </TourHeader>
              </TourStep>
              <TourStep target="#target-two">
                <TourHeader>
                  <TourTitle>Second step</TourTitle>
                </TourHeader>
              </TourStep>
            </TourPortal>
          </Tour>
        </div>
      )
    }

    const { rerender } = render(<RetargetableDemo firstTarget="#target-one" />)

    await user.click(await screen.findByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Second step')).toBeInTheDocument()

    rerender(<RetargetableDemo firstTarget="#target-one-alt" />)

    await waitFor(() => {
      expect(screen.getByText('Second step')).toBeInTheDocument()
    })
    expect(screen.queryByText('First step')).not.toBeInTheDocument()
  })

  it('uses latest step callbacks without reordering registered steps', async () => {
    const user = userEvent.setup()
    const initialFirstEnter = vi.fn()
    const latestFirstEnter = vi.fn()
    const initialSecondLeave = vi.fn()
    const latestSecondLeave = vi.fn()

    function CallbackDemo({ useLatestCallbacks }: { useLatestCallbacks: boolean }) {
      return (
        <div>
          <button id="target-one" type="button">
            Target one
          </button>
          <button id="target-two" type="button">
            Target two
          </button>
          <Tour open>
            <TourPortal>
              <TourStep target="#target-one" onStepEnter={useLatestCallbacks ? latestFirstEnter : initialFirstEnter}>
                <TourHeader>
                  <TourTitle>First step</TourTitle>
                </TourHeader>
              </TourStep>
              <TourStep target="#target-two" onStepLeave={useLatestCallbacks ? latestSecondLeave : initialSecondLeave}>
                <TourHeader>
                  <TourTitle>Second step</TourTitle>
                </TourHeader>
              </TourStep>
            </TourPortal>
          </Tour>
        </div>
      )
    }

    const { rerender } = render(<CallbackDemo useLatestCallbacks={false} />)

    await user.click(await screen.findByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Second step')).toBeInTheDocument()

    rerender(<CallbackDemo useLatestCallbacks />)

    await waitFor(() => {
      expect(screen.getByText('Second step')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Previous step' }))

    expect(initialFirstEnter).not.toHaveBeenCalled()
    expect(initialSecondLeave).not.toHaveBeenCalled()
    expect(latestFirstEnter).toHaveBeenCalledTimes(1)
    expect(latestSecondLeave).toHaveBeenCalledTimes(1)
  })
})
