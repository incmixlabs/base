import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AspectRatio } from './AspectRatio'
import { aspectRatioByRatio } from './aspect-ratio.class'

afterEach(() => {
  cleanup()
})

describe('AspectRatio', () => {
  it('passes through div props', () => {
    render(
      <AspectRatio ratio="1/1" data-testid="ratio-box" aria-label="Preview frame">
        <span>child</span>
      </AspectRatio>,
    )

    const node = screen.getByTestId('ratio-box')
    expect(node).toHaveAttribute('aria-label', 'Preview frame')
    expect(node).toContainElement(screen.getByText('child'))
  })

  it('merges customRatio with style props', () => {
    render(<AspectRatio data-testid="ratio-box" customRatio={1.5} style={{ borderRadius: '12px' }} />)

    const node = screen.getByTestId('ratio-box')
    expect(node.style.aspectRatio).toBe('1.5 / 1')
    expect(node.style.borderRadius).toBe('12px')
  })

  it('falls back to the configured ratio when customRatio=0', () => {
    render(<AspectRatio data-testid="ratio-box" customRatio={0} />)

    const node = screen.getByTestId('ratio-box')
    expect(node.className).toContain(aspectRatioByRatio['16/9'])
    expect(node.style.aspectRatio).toBe('')
  })

  it('does not inject invalid custom ratio values into inline styles', () => {
    render(<AspectRatio data-testid="ratio-box" customRatio={Number.NaN} style={{ aspectRatio: '4 / 3' }} />)

    const node = screen.getByTestId('ratio-box')
    expect(node.className).toContain(aspectRatioByRatio['16/9'])
    expect(node.style.aspectRatio).toBe('4 / 3')
  })
})
