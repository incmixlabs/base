import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPropDefValues } from '@/theme/props/prop-def'
import { textBySize, textSizeResponsive } from '../typography.class'
import { Blockquote } from './Blockquote'
import { blockquotePropDefs } from './blockquote.props'

function expectPropValue<T extends string>(values: readonly T[], value: T): T {
  expect(values).toContain(value)
  return value
}

describe('Blockquote', () => {
  it('renders only the left border', () => {
    render(<Blockquote>Border quote</Blockquote>)

    const element = screen.getByText('Border quote')
    expect(element).toHaveClass('border-0', 'border-l-4', '[border-left-style:solid]')
  })

  it('applies responsive size classes for container-query typography', () => {
    const initialSize = expectPropValue(getPropDefValues(blockquotePropDefs.size), 'sm')
    const responsiveSize = expectPropValue(getPropDefValues(blockquotePropDefs.size), 'xl')

    render(<Blockquote size={{ initial: initialSize, md: responsiveSize }}>Typography quote</Blockquote>)

    const element = screen.getByText('Typography quote')
    expect(element).toHaveClass(textBySize[initialSize], textSizeResponsive.md[responsiveSize])
  })
})
