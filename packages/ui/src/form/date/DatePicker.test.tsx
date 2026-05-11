import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria-components'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FieldGroup } from '../FieldGroup'
import { DatePicker } from './DatePicker'
import { datePickerTriggerGroupBase, datePickerTriggerGroupSizeStyles } from './DatePicker.css'

afterEach(() => {
  cleanup()
})

describe('DatePicker', () => {
  it('renders trigger and can be disabled', () => {
    const { rerender } = render(<DatePicker />)
    const trigger = screen.getByRole('button')
    expect(trigger).toBeInTheDocument()
    expect(trigger).not.toBeDisabled()

    rerender(<DatePicker isDisabled />)
    expect(trigger).toBeDisabled()
  })

  it('inherits size from FieldGroup when no explicit size is provided', () => {
    const { container } = render(
      <FieldGroup size="lg">
        <DatePicker ariaLabel="Start date" />
      </FieldGroup>,
    )

    const triggerGroup = Array.from(container.querySelectorAll<HTMLElement>('div')).find(element =>
      element.classList.contains(datePickerTriggerGroupBase),
    )
    expect(triggerGroup).toBeDefined()
    expect(triggerGroup?.classList.contains(datePickerTriggerGroupSizeStyles.lg)).toBe(true)
  })

  it('keeps hidden input empty when uncontrolled', () => {
    const { container } = render(<DatePicker ariaLabel="Start date" />)
    const hiddenInput = container.querySelector<HTMLInputElement>('input[type="text"][hidden]')

    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput?.value).toBe('')
  })

  it('writes a concrete value to the hidden input when controlled', () => {
    const { container } = render(<DatePicker ariaLabel="Start date" value={new Date(2026, 0, 15)} onChange={vi.fn()} />)
    const hiddenInput = container.querySelector<HTMLInputElement>('input[type="text"][hidden]')

    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput?.value).toBe('2026-01-15')
  })

  it('formats hidden input value using dateFormat when provided', () => {
    const { container } = render(
      <DatePicker
        ariaLabel="Start date"
        value={new Date(2026, 0, 15)}
        onChange={vi.fn()}
        name="startDate"
        dateFormat="dd/MM/yyyy"
      />,
    )
    const hiddenInput = container.querySelector<HTMLInputElement>('input[type="text"][hidden][name="startDate"]')

    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput?.value).toBe('15/01/2026')
  })

  it('initializes hidden input from defaultValue and forwards name', () => {
    const defaultDate = new Date(2026, 0, 16, 18, 45)
    const expectedMonth = new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2026, 0, 1))
    const numberFormatter = new Intl.NumberFormat(undefined, { useGrouping: false })
    const expectedDay = numberFormatter.format(16)
    const expectedYear = numberFormatter.format(2026)

    const { container } = render(<DatePicker ariaLabel="Start date" defaultValue={defaultDate} name="startDate" />)
    const hiddenInput = container.querySelector<HTMLInputElement>('input[type="text"][hidden][name="startDate"]')

    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput?.value).toBe('2026-01-16')
    const spinbuttonValueTexts = screen
      .getAllByRole('spinbutton')
      .map(spinbutton => spinbutton.getAttribute('aria-valuetext'))

    expect(spinbuttonValueTexts).toEqual(
      expect.arrayContaining([expect.stringContaining(expectedMonth), expectedDay, expectedYear]),
    )
  })

  it('opens the calendar dialog when pressing Enter on the trigger button', async () => {
    const user = userEvent.setup()
    render(<DatePicker ariaLabel="Start date" />)

    const trigger = screen.getByRole('button', { name: /open calendar/i })
    trigger.focus()
    expect(trigger).toHaveFocus()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.keyboard('{Enter}')

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('closes the calendar dialog when pressing Escape', async () => {
    const user = userEvent.setup()
    render(<DatePicker ariaLabel="Start date" />)

    await user.click(screen.getByRole('button', { name: /open calendar/i }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('tabs away from trigger without opening dialog', async () => {
    const user = userEvent.setup()
    render(<DatePicker ariaLabel="Start date" />)

    const trigger = screen.getByRole('button', { name: /open calendar/i })
    trigger.focus()
    expect(trigger).toHaveFocus()

    await user.tab()

    expect(trigger).not.toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('increments the day segment with ArrowUp keyboard navigation', async () => {
    const user = userEvent.setup()
    const numberFormatter = new Intl.NumberFormat(undefined, { useGrouping: false })
    const expectedInitialDay = numberFormatter.format(16)
    const { container } = render(
      <DatePicker ariaLabel="Start date" defaultValue={new Date(2026, 0, 16)} name="startDate" />,
    )
    const daySpinbutton = screen
      .getAllByRole('spinbutton')
      .find(spinbutton => spinbutton.getAttribute('aria-valuetext') === expectedInitialDay)

    expect(daySpinbutton).toBeDefined()
    if (!daySpinbutton) {
      throw new Error('Expected to find day spinbutton for initial day')
    }
    daySpinbutton.focus()
    await user.keyboard('{ArrowUp}')

    const hiddenInput = container.querySelector<HTMLInputElement>('input[type="text"][hidden][name="startDate"]')
    expect(hiddenInput?.value).toBe('2026-01-17')
  })

  it('decrements the day segment with ArrowDown keyboard navigation', async () => {
    const user = userEvent.setup()
    const numberFormatter = new Intl.NumberFormat(undefined, { useGrouping: false })
    const expectedInitialDay = numberFormatter.format(16)
    const { container } = render(
      <DatePicker ariaLabel="Start date" defaultValue={new Date(2026, 0, 16)} name="startDate" />,
    )
    const daySpinbutton = screen
      .getAllByRole('spinbutton')
      .find(spinbutton => spinbutton.getAttribute('aria-valuetext') === expectedInitialDay)

    expect(daySpinbutton).toBeDefined()
    if (!daySpinbutton) {
      throw new Error('Expected to find day spinbutton for initial day')
    }
    daySpinbutton.focus()
    await user.keyboard('{ArrowDown}')

    const hiddenInput = container.querySelector<HTMLInputElement>('input[type="text"][hidden][name="startDate"]')
    expect(hiddenInput?.value).toBe('2026-01-15')
  })

  it('does not allow selecting dates marked as unavailable', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <DatePicker
        ariaLabel="Start date"
        value={new Date(2026, 0, 15)}
        onChange={onChange}
        disabledDates={[new Date(2026, 0, 16)]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /open calendar/i }))

    const dialog = await screen.findByRole('dialog')
    const unavailableElement = dialog.querySelector('[data-unavailable]')
    expect(unavailableElement).toBeInTheDocument()
    await user.click(unavailableElement as HTMLElement)

    expect(onChange).not.toHaveBeenCalled()
    const hiddenInput = container.querySelector<HTMLInputElement>('input[type="text"][hidden]')
    expect(hiddenInput?.value).toBe('2026-01-15')
  })

  it('parses natural-language input and updates the named textbox when valid', () => {
    const onChange = vi.fn()
    render(<DatePicker ariaLabel="Start date" name="startDate" onChange={onChange} enableNaturalLanguage />)

    const input = screen.getByRole('textbox', { name: /start date/i })
    fireEvent.change(input, { target: { value: 'March 16, 2026' } })

    expect(onChange).toHaveBeenCalled()
    const latest = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0] as Date | undefined
    expect(latest).toBeInstanceOf(Date)

    expect(input).toHaveAttribute('name', 'startDate')
    expect(input).toHaveValue('2026-03-16')
  })

  it('does not commit ambiguous natural-language prefix like "next "', () => {
    const onChange = vi.fn()
    render(<DatePicker ariaLabel="Start date" name="startDate" onChange={onChange} enableNaturalLanguage />)

    const input = screen.getByRole('textbox', { name: /start date/i })
    fireEvent.change(input, { target: { value: 'next ' } })

    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('name', 'startDate')
    expect(input).toHaveValue('next ')
  })

  it('commits natural-language phrase "next w"', () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date(2026, 0, 15, 9, 0, 0))

      const onChange = vi.fn()
      render(<DatePicker ariaLabel="Start date" name="startDate" onChange={onChange} enableNaturalLanguage />)

      const input = screen.getByRole('textbox', { name: /start date/i })
      fireEvent.change(input, { target: { value: 'next w' } })

      expect(onChange).toHaveBeenCalled()
      expect(input).toHaveAttribute('name', 'startDate')
      expect(input).toHaveValue('2026-01-22')
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not commit natural-language input when parsed date is outside bounds', () => {
    const onChange = vi.fn()
    render(
      <DatePicker
        ariaLabel="Start date"
        name="startDate"
        onChange={onChange}
        enableNaturalLanguage
        minValue={new Date(2026, 0, 10)}
        maxValue={new Date(2026, 0, 20)}
      />,
    )

    const input = screen.getByRole('textbox', { name: /start date/i })
    fireEvent.change(input, { target: { value: 'January 1, 2020' } })

    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('name', 'startDate')
    expect(input).toHaveValue('January 1, 2020')
  })

  it('keeps invalid strict text input in the named textbox without committing it', () => {
    const onChange = vi.fn()
    render(<DatePicker ariaLabel="Start date" name="startDate" onChange={onChange} entryMode="text" />)

    const input = screen.getByRole('textbox', { name: /start date/i })
    fireEvent.change(input, { target: { value: '2026-02-31' } })

    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('name', 'startDate')
    expect(input).toHaveValue('2026-02-31')
  })

  it('keeps out-of-bounds strict text input from becoming the selected date', () => {
    const onChange = vi.fn()
    render(
      <DatePicker
        ariaLabel="Start date"
        name="startDate"
        onChange={onChange}
        entryMode="text"
        minValue={new Date(2026, 0, 10)}
        maxValue={new Date(2026, 0, 20)}
      />,
    )

    const input = screen.getByRole('textbox', { name: /start date/i })
    fireEvent.change(input, { target: { value: '2026-01-01' } })

    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('name', 'startDate')
    expect(input).toHaveValue('2026-01-01')
  })

  it('opens natural-language calendar when pressing ArrowDown in the textbox', async () => {
    const user = userEvent.setup()
    render(<DatePicker ariaLabel="Start date" enableNaturalLanguage />)

    const input = screen.getByRole('textbox', { name: /start date/i })
    input.focus()
    await user.keyboard('{ArrowDown}')

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('closes natural-language calendar when pressing Escape', async () => {
    const user = userEvent.setup()
    render(<DatePicker ariaLabel="Start date" enableNaturalLanguage />)

    const input = screen.getByRole('textbox', { name: /start date/i })
    input.focus()
    await user.keyboard('{ArrowDown}')
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('closes text-entry calendar when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <>
        <DatePicker ariaLabel="Start date" entryMode="text" />
        <button type="button">Outside</button>
      </>,
    )

    await user.click(screen.getByRole('button', { name: /open calendar/i }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Outside' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it.each([
    'ar-EG',
    'fa-IR-u-ca-gregory',
    'bn-BD',
    'mr-IN',
  ])('uses locale-aware segment values in date segments for %s', locale => {
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long' })
    const expectedMonth = monthFormatter.format(new Date(2026, 0, 1))
    const numberFormatter = new Intl.NumberFormat(locale, { useGrouping: false })
    const expectedDay = numberFormatter.format(16)
    const expectedYear = numberFormatter.format(2026)
    const { container } = render(
      <I18nProvider locale={locale}>
        <DatePicker ariaLabel="Start date" defaultValue={new Date(2026, 0, 16)} name="startDate" />
      </I18nProvider>,
    )

    const spinbuttonValueTexts = screen
      .getAllByRole('spinbutton')
      .map(spinbutton => spinbutton.getAttribute('aria-valuetext'))

    expect(spinbuttonValueTexts).toEqual(
      expect.arrayContaining([expect.stringContaining(expectedMonth), expectedDay, expectedYear]),
    )
    const hiddenInput = container.querySelector<HTMLInputElement>('input[type="text"][hidden][name="startDate"]')
    expect(hiddenInput?.value).toBe('2026-01-16')
  })
})
