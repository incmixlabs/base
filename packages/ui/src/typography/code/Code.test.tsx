import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { codeBySize, codeSizeResponsive } from '../inline-elements.css'
import { Code } from './Code'

describe('Code', () => {
  it('applies responsive size classes for container-query typography', () => {
    render(<Code size={{ initial: 'sm', md: 'xl' }}>npm install</Code>)

    const element = screen.getByText('npm install')
    expect(element).toHaveClass(codeBySize.sm, codeSizeResponsive.md.xl)
  })
})
