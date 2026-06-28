import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('keeps separator semantics and sidebar attributes non-overridable', () => {
    render(
      <Sidebar.Separator
        decorative={false}
        role="separator"
        aria-hidden={false}
        aria-orientation="vertical"
        size="lg"
        data-slot="custom-separator"
        data-sidebar="custom"
        data-testid="separator"
      />,
    )

    const separator = screen.getByTestId('separator')

    expect(separator).toHaveAttribute('role', 'presentation')
    expect(separator).toHaveAttribute('aria-hidden', 'true')
    expect(separator).not.toHaveAttribute('aria-orientation')
    expect(separator).toHaveAttribute('data-slot', 'sidebar-separator')
    expect(separator).toHaveAttribute('data-sidebar', 'separator')
    expect(separator.className).toContain('before:h-[0.0625rem]')
    expect(separator.className).not.toContain('before:h-[0.5rem]')
  })
})
