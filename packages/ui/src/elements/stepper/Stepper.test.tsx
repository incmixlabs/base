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

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))

  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Stepper', () => {
  it('renders the semantic utility class contract', () => {
    const describedSteps = steps.map(step => ({ ...step, description: `${step.title} description` }))
    const { container } = render(<Stepper steps={describedSteps} size="md" />)

    const root = container.firstElementChild
    const accountTab = screen.getByRole('tab', { name: /account/i })
    const indicator = accountTab.querySelector('span')
    const description = screen.getByText('Account description')
    const separator = container.querySelector('[aria-hidden="true"]')
    const panel = screen.getByRole('tabpanel')
    const footerMeta = screen.getByText('Step 1 of 3')

    expectClassTokens(root?.className, ['grid', 'w-full', 'gap-4'])
    expectClassTokens(accountTab.className, [
      'box-border',
      'flex',
      'text-neutral',
      'text-[length:0.9375rem]',
      'rounded-2xl',
      'px-1.5',
      'py-1',
      'focus-visible:outline-primary-highlight',
    ])
    expectClassTokens(indicator?.className, [
      'inline-flex',
      'rounded-full',
      'border-neutral',
      'h-7',
      'w-7',
      'data-[state=active]:bg-primary-soft',
      'data-[state=completed]:bg-primary-solid',
    ])
    expectClassTokens(description.className, ['text-muted', 'text-[length:0.8125rem]'])
    expectClassTokens(separator?.className, ['h-px', 'min-w-4', 'flex-auto', 'bg-[var(--color-neutral-border)]'])
    expectClassTokens(panel.className, ['min-h-40', 'rounded-2xl', 'border-neutral', 'p-4'])
    expectClassTokens(footerMeta.className, ['text-muted', 'text-sm'])
    expect(root?.className).not.toContain('Stepper_')
  })

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
