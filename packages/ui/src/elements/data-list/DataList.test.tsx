import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getTextSizeClasses } from '@/typography/get-text-size-classes'
import {
  dataListItemBase,
  dataListItemByAlign,
  dataListItemByOrientation,
  dataListLabelBase,
  dataListLabelByOrientation,
  dataListRootBase,
  dataListRootByOrientation,
  dataListRootBySize,
  dataListRootByTrim,
  dataListRootSizeResponsive,
  dataListValueBase,
} from './DataList.css'
import { DataList } from './DataList'

describe('DataList', () => {
  it('applies VE size and typography classes on the root', () => {
    render(
      <DataList.Root size="md">
        <DataList.Item>
          <DataList.Label>ID</DataList.Label>
          <DataList.Value>42</DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    )

    const root = screen.getByText('ID').closest('dl')
    expect(root).toHaveClass(dataListRootBase, dataListRootByOrientation.horizontal, dataListRootByTrim.normal)
    expect(root).toHaveClass(dataListRootBySize.md)
    expect(root).toHaveClass(getTextSizeClasses('md'))
  })

  it('supports responsive size classes and VE item composition', () => {
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

    expect(root).toHaveClass(dataListRootBase, dataListRootByOrientation.vertical, dataListRootByTrim.both)
    expect(root).toHaveClass(dataListRootBySize.sm, dataListRootSizeResponsive.md.lg)
    expect(root).toHaveClass(getTextSizeClasses({ initial: 'sm', md: 'lg' }, 'sm'))
    expect(item).toHaveClass(dataListItemBase, dataListItemByOrientation.vertical, dataListItemByAlign.center)
    expect(label).toHaveClass(dataListLabelBase, dataListLabelByOrientation.vertical)
    expect(value).toHaveClass(dataListValueBase)
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
