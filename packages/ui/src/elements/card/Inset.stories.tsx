import type { Meta, StoryObj } from '@storybook/react-vite'
import { selectArgType } from '@/theme/props/storybook'
import { Card } from './Card'
import { Inset } from './Inset'
import { insetPropDefs } from './inset.props'

const meta: Meta<typeof Inset> = {
  title: 'Elements/Inset',
  component: Inset,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inset is a card-adjacent helper for controlled edge bleed and aligned inner spacing. Use `clip` to choose border-box vs padding-box bleed, and `p`/`px`/`py`/etc. with `current` or `0` for inner spacing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    side: selectArgType(insetPropDefs.side, {
      description: 'Which sides should bleed outward.',
    }),
    clip: selectArgType(insetPropDefs.clip, {
      description: 'Spacing token used for the negative inset offset.',
    }),
    p: selectArgType(insetPropDefs.p),
    px: selectArgType(insetPropDefs.px),
    py: selectArgType(insetPropDefs.py),
    pt: selectArgType(insetPropDefs.pt),
    pr: selectArgType(insetPropDefs.pr),
    pb: selectArgType(insetPropDefs.pb),
    pl: selectArgType(insetPropDefs.pl),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    side: 'x',
    clip: 'padding-box',
    px: 'current',
    pb: 'current',
  },
  render: args => (
    <Card.Root className="w-[360px] overflow-hidden">
      <Inset {...args}>
        <div className="space-y-4">
          <div className="aspect-[16/9] rounded-lg bg-neutral-soft" />
          <div className="space-y-1">
            <div className="text-sm font-medium">Inset content</div>
            <div className="text-sm text-muted">
              Bleed media to the edge while body content stays aligned to a token grid.
            </div>
          </div>
        </div>
      </Inset>
    </Card.Root>
  ),
}

export const MediaBleed: Story = {
  render: () => (
    <Card.Root className="w-[380px] overflow-hidden">
      <Inset clip="padding-box" side="top" pb="current">
        <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-info/20 to-success/20" />
      </Inset>
      <Inset px="current" py="0">
        <div className="space-y-2">
          <div className="text-sm font-medium">Campaign performance</div>
          <div className="text-sm text-muted">
            The hero media bleeds horizontally, while the summary stays aligned with the card rhythm.
          </div>
        </div>
      </Inset>
    </Card.Root>
  ),
}
