import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tooltip } from './Tooltip'
import { tooltipContentBySize, tooltipContentMaxWidth } from './Tooltip.css'

describe('Tooltip', () => {
  it('uses tooltip runtime size and max-width classes instead of popover classes', () => {
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger render={<button type="button">Trigger</button>} />
        <Tooltip.Content size="md" maxWidth="lg">
          <Tooltip.Arrow />
          Tooltip body
        </Tooltip.Content>
      </Tooltip.Root>,
    )

    const popup = screen.getByText('Tooltip body').closest('[class]')
    expect(popup).not.toBeNull()
    expect(popup?.className).toContain(tooltipContentBySize.md)
    expect(popup?.className).toContain(tooltipContentMaxWidth.lg)
  })
})
