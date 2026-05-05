import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DbTableDefinitionEditor } from './DbTableDefinitionEditor'
import { createDbDiagramDocument } from './model'
import { sampleDbSchemaDiagramDocument } from './sample-data'

vi.mock('@/elements/accordion/Accordion', async () => {
  const React = await import('react')
  function omitProps<T extends Record<string, unknown>>(props: T, names: readonly string[]) {
    const nextProps = { ...props }
    for (const name of names) {
      delete nextProps[name]
    }
    return nextProps
  }

  return {
    Accordion: {
      Root: (
        props: React.HTMLAttributes<HTMLDivElement> & {
          border?: boolean
          contentPadding?: boolean
          defaultValue?: unknown
          multiple?: boolean
          size?: string
        },
      ) => {
        const { children, ...rootProps } = props
        return React.createElement(
          'div',
          omitProps(rootProps, ['border', 'contentPadding', 'defaultValue', 'multiple', 'size']),
          children,
        )
      },
      Item: (props: React.HTMLAttributes<HTMLDivElement> & { value?: string }) => {
        const { children, ...itemProps } = props
        return React.createElement('div', omitProps(itemProps, ['value']), children)
      },
      Trigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
        React.createElement('button', { type: 'button', ...props }, children),
      Content: (props: React.HTMLAttributes<HTMLDivElement> & { fill?: boolean }) => {
        const { children, ...contentProps } = props
        return React.createElement('div', omitProps(contentProps, ['fill']), children)
      },
    },
  }
})

vi.mock('@/elements/button/IconButton', async () => {
  const React = await import('react')
  return {
    IconButton: ({
      children,
      icon,
      title,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string; title?: string }) =>
      React.createElement('button', { type: 'button', title, ...props }, children ?? title ?? icon),
  }
})

vi.mock('@/table/tree-table', async () => {
  const React = await import('react')
  return {
    TreeTable: {
      Root: ({ children }: { children?: ReactNode }) => React.createElement('div', null, children),
      Toolbar: ({ actions }: { actions?: ReactNode }) => React.createElement('div', null, actions),
      Content: () => React.createElement('div', null),
    },
  }
})

describe('DbTableDefinitionEditor', () => {
  it('renders domain, type, and table definition sections', () => {
    render(
      <div style={{ height: 520, width: 900 }}>
        <DbTableDefinitionEditor document={createDbDiagramDocument(sampleDbSchemaDiagramDocument)} />
      </div>,
    )

    expect(screen.getByText('Schema definitions')).toBeInTheDocument()
    expect(screen.getByText('Domains')).toBeInTheDocument()
    expect(screen.getByText('Types')).toBeInTheDocument()
    expect(screen.getByText('Tables')).toBeInTheDocument()
    expect(screen.getByText('1 domain, 1 type, 3 tables')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add domain' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add type' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add table' })).not.toBeInTheDocument()
  })

  it('adds domains, types, and tables from the section header buttons', () => {
    function EditableEditor() {
      const [document, setDocument] = React.useState(() => createDbDiagramDocument(sampleDbSchemaDiagramDocument))
      return <DbTableDefinitionEditor document={document} onDocumentChange={setDocument} />
    }

    render(
      <div style={{ height: 520, width: 900 }}>
        <EditableEditor />
      </div>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Add domain' }))
    expect(screen.getByText('2 domains, 1 type, 3 tables')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add type' }))
    expect(screen.getByText('2 domains, 2 types, 3 tables')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add table' }))
    expect(screen.getByText('2 domains, 2 types, 4 tables')).toBeInTheDocument()
  }, 10_000)
})
