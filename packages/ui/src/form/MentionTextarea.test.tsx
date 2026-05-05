import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { MentionTextarea } from './MentionTextarea'
import { collectMentionReferences } from './mention-markdown'

const TEST_TIMEOUT_MS = 20_000

describe('MentionTextarea', () => {
  it(
    'serializes mentions with stable references and previews visible labels',
    async () => {
      const user = userEvent.setup()

      function TestHarness() {
        const [value, setValue] = React.useState('')

        return (
          <>
            <MentionTextarea
              mentions={[
                {
                  id: 'grace',
                  label: 'Grace Hopper',
                  value: 'user:grace',
                },
              ]}
              value={value}
              onValueChange={setValue}
            />
            <output data-testid="stored-value">{value}</output>
          </>
        )
      }

      render(<TestHarness />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, '@')
      await user.click(await screen.findByRole('option', { name: /Grace Hopper/i }))

      expect(textarea).toHaveValue('@Grace Hopper ')
      expect(screen.getByTestId('stored-value').textContent).toBe('@[Grace Hopper](user:grace) ')
      await new Promise(resolve => window.setTimeout(resolve, 0))

      await user.click(screen.getByRole('tab', { name: 'Preview' }))
      const previewPanel = screen.getByRole('tabpanel')
      expect(screen.getByText('@Grace Hopper')).toBeInTheDocument()
      expect(previewPanel).not.toHaveTextContent('@[Grace Hopper](user:grace)')
    },
    TEST_TIMEOUT_MS,
  )

  it('shows visible mention labels while preserving stable stored tokens during editing', () => {
    cleanup()

    const view = render(
      <MentionTextarea
        mentions={[
          {
            id: 'ada',
            label: 'Ada Lovelace',
            value: 'user:ada',
          },
          {
            id: 'grace',
            label: 'Grace Hopper',
            value: 'user:grace',
          },
        ]}
        value={'@[Ada Lovelace](user:ada), @[Grace Hopper](user:grace)'}
        onValueChange={() => {}}
      />,
    )

    expect(view.getByRole('textbox')).toHaveValue('@Ada Lovelace, @Grace Hopper')
  })

  it('removes contiguous duplicate structured mentions while editing', async () => {
    const user = userEvent.setup()
    cleanup()

    function TestHarness() {
      const [value, setValue] = React.useState(
        '@[Ada Lovelace](user:ada), @[Grace Hopper](user:grace), @[Ada Lovelace](user:ada) ',
      )

      return (
        <>
          <MentionTextarea
            mentions={[
              {
                id: 'ada',
                label: 'Ada Lovelace',
                value: 'user:ada',
              },
              {
                id: 'grace',
                label: 'Grace Hopper',
                value: 'user:grace',
              },
            ]}
            value={value}
            onValueChange={setValue}
          />
          <output data-testid="stored-value">{value}</output>
        </>
      )
    }

    render(<TestHarness />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('@Ada Lovelace, @Grace Hopper ')
    expect(screen.getByTestId('stored-value').textContent).toBe(
      '@[Ada Lovelace](user:ada), @[Grace Hopper](user:grace) ',
    )

    await user.type(textarea, '@')
    await user.click(await screen.findByRole('option', { name: /Ada Lovelace/i }))

    expect(textarea).toHaveValue('@Ada Lovelace, @Grace Hopper ')
    expect(screen.getByTestId('stored-value').textContent).toBe(
      '@[Ada Lovelace](user:ada), @[Grace Hopper](user:grace) ',
    )
  })

  it('normalizes contiguous mention runs to comma-separated display and storage', () => {
    cleanup()

    const view = render(
      <MentionTextarea
        mentions={[
          { id: 'grace', label: 'Grace Hopper', value: 'user:grace' },
          { id: 'lin', label: 'Linus Torvalds', value: 'user:lin' },
          { id: 'ada', label: 'Ada Lovelace', value: 'user:ada' },
        ]}
        value={'@[Grace Hopper](user:grace) @[Linus Torvalds](user:lin) @[Ada Lovelace](user:ada)'}
        onValueChange={() => {}}
      />,
    )

    expect(view.getByRole('textbox')).toHaveValue('@Grace Hopper, @Linus Torvalds, @Ada Lovelace')
  })

  it('collects user and tag ids from stable mention tokens', () => {
    expect(
      collectMentionReferences(
        '@[Ada Lovelace](user:ada), @[Grace Hopper](user:grace) #[Documentation](tag:docs) #[Bug](tag:bug) #[Documentation](tag:docs)',
      ),
    ).toEqual({
      userIds: ['ada', 'grace'],
      tagIds: ['docs', 'bug'],
    })
  })

  it('round-trips escaped mention labels and references through preview parsing', async () => {
    const user = userEvent.setup()
    cleanup()

    const view = render(
      <MentionTextarea
        mentions={[
          {
            id: 'grace',
            label: 'Grace Hopper',
            value: 'user:grace',
          },
        ]}
        value={'@[Grace\\] Hopper](user:grace\\)) '}
        onValueChange={() => {}}
      />,
    )

    await user.click(view.getByRole('tab', { name: 'Preview' }))
    const mention = view.getByText('@Grace] Hopper')
    expect(mention).toBeInTheDocument()
    expect(mention).not.toHaveAttribute('title')
    expect(view.queryByText('@[Grace\\] Hopper](user:grace\\))')).not.toBeInTheDocument()
  })

  it('renders structured mentions inside formatted markdown spans', async () => {
    const user = userEvent.setup()
    cleanup()

    const view = render(
      <MentionTextarea
        mentions={[
          {
            id: 'grace',
            label: 'Grace Hopper',
            value: 'user:grace',
          },
        ]}
        value={'**@[Grace Hopper](user:grace)**'}
        onValueChange={() => {}}
      />,
    )

    await user.click(view.getByRole('tab', { name: 'Preview' }))
    const mention = view.getByText('@Grace Hopper')
    expect(mention).toBeInTheDocument()
    expect(mention).not.toHaveAttribute('title')
    expect(view.queryByText('**@[Grace Hopper](user:grace)**')).not.toBeInTheDocument()
  })

  it('renders consecutive structured mentions as a comma-separated list in preview', async () => {
    const user = userEvent.setup()
    cleanup()

    const view = render(
      <MentionTextarea
        mentions={[
          {
            id: 'ada',
            label: 'Ada Lovelace',
            value: 'user:ada',
          },
          {
            id: 'grace',
            label: 'Grace Hopper',
            value: 'user:grace',
          },
        ]}
        value={'@[Ada Lovelace](user:ada) @[Grace Hopper](user:grace)'}
        onValueChange={() => {}}
      />,
    )

    await user.click(view.getByRole('tab', { name: 'Preview' }))

    expect(view.getByText('@Ada Lovelace')).toBeInTheDocument()
    expect(view.getByText('@Grace Hopper')).toBeInTheDocument()
    expect(view.container.querySelector('p')?.textContent).toContain(', ')
    expect(view.queryByText('@[Ada Lovelace](user:ada) @[Grace Hopper](user:grace)')).not.toBeInTheDocument()
  })

  it(
    'resolves user and tag references into avatar-aware preview content without showing ids',
    async () => {
      const user = userEvent.setup()
      cleanup()

      render(
        <MentionTextarea
          triggers={[
            {
              trigger: '@',
              items: [
                {
                  id: 'ada',
                  label: 'Ada Lovelace',
                  value: 'user:ada',
                  description: 'ada@example.com',
                  hoverCard: true,
                },
                {
                  id: 'grace',
                  label: 'Grace Hopper',
                  value: 'user:grace',
                  description: 'grace@example.com',
                  hoverCard: true,
                },
              ],
            },
            {
              trigger: '#',
              items: [{ id: 'docs', label: 'Documentation', value: 'tag:docs' }],
            },
          ]}
          value={'@[Ada Lovelace](user:ada) @[Grace Hopper](user:grace) #[Documentation](tag:docs)'}
          onValueChange={() => {}}
        />,
      )

      await user.click(screen.getByRole('tab', { name: 'Preview' }))

      const preview = screen.getByRole('tabpanel')
      expect(screen.getByText('@Ada Lovelace')).toBeInTheDocument()
      expect(screen.getByText('@Grace Hopper')).toBeInTheDocument()
      expect(screen.getByText('#Documentation')).toBeInTheDocument()
      expect(preview.textContent).toContain(', ')
      expect(preview).not.toHaveTextContent('user:ada')
      expect(preview).not.toHaveTextContent('user:grace')
      expect(preview).not.toHaveTextContent('tag:docs')

      await user.hover(screen.getByText('AL'))
      expect(await screen.findByText('ada@example.com')).toBeInTheDocument()
    },
    TEST_TIMEOUT_MS,
  )

  it('does not style fallback trigger runs without a whitespace boundary', async () => {
    const user = userEvent.setup()
    cleanup()

    const view = render(
      <MentionTextarea
        mentions={[
          {
            id: 'grace',
            label: 'Grace Hopper',
            value: 'user:grace',
          },
        ]}
        triggers={[
          {
            trigger: ':',
            items: [{ id: 'smile', label: 'smile', value: 'emoji:smile' }],
          },
        ]}
        value={'Meet at 10:30 or email ada@example.com'}
        onValueChange={() => {}}
      />,
    )

    await user.click(view.getByRole('tab', { name: 'Preview' }))

    expect(view.container.querySelector('.text-primary.font-medium')).toBeNull()
    expect(view.getByText('Meet at 10:30 or email ada@example.com')).toBeInTheDocument()
  })

  it('renders uploaded images in preview for blob and data urls', async () => {
    const user = userEvent.setup()
    cleanup()

    render(
      <MentionTextarea
        mentions={[
          {
            id: 'grace',
            label: 'Grace Hopper',
            value: 'user:grace',
          },
        ]}
        value={
          '![blob image](blob:http://localhost:6006/2f2f2f2f-1111-2222-3333-444444444444)\n\n![data image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB)'
        }
        onValueChange={() => {}}
      />,
    )

    await user.click(screen.getByRole('tab', { name: 'Preview' }))
    const preview = screen.getByRole('tabpanel')

    const blobImage = within(preview).getByAltText('blob image')
    const dataImage = within(preview).getByAltText('data image')

    expect(blobImage).toHaveAttribute('src', 'blob:http://localhost:6006/2f2f2f2f-1111-2222-3333-444444444444')
    expect(dataImage).toHaveAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB')
    expect(blobImage.closest('a')).toHaveAttribute(
      'href',
      'blob:http://localhost:6006/2f2f2f2f-1111-2222-3333-444444444444',
    )
    expect(dataImage.closest('a')).toHaveAttribute('href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB')
  })

  it('renders github-style html image tags with width and height in preview', async () => {
    const user = userEvent.setup()
    cleanup()

    render(
      <MentionTextarea
        mentions={[
          {
            id: 'grace',
            label: 'Grace Hopper',
            value: 'user:grace',
          },
        ]}
        value={
          '<img width="1486" height="887" alt="Image" src="https://github.com/user-attachments/assets/71167ed0-f5d8-40a6-a3d3-8575a6ebba99" />'
        }
        onValueChange={() => {}}
      />,
    )

    await user.click(screen.getByRole('tab', { name: 'Preview' }))
    const image = within(screen.getByRole('tabpanel')).getByAltText('Image')

    expect(image).toHaveAttribute(
      'src',
      'https://github.com/user-attachments/assets/71167ed0-f5d8-40a6-a3d3-8575a6ebba99',
    )
    expect(image).toHaveAttribute('width', '1486')
    expect(image).toHaveAttribute('height', '887')
    expect(image.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/user-attachments/assets/71167ed0-f5d8-40a6-a3d3-8575a6ebba99',
    )
  })

  it('serializes uploaded images using responsive width with editor max-width', async () => {
    cleanup()

    function TestHarness() {
      const [value, setValue] = React.useState('')

      return (
        <>
          <MentionTextarea
            mentions={[
              {
                id: 'grace',
                label: 'Grace Hopper',
                value: 'user:grace',
              },
            ]}
            value={value}
            onValueChange={setValue}
            onFileUpload={async () => 'https://example.com/upload.png'}
          />
          <output data-testid="stored-value">{value}</output>
        </>
      )
    }

    render(<TestHarness />)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    Object.defineProperty(textarea, 'clientWidth', { configurable: true, value: 640 })

    const file = new File(['img'], 'upload.png', { type: 'image/png' })
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL

    URL.createObjectURL = () => 'blob:http://localhost:6008/upload'
    URL.revokeObjectURL = () => {}

    const originalImage = globalThis.Image
    class MockImage {
      naturalWidth = 1200
      naturalHeight = 800
      onload: null | (() => void) = null
      onerror: null | (() => void) = null

      set src(_value: string) {
        this.onload?.()
      }
    }

    // @ts-expect-error test mock
    globalThis.Image = MockImage

    try {
      fireEvent.paste(textarea, {
        clipboardData: {
          files: [file],
        },
      })
    } finally {
      URL.createObjectURL = originalCreateObjectURL
      URL.revokeObjectURL = originalRevokeObjectURL
      globalThis.Image = originalImage
    }

    await waitFor(() => {
      expect(screen.getByTestId('stored-value').textContent).toBe(
        '<img alt="upload.png" src="https://example.com/upload.png" style="width: 100%; max-width: 640px; height: auto;" />',
      )
    })
  })

  it('does not upscale uploaded images beyond their natural width', async () => {
    cleanup()

    function TestHarness() {
      const [value, setValue] = React.useState('')

      return (
        <>
          <MentionTextarea
            mentions={[
              {
                id: 'grace',
                label: 'Grace Hopper',
                value: 'user:grace',
              },
            ]}
            value={value}
            onValueChange={setValue}
            onFileUpload={async () => 'https://example.com/tiny.png'}
          />
          <output data-testid="stored-value">{value}</output>
        </>
      )
    }

    render(<TestHarness />)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    Object.defineProperty(textarea, 'clientWidth', { configurable: true, value: 1000 })

    const file = new File(['img'], 'tiny.png', { type: 'image/png' })
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL

    URL.createObjectURL = () => 'blob:http://localhost:6008/tiny'
    URL.revokeObjectURL = () => {}

    const originalImage = globalThis.Image
    class MockImage {
      naturalWidth = 50
      naturalHeight = 20
      onload: null | (() => void) = null
      onerror: null | (() => void) = null

      set src(_value: string) {
        this.onload?.()
      }
    }

    // @ts-expect-error test mock
    globalThis.Image = MockImage

    try {
      fireEvent.paste(textarea, {
        clipboardData: {
          files: [file],
        },
      })
    } finally {
      URL.createObjectURL = originalCreateObjectURL
      URL.revokeObjectURL = originalRevokeObjectURL
      globalThis.Image = originalImage
    }

    await waitFor(() => {
      expect(screen.getByTestId('stored-value').textContent).toBe(
        '<img alt="tiny.png" src="https://example.com/tiny.png" style="width: 100%; max-width: 50px; height: auto;" />',
      )
    })
  })
})
