import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { sliderPropDefs } from '@/elements/slider/slider.props'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Form/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(sliderPropDefs.size),
    },
    variant: {
      control: 'select',
      options: getPropDefValues(sliderPropDefs.variant),
    },
    color: {
      control: 'select',
      options: getPropDefValues(sliderPropDefs.color),
    },
    radius: {
      control: 'select',
      options: getPropDefValues(sliderPropDefs.radius),
    },
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
        <p className="mt-2 text-sm text-muted-foreground text-center">Value: {value[0]}</p>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="w-64 space-y-6">
      {getPropDefValues(sliderPropDefs.size).map(size => (
        <div key={size}>
          <p className="text-sm text-muted-foreground mb-2">Size {size}</p>
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
          <p className="text-sm text-muted-foreground mb-2 capitalize">{color}</p>
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
          <p className="text-sm text-muted-foreground mb-2 capitalize">{variant}</p>
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
          <p className="text-sm text-muted-foreground mb-2 capitalize">{radius}</p>
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
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
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
      <div className="w-72 p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          <Slider {...args} value={volume} onValueChange={setVolume} className="flex-1" aria-label="Volume" />
          <span className="text-sm w-8 text-right">{volume[0]}%</span>
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
        <p className="mt-2 text-sm text-muted-foreground text-center">
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
        <div className="flex items-center justify-between text-xs text-muted-foreground">
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
      <div className="w-80 p-4 border rounded-lg">
        <h4 className="font-medium mb-4">Price Range</h4>
        <Slider
          value={price}
          onValueChange={setPrice}
          min={0}
          max={1000}
          step={10}
          aria-label="Price range"
          {...args}
        />
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-muted-foreground">$0</span>
          <span className="font-medium">
            ${price[0]} - ${price[1]}
          </span>
          <span className="text-muted-foreground">$1000</span>
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
      <div className="w-72 p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Brightness</span>
          <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
          <Slider
            value={brightness}
            onValueChange={setBrightness}
            className="flex-1"
            aria-label="Brightness"
            {...args}
          />
          <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        </div>
      </div>
    )
  },
}
