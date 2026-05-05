import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FieldGroupProvider } from './FieldGroupContext'
import { FileUpload } from './FileUpload'

afterEach(() => {
  cleanup()
})

describe('FileUpload', () => {
  it('applies error styling and invalid semantics', () => {
    const { container } = render(<FileUpload error />)

    const dropzone = container.querySelector(
      '[data-slot="file-upload-dropzone"][data-invalid="true"]',
    ) as HTMLElement | null
    expect(dropzone).toBeInTheDocument()
    expect(dropzone?.className).toContain('border-destructive')
    expect(dropzone).toHaveAttribute('aria-invalid', 'true')
  })

  it('uses the provided radius token on the dropzone surface', () => {
    const { container } = render(<FileUpload radius="lg" />)

    const dropzone = container.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement | null
    expect(dropzone?.style.getPropertyValue('--element-border-radius')).toBeTruthy()
  })

  it('inherits size from FieldGroup context', () => {
    const { container } = render(
      <FieldGroupProvider value={{ size: 'xs' }}>
        <FileUpload />
      </FieldGroupProvider>,
    )

    expect(screen.getByText(/drag & drop/i)).toHaveClass('text-[length:var(--file-upload-title-font-size)]')
    const dropzone = container.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement | null
    expect(dropzone?.style.getPropertyValue('--file-upload-title-font-size')).toBeTruthy()
  })

  it('opens the file picker when clicking the dropzone trigger', () => {
    const inputClick = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

    render(<FileUpload />)

    fireEvent.click(screen.getByRole('button', { name: /drag & drop files here, or click to select/i }))

    expect(inputClick).toHaveBeenCalled()
    inputClick.mockRestore()
  })
})
