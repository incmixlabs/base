import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { dateCalendarNavButtonColorStyles } from './date-surface.shared.class'
import { MiniCalendar } from './MiniCalendar'

describe('MiniCalendar', () => {
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

  it('renders visible week navigation arrows', () => {
    render(<MiniCalendar value={new Date(2026, 0, 15)} color="slate" navButtonVariant="soft" />)

    const previousButton = document.querySelector<HTMLButtonElement>('button[aria-label="Previous week"]')
    const nextButton = document.querySelector<HTMLButtonElement>('button[aria-label="Next week"]')

    expect(previousButton).not.toBeNull()
    expect(nextButton).not.toBeNull()
    if (!previousButton || !nextButton) {
      throw new Error('Expected week navigation buttons to exist')
    }

    expect(previousButton.querySelector('svg')).not.toBeNull()
    expect(nextButton.querySelector('svg')).not.toBeNull()
    expect(previousButton).toHaveClass(...dateCalendarNavButtonColorStyles.slate.soft.split(/\s+/))
    expect(nextButton).toHaveClass(...dateCalendarNavButtonColorStyles.slate.soft.split(/\s+/))
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
