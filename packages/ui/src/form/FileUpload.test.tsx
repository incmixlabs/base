import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
    expect(dropzone?.className).toContain('border-[color:var(--color-error-border)]')
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

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith([
        expect.objectContaining({
          file,
          status: 'pending',
        }),
      ]),
    )
  })

  it('confirms before removing a file when configured', async () => {
    const user = userEvent.setup()
    const file = new File(['image'], 'hero.png', { type: 'image/png' })
    const uploadedFile: UploadedFile = {
      id: 'upload-1',
      file,
      progress: 100,
      status: 'success',
    }
    const onChange = vi.fn()
    const onFileRemove = vi.fn()

    render(<FileUpload value={[uploadedFile]} confirmBeforeRemove onChange={onChange} onFileRemove={onFileRemove} />)

    await user.click(screen.getByRole('button', { name: 'Remove hero.png' }))

    expect(await screen.findByText('Remove file?')).toBeInTheDocument()
    expect(screen.getByText('Remove "hero.png"? This action cannot be undone.')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Keep file' }))

    await waitFor(() => expect(screen.queryByText('Remove file?')).not.toBeInTheDocument())
    expect(onChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Remove hero.png' }))
    expect(await screen.findByText('Remove file?')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByText('Remove file?')).not.toBeInTheDocument())
    expect(onChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Remove hero.png' }))
    await user.click(await screen.findByRole('button', { name: 'Remove' }))

    expect(onChange).toHaveBeenCalledWith([])
    expect(onFileRemove).toHaveBeenCalledWith(uploadedFile)
  })

  it('keeps the uploaded file in controlled onUpload success changes', async () => {
    const user = userEvent.setup()
    const file = new File(['image'], 'hero.png', { type: 'image/png' })
    const onChange = vi.fn()
    const onUpload = vi.fn(async (_file: File, onProgress: (progress: number) => void) => {
      onProgress(50)
    })

    render(<FileUpload value={[]} onChange={onChange} onUpload={onUpload} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement | null
    await user.upload(input!, file)

    expect(onUpload).toHaveBeenCalledWith(file, expect.any(Function))

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        expect.objectContaining({
          file,
          progress: 100,
          status: 'success',
        }),
      ]),
    )
  })

  it('keeps the uploaded file in controlled onUpload error changes', async () => {
    const user = userEvent.setup()
    const file = new File(['image'], 'hero.png', { type: 'image/png' })
    const onChange = vi.fn()
    const onUpload = vi.fn(async () => {
      throw new Error('Upload failed on server')
    })

    render(<FileUpload value={[]} onChange={onChange} onUpload={onUpload} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement | null
    await user.upload(input!, file)

    expect(onUpload).toHaveBeenCalledWith(file, expect.any(Function))

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        expect.objectContaining({
          error: 'Upload failed on server',
          file,
          status: 'error',
        }),
      ]),
    )
  })
})
