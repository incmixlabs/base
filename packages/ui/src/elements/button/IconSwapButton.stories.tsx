import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Box } from '@/layouts/box/Box'
import { selectArgType } from '@/theme/props/storybook'
import { IconSwapButton } from './IconSwapButton'
import { iconButtonPropDefs } from './icon-button.props'

const themeIcons = ['sun', 'moon'] as const

const meta: Meta<typeof IconSwapButton> = {
  title: 'Elements/IconSwapButton',
  component: IconSwapButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      ...selectArgType(iconButtonPropDefs.size),
    },
    variant: {
      ...selectArgType(iconButtonPropDefs.variant),
    },
    color: {
      ...selectArgType(iconButtonPropDefs.color),
    },
    radius: {
      ...selectArgType(iconButtonPropDefs.radius),
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    highContrast: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => {
    const [value, setValue] = React.useState<(typeof themeIcons)[number]>('sun')

    return (
      <IconSwapButton
        {...args}
        icons={themeIcons}
        value={value}
        onToggle={setValue}
        title={value === 'sun' ? 'Switch to moon' : 'Switch to sun'}
      />
    )
  },
}

export const Variants: Story = {
  render: () => {
    const [soft, setSoft] = React.useState<(typeof themeIcons)[number]>('sun')
    const [solid, setSolid] = React.useState<(typeof themeIcons)[number]>('moon')
    const [outline, setOutline] = React.useState<(typeof themeIcons)[number]>('sun')
    const [ghost, setGhost] = React.useState<(typeof themeIcons)[number]>('moon')

    return (
      <Box display="flex" className="items-center gap-3">
        <IconSwapButton icons={themeIcons} value={solid} onToggle={setSolid} variant="solid" title="Solid swap" />
        <IconSwapButton icons={themeIcons} value={soft} onToggle={setSoft} variant="soft" title="Soft swap" />
        <IconSwapButton
          icons={themeIcons}
          value={outline}
          onToggle={setOutline}
          variant="outline"
          title="Outline swap"
        />
        <IconSwapButton icons={themeIcons} value={ghost} onToggle={setGhost} variant="ghost" title="Ghost swap" />
      </Box>
    )
  },
}
