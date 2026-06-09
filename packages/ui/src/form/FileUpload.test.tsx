import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FieldGroupProvider } from './FieldGroupContext'
import { FileUpload, type UploadedFile } from './FileUpload'

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

  it('hides the dropzone when the controlled file list is full', () => {
    const file = new File(['image'], 'hero.png', { type: 'image/png' })
    const uploadedFile: UploadedFile = {
      id: 'upload-1',
      file,
      progress: 100,
      status: 'success',
    }
    const { container } = render(
      <FileUpload value={[uploadedFile]} maxFiles={1} multiple={false} hideDropzoneWhenFull />,
    )

    const dropzone = container.querySelector('[data-slot="file-upload-dropzone"]') as HTMLElement | null

    expect(screen.getByText('hero.png')).toBeInTheDocument()
    expect(dropzone).toHaveClass('hidden')
  })

  it('asks for confirmation before accepting uploaded files when enabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FileUpload confirmBeforeUpload onChange={onChange} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement | null
    const file = new File(['image'], 'hero.png', { type: 'image/png' })
    await user.upload(input!, file)

    expect(screen.getByText('Upload this file?')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Upload' }))

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({
        file,
        status: 'pending',
      }),
    ])
  })

  it('asks for confirmation before removing files when enabled', async () => {
    const user = userEvent.setup()
    const file = new File(['image'], 'hero.png', { type: 'image/png' })
    const uploadedFile: UploadedFile = {
      id: 'upload-1',
      file,
      progress: 100,
      status: 'success',
    }
    const onChange = vi.fn()

    render(<FileUpload value={[uploadedFile]} confirmBeforeRemove onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Remove hero.png' }))

    expect(screen.getByText('Remove this file?')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Remove' }))

    expect(onChange).toHaveBeenCalledWith([])
  })
})
