import type { Meta, StoryObj } from '@storybook/react-vite'
import { Diagrammer, type DiagrammerProps } from '../Diagrammer'
import { toRulesDiagrammerDocument } from './model'
import { sampleRulesDiagramModelDocument } from './sample-data'

type RulesDiagrammerStoryProps = Omit<DiagrammerProps, 'defaultDocument' | 'document'>

function RulesDiagrammerStory(args: RulesDiagrammerStoryProps) {
  const sampleDiagramDocument = toRulesDiagrammerDocument(sampleRulesDiagramModelDocument)
  return <Diagrammer {...args} defaultDocument={sampleDiagramDocument} />
}

const meta = {
  title: 'Blocks/Diagrammer/Rules Model',
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
} satisfies Meta<RulesDiagrammerStoryProps>

export default meta

type Story = StoryObj<typeof meta>

export const DiscountRule: Story = {
  render: RulesDiagrammerStory,
}
