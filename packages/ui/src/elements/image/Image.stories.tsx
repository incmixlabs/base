import type { Meta, StoryObj } from '@storybook/react-vite'
import { AspectRatio } from '@/layouts'
import { Image } from './Image'

const meta: Meta<typeof Image> = {
  title: 'Elements/Image',
  component: Image,
  parameters: {
    layout: 'padded',
  },
  args: {
    alt: 'Sample image',
    objectFit: 'cover',
  },
  argTypes: {
    objectFit: {
      control: 'select',
      options: ['contain', 'cover', 'fill', 'none', 'scale-down'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleSrc = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
const fallbackSrc = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'

export const Default: Story = {
  args: {
    src: sampleSrc,
  },
  render: args => <Image {...args} className="h-64 w-full rounded-xl border" />,
}

export const WithAspectRatio: Story = {
  args: {
    src: sampleSrc,
    alt: 'Landscape in 16:9 frame',
    srcSet: `${sampleSrc}&w=640 640w, ${sampleSrc}&w=960 960w, ${sampleSrc}&w=1280 1280w`,
    sizes: '(min-width: 1024px) 720px, 100vw',
  },
  render: args => (
    <AspectRatio ratio="16/9" className="w-[420px] overflow-hidden rounded-xl border">
      <Image {...args} className="h-full w-full" />
    </AspectRatio>
  ),
}

export const ResponsiveSources: Story = {
  args: {
    src: `${sampleSrc}&w=960`,
    alt: 'Responsive sample',
    srcSet: `${sampleSrc}&w=480 480w, ${sampleSrc}&w=768 768w, ${sampleSrc}&w=960 960w, ${sampleSrc}&w=1440 1440w`,
    sizes: '(min-width: 1280px) 720px, (min-width: 768px) 60vw, 100vw',
  },
  render: args => (
    <div className="max-w-3xl space-y-3">
      <div className="text-sm text-muted-foreground">
        This story keeps `srcSet` and `sizes` visible in controls and composes the image inside `AspectRatio`.
      </div>
      <AspectRatio ratio="21/9" className="w-full overflow-hidden rounded-xl border">
        <Image {...args} className="h-full w-full" />
      </AspectRatio>
    </div>
  ),
}

export const FallbackSource: Story = {
  args: {
    src: 'https://example.com/does-not-exist.jpg',
    fallbackSrc,
    alt: 'Fallback source demo',
  },
  render: args => (
    <div className="max-w-xl space-y-3">
      <div className="text-sm text-muted-foreground">
        The primary image intentionally fails so `fallbackSrc` can be exercised in Storybook.
      </div>
      <AspectRatio ratio="4/3" className="w-full overflow-hidden rounded-xl border">
        <Image {...args} className="h-full w-full" />
      </AspectRatio>
    </div>
  ),
}

export const ObjectFitComparison: Story = {
  render: () => (
    <div className="grid w-[720px] grid-cols-2 gap-4">
      {(['cover', 'contain', 'fill', 'none', 'scale-down'] as const).map(objectFit => (
        <div key={objectFit} className="space-y-2">
          <div className="text-xs text-muted-foreground">objectFit="{objectFit}"</div>
          <AspectRatio ratio="3/2" className="w-full overflow-hidden rounded-xl border bg-muted/40">
            <Image src={sampleSrc} alt={`${objectFit} sample`} objectFit={objectFit} className="h-full w-full" />
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
}
