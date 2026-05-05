import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@/form'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { Textarea } from './Textarea'
import { textFieldSizes } from './text-field.props'

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: [...textFieldSizes],
    },
    variant: {
      control: 'select',
      options: [
        'classic',
        'solid',
        'soft',
        'surface',
        'outline',
        'ghost',
        'floating-filled',
        'floating-standard',
        'floating-outlined',
      ],
    },
    radius: {
      control: 'select',
      options: getPropDefValues(radiusPropDef.radius),
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    autoSize: {
      control: 'boolean',
    },
    minRows: {
      control: 'number',
    },
    maxRows: {
      control: 'number',
    },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: args => (
    <div className="w-80">
      <Textarea {...args} placeholder="Enter your message..." />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {textFieldSizes.map(size => (
        <div key={size}>
          <p className="text-sm text-muted-foreground mb-2">{size}</p>
          <Textarea size={size} placeholder={`${size} textarea`} />
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {(['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] as const).map(variant => (
        <div key={variant}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{variant}</p>
          <Textarea variant={variant} placeholder={`${variant} variant`} />
        </div>
      ))}
    </div>
  ),
}

export const Resize: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {(['none', 'vertical', 'horizontal', 'both'] as const).map(resize => (
        <div key={resize}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">Resize: {resize}</p>
          <Textarea resize={resize} placeholder={`Resize ${resize}`} />
        </div>
      ))}
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Textarea error placeholder="Enter description..." />
      <p className="text-sm text-destructive">Description is required</p>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Textarea disabled placeholder="This textarea is disabled" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" placeholder="Enter a detailed description..." rows={4} />
      <p className="text-xs text-muted-foreground">Provide a detailed description of your issue.</p>
    </div>
  ),
}

export const CharacterCount: Story = {
  render: () => {
    const maxLength = 200
    return (
      <div className="w-80 space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" placeholder="Tell us about yourself..." maxLength={maxLength} rows={3} />
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground">0 / {maxLength}</span>
        </div>
      </div>
    )
  },
}

export const ContactForm: Story = {
  render: () => (
    <div className="w-96 space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Contact Us</h3>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <input
          id="subject"
          type="text"
          placeholder="What's this about?"
          className="w-full px-3 py-2 text-sm border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="How can we help you?" rows={5} resize="none" />
      </div>
      <button className="w-full py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">
        Send Message
      </button>
    </div>
  ),
}

export const CodeInput: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Label htmlFor="json-config">JSON Configuration</Label>
      <Textarea id="json-config" className="font-mono" placeholder='{"key": "value"}' rows={8} resize="vertical" />
    </div>
  ),
}

// ============================================================================
// Floating Variants
// ============================================================================

export const FloatingFilled: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Textarea variant="floating-filled" label="Message" />
      <Textarea variant="floating-filled" label="Description" rows={4} />
      <Textarea variant="floating-filled" placeholder="Uses placeholder as label" />
    </div>
  ),
}

export const FloatingStandard: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Textarea variant="floating-standard" label="Message" />
      <Textarea variant="floating-standard" label="Description" rows={4} />
      <Textarea variant="floating-standard" placeholder="Uses placeholder as label" />
    </div>
  ),
}

export const FloatingOutlined: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Textarea variant="floating-outlined" label="Message" />
      <Textarea variant="floating-outlined" label="Description" rows={4} />
      <Textarea variant="floating-outlined" placeholder="Uses placeholder as label" />
    </div>
  ),
}

export const FloatingVariantsComparison: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">Floating Filled</p>
        <Textarea variant="floating-filled" label="Your message" rows={3} />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Floating Standard</p>
        <Textarea variant="floating-standard" label="Your message" rows={3} />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Floating Outlined</p>
        <Textarea variant="floating-outlined" label="Your message" rows={3} />
      </div>
    </div>
  ),
}

