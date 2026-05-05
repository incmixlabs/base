import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { textBase, textSizeResponsive } from '../typography.ve.css'
import { Text } from './Text'

describe('Text', () => {
  it('applies container-query responsive size classes', () => {
    render(
      <div style={{ containerType: 'inline-size' }}>
        <Text size={{ initial: 'sm', md: 'xl' }}>Body copy</Text>
      </div>,
    )

    const text = screen.getByText('Body copy')
    expect(text).toBeInTheDocument()
    expect(text.className).toContain(textBase)
    expect(text.className).toContain(textSizeResponsive.md.xl)
  })
})
