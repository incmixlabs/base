import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Box } from '@/layouts/box/Box'
import { colorPropDef, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { NumberInput } from './NumberInput'
import { numberInputInputVariants, numberInputSizes, numberInputVariants } from './number-input.props'

const meta: Meta<typeof NumberInput> = {
  title: 'Form/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    variant: 'button',
    size: 'md',
    inputVariant: 'outline',
    color: SemanticColor.slate,
    radius: 'md',
    step: 1,
    defaultValue: 2,
    min: 0,
    max: 10,
    allowDecimal: false,
    iconButton: {
      variant: 'soft',
      color: SemanticColor.slate,
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [...numberInputVariants],
    },
    size: {
      control: 'select',
      options: [...numberInputSizes],
    },
    inputVariant: {
      control: 'select',
      options: [...numberInputInputVariants],
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
    },
    radius: {
      control: 'select',
      options: getPropDefValues(radiusPropDef.radius),
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'xs',
    radius: 'sm',
  },
}

export const IconVariant: Story = {
  args: {
    variant: 'icon',
  },
}

export const DecimalStep: Story = {
  args: {
    variant: 'icon',
    allowDecimal: true,
    step: 0.25,
    defaultValue: 1.5,
    min: -2,
    max: 3,
  },
}

export const GhostVariantOverride: Story = {
  args: {
    iconButton: {
      variant: 'ghost',
    },
  },
}

export const Comparison: Story = {
  render: () => {
    const [buttonValue, setButtonValue] = React.useState<number | ''>(2)
    const [iconValue, setIconValue] = React.useState<number | ''>(4)

    return (
      <Box display="flex" className="max-w-xl flex-col gap-4">
        <NumberInput
          label="Guests"
          variant="button"
          value={buttonValue}
          onValueChange={setButtonValue}
          iconButton={{ variant: 'soft', color: SemanticColor.slate }}
          min={1}
          max={8}
          allowDecimal={false}
        />
        <NumberInput
          label="Nights"
          variant="icon"
          value={iconValue}
          onValueChange={setIconValue}
          min={1}
          max={14}
          allowDecimal={false}
        />
      </Box>
    )
  },
}
