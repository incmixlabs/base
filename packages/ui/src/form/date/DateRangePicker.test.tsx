import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { I18nProvider } from 'react-aria-components'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FieldGroup } from '../FieldGroup'
import { DateRangePicker } from './DateRangePicker'
import { rangeTriggerGroupBase, rangeTriggerGroupSizeStyles } from './DateRangePicker.css'

const DUAL_MONTH_INTERACTION_TEST_TIMEOUT_MS = 15_000
const DUAL_MONTH_HEADING_TOGGLE_TEST_TIMEOUT_MS = 15_000
const DUAL_MONTH_SLOW_INTERACTION_TEST_TIMEOUT_MS = 30_000

afterEach(() => {
  cleanup()
})

describe('DateRangePicker', () => {
  it('does not render hidden inputs when name is not provided', () => {
    const { container } = render(<DateRangePicker ariaLabel="Travel dates" />)
    const hiddenInputs = container.querySelectorAll('input[type="hidden"]')

    expect(hiddenInputs.length).toBe(0)
  })

  it('inherits size from FieldGroup when no explicit size is provided', () => {
    const { container } = render(
      <FieldGroup size="lg" variant="surface">
        <DateRangePicker ariaLabel="Travel dates" />
      </FieldGroup>,
    )

    const triggerGroup = Array.from(container.querySelectorAll<HTMLElement>('div')).find(element =>
      element.classList.contains(rangeTriggerGroupBase),
    )
    expect(triggerGroup).toBeDefined()
    expect(triggerGroup?.classList.contains(rangeTriggerGroupSizeStyles.lg)).toBe(true)
  })

  it('keeps hidden inputs empty when range is undefined', () => {
    const { container } = render(<DateRangePicker ariaLabel="Travel dates" name="tripDate" />)
    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')

    expect(fromInput).toBeInTheDocument()
    expect(toInput).toBeInTheDocument()
    expect(fromInput?.value).toBe('')
    expect(toInput?.value).toBe('')
  })

  it('writes hidden inputs when controlled range is provided', () => {
    const { container } = render(
      <DateRangePicker
        ariaLabel="Travel dates"
        name="tripDate"
        value={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
        onChange={vi.fn()}
      />,
    )
    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')

    expect(fromInput).toBeInTheDocument()
    expect(toInput).toBeInTheDocument()
    expect(fromInput?.value).toBe('2026-01-15')
    expect(toInput?.value).toBe('2026-01-20')
  })

  it('keeps hidden input mapping stable with style props and FieldGroup inheritance', () => {
    const { container } = render(
      <FieldGroup size="lg" variant="surface">
        <DateRangePicker
          ariaLabel="Travel dates"
          name="tripDate"
          value={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
          onChange={vi.fn()}
          color="warning"
          radius="full"
        />
      </FieldGroup>,
    )
    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')

    expect(fromInput).toBeInTheDocument()
    expect(toInput).toBeInTheDocument()
    expect(fromInput?.value).toBe('2026-01-15')
    expect(toInput?.value).toBe('2026-01-20')
  })

  it('formats hidden inputs using dateFormat when provided', () => {
    const { container } = render(
      <DateRangePicker
        ariaLabel="Travel dates"
        name="tripDate"
        value={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
        onChange={vi.fn()}
        dateFormat="dd/MM/yyyy"
      />,
    )
    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')

    expect(fromInput?.value).toBe('15/01/2026')
    expect(toInput?.value).toBe('20/01/2026')
  })

  it(
    'opens dialog with Enter on trigger and closes on Escape',
    async () => {
      const user = userEvent.setup()
      render(<DateRangePicker ariaLabel="Travel dates" />)

      const trigger = screen.getByRole('button', { name: /open calendar/i })
      trigger.focus()
      expect(trigger).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(await screen.findByRole('dialog')).toBeInTheDocument()

      await user.keyboard('{Escape}')
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
      expect(trigger).not.toHaveAttribute('aria-expanded', 'true')
    },
    DUAL_MONTH_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('tabs away from trigger without opening dialog', async () => {
    const user = userEvent.setup()
    render(
      <DateRangePicker
        ariaLabel="Travel dates"
        defaultValue={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
      />,
    )

    const trigger = screen.getByRole('button', { name: /open calendar/i })
    trigger.focus()
    expect(trigger).toHaveFocus()

    await user.tab()

    expect(trigger).not.toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('increments both start and end day segments with ArrowUp keyboard navigation', async () => {
    const user = userEvent.setup()
    const numberFormatter = new Intl.NumberFormat(undefined, { useGrouping: false })
    const expectedStartDay = numberFormatter.format(15)
    const expectedEndDay = numberFormatter.format(20)
    const { container } = render(
      <DateRangePicker
        ariaLabel="Travel dates"
        name="tripDate"
        defaultValue={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
      />,
    )

    const daySpinbuttons = screen.getAllByRole('spinbutton')
    const startDaySpinbutton = daySpinbuttons.find(
      spinbutton => spinbutton.getAttribute('aria-valuetext') === expectedStartDay,
    )
    const endDaySpinbutton = daySpinbuttons.find(
      spinbutton => spinbutton.getAttribute('aria-valuetext') === expectedEndDay,
    )

    expect(startDaySpinbutton).toBeDefined()
    expect(endDaySpinbutton).toBeDefined()
    if (!startDaySpinbutton || !endDaySpinbutton) {
      throw new Error('Expected to find both start and end day spinbuttons')
    }

    startDaySpinbutton.focus()
    await user.keyboard('{ArrowUp}')
    endDaySpinbutton.focus()
    await user.keyboard('{ArrowUp}')

    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
    expect(fromInput?.value).toBe('2026-01-16')
    expect(toInput?.value).toBe('2026-01-21')
  })

  it.each(['ar-EG', 'fa-IR-u-ca-gregory'])('uses locale-aware numerals in range segments for %s', locale => {
    const numberFormatter = new Intl.NumberFormat(locale, { useGrouping: false })
    const expectedFromDay = numberFormatter.format(15)
    const expectedToDay = numberFormatter.format(20)
    const expectedYear = numberFormatter.format(2026)
    const { container } = render(
      <I18nProvider locale={locale}>
        <DateRangePicker
          ariaLabel="Travel dates"
          name="tripDate"
          defaultValue={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
        />
      </I18nProvider>,
    )

    const spinbuttonValueTexts = screen
      .getAllByRole('spinbutton')
      .map(spinbutton => spinbutton.getAttribute('aria-valuetext'))

    expect(spinbuttonValueTexts).toEqual(expect.arrayContaining([expectedFromDay, expectedToDay, expectedYear]))

    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
    expect(fromInput?.value).toBe('2026-01-15')
    expect(toInput?.value).toBe('2026-01-20')
  })

  it('does not allow selecting dates outside min/max bounds', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <DateRangePicker
        ariaLabel="Travel dates"
        name="tripDate"
        value={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
        onChange={onChange}
        minValue={new Date(2026, 0, 15)}
        maxValue={new Date(2026, 0, 20)}
      />,
    )

    await user.click(screen.getByRole('button', { name: /open calendar/i }))
    const dialog = await screen.findByRole('dialog')
    const unavailableCell = dialog.querySelector(
      'button[data-day-key][data-unavailable][aria-disabled="true"]:not([data-outside-month])',
    )
    expect(unavailableCell).toBeInTheDocument()

    await user.click(unavailableCell as HTMLElement)

    expect(onChange).not.toHaveBeenCalled()
    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
    expect(fromInput?.value).toBe('2026-01-15')
    expect(toInput?.value).toBe('2026-01-20')
  })

  it('does not allow selecting disabledDates', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <DateRangePicker
        ariaLabel="Travel dates"
        name="tripDate"
        value={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
        onChange={onChange}
        disabledDates={[new Date(2026, 0, 16)]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /open calendar/i }))
    const dialog = await screen.findByRole('dialog')
    const unavailableCell = dialog.querySelector(
      'button[data-day-key][data-unavailable][aria-disabled="true"]:not([data-outside-month])',
    )
    expect(unavailableCell).toBeInTheDocument()

    await user.click(unavailableCell as HTMLElement)

    expect(onChange).not.toHaveBeenCalled()
    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
    expect(fromInput?.value).toBe('2026-01-15')
    expect(toInput?.value).toBe('2026-01-20')
  })

  it('keeps hidden inputs empty after first click while range end is pending', async () => {
    const user = userEvent.setup()
    const { container } = render(<DateRangePicker ariaLabel="Travel dates" name="tripDate" />)

    await user.click(screen.getByRole('button', { name: /open calendar/i }))
    const dialog = await screen.findByRole('dialog')
    const selectableCell = dialog.querySelector(
      'button[data-day-key]:not([data-unavailable]):not([data-outside-month]):not([aria-disabled="true"])',
    )
    expect(selectableCell).toBeInTheDocument()

    await user.click(selectableCell as HTMLElement)

    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
    expect(fromInput?.value).toBe('')
    expect(toInput?.value).toBe('')
  })

  it(
    'writes hidden inputs after completing range with second click',
    async () => {
      const user = userEvent.setup()
      const { container } = render(
        <DateRangePicker
          ariaLabel="Travel dates"
          name="tripDate"
          defaultValue={{ from: new Date(2026, 0, 10), to: new Date(2026, 0, 12) }}
        />,
      )

      await user.click(screen.getByRole('button', { name: /open calendar/i }))
      await screen.findByRole('dialog')
      const startButton = screen.getByRole('button', { name: /January 14, 2026/i })
      const endButton = screen.getByRole('button', { name: /January 19, 2026/i })

      await user.click(startButton)
      await user.click(endButton)

      const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
      const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
      await waitFor(() => {
        expect(fromInput?.value).toBe('2026-01-14')
        expect(toInput?.value).toBe('2026-01-19')
      })
    },
    DUAL_MONTH_SLOW_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('writes hidden inputs and emits onChange for uncontrolled segment edits', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <DateRangePicker
        ariaLabel="Travel dates"
        name="tripDate"
        onChange={onChange}
        defaultValue={{ from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }}
      />,
    )
    const numberFormatter = new Intl.NumberFormat(undefined, { useGrouping: false })
    const expectedStartDay = numberFormatter.format(15)

    const startDaySpinbutton = screen
      .getAllByRole('spinbutton')
      .find(spinbutton => spinbutton.getAttribute('aria-valuetext') === expectedStartDay)
    expect(startDaySpinbutton).toBeDefined()
    if (!startDaySpinbutton) {
      throw new Error('Expected start day spinbutton')
    }

    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
    expect(fromInput?.value).toBe('2026-01-15')
    expect(toInput?.value).toBe('2026-01-20')

    startDaySpinbutton.focus()
    await user.keyboard('{ArrowUp}')

    expect(onChange).toHaveBeenCalled()
    const nextRange = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0] as { from?: Date; to?: Date } | undefined
    expect(nextRange?.from).toBeInstanceOf(Date)
    expect(nextRange?.to).toBeInstanceOf(Date)

    expect(fromInput?.value).toBe('2026-01-16')
    expect(toInput?.value).toBe('2026-01-20')
  })

  it('keeps controlled range stable on first click and updates after second click', async () => {
    const user = userEvent.setup()

    function ControlledHarness() {
      const [value, setValue] = React.useState<{ from: Date; to: Date } | undefined>({
        from: new Date(2026, 0, 15),
        to: new Date(2026, 0, 20),
      })

      return <DateRangePicker ariaLabel="Travel dates" name="tripDate" value={value} onChange={setValue} />
    }

    const { container } = render(<ControlledHarness />)

    await user.click(screen.getByRole('button', { name: /open calendar/i }))
    const dialog = await screen.findByRole('dialog')
    const dayButtons = Array.from(dialog.querySelectorAll<HTMLElement>('button[data-day-key][aria-label]')).filter(
      button => button.getAttribute('aria-label')?.includes('January'),
    )
    const day18 = dayButtons.find(button => button.getAttribute('aria-label')?.includes('January 18, 2026'))
    const day22 = dayButtons.find(button => button.getAttribute('aria-label')?.includes('January 22, 2026'))

    expect(day18).toBeInTheDocument()
    expect(day22).toBeInTheDocument()
    if (!day18 || !day22) {
      throw new Error('Expected to find selectable day buttons for January 18 and January 22')
    }

    const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
    const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
    expect(fromInput?.value).toBe('2026-01-15')
    expect(toInput?.value).toBe('2026-01-20')

    await user.click(day18)
    expect(fromInput?.value).toBe('2026-01-15')
    expect(toInput?.value).toBe('2026-01-20')

    await user.click(day22)
    await waitFor(() => {
      expect(fromInput?.value).toBe('2026-01-18')
      expect(toInput?.value).toBe('2026-01-22')
    })
  })

  it(
    'keeps right month stable when navigating previous from the left month in dual mode',
    () => {
      render(
        <DateRangePicker
          ariaLabel="Travel dates"
          visibleMonths={2}
          value={{ from: new Date(2026, 1, 10), to: new Date(2026, 2, 12) }}
          onChange={vi.fn()}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /open calendar/i }))

      expect(screen.getByText('February 2026')).toBeInTheDocument()
      expect(screen.getByText('March 2026')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /previous month/i }))

      expect(screen.getByText('January 2026')).toBeInTheDocument()
      expect(screen.getByText('March 2026')).toBeInTheDocument()
    },
    DUAL_MONTH_INTERACTION_TEST_TIMEOUT_MS,
  )

  it(
    'toggles month and year picker state from dual-month heading',
    async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          ariaLabel="Travel dates"
          visibleMonths={2}
          value={{ from: new Date(2026, 1, 10), to: new Date(2026, 2, 12) }}
          onChange={vi.fn()}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /open calendar/i }))
      const leftHeadingButton = screen.getByRole('button', { name: /select month and year for left calendar/i })
      expect(leftHeadingButton).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(leftHeadingButton)
      expect(leftHeadingButton).toHaveAttribute('aria-expanded', 'true')

      await user.keyboard('{Escape}')
      await waitFor(() => expect(leftHeadingButton).toHaveAttribute('aria-expanded', 'false'))
    },
    DUAL_MONTH_HEADING_TOGGLE_TEST_TIMEOUT_MS,
  )

  it(
    'commits cross-month range selection in dual mode on second click',
    async () => {
      const { container } = render(
        <DateRangePicker
          ariaLabel="Travel dates"
          name="tripDate"
          visibleMonths={2}
          defaultValue={{ from: new Date(2026, 0, 30), to: new Date(2026, 1, 3) }}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /open calendar/i }))
      await screen.findByRole('dialog')
      fireEvent.click(screen.getByRole('button', { name: /Saturday, January 31, 2026/ }))

      const fromInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_from"]')
      const toInput = container.querySelector<HTMLInputElement>('input[type="hidden"][name="tripDate_to"]')
      expect(fromInput?.value).toBe('2026-01-30')
      expect(toInput?.value).toBe('2026-02-03')

      fireEvent.click(screen.getByRole('button', { name: /Wednesday, February 4, 2026/ }))

      await waitFor(() => {
        expect(fromInput?.value).toBe('2026-01-31')
        expect(toInput?.value).toBe('2026-02-04')
      })
    },
    DUAL_MONTH_SLOW_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('opens with Enter and closes with Escape in dual mode', async () => {
    const user = userEvent.setup()
    render(<DateRangePicker ariaLabel="Travel dates" visibleMonths={2} />)

    const trigger = screen.getByRole('button', { name: /open calendar/i })
    trigger.focus()

    await user.keyboard('{Enter}')
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it(
    'moves keyboard focus across panels with ArrowRight in dual mode',
    async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          ariaLabel="Travel dates"
          visibleMonths={2}
          value={{ from: new Date(2026, 0, 31), to: new Date(2026, 1, 3) }}
          onChange={vi.fn()}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /open calendar/i }))
      const january31 = screen.getByRole('button', { name: /Saturday, January 31, 2026/ })
      january31.focus()
      expect(january31).toHaveFocus()

      await user.keyboard('{ArrowRight}')

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Sunday, February 1, 2026/ })).toHaveFocus()
      })
    },
    DUAL_MONTH_SLOW_INTERACTION_TEST_TIMEOUT_MS,
  )
})
