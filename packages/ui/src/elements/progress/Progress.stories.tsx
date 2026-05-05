import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Progress } from '@/elements'
import { progressPropDefs } from '@/elements/progress/progress.props'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'

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
          <p className="text-sm text-muted-foreground mb-2">Size {size}</p>
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
          <p className="text-sm text-muted-foreground mb-2 capitalize">{color}</p>
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
          <p className="text-sm text-muted-foreground mb-2 capitalize">{variant}</p>
          <Progress variant={variant} value={50} />
        </div>
      ))}
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p className="text-sm text-muted-foreground">Loading...</p>
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
        <p className="mt-2 text-sm text-muted-foreground text-center">{progress}%</p>
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
      <div className="w-80 p-4 border rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">document.pdf</p>
            <p className="text-xs text-muted-foreground">2.4 MB</p>
          </div>
          {!uploading && progress === 0 && (
            <button onClick={startUpload} className="text-sm text-primary hover:underline">
              Upload
            </button>
          )}
          {progress >= 100 && <span className="text-sm text-green-600">Complete</span>}
        </div>
        {(uploading || progress > 0) && (
          <div>
            <Progress
              value={Math.min(progress, 100)}
              color={progress >= 100 ? SemanticColor.success : SemanticColor.primary}
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">{Math.min(Math.round(progress), 100)}%</p>
          </div>
        )}
      </div>
    )
  },
}

export const MultipleProgress: Story = {
  render: () => (
    <div className="w-80 space-y-4 p-4 border rounded-lg">
      <h4 className="font-medium">Storage Usage</h4>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Documents</span>
            <span className="text-muted-foreground">4.2 GB</span>
          </div>
          <Progress value={42} color="info" size="sm" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Photos</span>
            <span className="text-muted-foreground">8.5 GB</span>
          </div>
          <Progress value={85} color="success" size="sm" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Videos</span>
            <span className="text-muted-foreground">9.1 GB</span>
          </div>
          <Progress value={91} color="warning" size="sm" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Other</span>
            <span className="text-muted-foreground">1.2 GB</span>
          </div>
          <Progress value={12} color="neutral" size="sm" />
        </div>
      </div>
      <div className="pt-2 border-t">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Total</span>
          <span>23 GB / 50 GB</span>
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
          <div className="flex justify-between text-sm mb-1">
            <span>{skill}</span>
            <span className="text-muted-foreground">{level}%</span>
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
