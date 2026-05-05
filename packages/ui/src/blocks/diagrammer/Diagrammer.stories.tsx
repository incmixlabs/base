import type { Meta, StoryObj } from '@storybook/react-vite'
import { Diagrammer, type DiagrammerProps } from './Diagrammer'
import { sampleDbDiagramDocument, sampleRulesDiagramDocument } from './sample-data'
import type { DiagrammerDocument } from './types'

type DiagrammerStoryProps = Omit<DiagrammerProps, 'defaultDocument' | 'document'>
type DiagrammerStoryFrameProps = DiagrammerStoryProps & {
  initialDocument: DiagrammerDocument
}

function DiagrammerStoryFrame({ initialDocument, ...args }: DiagrammerStoryFrameProps) {
  return <Diagrammer {...args} defaultDocument={initialDocument} />
}

const meta = {
  title: 'Blocks/Diagrammer',
  component: Diagrammer,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: 'min(100%, 1120px)', margin: '0 auto' }}>
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
    height: 560,
    readonly: false,
    showControls: true,
    showMiniMap: false,
    fitView: false,
  },
} satisfies Meta<DiagrammerStoryProps>

export default meta

type Story = StoryObj<typeof meta>

export const DatabaseSchema: Story = {
  render: args => <DiagrammerStoryFrame {...args} initialDocument={sampleDbDiagramDocument} />,
}

export const RulesEngine: Story = {
  render: args => <DiagrammerStoryFrame {...args} initialDocument={sampleRulesDiagramDocument} />,
}

export const WithMiniMap: Story = {
  args: {
    showMiniMap: true,
  },
  render: args => <DiagrammerStoryFrame {...args} initialDocument={sampleDbDiagramDocument} />,
}

export const Readonly: Story = {
  args: {
    readonly: true,
  },
  render: args => <DiagrammerStoryFrame {...args} initialDocument={sampleDbDiagramDocument} />,
}
