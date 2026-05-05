import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Label } from './Label'
import { SignatureInput } from './SignatureInput'

const meta: Meta<typeof SignatureInput> = {
  title: 'Form/SignatureInput',
  component: SignatureInput,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof SignatureInput>

export const Default: Story = {
  render: args => (
    <div>
      <SignatureInput {...args} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Signature</Label>
      <SignatureInput />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [signature, setSignature] = useState<string | undefined>()

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Your Signature</Label>
          <SignatureInput value={signature} onChange={setSignature} />
        </div>
        <div className="p-3 bg-muted rounded-md text-sm">
          <strong>Signature status:</strong> {signature ? 'Signed' : 'Empty'}
        </div>
        {signature && (
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground mb-2">Preview:</p>
            <img src={signature} alt="Signature preview" className="max-w-full h-auto" />
          </div>
        )}
      </div>
    )
  },
}

export const CustomSize: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Small (300x100)</Label>
        <SignatureInput width={300} height={100} />
      </div>
      <div className="space-y-2">
        <Label>Large (500x200)</Label>
        <SignatureInput width={500} height={200} />
      </div>
    </div>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Blue ink on white</Label>
        <SignatureInput strokeColor="#1e40af" backgroundColor="#ffffff" />
      </div>
      <div className="space-y-2">
        <Label>White on dark</Label>
        <SignatureInput strokeColor="#ffffff" backgroundColor="#1f2937" />
      </div>
      <div className="space-y-2">
        <Label>Red ink</Label>
        <SignatureInput strokeColor="#dc2626" />
      </div>
    </div>
  ),
}

export const CustomStrokeWidth: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Thin stroke (1px)</Label>
        <SignatureInput strokeWidth={1} />
      </div>
      <div className="space-y-2">
        <Label>Medium stroke (3px)</Label>
        <SignatureInput strokeWidth={3} />
      </div>
      <div className="space-y-2">
        <Label>Thick stroke (5px)</Label>
        <SignatureInput strokeWidth={5} />
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      {(['outline', 'soft', 'surface'] as const).map(variant => (
        <div key={variant} className="space-y-2">
          <Label className="capitalize">{variant}</Label>
          <SignatureInput variant={variant} />
        </div>
      ))}
    </div>
  ),
}

export const CustomPlaceholder: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Custom Placeholder</Label>
      <SignatureInput placeholder="Draw your signature above" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Disabled</Label>
      <SignatureInput disabled />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>With Error</Label>
      <SignatureInput error />
      <p className="text-xs text-destructive">Signature is required</p>
    </div>
  ),
}

export const ContractForm: Story = {
  render: () => {
    const [agreed, setAgreed] = useState(false)
    const [signature, setSignature] = useState<string | undefined>()

    return (
      <div className="w-[500px] p-6 border rounded-lg space-y-6">
        <h3 className="font-semibold text-lg">Terms Agreement</h3>

        <div className="p-4 bg-muted rounded-md text-sm max-h-40 overflow-y-auto">
          <p className="mb-2">By signing below, you agree to the following terms and conditions:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>You will comply with all applicable laws and regulations</li>
            <li>You will maintain confidentiality of all shared information</li>
            <li>You accept the pricing and payment terms as discussed</li>
            <li>This agreement is binding upon signature</li>
          </ul>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="agree" className="text-sm">
            I have read and agree to the terms and conditions above
          </label>
        </div>

        <div className="space-y-2">
          <Label>Signature *</Label>
          <SignatureInput value={signature} onChange={setSignature} error={!signature && agreed} width={468} />
          {!signature && agreed && <p className="text-xs text-destructive">Please sign above</p>}
        </div>

        <div className="flex gap-3">
          <button type="button" className="flex-1 py-2 px-4 border rounded-md font-medium hover:bg-muted">
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
            disabled={!agreed || !signature}
          >
            Submit Agreement
          </button>
        </div>
      </div>
    )
  },
}
