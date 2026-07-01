import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TooltipWrapper } from './TooltipWrapper'
import { Tooltip } from './Tooltip'
import { tooltipContentPropDefs } from './tooltip.props'

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Tooltip', () => {
  it('keeps size metadata scalar until responsive class handling exists', () => {
    expect('responsive' in tooltipContentPropDefs.size).toBe(false)
  })

  it('renders the floating surface class contract', () => {
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
    expectClassTokens(popup?.className, [
      'relative',
      'box-border',
      'overflow-visible',
      'rounded-[var(--element-border-radius)]',
      '[min-width:var(--anchor-width)]',
      'px-3',
      'py-1',
      'text-base',
      'leading-6',
      'max-w-[32rem]',
      'bg-inverse-solid',
      'border-[var(--color-inverse-text)]',
      'text-inverse-contrast',
      '[--af-floating-surface-arrow-fill:var(--color-inverse-solid)]',
      '[--af-floating-surface-arrow-edge:var(--color-inverse-text)]',
    ])
    expect(popup?.className).not.toContain('[fill:')

    const arrow = popup?.querySelector('svg[viewBox="0 0 20 10"]')?.parentElement
    expect(arrow).not.toBeNull()
    expectClassTokens(arrow?.className, [
      'flex',
      '[fill:var(--af-floating-surface-arrow-fill,currentColor)]',
      '[color:var(--af-floating-surface-arrow-edge,currentColor)]',
    ])
  })
})

describe('TooltipWrapper', () => {
  it('composes element triggers onto the focusable element', () => {
    render(
      <TooltipWrapper
        defaultOpen
        className="wrapper-trigger-class"
        trigger={
          <button type="button" className="source-trigger-class">
            Inspect
          </button>
        }
        data={{ title: 'Details' }}
      />,
    )

    const trigger = screen.getByRole('button', { name: 'Inspect' })
    expectClassTokens(trigger.className, ['source-trigger-class', 'wrapper-trigger-class'])
  })

  it('renders zero-valued wrapper content', () => {
    render(
      <TooltipWrapper
        defaultOpen
        trigger={<button type="button">Metrics</button>}
        data={{
          title: 0,
          description: 0,
          items: [{ id: 'count', label: 'Count', value: 0, description: 0 }],
          footer: 0,
        }}
      />,
    )

    expect(screen.getAllByText('0')).toHaveLength(5)
  })

  it('does not render empty wrappers for boolean content', () => {
    render(
      <TooltipWrapper
        defaultOpen
        trigger={<button type="button">Boolean metrics</button>}
        data={{
          title: false,
          description: false,
          items: [{ id: 'hidden', label: false, value: false, description: false }],
          footer: false,
        }}
      />,
    )

    const tooltip = document.body.querySelector('[data-base-ui-portal] [data-base-ui-focusable]')

    expect(tooltip).not.toBeNull()
    expect(tooltip?.querySelector('.text-sm.font-semibold')).toBeNull()
    expect(tooltip?.querySelector('.rounded-md.border.border-neutral')).toBeNull()
    expect(tooltip?.querySelector('.opacity-70')).toBeNull()
  })
})
