import type { Meta, StoryObj } from '@storybook/react-vite'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Theme } from '@/theme/ThemeProvider'
import { ScrollArea } from './ScrollArea'
import { scrollAreaPropDefs } from './scroll-area.props'

const sizes = getPropDefValues(scrollAreaPropDefs.size)
const types = getPropDefValues(scrollAreaPropDefs.type)
const scrolls = getPropDefValues(scrollAreaPropDefs.scroll)
const variants = getPropDefValues(scrollAreaPropDefs.variant)
const surfaceVariants = getPropDefValues(scrollAreaPropDefs.surfaceVariant)
const colors = getPropDefValues(scrollAreaPropDefs.color)
const trackShapes = getPropDefValues(scrollAreaPropDefs.trackShape)
const thumbStyles = getPropDefValues(scrollAreaPropDefs.thumbStyle)
const railTones = getPropDefValues(scrollAreaPropDefs.rail)
const thicknesses = getPropDefValues(scrollAreaPropDefs.thickness)
const trackerStyles = getPropDefValues(scrollAreaPropDefs.trackerStyle)
const defaultSize = scrollAreaPropDefs.size.default
const defaultType = scrollAreaPropDefs.type.default
const alwaysType = types.find(type => type === 'always') ?? defaultType

const meta: Meta<typeof ScrollArea> = {
  title: 'Elements/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: types,
    },
    scroll: {
      control: 'select',
      options: scrolls,
    },
    size: {
      control: 'select',
      options: sizes,
    },
    variant: {
      control: 'select',
      options: variants,
    },
    color: {
      control: 'select',
      options: colors,
    },
    surfaceColor: {
      control: 'select',
      options: colors,
    },
    surfaceVariant: {
      control: 'select',
      options: surfaceVariants,
    },
    trackColor: {
      control: 'select',
      options: colors,
    },
    rail: {
      control: 'select',
      options: railTones,
    },
    arrow: {
      control: 'select',
      options: railTones,
    },
    tracker: {
      control: 'select',
      options: colors,
    },
    thickness: {
      control: 'select',
      options: thicknesses,
    },
    trackerStyle: {
      control: 'select',
      options: trackerStyles,
    },
    trackShape: {
      control: 'select',
      options: trackShapes,
    },
    controls: {
      control: 'boolean',
    },
    thumbStyle: {
      control: 'select',
      options: thumbStyles,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleParagraphs = Array.from({ length: 10 }, (_, i) => (
  <p key={i} className="mb-4 text-sm">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua.
  </p>
))

const longSampleParagraphs = Array.from({ length: 48 }, (_, i) => (
  <p key={i} className="mb-6 text-sm">
    Section {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat.
  </p>
))

function ScrollAreaContent({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-4 pr-2">{children}</div>
}

function HorizontalContent() {
  return (
    <div className="px-4 py-4">
      <div className="flex w-max gap-6">
        {Array.from({ length: 14 }, (_, i) => (
          <div
            key={i}
            className="flex h-28 w-56 shrink-0 flex-col items-start justify-between rounded-xl border bg-muted/40 p-4 text-sm"
          >
            <div className="font-medium">Panel {i + 1}</div>
            <div className="text-muted-foreground">Wide cards force horizontal-only overflow.</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BothAxisContent() {
  return (
    <div className="px-4 py-4">
      <div className="w-max space-y-4">
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} className="flex w-[1120px] gap-4 rounded-xl border bg-muted/30 p-4">
            <div className="w-40 shrink-0 text-sm font-medium">Row {i + 1}</div>
            <div className="w-64 shrink-0 text-sm text-muted-foreground">
              Horizontal overflow should stay active while the vertical stack extends beyond the frame height.
            </div>
            <div className="w-[560px] shrink-0 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Default: Story = {
  args: {
    type: alwaysType,
    scroll: scrollAreaPropDefs.scroll.default,
    size: scrollAreaPropDefs.size.default,
    variant: scrollAreaPropDefs.variant.default,
    color: 'neutral',
    surfaceVariant: 'surface',
    trackColor: undefined,
    rail: 'auto',
    arrow: 'auto',
    tracker: undefined,
    thickness: 'thin',
    trackerStyle: 'line',
    trackShape: scrollAreaPropDefs.trackShape.default,
    thumbStyle: scrollAreaPropDefs.thumbStyle.default,
    controls: false,
  },
  render: args => (
    <ScrollArea {...args} className="h-64 w-80 rounded-lg border">
      <ScrollAreaContent>{sampleParagraphs}</ScrollAreaContent>
    </ScrollArea>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {sizes.map(size => (
        <div key={size} className="space-y-2">
          <p className="text-sm font-medium">size = {size}</p>
          <ScrollArea type={alwaysType} size={size} className="h-48 rounded-lg border">
            <ScrollAreaContent>{sampleParagraphs}</ScrollAreaContent>
          </ScrollArea>
        </div>
      ))}
    </div>
  ),
}

export const Types: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {types.map(type => (
        <div key={type} className="space-y-2">
          <p className="text-sm font-medium">type = {type}</p>
          <ScrollArea type={type} size={defaultSize} className="h-48 rounded-lg border">
            <ScrollAreaContent>{sampleParagraphs}</ScrollAreaContent>
          </ScrollArea>
        </div>
      ))}
    </div>
  ),
}

export const Directions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {scrolls.map(direction => (
        <div key={direction} className="space-y-2">
          <p className="text-sm font-medium">{direction}</p>
          <ScrollArea scroll={direction} className="h-48 rounded-lg border">
            {(direction === 'vertical' || direction === 'auto') && (
              <ScrollAreaContent>{sampleParagraphs}</ScrollAreaContent>
            )}
            {direction === 'horizontal' && (
              <ScrollAreaContent>
                <div className="flex gap-4" style={{ width: '640px' }}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="h-24 w-24 shrink-0 rounded-md bg-muted" />
                  ))}
                </div>
              </ScrollAreaContent>
            )}
            {direction === 'both' && (
              <ScrollAreaContent>
                <div style={{ width: '640px' }}>{sampleParagraphs}</div>
              </ScrollAreaContent>
            )}
          </ScrollArea>
        </div>
      ))}
    </div>
  ),
}

export const Themes: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {variants.map(variant => (
        <div key={variant} className="space-y-3">
          <p className="text-sm font-medium">variant = {variant}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['neutral', 'primary', 'info', 'success'] as const).map(color => (
              <ScrollArea
                key={`${variant}-${color}`}
                type={alwaysType}
                variant={variant}
                color={color}
                trackColor={color}
                className="h-40 rounded-xl border"
              >
                <ScrollAreaContent>{sampleParagraphs}</ScrollAreaContent>
              </ScrollArea>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-4">
      {trackShapes.map(trackShape => (
        <div key={trackShape} className="space-y-2">
          <p className="text-sm font-medium">trackShape = {trackShape}</p>
          <ScrollArea
            type={alwaysType}
            size="xs"
            variant="soft"
            color="primary"
            trackColor="primary"
            trackShape={trackShape}
            controls
            className="h-48 max-w-3xl rounded-xl border"
          >
            <ScrollAreaContent>{sampleParagraphs}</ScrollAreaContent>
          </ScrollArea>
        </div>
      ))}
    </div>
  ),
}

export const LongContent: Story = {
  render: () => (
    <div className="max-w-4xl space-y-2">
      <p className="text-sm font-medium">Long vertical scroll stress test</p>
      <ScrollArea
        type={alwaysType}
        scroll="vertical"
        size="xs"
        surfaceVariant="surface"
        surfaceColor="primary"
        rail="auto"
        arrow="auto"
        tracker="primary"
        thickness="thin"
        trackerStyle="line"
        trackShape="circle"
        controls
        className="h-[36rem] rounded-xl"
      >
        <div className="max-w-[22rem] px-5 py-5 leading-7">{longSampleParagraphs}</div>
      </ScrollArea>
    </div>
  ),
}

export const Horizontal: Story = {
  args: {
    type: alwaysType,
    scroll: 'horizontal',
    size: 'xs',
    surfaceVariant: 'surface',
    rail: 'auto',
    arrow: 'auto',
    tracker: 'primary',
    thickness: 'thin',
    trackerStyle: 'line',
    trackShape: 'circle',
    controls: true,
  },
  render: args => (
    <ScrollArea {...args} className="h-40 max-w-xl rounded-xl border">
      <HorizontalContent />
    </ScrollArea>
  ),
}

export const BothAxes: Story = {
  args: {
    type: alwaysType,
    scroll: 'both',
    size: 'xs',
    surfaceVariant: 'surface',
    rail: 'auto',
    arrow: 'auto',
    tracker: 'secondary',
    thickness: 'thin',
    trackerStyle: 'line',
    trackShape: 'circle',
    controls: true,
  },
  render: args => (
    <ScrollArea {...args} className="h-56 max-w-sm rounded-xl border">
      <BothAxisContent />
    </ScrollArea>
  ),
}

export const Playground: Story = {
  args: {
    type: alwaysType,
    scroll: 'vertical',
    size: 'sm',
    surfaceVariant: 'surface',
    surfaceColor: undefined,
    variant: 'soft',
    color: 'neutral',
    trackColor: 'slate',
    rail: 'auto',
    arrow: 'auto',
    tracker: 'primary',
    thickness: 'thin',
    trackerStyle: 'line',
    trackShape: 'circle',
    controls: true,
  },
  render: args => {
    const content =
      args.scroll === 'horizontal' ? (
        <HorizontalContent />
      ) : args.scroll === 'both' ? (
        <BothAxisContent />
      ) : (
        <ScrollAreaContent>{longSampleParagraphs}</ScrollAreaContent>
      )

    const frameClassName =
      args.scroll === 'horizontal'
        ? 'h-40 max-w-xl rounded-xl border'
        : args.scroll === 'both'
          ? 'h-56 max-w-sm rounded-xl border'
          : 'h-[32rem] max-w-4xl rounded-xl border'

    return (
      <ScrollArea {...args} className={frameClassName}>
        {content}
      </ScrollArea>
    )
  },
}

export const MalihuInspired: Story = {
  render: () => {
    const presets = [
      {
        id: 'rail-light-tracker-neutral',
        label: 'rail=light arrow=light tracker=neutral thickness=thin trackerStyle=line',
        appearance: 'dark' as const,
        props: {
          type: alwaysType,
          scroll: 'vertical' as const,
          surfaceVariant: 'surface' as const,
          rail: 'light' as const,
          arrow: 'light' as const,
          tracker: 'neutral' as const,
          thickness: 'thin' as const,
          trackerStyle: 'line' as const,
          trackShape: 'circle' as const,
          controls: true,
        },
      },
      {
        id: 'rail-light-tracker-primary-dot',
        label: 'rail=light arrow=light tracker=primary thickness=thin trackerStyle=dot',
        appearance: 'dark' as const,
        props: {
          type: alwaysType,
          scroll: 'vertical' as const,
          rail: 'light' as const,
          arrow: 'light' as const,
          tracker: 'primary' as const,
          thickness: 'thin' as const,
          trackerStyle: 'dot' as const,
          trackShape: 'circle' as const,
          controls: true,
        },
      },
      {
        id: 'surface-primary-secondary-dot',
        label:
          'surfaceColor=primary surfaceVariant=surface rail=dark arrow=dark tracker=secondary thickness=thick trackerStyle=dot',
        appearance: 'light' as const,
        props: {
          type: alwaysType,
          scroll: 'vertical' as const,
          surfaceColor: 'primary' as const,
          surfaceVariant: 'surface' as const,
          rail: 'dark' as const,
          arrow: 'dark' as const,
          tracker: 'secondary' as const,
          thickness: 'thick' as const,
          trackerStyle: 'dot' as const,
          trackShape: 'circle' as const,
          controls: true,
        },
      },
      {
        id: 'rail-light-secondary-line',
        label: 'rail=light arrow=light tracker=secondary thickness=thick trackerStyle=line',
        appearance: 'dark' as const,
        props: {
          type: alwaysType,
          scroll: 'vertical' as const,
          rail: 'light' as const,
          arrow: 'light' as const,
          tracker: 'secondary' as const,
          thickness: 'thick' as const,
          trackerStyle: 'line' as const,
          trackShape: 'circle' as const,
          controls: true,
        },
      },
    ]

    return (
      <div className="grid gap-6 xl:grid-cols-2">
        {presets.map(preset => (
          <Theme key={preset.id} appearance={preset.appearance}>
            <div className="space-y-3">
              <div className="text-lg font-medium">{preset.label}</div>
              <ScrollArea {...preset.props} className="h-[32rem] rounded-xl">
                <div className="max-w-[18rem] px-4 py-4 text-sm leading-8">{sampleParagraphs}</div>
              </ScrollArea>
            </div>
          </Theme>
        ))}
      </div>
    )
  },
}
