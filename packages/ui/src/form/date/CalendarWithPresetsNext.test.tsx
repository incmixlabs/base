import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CalendarWithPresetsNext, type DateRangePresetNext } from './CalendarWithPresetsNext'

afterEach(() => {
  vi.useRealTimers()
  cleanup()
})

/** Match aria-label like "Sunday, March 15, 2026" with negative lookahead to avoid partial matches. */
const dayLabel = (month: string, day: number) => new RegExp(`${month} ${day}(?!\\d)`, 'i')
const CALENDAR_WITH_PRESETS_TEST_TIMEOUT_MS = 15_000

/** Get the nav button by aria-label (distinct from preset buttons which use visible text). */
const getNavButton = (label: string) => screen.getByLabelText(label)

describe('CalendarWithPresetsNext', () => {
  it(
    'renders preset buttons',
    () => {
      act(() => {
        render(<CalendarWithPresetsNext />)
      })

      expect(screen.getByRole('button', { name: 'Today' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Last 7 days' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Last month' })).toBeTruthy()
    },
    CALENDAR_WITH_PRESETS_TEST_TIMEOUT_MS,
  )

  it(
    'calls onChange when a preset is clicked',
    async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      act(() => {
        render(<CalendarWithPresetsNext onChange={onChange} />)
      })

      await user.click(screen.getByRole('button', { name: 'Today' }))

      expect(onChange).toHaveBeenCalledTimes(1)
      const range = onChange.mock.calls[0][0]
      expect(range.from).toBeInstanceOf(Date)
      expect(range.to).toBeInstanceOf(Date)
    },
    CALENDAR_WITH_PRESETS_TEST_TIMEOUT_MS,
  )

  it('renders custom presets', () => {
    const customPresets: DateRangePresetNext[] = [
      { label: 'Q1', getValue: () => ({ from: new Date(2026, 0, 1), to: new Date(2026, 2, 31) }) },
      { label: 'Q2', getValue: () => ({ from: new Date(2026, 3, 1), to: new Date(2026, 5, 30) }) },
    ]

    act(() => {
      render(<CalendarWithPresetsNext presets={customPresets} />)
    })

    expect(screen.getByRole('button', { name: 'Q1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Q2' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Today' })).toBeNull()
  })

  it(
    'selects a range via two calendar clicks',
    async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      act(() => {
        render(
          <CalendarWithPresetsNext
            value={{ from: new Date(2026, 2, 5), to: new Date(2026, 2, 8) }}
            onChange={onChange}
          />,
        )
      })

      // Click March 10 (first click starts new range — previous range had both from and to)
      const day10 = screen.getByRole('button', { name: dayLabel('March', 10) })
      await user.click(day10)

      // Click March 15 (second click completes range)
      const day15 = screen.getByRole('button', { name: dayLabel('March', 15) })
      await user.click(day15)

      expect(onChange).toHaveBeenCalledTimes(1)
      const range = onChange.mock.calls[0][0]
      expect(range.from.getDate()).toBe(10)
      expect(range.to.getDate()).toBe(15)
    },
    CALENDAR_WITH_PRESETS_TEST_TIMEOUT_MS,
  )

  it('hides calendar when showCalendar is false', () => {
    act(() => {
      render(<CalendarWithPresetsNext showCalendar={false} />)
    })

    // Preset buttons should exist
    expect(screen.getByRole('button', { name: 'Today' })).toBeTruthy()

    // Nav buttons (aria-label) should not exist
    expect(screen.queryByLabelText('Previous month')).toBeNull()
    // Month heading button should not exist
    expect(screen.queryByLabelText(/Select month and year/)).toBeNull()
  })

  it('clamps preset range to min/max bounds', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-03-15T12:00:00Z'))

    const user = userEvent.setup()
    const onChange = vi.fn()
    const today = new Date()
    const minValue = new Date(today)
    minValue.setDate(today.getDate() - 3)

    act(() => {
      render(<CalendarWithPresetsNext onChange={onChange} minValue={minValue} />)
    })

    await user.click(screen.getByRole('button', { name: 'Last 7 days' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    const range = onChange.mock.calls[0][0]
    expect(range.from.getFullYear()).toBe(minValue.getFullYear())
    expect(range.from.getMonth()).toBe(minValue.getMonth())
    expect(range.from.getDate()).toBe(minValue.getDate())
  })

  it('disables all interactions when isDisabled is true', () => {
    act(() => {
      render(<CalendarWithPresetsNext isDisabled />)
    })

    const todayButton = screen.getByRole('button', { name: 'Today' })
    expect(todayButton).toBeDisabled()
  })

  it('renders two month panels in dual mode', () => {
    act(() => {
      render(<CalendarWithPresetsNext visibleMonths={2} />)
    })

    const headingButtons = screen.getAllByLabelText(/Select month and year/)
    expect(headingButtons.length).toBe(2)
  })

  it(
    'navigates months with prev/next buttons',
    async () => {
      const user = userEvent.setup()
      act(() => {
        render(<CalendarWithPresetsNext value={{ from: new Date(2026, 2, 15) }} />)
      })

      const headingButton = screen.getByLabelText(/Select month and year/)
      expect(headingButton.textContent).toContain('March')

      await user.click(getNavButton('Next month'))
      expect(headingButton.textContent).toContain('April')

      await user.click(getNavButton('Previous month'))
      expect(headingButton.textContent).toContain('March')
    },
    CALENDAR_WITH_PRESETS_TEST_TIMEOUT_MS,
  )
})
