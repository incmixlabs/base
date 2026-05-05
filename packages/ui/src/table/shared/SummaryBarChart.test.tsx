import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SummaryBarChart } from './SummaryBarChart'

afterEach(() => cleanup())

describe('SummaryBarChart', () => {
  it('renders an accessible G2-backed stacked summary chart host', () => {
    render(
      <SummaryBarChart
        data={[
          { label: '00:00', value: 10, secondary: 3 },
          { label: '06:00', value: 5 },
        ]}
      />,
    )

    expect(screen.getByRole('img', { name: 'Summary bar chart: 00:00 10, 06:00 5' })).toBeInTheDocument()
  })

  it('does not render empty data', () => {
    const { container } = render(<SummaryBarChart data={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
