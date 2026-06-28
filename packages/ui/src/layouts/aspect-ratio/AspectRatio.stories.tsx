import type { Meta, StoryObj } from '@storybook/react-vite'
import { Image } from '@/elements'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { AspectRatio } from './AspectRatio'
import { aspectRatioPropDefs } from './aspect-ratio.props'

const ratios = getPropDefValues(aspectRatioPropDefs.ratio)

const meta: Meta<typeof AspectRatio> = {
  title: 'Layouts/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    ratio: selectArgType(aspectRatioPropDefs.ratio),
  },
}

export default meta
type Story = StoryObj<typeof meta>

const DemoContent = ({ label }: { label: string }) => (
  <div className="flex h-full w-full items-center justify-center bg-neutral-soft text-sm text-slate">{label}</div>
)

export const Default: Story = {
  args: {
    ratio: '16/9',
  },
  render: args => (
    <AspectRatio {...args} className="w-[320px] rounded-lg border border-light">
      <DemoContent label="16:9" />
    </AspectRatio>
  ),
}

export const Ratios: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[720px]">
      {ratios.map(ratio => (
        <div key={ratio} className="space-y-2">
          <div className="text-slate text-xs">ratio="{ratio}"</div>
          <AspectRatio ratio={ratio} className="w-full rounded-lg border border-light">
            <DemoContent label={ratio} />
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <div className="w-[420px] space-y-2">
      <div className="text-slate text-xs">AspectRatio should own layout; Image should own source behavior.</div>
      <AspectRatio ratio="16/9" className="overflow-hidden rounded-xl border border-light">
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
          srcSet={[
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80 640w',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80 960w',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1280&q=80 1280w',
          ].join(', ')}
          sizes="(min-width: 1024px) 420px, 100vw"
          alt="Landscape sample"
          className="h-full w-full"
        />
      </AspectRatio>
    </div>
  ),
}
