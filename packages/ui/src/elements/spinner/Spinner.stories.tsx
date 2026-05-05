import type { Meta, StoryObj } from '@storybook/react-vite'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button, Spinner } from '@/elements'
import { semanticColorKeys } from '@/theme/props/color.prop'
import { spinnerPropDefs, spinnerVariants } from './spinner.props'

const sizes = spinnerPropDefs.size.values
const variants = spinnerVariants
const colors = semanticColorKeys

const meta: Meta<typeof Spinner> = {
  title: 'Elements/Spinner',
  component: Spinner,
  args: {
    color: 'primary',
  },
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: [...sizes],
    },
    variant: {
      control: 'select',
      options: [...variants],
    },
    color: {
      control: 'select',
      options: [...colors],
    },
    loading: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    loading: true,
    variant: 'spinner',
  },
}

export const CodeVariant: Story = {
  args: {
    variant: 'code',
    size: 'lg',
  },
}

export const AIVariant: Story = {
  args: {
    variant: 'ai',
    size: 'lg',
  },
  render: args => <Spinner {...args} />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {variants.map(variant => (
        <div key={variant} className="flex items-center gap-6">
          <span className="w-16 text-xs text-muted-foreground">{variant}</span>
          {sizes.map(size => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Spinner size={size} variant={variant} />
              <span className="text-xs text-muted-foreground">{size}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner color="primary" />
      <Spinner color="info" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="error" />
      <Spinner color="neutral" />
    </div>
  ),
}

export const SemanticAI: Story = {
  args: {
    variant: 'ai',
    size: 'lg',
  },
  render: args => (
    <div className="flex items-center gap-6 rounded-[1.75rem] border border-border/60 bg-[radial-gradient(circle_at_top,_rgba(38,38,45,0.96),_rgba(12,12,16,1)_72%)] px-8 py-6 text-white">
      <Spinner {...args} color="light" />
      <Spinner {...args} color="primary" />
      <Spinner {...args} color="accent" />
      <Spinner {...args} color="info" />
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span className="text-sm">Loading...</span>
      </div>
      <div className="flex items-center gap-2">
        <Spinner size="sm" color="primary" />
        <span className="text-sm text-primary">Processing your request...</span>
      </div>
    </div>
  ),
}

export const ButtonLoading: Story = {
  render: () => {
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 2000)
    }

    return (
      <div className="flex gap-4">
        <Button onClick={handleClick} disabled={loading}>
          {loading && <Spinner size="xs" className="mr-2" />}
          {loading ? 'Loading...' : 'Click me'}
        </Button>
        <Button variant="outline" onClick={handleClick} disabled={loading}>
          {loading && <Spinner size="xs" className="mr-2" />}
          Submit
        </Button>
      </div>
    )
  },
}

export const LoadingOverlay: Story = {
  render: () => (
    <div className="relative w-64 h-32 border rounded-lg">
      <div className="p-4">
        <h4 className="font-medium">Card Content</h4>
        <p className="text-sm text-muted-foreground">This content is loading...</p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
        <Spinner size="md" />
      </div>
    </div>
  ),
}

export const FullPageLoading: Story = {
  render: () => (
    <div className="w-80 h-48 border rounded-lg flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" color="primary" />
      <div className="text-center">
        <p className="font-medium">Loading your dashboard</p>
        <p className="text-sm text-muted-foreground">Please wait a moment...</p>
      </div>
    </div>
  ),
}

export const InlineLoading: Story = {
  render: () => (
    <div className="w-72 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm">Checking availability</span>
        <Spinner size="xs" />
      </div>
    </div>
  ),
}

export const LoadingList: Story = {
  render: () => (
    <div className="w-72 border rounded-lg divide-y">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-3 flex items-center gap-3">
          <Spinner size="sm" color="inverse" />
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-muted rounded animate-pulse mt-1" />
          </div>
        </div>
      ))}
    </div>
  ),
}

export const ConditionalLoading: Story = {
  render: () => {
    const [loading, setLoading] = useState(true)

    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setLoading(!loading)}>
          Toggle Loading
        </Button>
        <Spinner loading={loading}>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Content Loaded</h4>
            <p className="text-sm text-muted-foreground">This content is now visible.</p>
          </div>
        </Spinner>
      </div>
    )
  },
}

function PulsingArrowFlowPreview() {
  const reduceMotion = useReducedMotion()
  const sharedTransition = {
    duration: 1.4,
    ease: 'easeInOut' as const,
    repeat: Infinity,
  }

  return (
    <div className="flex min-h-48 w-80 items-center justify-center rounded-[2rem] border border-border/70 bg-gradient-to-b from-stone-50 to-stone-200 p-8 text-stone-900">
      <div className="w-[18rem] rounded-[1.75rem] bg-white/80 px-8 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={
              reduceMotion
                ? { opacity: [0.7, 0.95, 0.7] }
                : { x: [0, -14, 0], opacity: [0.55, 0.95, 0.55], scale: [0.96, 1.06, 0.96] }
            }
            transition={sharedTransition}
            className="text-3xl font-semibold leading-none"
          >
            ←
          </motion.div>
          <motion.div
            animate={
              reduceMotion ? { opacity: [0.7, 0.95, 0.7] } : { opacity: [0.6, 1, 0.6], scale: [0.92, 1.14, 0.92] }
            }
            transition={sharedTransition}
            className="h-3 w-3 rounded-full bg-current"
          />
          <motion.div
            animate={
              reduceMotion
                ? { opacity: [0.7, 0.95, 0.7] }
                : { x: [0, 14, 0], opacity: [0.55, 0.95, 0.55], scale: [0.96, 1.06, 0.96] }
            }
            transition={sharedTransition}
            className="text-3xl font-semibold leading-none"
          >
            →
          </motion.div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-300/70">
          <motion.div
            animate={reduceMotion ? { opacity: [0.7, 1, 0.7] } : { x: ['-55%', '155%'], opacity: [0.35, 0.9, 0.35] }}
            transition={{
              duration: 1.6,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            className="h-full w-[45%] rounded-full bg-current"
          />
        </div>
      </div>
    </div>
  )
}

export const PulsingArrows: Story = {
  render: () => <PulsingArrowFlowPreview />,
}
