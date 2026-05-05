import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { AppShell } from '@/layouts/app-shell/AppShell'
import { Diagrammer, type DiagrammerProps } from '../Diagrammer'
import { DbTableDefinitionEditor } from './DbTableDefinitionEditor'
import { createDbDiagramDocument, toDbDiagrammerDocument, updateDbDiagramLayoutFromDiagrammer } from './model'
import { sampleDbSchemaDiagramDocument } from './sample-data'

type DbDiagrammerStoryProps = Omit<DiagrammerProps, 'defaultDocument' | 'document'>

const tableDefinitionEditorDocument = {
  ...sampleDbSchemaDiagramDocument,
  types: [
    ...(sampleDbSchemaDiagramDocument.types ?? []),
    {
      id: 'billing-address',
      schemaId: 'public',
      name: 'billing_address',
      fields: [
        { id: 'line_1', name: 'line_1', type: 'varchar', length: 120, nullable: false },
        { id: 'city', name: 'city', type: 'varchar', length: 80, nullable: false },
      ],
    },
    {
      id: 'address-line-1',
      schemaId: 'public',
      name: 'addressline1',
      type: 'varchar',
      length: 30,
    },
    {
      id: 'drink-options',
      schemaId: 'public',
      name: 'drink_options',
      type: 'enum',
      values: ['coffee', 'tea', 'juice'],
    },
  ],
}

function DbDiagrammerStory(args: DbDiagrammerStoryProps) {
  const sampleDbDiagramDocument = toDbDiagrammerDocument(sampleDbSchemaDiagramDocument)
  return <Diagrammer {...args} defaultDocument={sampleDbDiagramDocument} />
}

function TableDefinitionEditorStory(args: DbDiagrammerStoryProps) {
  const [document, setDocument] = React.useState(() => createDbDiagramDocument(tableDefinitionEditorDocument))
  const diagramDocument = React.useMemo(() => toDbDiagrammerDocument(document), [document])

  return (
    <AppShell.Root defaultSecondaryOpen className="h-full" style={{ height: args.height ?? 620 }}>
      <AppShell.Body>
        <AppShell.Secondary side="left" width="560px" resize scroll="auto">
          <DbTableDefinitionEditor document={document} onDocumentChange={setDocument} />
        </AppShell.Secondary>
        <AppShell.Main>
          <Diagrammer
            {...args}
            document={diagramDocument}
            fitView={false}
            height="100%"
            onDocumentChange={nextDiagramDocument => {
              setDocument(previousDocument =>
                updateDbDiagramLayoutFromDiagrammer(previousDocument, nextDiagramDocument),
              )
            }}
            className="min-w-0"
          />
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  )
}

const meta = {
  title: 'Blocks/Diagrammer/DB Schema Model',
  component: Diagrammer,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: 'min(100%, 1220px)', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    height: {
      control: { type: 'number', min: 320, step: 20 },
    },
    readonly: {
      control: 'boolean',
    },
    showControls: {
      control: 'boolean',
    },
    showMiniMap: {
      control: 'boolean',
    },
    fitView: {
      control: 'boolean',
    },
  },
  args: {
    height: 620,
    readonly: false,
    showControls: true,
    showMiniMap: true,
    fitView: false,
  },
} satisfies Meta<DbDiagrammerStoryProps>

export default meta

type Story = StoryObj<typeof meta>

export const CommerceSchema: Story = {
  render: DbDiagrammerStory,
}

export const TableDefinitionEditor: Story = {
  render: TableDefinitionEditorStory,
}