export const FloatingWithError: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <Textarea variant="floating-filled" label="Description" error />
        <p className="text-sm text-red-500 mt-1">Description is required</p>
      </div>
      <div>
        <Textarea variant="floating-outlined" label="Bio" error />
        <p className="text-sm text-red-500 mt-1">Bio must be at least 50 characters</p>
      </div>
    </div>
  ),
}

export const FloatingDisabled: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Textarea variant="floating-filled" label="Disabled filled" disabled />
      <Textarea variant="floating-standard" label="Disabled standard" disabled />
      <Textarea variant="floating-outlined" label="Disabled outlined" disabled />
    </div>
  ),
}

export const FloatingSizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {textFieldSizes.map(size => (
        <div key={size}>
          <p className="text-sm text-muted-foreground mb-2">{size}</p>
          <Textarea variant="floating-outlined" size={size} label={`${size} textarea`} />
        </div>
      ))}
    </div>
  ),
}

export const FloatingFeedbackForm: Story = {
  render: () => (
    <div className="w-96 space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Send Feedback</h3>
      <Textarea variant="floating-outlined" label="Subject" rows={1} />
      <Textarea variant="floating-outlined" label="Your feedback" rows={5} />
      <button className="w-full py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">
        Submit Feedback
      </button>
    </div>
  ),
}

// ============================================================================
// AutoSize Variants
// ============================================================================

export const AutoSize: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="auto-message">Auto-sizing textarea</Label>
      <Textarea id="auto-message" autoSize placeholder="Type here and watch the textarea grow..." />
      <p className="text-xs text-muted-foreground">The textarea will automatically expand as you type more content.</p>
    </div>
  ),
}

export const AutoSizeWithMinMax: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="min-max">Min 2 rows, Max 6 rows</Label>
        <Textarea
          id="min-max"
          autoSize
          minRows={2}
          maxRows={6}
          placeholder="This textarea has min/max row constraints..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="min-only">Min 3 rows (no max)</Label>
        <Textarea id="min-only" autoSize minRows={3} placeholder="Starts with 3 rows, grows indefinitely..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max-only">Max 4 rows</Label>
        <Textarea id="max-only" autoSize maxRows={4} placeholder="Grows up to 4 rows, then scrolls..." />
      </div>
    </div>
  ),
}

export const AutoSizeVariants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {(['classic', 'surface', 'outline', 'soft'] as const).map(variant => (
        <div key={variant}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{variant} (autoSize)</p>
          <Textarea variant={variant} autoSize minRows={1} placeholder={`Auto-sizing ${variant} variant`} />
        </div>
      ))}
    </div>
  ),
}

export const AutoSizeFloating: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">Floating Filled (autoSize)</p>
        <Textarea variant="floating-filled" autoSize minRows={1} maxRows={5} label="Your message" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Floating Standard (autoSize)</p>
        <Textarea variant="floating-standard" autoSize minRows={1} maxRows={5} label="Your message" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Floating Outlined (autoSize)</p>
        <Textarea variant="floating-outlined" autoSize minRows={1} maxRows={5} label="Your message" />
      </div>
    </div>
  ),
}

export const AutoSizeChatInput: Story = {
  render: () => (
    <div className="w-96 border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold">Chat</h3>
      <div className="space-y-2 p-2 bg-muted/50 rounded">
        <p className="text-sm">Hello! How can I help you today?</p>
      </div>
      <div className="flex gap-2 items-end">
        <Textarea autoSize minRows={1} maxRows={4} placeholder="Type a message..." className="flex-1" />
        <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md shrink-0">
          Send
        </button>
      </div>
    </div>
  ),
}

export const AutoSizeCodeEditor: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label htmlFor="code-editor">Code snippet</Label>
      <Textarea
        id="code-editor"
        autoSize
        minRows={3}
        maxRows={20}
        className="font-mono text-sm"
        placeholder={'// Paste your code here\nfunction example() {\n  return "hello"\n}'}
      />
      <p className="text-xs text-muted-foreground">Supports syntax highlighting in the real implementation.</p>
    </div>
  ),
}
