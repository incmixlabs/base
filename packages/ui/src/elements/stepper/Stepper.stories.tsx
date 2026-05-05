import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Text } from '@/typography'
import { Stepper, type StepperProps, type StepperStep } from './Stepper'

const demoSteps: StepperStep[] = [
  {
    id: 'account',
    title: 'Account',
    description: 'Create your account',
    content: <Text size="sm">Account setup form content</Text>,
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Add profile details',
    content: <Text size="sm">Profile form content</Text>,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm and submit',
    content: <Text size="sm">Review summary content</Text>,
  },
]

const meta: Meta<typeof Stepper> = {
  title: 'Elements/Stepper',
  component: Stepper,
  args: {
    steps: demoSteps,
    orientation: 'horizontal',
    variant: 'default',
    size: 'md',
    allowStepSelect: true,
    showControls: true,
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Stepper>

function ControlledPreview(args: StepperProps) {
  const [value, setValue] = React.useState(args.value ?? 0)

  React.useEffect(() => {
    setValue(args.value ?? 0)
  }, [args.value])

  return (
    <Stepper
      {...args}
      value={value}
      onValueChange={(next, step) => {
        setValue(next)
        args.onValueChange?.(next, step)
      }}
      className={cn('w-full max-w-3xl', args.className)}
    />
  )
}

export const Default: Story = {
  render: args => <ControlledPreview {...args} />,
}

export const Pill: Story = {
  args: {
    variant: 'pill',
  },
  render: args => <ControlledPreview {...args} />,
}

export const Animated: Story = {
  args: {
    animated: true,
  },
  render: args => <ControlledPreview {...args} />,
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    className: 'max-w-xl',
  },
  render: args => <ControlledPreview {...args} />,
}
