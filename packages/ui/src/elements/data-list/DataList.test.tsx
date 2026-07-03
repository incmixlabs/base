import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getPropDefValues } from '@/theme/props/prop-def'
import { getTextSizeClasses } from '@/typography/get-text-size-classes'
import { DataList } from './DataList'
import { dataListPropDefs } from './data-list.props'

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

function expectNoTrimSelectorClasses(className: string | undefined) {
  expect(className).not.toContain("[&>[data-slot='data-list-item']:first-child]:mt-[calc(")
  expect(className).not.toContain("[&>[data-slot='data-list-item']:last-child]:mb-[calc(")
}

describe('DataList', () => {
  it('keeps scalar metadata for orientation and item alignment', () => {
    expect(dataListPropDefs.Root.size).toHaveProperty('responsive', true)
    expect(dataListPropDefs.Root.orientation).not.toHaveProperty('responsive')
    expect(dataListPropDefs.Item.align).not.toHaveProperty('responsive')
  })

  it('applies size and typography classes on the root', () => {
    const { container } = render(
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
      'gap-4',
    ])
    expectNoTrimSelectorClasses(root?.className)
    expect(root).toHaveClass(getTextSizeClasses('md'))
    expectClassTokens(item?.className, [
      'grid',
      '[grid-template-columns:inherit]',
      'col-span-2',
      'gap-4',
      'items-baseline',
      "[&>[data-slot='data-list-value']]:mt-[-0.25em]",
      "[&>[data-slot='data-list-value']]:mb-[-0.25em]",
      "[&:first-child>[data-slot='data-list-value']]:mt-0",
      "[&:last-child>[data-slot='data-list-value']]:mb-0",
    ])
    expectClassTokens(label?.className, ['min-w-[120px]'])
    expect(container.innerHTML).not.toContain('--af-datalist')
  })

  it('supports responsive size classes and item composition', () => {
    const { container } = render(
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
      "[&>[data-slot='data-list-item']:first-child]:mt-[calc(var(--default-leading-trim-start)-1.25rem*var(--theme-typography-text-leading,1)/2)]",
      "[&>[data-slot='data-list-item']:last-child]:mb-[calc(var(--default-leading-trim-end)-1.25rem*var(--theme-typography-text-leading,1)/2)]",
      "cq-md:[&>[data-slot='data-list-item']:first-child]:mt-[calc(var(--default-leading-trim-start)-1.625rem*var(--theme-typography-text-leading,1)/2)]",
      "cq-md:[&>[data-slot='data-list-item']:last-child]:mb-[calc(var(--default-leading-trim-end)-1.625rem*var(--theme-typography-text-leading,1)/2)]",
    ])
    expect(root).toHaveClass(getTextSizeClasses({ initial: 'sm', md: 'lg' }, 'sm'))
    expectClassTokens(item?.className, [
      'flex',
      'flex-col',
      'gap-1',
      'items-center',
      "[&>[data-slot='data-list-value']]:mt-[-0.25em]",
      "[&>[data-slot='data-list-value']]:mb-[-0.25em]",
    ])
    expectClassTokens(label?.className, [
      'flex',
      'font-medium',
      '[color:color-mix(in_oklch,var(--color-neutral-text)_68%,transparent)]',
      "before:content-['\\200D']",
      'min-w-0',
    ])
    expectClassTokens(value?.className, ['flex', 'min-w-0', 'mx-0', "before:content-['\\200D']"])
    expect(container.innerHTML).not.toContain('--af-datalist')
  })

  it('exposes and applies the xs size contract', () => {
    expect(getPropDefValues(dataListPropDefs.Root.size)).toContain('xs')

    render(
      <DataList.Root size="xs">
        <DataList.Item>
          <DataList.Label>XS</DataList.Label>
          <DataList.Value>Compact</DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    )

    const root = screen.getByText('XS').closest('dl')
    const item = screen.getByText('XS').closest('div')
    const label = screen.getByText('XS').closest('dt')

    expectClassTokens(root?.className, ['gap-2'])
    expect(root).toHaveClass(getTextSizeClasses('xs'))
    expectClassTokens(item?.className, ['gap-4'])
    expectClassTokens(label?.className, ['min-w-[80px]'])
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
    expectClassTokens(item?.className, [
      'items-center',
      "[&>[data-slot='data-list-value']]:mt-[-0.25em]",
      "[&>[data-slot='data-list-value']]:mb-[-0.25em]",
    ])
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
