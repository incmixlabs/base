import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPropDefValues } from '@/theme/props/prop-def'
import { designTokens } from '@/theme/tokens'
import { textBase, textSizeResponsive, typographyTrimByTrim } from '../typography.class'
import { Text } from './Text'
import { textPropDefs } from './text.props'

function expectPropValue<T extends string>(values: readonly T[], value: T): T {
  expect(values).toContain(value)
  return value
}

describe('Text', () => {
  it('supports block-level truncation', () => {
    render(
      <Text as="p" truncate>
        Long body copy
      </Text>,
    )

    const text = screen.getByText('Long body copy')
    expect(text.tagName).toBe('P')
    expect(text).toHaveClass('truncate')
  })

  it('applies container-query responsive size classes', () => {
    const initialSize = expectPropValue(getPropDefValues(textPropDefs.size), 'sm')
    const responsiveSize = expectPropValue(getPropDefValues(textPropDefs.size), 'xl')

    render(
      <div style={{ containerType: 'inline-size' }}>
        <Text size={{ initial: initialSize, md: responsiveSize }}>Body copy</Text>
      </div>,
    )

    const text = screen.getByText('Body copy')
    expect(text).toBeInTheDocument()
    expect(text.className).toContain(textBase)
    expect(text.className).toContain(textSizeResponsive.md[responsiveSize])
  })

  it('applies concrete leading-trim utilities', () => {
    render(<Text trim="both">Trimmed copy</Text>)

    expect(screen.getByText('Trimmed copy')).toHaveClass(typographyTrimByTrim.both)
  })

  it('applies muted opacity when requested', () => {
    render(<Text muted>Muted copy</Text>)

    expect(screen.getByText('Muted copy')).toHaveClass('opacity-70')
  })

  it('treats muted variant as readable text with muted opacity', () => {
    render(
      <Text color="neutral" variant="muted">
        Muted variant
      </Text>,
    )

    const text = screen.getByText('Muted variant')
    expect(text).toHaveClass('opacity-70')
    expect(text).toHaveStyle({ color: designTokens.color.neutral.text })
  })

  it('can render semantic cite text', () => {
    render(<Text as="cite">Citation</Text>)

    expect(screen.getByText('Citation').tagName).toBe('CITE')
  })
})
