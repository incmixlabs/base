import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Button } from '@/elements/button/Button'
import { InputOTP, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from './InputOTP'
import { Label } from './Label'

const meta: Meta<typeof InputOTP> = {
  title: 'Form/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    maxLength: {
      control: { type: 'number', min: 4, max: 8 },
    },
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'minimal'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof InputOTP>

// Basic numeric OTP
export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>Enter verification code</Label>
        <InputOTP {...args} value={value} onChange={setValue} />
        <p className="text-sm text-muted-foreground">Value: {value || '(empty)'}</p>
      </div>
    )
  },
}

// 4-digit OTP
export const FourDigits: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>4-digit PIN</Label>
        <InputOTP maxLength={4} value={value} onChange={setValue} />
      </div>
    )
  },
}

// 6-digit OTP (default)
export const SixDigits: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>6-digit code</Label>
        <InputOTP maxLength={6} value={value} onChange={setValue} />
      </div>
    )
  },
}

// 8-digit OTP
export const EightDigits: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>8-digit code</Label>
        <InputOTP maxLength={8} value={value} onChange={setValue} />
      </div>
    )
  },
}

// Alphanumeric
export const Alphanumeric: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>Alphanumeric code</Label>
        <InputOTP
          maxLength={6}
          value={value}
          onChange={setValue}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          inputMode="text"
        />
        <p className="text-xs text-muted-foreground">Letters and numbers allowed</p>
      </div>
    )
  },
}

// Letters only
export const LettersOnly: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>Letter code</Label>
        <InputOTP maxLength={4} value={value} onChange={setValue} pattern={REGEXP_ONLY_CHARS} inputMode="text" />
        <p className="text-xs text-muted-foreground">Letters only (A-Z)</p>
      </div>
    )
  },
}

// Variants
export const Variants: Story = {
  render: () => {
    const [v1, setV1] = useState('')
    const [v2, setV2] = useState('')
    const [v3, setV3] = useState('')

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Outline (default)</Label>
          <InputOTP variant="outline" value={v1} onChange={setV1} />
        </div>
        <div className="space-y-2">
          <Label>Filled</Label>
          <InputOTP variant="filled" value={v2} onChange={setV2} />
        </div>
        <div className="space-y-2">
          <Label>Minimal</Label>
          <InputOTP variant="minimal" value={v3} onChange={setV3} />
        </div>
      </div>
    )
  },
}

// Grouped with separator
export const Grouped: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>Grouped code (3-3)</Label>
        <InputOTP maxLength={6} value={value} onChange={setValue} groups={[3, 3]} />
      </div>
    )
  },
}

// Grouped 4 digits
export const GroupedFour: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>Grouped code (2-2)</Label>
        <InputOTP maxLength={4} value={value} onChange={setValue} groups={[2, 2]} />
      </div>
    )
  },
}

// Grouped with custom separator
export const CustomSeparator: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="space-y-2">
        <Label>Custom separator</Label>
        <InputOTP
          maxLength={6}
          value={value}
          onChange={setValue}
          groups={[3, 3]}
          separator={<span className="text-muted-foreground px-2">/</span>}
        />
      </div>
    )
  },
}

// With error state
export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('123')
    return (
      <div className="space-y-2">
        <Label>Verification code</Label>
        <InputOTP value={value} onChange={setValue} error />
        <p className="text-sm text-destructive">Invalid code. Please try again.</p>
      </div>
    )
  },
}

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Verification code</Label>
      <InputOTP value="123456" disabled />
    </div>
  ),
}

// With completion callback
export const WithCompletion: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [completed, setCompleted] = useState(false)

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Enter 6-digit code</Label>
          <InputOTP
            value={value}
            onChange={v => {
              setValue(v)
              setCompleted(false)
            }}
            onComplete={() => setCompleted(true)}
          />
        </div>
        {completed && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm">
            Code complete! Verifying...
          </div>
        )}
      </div>
    )
  },
}

// With resend timer
export const WithResendTimer: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [timer, setTimer] = useState(30)
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer(t => t - 1)
        }, 1000)
        return () => clearInterval(interval)
      } else {
        setCanResend(true)
      }
    }, [timer])

    const handleResend = () => {
      setTimer(30)
      setCanResend(false)
      setValue('')
    }

    return (
      <div className="space-y-4 w-80">
        <div className="space-y-2">
          <Label>Verification code</Label>
          <InputOTP value={value} onChange={setValue} />
        </div>
        <div className="flex items-center justify-between text-sm">
          {canResend ? (
            <Button variant="ghost" size="sm" onClick={handleResend}>
              Resend code
            </Button>
          ) : (
            <span className="text-muted-foreground">Resend code in {timer}s</span>
          )}
        </div>
      </div>
    )
  },
}

// Verification form example
export const VerificationForm: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleComplete = () => {
      setStatus('loading')
      // Simulate API call
      setTimeout(() => {
        if (value === '123456') {
          setStatus('success')
        } else {
          setStatus('error')
        }
      }, 1500)
    }

    const handleChange = (v: string) => {
      setValue(v)
      if (status === 'error') {
        setStatus('idle')
      }
    }

    return (
      <div className="w-80 space-y-6 p-6 border rounded-lg">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">Verify your email</h3>
          <p className="text-sm text-muted-foreground">We sent a code to your email address</p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            value={value}
            onChange={handleChange}
            onComplete={handleComplete}
            error={status === 'error'}
            disabled={status === 'loading' || status === 'success'}
          />
        </div>

        {status === 'error' && <p className="text-sm text-destructive text-center">Invalid code. Try 123456.</p>}

        {status === 'success' && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm text-center">
            Email verified successfully!
          </div>
        )}

        {status === 'loading' && <p className="text-sm text-muted-foreground text-center">Verifying...</p>}

        <div className="text-center">
          <Button variant="ghost" size="sm" disabled={status === 'loading' || status === 'success'}>
            Resend code
          </Button>
        </div>
      </div>
    )
  },
}

// All patterns showcase
export const PatternShowcase: Story = {
  render: () => {
    const [digits, setDigits] = useState('')
    const [chars, setChars] = useState('')
    const [alphanumeric, setAlphanumeric] = useState('')

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>
            Digits only <code className="text-xs bg-muted px-1 rounded">REGEXP_ONLY_DIGITS</code>
          </Label>
          <InputOTP
            maxLength={4}
            value={digits}
            onChange={setDigits}
            pattern={REGEXP_ONLY_DIGITS}
            inputMode="numeric"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Letters only <code className="text-xs bg-muted px-1 rounded">REGEXP_ONLY_CHARS</code>
          </Label>
          <InputOTP maxLength={4} value={chars} onChange={setChars} pattern={REGEXP_ONLY_CHARS} inputMode="text" />
        </div>
        <div className="space-y-2">
          <Label>
            Alphanumeric <code className="text-xs bg-muted px-1 rounded">REGEXP_ONLY_DIGITS_AND_CHARS</code>
          </Label>
          <InputOTP
            maxLength={4}
            value={alphanumeric}
            onChange={setAlphanumeric}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            inputMode="text"
          />
        </div>
      </div>
    )
  },
}
