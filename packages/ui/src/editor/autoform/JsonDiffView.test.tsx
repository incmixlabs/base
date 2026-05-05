import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { JsonDiffView } from './JsonDiffView'
import type { JsonValue } from './json-value.types'

afterEach(() => {
  cleanup()
})

describe('JsonDiffView', () => {
  it('renders added, removed, and modified badges for schema-shaped JSON', () => {
    const before: JsonValue = {
      title: 'Profile',
      properties: {
        email: {
          type: 'string',
        },
        legacyCode: {
          type: 'string',
        },
      },
    }

    const after: JsonValue = {
      title: 'Customer profile',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        phone: {
          type: 'string',
        },
      },
    }

    render(<JsonDiffView before={before} after={after} />)

    const titleRow = screen
      .getAllByRole('treeitem')
      .find(node => node.getAttribute('data-tree-item-id') === 'root/title')
    expect(titleRow).toBeDefined()
    expect(within(titleRow as HTMLElement).getByText('Modified')).toBeInTheDocument()

    const addedRow = screen
      .getAllByRole('treeitem')
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/phone')
    expect(addedRow).toBeDefined()
    expect(within(addedRow as HTMLElement).getByText('Added')).toBeInTheDocument()

    const removedRow = screen
      .getAllByRole('treeitem')
      .find(node => node.getAttribute('data-tree-item-id') === 'root/properties/legacyCode')
    expect(removedRow).toBeDefined()
    expect(within(removedRow as HTMLElement).getByText('Removed')).toBeInTheDocument()
  })

  it('can hide unchanged leaf rows', () => {
    const before: JsonValue = {
      title: 'Profile',
      type: 'object',
    }

    const after: JsonValue = {
      title: 'Customer profile',
      type: 'object',
    }

    render(<JsonDiffView before={before} after={after} hideUnchanged />)

    expect(screen.getByRole('treeitem', { name: /title/i })).toBeInTheDocument()
    expect(screen.queryByRole('treeitem', { name: /^type string$/i })).not.toBeInTheDocument()
  })
})
