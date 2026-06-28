import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPropDefValues } from '@/theme/props/prop-def'
import { headingBase, headingSizeResponsive } from '../typography.class'
import { Heading } from './Heading'
import { headingPropDefs } from './heading.props'

function expectPropValue<T extends string>(values: readonly T[], value: T): T {
  expect(values).toContain(value)
  return value
}

describe('Heading', () => {
  it('applies container-query responsive size classes', () => {
    const initialSize = expectPropValue(getPropDefValues(headingPropDefs.size), 'lg')
    const responsiveSize = expectPropValue(getPropDefValues(headingPropDefs.size), '3x')

    render(
      <div style={{ containerType: 'inline-size' }}>
        <Heading size={{ initial: initialSize, md: responsiveSize }}>Headline</Heading>
      </div>,
    )

    const heading = screen.getByText('Headline')
    expect(heading).toBeInTheDocument()
    expect(heading.className).toContain(headingBase)
    expect(heading.className).toContain(headingSizeResponsive.md[responsiveSize])
  })
})
