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
    await user.click(screen.getByRole('button', { name: 'Next step' }))

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
})
