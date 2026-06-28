import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPropDefValues } from '@/theme/props/prop-def'
import { codeBySize, codeSizeResponsive } from '../inline-elements.class'
import { Code } from './Code'
import { codePropDefs } from './code.props'

function expectPropValue<T extends string>(values: readonly T[], value: T): T {
  expect(values).toContain(value)
  return value
}

describe('Code', () => {
  it('applies responsive size classes for container-query typography', () => {
    const initialSize = expectPropValue(getPropDefValues(codePropDefs.size), 'sm')
    const responsiveSize = expectPropValue(getPropDefValues(codePropDefs.size), 'xl')

    render(<Code size={{ initial: initialSize, md: responsiveSize }}>npm install</Code>)

    const element = screen.getByText('npm install')
    expect(element).toHaveClass(codeBySize[initialSize], codeSizeResponsive.md[responsiveSize])
  })
})
