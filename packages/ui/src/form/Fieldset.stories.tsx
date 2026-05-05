import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldGroup } from './FieldGroup'
import { Fieldset } from './Fieldset'
import { TextField } from './TextField'

const meta: Meta<typeof Fieldset> = {
  title: 'Form/Fieldset',
  component: Fieldset,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Fieldset legend="Traveler information" description="Grouped fields rendered inside a semantic fieldset.">
        <FieldGroup layout="grid" columns="2" gap="4">
          <TextField label="Full name" placeholder="Traveler full name" />
          <TextField label="Email address" type="email" placeholder="name@example.com" />
          <TextField label="Passport number" placeholder="Optional passport number" />
          <TextField label="Loyalty program" placeholder="Airline or hotel program" />
        </FieldGroup>
      </Fieldset>
    </div>
  ),
}
