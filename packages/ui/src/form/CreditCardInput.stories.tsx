import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CreditCardInput, type CreditCardValue } from './CreditCardInput'
import { Label } from './Label'

const meta: Meta<typeof CreditCardInput> = {
  title: 'Form/CreditCardInput',
  component: CreditCardInput,
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
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    showName: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof CreditCardInput>

export const Default: Story = {
  render: args => (
    <div className="w-80">
      <CreditCardInput {...args} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Payment Details</Label>
      <CreditCardInput />
    </div>
  ),
}

export const WithCardholderName: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Card Information</Label>
      <CreditCardInput showName />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [card, setCard] = useState<CreditCardValue>({
      number: '',
      rawNumber: '',
      expiry: '',
      cvv: '',
      name: '',
      cardType: 'unknown',
      isValid: false,
    })

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <Label>Payment Card</Label>
          <CreditCardInput value={card} onChange={setCard} showName />
        </div>
        <div className="p-3 bg-muted rounded-md text-sm space-y-1">
          <p>
            <strong>Card Type:</strong> {card.cardType}
          </p>
          <p>
            <strong>Number:</strong> {card.number || '-'}
          </p>
          <p>
            <strong>Expiry:</strong> {card.expiry || '-'}
          </p>
          <p>
            <strong>CVV:</strong> {'*'.repeat(card.cvv.length) || '-'}
          </p>
          <p>
            <strong>Name:</strong> {card.name || '-'}
          </p>
          <p>
            <strong>Valid:</strong> {card.isValid ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    )
  },
}

export const CardTypeDetection: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <p className="text-sm text-muted-foreground">Try these prefixes to see card type detection:</p>
      <ul className="text-xs text-muted-foreground space-y-1">
        <li>
          <strong>4</strong> - Visa
        </li>
        <li>
          <strong>51-55</strong> - Mastercard
        </li>
        <li>
          <strong>34 or 37</strong> - American Express
        </li>
        <li>
          <strong>6011 or 65</strong> - Discover
        </li>
      </ul>
      <CreditCardInput />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="space-y-2">
          <Label>Size {size}</Label>
          <CreditCardInput size={size} />
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
          <CreditCardInput variant={variant} />
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Disabled</Label>
      <CreditCardInput
        disabled
        value={{
          number: '4242 4242 4242 4242',
          rawNumber: '4242424242424242',
          expiry: '12/25',
          cvv: '123',
          name: '',
          cardType: 'visa',
          isValid: true,
        }}
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>With Error</Label>
      <CreditCardInput error />
      <p className="text-xs text-destructive">Please enter valid card details</p>
    </div>
  ),
}

export const CustomPlaceholders: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Custom Placeholders</Label>
      <CreditCardInput
        numberPlaceholder="1234 5678 9012 3456"
        expiryPlaceholder="Expiry"
        cvvPlaceholder="Security Code"
        namePlaceholder="JOHN DOE"
        showName
      />
    </div>
  ),
}

export const CheckoutForm: Story = {
  render: () => {
    const [card, setCard] = useState<CreditCardValue>({
      number: '',
      rawNumber: '',
      expiry: '',
      cvv: '',
      name: '',
      cardType: 'unknown',
      isValid: false,
    })
    const [email, setEmail] = useState('')

    return (
      <div className="w-96 p-6 border rounded-lg space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Checkout</h3>
          <p className="text-sm text-muted-foreground">Complete your purchase</p>
        </div>

        <div className="p-4 bg-muted rounded-md">
          <div className="flex justify-between">
            <span>Premium Plan</span>
            <span className="font-semibold">$29.99/mo</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-email">Email</Label>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Card Details</Label>
            <CreditCardInput value={card} onChange={setCard} showName />
          </div>
        </div>

        <button
          type="button"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
          disabled={!card.isValid || !email}
        >
          Pay $29.99
        </button>

        <p className="text-xs text-center text-muted-foreground">Your payment is secured with 256-bit SSL encryption</p>
      </div>
    )
  },
}

export const ValidationExample: Story = {
  render: () => {
    const [card, setCard] = useState<CreditCardValue>({
      number: '',
      rawNumber: '',
      expiry: '',
      cvv: '',
      name: '',
      cardType: 'unknown',
      isValid: false,
    })

    const getValidationStatus = () => {
      const checks = []

      if (card.rawNumber.length > 0) {
        const isNumberValid = card.rawNumber.length >= 13 && card.rawNumber.length <= 16
        checks.push({ label: 'Card number (13-16 digits)', valid: isNumberValid })
      }

      if (card.expiry.length > 0) {
        const expiryMatch = card.expiry.match(/^(\d{2})\/(\d{2})$/)
        const isExpiryValid = expiryMatch && Number(expiryMatch[1]) >= 1 && Number(expiryMatch[1]) <= 12
        checks.push({ label: 'Valid expiry (MM/YY)', valid: Boolean(isExpiryValid) })
      }

      if (card.cvv.length > 0) {
        const cvvLength = card.cardType === 'amex' ? 4 : 3
        checks.push({ label: `CVV (${cvvLength} digits)`, valid: card.cvv.length === cvvLength })
      }

      return checks
    }

    const validationChecks = getValidationStatus()

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <Label>Card with Validation</Label>
          <CreditCardInput value={card} onChange={setCard} error={card.rawNumber.length > 0 && !card.isValid} />
        </div>

        {validationChecks.length > 0 && (
          <div className="p-3 bg-muted rounded-md text-sm space-y-1">
            {validationChecks.map((check, i) => (
              <p key={i} className={check.valid ? 'text-green-600' : 'text-muted-foreground'}>
                {check.valid ? '\u2713' : '\u25CB'} {check.label}
              </p>
            ))}
          </div>
        )}
      </div>
    )
  },
}
