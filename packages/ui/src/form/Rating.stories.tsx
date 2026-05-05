import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heart, Star, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { SemanticColor } from '@/theme/props/color.prop'
import { Rating, RatingItem } from './Rating'

const semanticColorOptions = Object.values(SemanticColor)

const meta: Meta<typeof Rating> = {
  title: 'Form/Rating',
  component: Rating,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2x'],
    },
    color: {
      control: 'select',
      options: semanticColorOptions,
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'select',
      options: [0.5, 1],
    },
    clearable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    activationMode: {
      control: 'select',
      options: ['automatic', 'manual'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Rating>

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState(3)
    return (
      <div>
        <Rating {...args} value={value} onValueChange={setValue}>
          {Array.from({ length: args.max ?? 5 }, (_, i) => (
            <RatingItem key={i} />
          ))}
        </Rating>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Rating: {value} / {args.max ?? 5}
        </p>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(size => (
        <div key={size}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{size}</p>
          <Rating size={size} defaultValue={3}>
            {Array.from({ length: 5 }, (_, i) => (
              <RatingItem key={i} />
            ))}
          </Rating>
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      {semanticColorOptions.map(color => (
        <div key={color}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{color}</p>
          <Rating color={color} defaultValue={3}>
            {Array.from({ length: 5 }, (_, i) => (
              <RatingItem key={i} />
            ))}
          </Rating>
        </div>
      ))}
    </div>
  ),
}

export const HalfStars: Story = {
  render: () => {
    const [value, setValue] = useState(3.5)
    return (
      <div>
        <Rating step={0.5} value={value} onValueChange={setValue}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i} />
          ))}
        </Rating>
        <p className="mt-2 text-sm text-muted-foreground text-center">Rating: {value} / 5</p>
      </div>
    )
  },
}

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState(3)
    return (
      <div>
        <Rating clearable value={value} onValueChange={setValue}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i} />
          ))}
        </Rating>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          {value > 0 ? `Rating: ${value} / 5 (click same star to clear)` : 'No rating'}
        </p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <Rating disabled defaultValue={4}>
      {Array.from({ length: 5 }, (_, i) => (
        <RatingItem key={i} />
      ))}
    </Rating>
  ),
}

export const ReadOnly: Story = {
  render: () => (
    <Rating readOnly defaultValue={4}>
      {Array.from({ length: 5 }, (_, i) => (
        <RatingItem key={i} />
      ))}
    </Rating>
  ),
}

export const CustomIcons: Story = {
  render: () => {
    const [hearts, setHearts] = useState(3)
    const [thumbs, setThumbs] = useState(2)
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Hearts</p>
          <Rating value={hearts} onValueChange={setHearts}>
            {Array.from({ length: 5 }, (_, i) => (
              <RatingItem key={i}>
                <Heart />
              </RatingItem>
            ))}
          </Rating>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Thumbs Up</p>
          <Rating value={thumbs} onValueChange={setThumbs}>
            {Array.from({ length: 5 }, (_, i) => (
              <RatingItem key={i}>
                <ThumbsUp />
              </RatingItem>
            ))}
          </Rating>
        </div>
      </div>
    )
  },
}

export const CustomMax: Story = {
  render: () => {
    const [value, setValue] = useState(7)
    return (
      <div>
        <Rating max={10} value={value} onValueChange={setValue}>
          {Array.from({ length: 10 }, (_, i) => (
            <RatingItem key={i} />
          ))}
        </Rating>
        <p className="mt-2 text-sm text-muted-foreground text-center">Rating: {value} / 10</p>
      </div>
    )
  },
}

export const RenderFunction: Story = {
  render: () => {
    const [value, setValue] = useState(3)
    return (
      <Rating value={value} onValueChange={setValue} size="lg">
        {Array.from({ length: 5 }, (_, i) => (
          <RatingItem key={i}>
            {dataState => (
              <Star
                className={
                  dataState === 'full'
                    ? 'fill-current'
                    : dataState === 'partial'
                      ? 'fill-(--partial-fill)'
                      : 'fill-transparent opacity-40'
                }
              />
            )}
          </RatingItem>
        ))}
      </Rating>
    )
  },
}

export const Vertical: Story = {
  render: () => {
    const [value, setValue] = useState(3)
    return (
      <Rating orientation="vertical" value={value} onValueChange={setValue}>
        {Array.from({ length: 5 }, (_, i) => (
          <RatingItem key={i} />
        ))}
      </Rating>
    )
  },
}

export const FormIntegration: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState<number | null>(null)
    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          setSubmitted(Number(data.get('rating')))
        }}
        className="space-y-4"
      >
        <div>
          <label className="text-sm font-medium mb-2 block">Your Rating</label>
          <Rating name="rating" defaultValue={0} required>
            {Array.from({ length: 5 }, (_, i) => (
              <RatingItem key={i} />
            ))}
          </Rating>
        </div>
        <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">
          Submit
        </button>
        {submitted !== null && <p className="text-sm text-muted-foreground">Submitted rating: {submitted}</p>}
      </form>
    )
  },
}
