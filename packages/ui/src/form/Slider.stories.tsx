import type { Meta, StoryObj } from '@storybook/react-vite'
import { SunDim, SunMedium, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { sliderPropDefs } from '@/elements/slider/slider.props'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Form/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: selectArgType(sliderPropDefs.size),
    variant: selectArgType(sliderPropDefs.variant),
    color: selectArgType(sliderPropDefs.color),
    radius: selectArgType(sliderPropDefs.radius),
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState([50])
    return (
      <div className="w-64">
        <Slider {...args} value={value} onValueChange={setValue} />
        <p className="mt-2 text-center text-sm text-muted">Value: {value[0]}</p>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="w-64 space-y-6">
      {getPropDefValues(sliderPropDefs.size).map(size => (
        <div key={size}>
          <p className="mb-2 text-sm text-muted">Size {size}</p>
          <Slider size={size} defaultValue={[50]} />
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      {getPropDefValues(sliderPropDefs.color).map(color => (
        <div key={color}>
          <p className="mb-2 text-sm text-muted capitalize">{color}</p>
          <Slider color={color} defaultValue={[60]} />
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-64 space-y-6">
      {getPropDefValues(sliderPropDefs.variant).map(variant => (
        <div key={variant}>
          <p className="mb-2 text-sm text-muted capitalize">{variant}</p>
          <Slider variant={variant} defaultValue={[50]} />
        </div>
      ))}
    </div>
  ),
}

export const Radius: Story = {
  render: () => (
    <div className="w-64 space-y-6">
      {getPropDefValues(sliderPropDefs.radius).map(radius => (
        <div key={radius}>
          <p className="mb-2 text-sm text-muted capitalize">{radius}</p>
          <Slider radius={radius} size="md" defaultValue={[50]} />
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Slider disabled defaultValue={[40]} />
    </div>
  ),
}

export const CustomRange: Story = {
  render: args => {
    const [value, setValue] = useState([25])
    return (
      <div className="w-64">
        <Slider {...args} value={value} onValueChange={setValue} min={0} max={100} step={5} />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>0</span>
          <span>{value[0]}</span>
          <span>100</span>
        </div>
      </div>
    )
  },
}

export const VolumeControl: Story = {
  render: args => {
    const [volume, setVolume] = useState([75])
    return (
      <div className="w-72 rounded-[var(--element-border-radius)] border border-neutral p-4">
        <div className="flex items-center gap-3">
          <Volume2 className="h-5 w-5 text-muted" />
          <Slider {...args} value={volume} onValueChange={setVolume} className="flex-1" aria-label="Volume" />
          <span className="w-8 text-right text-sm">{volume[0]}%</span>
        </div>
      </div>
    )
  },
}

export const Range: Story = {
  render: args => {
    const [value, setValue] = useState([25, 75])
    return (
      <div className="w-64">
        <Slider {...args} value={value} onValueChange={setValue} />
        <p className="mt-2 text-center text-sm text-muted">
          Range: {value[0]} - {value[1]}
        </p>
      </div>
    )
  },
}

export const RangeSliderRadixStyle: Story = {
  args: {
    variant: 'surface',
    color: SemanticColor.primary,
    size: 'md',
    radius: 'full',
  },
  render: args => {
    const [range, setRange] = useState([20, 80])
    return (
      <div className="w-72 space-y-3">
        <Slider {...args} value={range} onValueChange={setRange} min={0} max={100} step={1} aria-label="Range slider" />
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{range[0]}</span>
          <span>{range[1]}</span>
        </div>
      </div>
    )
  },
}

export const PriceRange: Story = {
  args: {
    color: SemanticColor.success,
  },
  render: args => {
    const [price, setPrice] = useState([200, 800])
    return (
      <div className="w-80 rounded-[var(--element-border-radius)] border border-neutral p-4">
        <h4 className="mb-4 font-medium">Price Range</h4>
        <Slider
          value={price}
          onValueChange={setPrice}
          min={0}
          max={1000}
          step={10}
          aria-label="Price range"
          {...args}
        />
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted">$0</span>
          <span className="font-medium">
            ${price[0]} - ${price[1]}
          </span>
          <span className="text-muted">$1000</span>
        </div>
      </div>
    )
  },
}

export const BrightnessControl: Story = {
  args: {
    color: SemanticColor.warning,
  },
  render: args => {
    const [brightness, setBrightness] = useState([80])
    return (
      <div className="w-72 rounded-[var(--element-border-radius)] border border-neutral p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">Brightness</span>
          <span className="text-sm text-muted">{brightness[0]}%</span>
        </div>
        <div className="flex items-center gap-3">
          <SunDim className="h-4 w-4 text-muted" />
          <Slider
            value={brightness}
            onValueChange={setBrightness}
            className="flex-1"
            aria-label="Brightness"
            {...args}
          />
          <SunMedium className="h-5 w-5 text-muted" />
        </div>
      </div>
    )
  },
}
