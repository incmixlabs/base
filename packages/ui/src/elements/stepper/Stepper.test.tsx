import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Stepper } from './Stepper'

const steps = [
  { id: 'account', title: 'Account', content: <div>Account content</div> },
  { id: 'profile', title: 'Profile', content: <div>Profile content</div> },
  { id: 'review', title: 'Review', content: <div>Review content</div> },
]

const stepsWithDisabledMiddle = [
  { id: 'account', title: 'Account', content: <div>Account content</div> },
  { id: 'billing', title: 'Billing', content: <div>Billing content</div>, disabled: true },
  { id: 'review', title: 'Review', content: <div>Review content</div> },
]

afterEach(() => {
  cleanup()
})

describe('Stepper', () => {
  it('renders active step content and advances with controls', async () => {
    const user = userEvent.setup()
    render(<Stepper steps={steps} />)

    expect(screen.getByText('Account content')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Profile content')).toBeInTheDocument()
  })

  it('supports controlled step changes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(<Stepper steps={steps} value={1} onValueChange={onValueChange} />)

    expect(screen.getAllByRole('tabpanel')[0]).toHaveTextContent('Profile content')
    await user.click(screen.getByRole('tab', { name: /review/i }))

    expect(onValueChange).toHaveBeenCalledWith(2, expect.objectContaining({ id: 'review' }))
  })

  it('calls onComplete on the last step', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()

    render(<Stepper steps={steps} value={2} onComplete={onComplete} />)

    await user.click(screen.getByRole('button', { name: 'Complete' }))

    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ id: 'review' }), 2)
  })

  it('supports keyboard navigation between step triggers', async () => {
    const user = userEvent.setup()
    render(<Stepper steps={steps} />)

    const accountTab = screen.getAllByRole('tab', { name: /account/i })[0]
    const profileTab = screen.getAllByRole('tab', { name: /profile/i })[0]

    accountTab.focus()
    expect(accountTab).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(profileTab).toHaveFocus()
  })

  it('skips disabled steps without marking them completed', async () => {
    const user = userEvent.setup()
    render(<Stepper steps={stepsWithDisabledMiddle} />)

    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Review content')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /billing/i })).toHaveAttribute('data-state', 'inactive')
  })

  it('renders footer controls for single-step flows and completes them', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()

    render(<Stepper steps={[steps[0]]} onComplete={onComplete} />)

    await user.click(screen.getByRole('button', { name: 'Complete' }))

    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ id: 'account' }), 0)
  })
})
