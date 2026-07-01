import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { dateCalendarNavButtonColorStyles } from './date-surface.shared.class'
import { MiniCalendar } from './MiniCalendar'

describe('MiniCalendar', () => {
  function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
    const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
    for (const token of tokens) {
      expect(classTokens).toContain(token)
    }
  }

  it('renders month heading and weekday labels', () => {
    const value = new Date(2026, 0, 15)
    render(<MiniCalendar value={value} />)

    expect(document.body.textContent).toContain('January 2026')
    // Verify 7 day buttons are rendered for the week view
    const dayButtons = document.querySelectorAll('button[aria-label]')
    // CalendarHeader also has nav buttons with aria-label, so filter to day buttons
    const dayOnlyButtons = Array.from(dayButtons).filter(button => !button.getAttribute('aria-label')?.includes('week'))
    expect(dayOnlyButtons).toHaveLength(7)
  })

  it('keeps nav chevrons visible with date-specific icon sizing', () => {
    const { container } = render(<MiniCalendar value={new Date(2026, 0, 15)} size="xs" color="primary" />)
    const previousButton = container.querySelector<HTMLButtonElement>('button[aria-label="Previous week"]')
    const nextButton = container.querySelector<HTMLButtonElement>('button[aria-label="Next week"]')
    const previousIcon = previousButton?.querySelector('svg')

    expect(previousButton).toBeTruthy()
    expect(nextButton).toBeTruthy()
    expectClassTokens(previousButton?.className, [
      '[&_svg]:stroke-current',
      '[&_svg_path]:stroke-current',
      'h-7',
      'w-7',
    ])
    expect(previousButton).toHaveClass(...dateCalendarNavButtonColorStyles.primary.soft.split(/\s+/))
    expect(nextButton).toHaveClass(...dateCalendarNavButtonColorStyles.primary.soft.split(/\s+/))
    expect(previousButton?.className).not.toContain('[&_svg]:size-5')
    expectClassTokens(previousIcon?.getAttribute('class') ?? undefined, ['h-3', 'w-3'])
  })

  it('renders month and year wheels as direct wrapper columns', async () => {
    const user = userEvent.setup()
    render(<MiniCalendar value={new Date(2026, 0, 15)} />)

    await user.click(document.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]') as HTMLButtonElement)

    const wrapper = document.querySelector<HTMLElement>('[data-rwp-wrapper="true"]')
    expect(wrapper).toBeTruthy()
    expectClassTokens(wrapper?.parentElement?.className, ['absolute', 'w-72'])
    expect(Array.from(wrapper?.children ?? []).filter(child => child.getAttribute('data-rwp') === 'true')).toHaveLength(
      2,
    )
  })

  it('calls onChange when selecting an enabled date', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<MiniCalendar value={new Date(2026, 0, 15)} onChange={onChange} />)

    const dayButton = container.querySelector<HTMLButtonElement>('button[aria-label*="January 16, 2026"]')
    expect(dayButton).toBeTruthy()
    if (!dayButton) {
      throw new Error('Expected day button to exist')
    }

    await user.click(dayButton)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 16))
  })
})
