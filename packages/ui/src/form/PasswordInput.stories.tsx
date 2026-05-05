import type { Meta, StoryObj } from '@storybook/react-vite'
import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Label } from './Label'
import { PasswordInput } from './PasswordInput'

const meta: Meta<typeof PasswordInput> = {
  title: 'Form/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'],
    },
  },
}

export default meta
type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
  render: args => (
    <div className="w-80">
      <PasswordInput {...args} placeholder="Enter password" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="password">Password</Label>
      <PasswordInput id="password" placeholder="Enter password" />
    </div>
  ),
}

export const WithStrengthIndicator: Story = {
  render: () => {
    const [password, setPassword] = useState('')

    return (
      <div className="w-80 space-y-2">
        <Label htmlFor="strong-password">Create Password</Label>
        <PasswordInput
          id="strong-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter a strong password"
          showStrength
        />
        <ul className="text-xs text-muted-foreground space-y-1 mt-2">
          <li className={password.length >= 8 ? 'text-green-600' : ''}>
            {password.length >= 8 ? '✓' : '○'} At least 8 characters
          </li>
          <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-green-600' : ''}>
            {/[A-Z]/.test(password) && /[a-z]/.test(password) ? '✓' : '○'} Upper & lowercase letters
          </li>
          <li className={/\d/.test(password) ? 'text-green-600' : ''}>
            {/\d/.test(password) ? '✓' : '○'} At least one number
          </li>
          <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : ''}>
            {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} Special character
          </li>
        </ul>
      </div>
    )
  },
}

export const WithLeftIcon: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="icon-password">Password</Label>
      <PasswordInput id="icon-password" leftIcon={<Lock />} placeholder="Enter password" />
    </div>
  ),
}

export const CustomStrengthCalculator: Story = {
  render: () => {
    // Custom calculator that requires specific patterns
    const customCalculator = (password: string): number => {
      if (!password) return 0
      if (password.length < 6) return 1
      if (password.length < 10) return 2
      if (password.length < 14) return 3
      return 4
    }

    return (
      <div className="w-80 space-y-2">
        <Label htmlFor="custom-strength">Password (length-based strength)</Label>
        <PasswordInput
          id="custom-strength"
          placeholder="Enter password"
          showStrength
          strengthCalculator={customCalculator}
        />
        <p className="text-xs text-muted-foreground">Strength is based on password length only</p>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="space-y-2">
          <Label>Size {size}</Label>
          <PasswordInput size={size} placeholder="Password" />
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      {(['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] as const).map(variant => (
        <div key={variant} className="space-y-2">
          <Label className="capitalize">{variant}</Label>
          <PasswordInput variant={variant} placeholder="Password" />
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Disabled</Label>
      <PasswordInput disabled value="secretpassword" />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>With Error</Label>
      <PasswordInput error placeholder="Password" />
      <p className="text-xs text-destructive">Password is required</p>
    </div>
  ),
}

export const LoginForm: Story = {
  render: () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
      <div className="w-96 p-6 border rounded-lg space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <PasswordInput
              id="login-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        </div>

        <button type="button" className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium">
          Sign In
        </button>
      </div>
    )
  },
}

export const SignupForm: Story = {
  render: () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const passwordsMatch = password === confirmPassword && password.length > 0

    return (
      <div className="w-96 p-6 border rounded-lg space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Create account</h2>
          <p className="text-sm text-muted-foreground">Enter your details below</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Password</Label>
            <PasswordInput
              id="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              showStrength
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              error={confirmPassword.length > 0 && !passwordsMatch}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-destructive">Passwords don't match</p>
            )}
          </div>
        </div>

        <button
          type="button"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
          disabled={!passwordsMatch}
        >
          Create Account
        </button>
      </div>
    )
  },
}
