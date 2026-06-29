import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Progress } from '@/elements'
import { progressPropDefs } from '@/elements/progress/progress.props'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Text } from '@/typography'

const meta: Meta<typeof Progress> = {
  title: 'Elements/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(progressPropDefs.size),
    },
    variant: {
      control: 'select',
      options: getPropDefValues(progressPropDefs.variant),
    },
    color: {
      control: 'select',
      options: getPropDefValues(progressPropDefs.color),
    },
    radius: {
      control: 'select',
      options: getPropDefValues(progressPropDefs.radius),
    },
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: {
    value: 60,
  },
  render: args => (
    <div className="w-64">
      <Progress {...args} />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      {getPropDefValues(progressPropDefs.size).map(size => (
        <div key={size}>
          <Text as="p" size="sm" color="neutral" muted className="mb-2">
            Size {size}
          </Text>
          <Progress size={size} value={60} />
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      {getPropDefValues(progressPropDefs.color).map(color => (
        <div key={color}>
          <Text as="p" size="sm" color="neutral" muted className="mb-2 capitalize">
            {color}
          </Text>
          <Progress color={color} value={70} />
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      {getPropDefValues(progressPropDefs.variant).map(variant => (
        <div key={variant}>
          <Text as="p" size="sm" color="neutral" muted className="mb-2 capitalize">
            {variant}
          </Text>
          <Progress variant={variant} value={50} />
        </div>
      ))}
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <Text as="p" size="sm" color="neutral" muted>
        Loading...
      </Text>
      <Progress />
    </div>
  ),
}

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0
          return prev + 10
        })
      }, 500)
      return () => clearInterval(timer)
    }, [])

    return (
      <div className="w-64">
        <Progress value={progress} />
        <Text as="p" size="sm" color="neutral" muted className="mt-2 text-center">
          {progress}%
        </Text>
      </div>
    )
  },
}

export const FileUpload: Story = {
  render: () => {
    const [progress, setProgress] = useState(0)
    const [uploading, setUploading] = useState(false)

    const startUpload = () => {
      setUploading(true)
      setProgress(0)
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploading(false)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)
    }

    return (
      <div className="w-80 space-y-4 rounded-lg border border-neutral p-4">
        <div className="flex items-center justify-between">
          <div>
            <Text as="p" size="sm" weight="medium">
              document.pdf
            </Text>
            <Text as="p" size="xs" color="neutral" muted>
              2.4 MB
            </Text>
          </div>
          {!uploading && progress === 0 && (
            <button onClick={startUpload} className="text-sm text-primary hover:underline">
              Upload
            </button>
          )}
          {progress >= 100 && (
            <Text as="span" size="sm" color="success">
              Complete
            </Text>
          )}
        </div>
        {(uploading || progress > 0) && (
          <div>
            <Progress
              value={Math.min(progress, 100)}
              color={progress >= 100 ? SemanticColor.success : SemanticColor.primary}
            />
            <Text as="p" size="xs" color="neutral" muted className="mt-1 text-right">
              {Math.min(Math.round(progress), 100)}%
            </Text>
          </div>
        )}
      </div>
    )
  },
}

export const MultipleProgress: Story = {
  render: () => (
    <div className="w-80 space-y-4 rounded-lg border border-neutral p-4">
      <Text as="p" size="sm" weight="medium">
        Storage Usage
      </Text>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <Text as="span" size="sm">
              Documents
            </Text>
            <Text as="span" size="sm" color="neutral" muted>
              4.2 GB
            </Text>
          </div>
          <Progress value={42} color="info" size="sm" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <Text as="span" size="sm">
              Photos
            </Text>
            <Text as="span" size="sm" color="neutral" muted>
              8.5 GB
            </Text>
          </div>
          <Progress value={85} color="success" size="sm" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <Text as="span" size="sm">
              Videos
            </Text>
            <Text as="span" size="sm" color="neutral" muted>
              9.1 GB
            </Text>
          </div>
          <Progress value={91} color="warning" size="sm" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <Text as="span" size="sm">
              Other
            </Text>
            <Text as="span" size="sm" color="neutral" muted>
              1.2 GB
            </Text>
          </div>
          <Progress value={12} color="neutral" size="sm" />
        </div>
      </div>
      <div className="border-t border-neutral pt-2">
        <div className="flex justify-between">
          <Text as="span" size="sm" weight="medium">
            Total
          </Text>
          <Text as="span" size="sm">
            23 GB / 50 GB
          </Text>
        </div>
      </div>
    </div>
  ),
}

export const SkillLevels: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      {[
        { skill: 'React', level: 90 },
        { skill: 'TypeScript', level: 85 },
        { skill: 'Node', level: 75 },
        { skill: 'Python', level: 60 },
        { skill: 'Rust', level: 30 },
      ].map(({ skill, level }) => (
        <div key={skill}>
          <div className="flex justify-between mb-1">
            <Text as="span" size="sm">
              {skill}
            </Text>
            <Text as="span" size="sm" color="neutral" muted>
              {level}%
            </Text>
          </div>
          <Progress
            value={level}
            size="xs"
            color={level >= 80 ? SemanticColor.success : level >= 50 ? SemanticColor.primary : SemanticColor.warning}
          />
        </div>
      ))}
    </div>
  ),
}
