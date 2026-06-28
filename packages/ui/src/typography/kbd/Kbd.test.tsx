import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Kbd } from './Kbd'
import { kbdBySize, kbdSizeResponsive } from './kbd.class'
import { kbdPropDefs } from './kbd.props'

function expectPropValue<T extends string>(values: readonly T[], value: T): T {
  expect(values).toContain(value)
  return value
}

describe('Kbd', () => {
  it('applies responsive size classes for container-query typography', () => {
    const initialSize = expectPropValue(getPropDefValues(kbdPropDefs.size), 'sm')
    const responsiveSize = expectPropValue(getPropDefValues(kbdPropDefs.size), 'xl')

    render(<Kbd size={{ initial: initialSize, md: responsiveSize }}>⌘ K</Kbd>)

    const element = screen.getByText('⌘ K')
    expect(element).toHaveClass(kbdBySize[initialSize], kbdSizeResponsive.md[responsiveSize])
  })
})
