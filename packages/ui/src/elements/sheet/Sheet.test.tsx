import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { expectClassTokens } from '@/test/class-name-utils'
import { Sheet } from './Sheet'

afterEach(() => {
  cleanup()
})

describe('Sheet', () => {
  it('renders the semantic surface and resize handle utility classes', async () => {
    const { unmount } = render(
      <Sheet.Root defaultOpen>
        <Sheet.Content side="right" resize>
          <Sheet.Header>
            <Sheet.Title>Sheet title</Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>
          <Sheet.Body>
            <Sheet.Description>Sheet description</Sheet.Description>
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>,
    )

    const dialog = screen.getByRole('dialog')
    const description = screen.getByText('Sheet description')
    const resizeHandle = screen.getByRole('separator', { name: 'Resize sheet' })
    const backdrop = Array.from(document.body.querySelectorAll('div')).find(element =>
      element.className.includes('bg-black/25'),
    )

    expect(backdrop).not.toBeUndefined()
    expectClassTokens(backdrop?.className, ['fixed', 'inset-0', 'z-[100]', 'bg-black/25'])
    expectClassTokens(dialog.className, [
      'fixed',
      'z-[110]',
      'bg-neutral-surface',
      'shadow-[var(--shadow-2xl,0_25px_50px_-12px_rgba(0,0,0,0.25))]',
      'border-solid',
      'right-0',
      'top-0',
      'h-full',
      'w-full',
      'max-w-[420px]',
      'border-l',
      'border-neutral',
    ])
    expectClassTokens(resizeHandle.className, [
      'absolute',
      'inset-y-0',
      'z-30',
      'w-3',
      'cursor-col-resize',
      'touch-none',
      'after:bg-[var(--color-neutral-border)]',
      'hover:after:bg-primary',
      'focus-visible:after:bg-primary',
      'data-[resizing]:after:bg-primary',
      'left-0',
    ])
    expect(description.className).toContain('opacity-70')
    expect(dialog.className).not.toContain('sheet_')

    unmount()
    await Promise.resolve()
  })
})
