import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getTextSizeClasses } from '@/typography/get-text-size-classes'
import { DataList } from './DataList'

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('DataList', () => {
  it('applies size and typography classes on the root', () => {
    render(
      <DataList.Root size="md">
        <DataList.Item>
          <DataList.Label>ID</DataList.Label>
          <DataList.Value>42</DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    )

    const root = screen.getByText('ID').closest('dl')
    const item = screen.getByText('ID').closest('div')
    const label = screen.getByText('ID').closest('dt')

    expectClassTokens(root?.parentElement?.className, ['[container-type:inline-size]'])
    expectClassTokens(root?.className, [
      'w-full',
      '[overflow-wrap:anywhere]',
      '[font-family:var(--default-font-family)]',
      'font-normal',
      '[font-style:var(--default-font-style)]',
      'text-start',
      'grid',
      'grid-cols-[auto_1fr]',
      '[--af-datalist-leading-trim-start:initial]',
      '[--af-datalist-leading-trim-end:initial]',
      'gap-4',
      '[--line-height:calc(1.5rem*var(--theme-typography-text-leading,1))]',
    ])
    expect(root).toHaveClass(getTextSizeClasses('md'))
    expectClassTokens(item?.className, ['grid', '[grid-template-columns:inherit]', 'col-span-2', 'gap-4'])
    expectClassTokens(label?.className, ['min-w-[120px]'])
  })

  it('supports responsive size classes and item composition', () => {
    render(
      <DataList.Root size={{ initial: 'sm', md: 'lg' }} orientation="vertical" trim="both">
        <DataList.Item align="center">
          <DataList.Label>Status</DataList.Label>
          <DataList.Value>Healthy</DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    )

    const root = screen.getByText('Status').closest('dl')
    const item = screen.getByText('Status').closest('div')
    const label = screen.getByText('Status').closest('dt')
    const value = screen.getByText('Healthy').closest('dd')

    expectClassTokens(root?.className, [
      'w-full',
      'flex',
      'flex-col',
      'gap-3',
      'cq-md:gap-5',
      '[--line-height:calc(1.25rem*var(--theme-typography-text-leading,1))]',
      'cq-md:[--line-height:calc(1.625rem*var(--theme-typography-text-leading,1))]',
      '[--af-datalist-leading-trim-start:calc(var(--default-leading-trim-start)-var(--line-height)/2)]',
      '[--af-datalist-leading-trim-end:calc(var(--default-leading-trim-end)-var(--line-height)/2)]',
    ])
    expect(root).toHaveClass(getTextSizeClasses({ initial: 'sm', md: 'lg' }, 'sm'))
    expectClassTokens(item?.className, [
      'flex',
      'flex-col',
      'gap-1',
      'items-center',
      '[--af-datalist-value-trim-start:-0.25em]',
      '[--af-datalist-value-trim-end:-0.25em]',
      '[--af-datalist-first-value-trim-start:-0.25em]',
      '[--af-datalist-last-value-trim-end:-0.25em]',
    ])
    expectClassTokens(label?.className, [
      'flex',
      'font-medium',
      '[color:color-mix(in_oklch,var(--color-neutral-text)_68%,transparent)]',
      "before:content-['\\200D']",
      'min-w-0',
    ])
    expectClassTokens(value?.className, [
      'flex',
      'min-w-0',
      'mx-0',
      'mt-[var(--af-datalist-value-trim-start)]',
      'mb-[var(--af-datalist-value-trim-end)]',
      "before:content-['\\200D']",
    ])
  })

  it('supports between justification for horizontal rows', () => {
    render(
      <DataList.Root>
        <DataList.Item align="between">
          <DataList.Label>Soft</DataList.Label>
          <DataList.Value>4</DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    )

    const item = screen.getByText('Soft').closest('div')
    expect(item).toHaveStyle({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })
  })

  it('applies minWidth on labels and keeps width as a compatibility alias', () => {
    const { container, rerender } = render(
      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth="88px">Status</DataList.Label>
          <DataList.Value>Authorized</DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    )

    expect(container.querySelector('dt')).toHaveStyle({ minWidth: '88px' })

    rerender(
      <DataList.Root>
        <DataList.Item>
          <DataList.Label width="96px">ID</DataList.Label>
          <DataList.Value>u_2J89JSA4GJ</DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    )

    expect(container.querySelector('dt')).toHaveStyle({ minWidth: '96px' })
  })
})
