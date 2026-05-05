import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { textBySize, textSizeResponsive } from '../typography.ve.css'
import { Blockquote } from './Blockquote'

describe('Blockquote', () => {
  it('applies responsive size classes for container-query typography', () => {
    render(<Blockquote size={{ initial: 'sm', md: 'xl' }}>Typography quote</Blockquote>)

    const element = screen.getByText('Typography quote')
    expect(element).toHaveClass(textBySize.sm, textSizeResponsive.md.xl)
  })
})
