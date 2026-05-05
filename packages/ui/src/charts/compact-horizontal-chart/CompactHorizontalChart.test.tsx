import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { CompactHorizontalChart } from './CompactHorizontalChart'

const chartData = [{ label: 'United States', value: 34 }]

afterEach(() => cleanup())

function getChartParts() {
  const root = screen.getByRole('img', { name: /Top countries/i })
  const track = document.querySelector<HTMLElement>('[title="United States: 34"]')
  if (!track) throw new Error('Expected compact chart track to render.')
  const fill = track.firstElementChild as HTMLElement | null
  if (!fill) throw new Error('Expected compact chart fill to render.')
  return { root, track, fill }
}

describe('CompactHorizontalChart', () => {
  it('defaults chart radius to the ThemeProvider radius', () => {
    render(
      <Theme radius="lg">
        <CompactHorizontalChart title="Top countries" data={chartData} />
      </Theme>,
    )

    const { root, track, fill } = getChartParts()
    expect(root.style.borderRadius).toBe(designTokens.radius.lg)
    expect(track.style.borderRadius).toBe(designTokens.radius.lg)
    expect(fill.style.borderRadius).toBe(designTokens.radius.lg)
  })

  it('lets radius none square the surface and bars', () => {
    render(
      <Theme radius="lg">
        <CompactHorizontalChart title="Top countries" data={chartData} radius="none" />
      </Theme>,
    )

    const { root, track, fill } = getChartParts()
    expect(root.style.borderRadius).toBe('0px')
    expect(track.style.borderRadius).toBe('0px')
    expect(fill.style.borderRadius).toBe('0px')
  })

  it('caps a full theme radius to lg for the chart surface and bars', () => {
    render(
      <Theme radius="full">
        <CompactHorizontalChart title="Top countries" data={chartData} />
      </Theme>,
    )

    const { root, track, fill } = getChartParts()
    expect(root.style.borderRadius).toBe(designTokens.radius.lg)
    expect(track.style.borderRadius).toBe(designTokens.radius.lg)
    expect(fill.style.borderRadius).toBe(designTokens.radius.lg)
  })

  it('uses normalized values in the screen reader summary', () => {
    render(
      <CompactHorizontalChart
        title="Top countries"
        data={[
          { label: 'Missing', value: null },
          { label: 'Negative', value: -10 },
        ]}
      />,
    )

    expect(screen.getByRole('img', { name: 'Top countries: Missing n/a, Negative 0' })).toBeInTheDocument()
  })

  it('formats values from JSON-safe formatter config', () => {
    render(<CompactHorizontalChart title="Top countries" data={chartData} valueFormat="percent" />)

    expect(screen.getByRole('img', { name: 'Top countries: United States 34%' })).toBeInTheDocument()
    expect(document.querySelector('[title="United States: 34%"]')).toBeInTheDocument()
  })
})
