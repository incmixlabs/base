import type { Meta, StoryObj } from '@storybook/react-vite'
import { Barcode, type BarcodeFormat, barcodeFormats } from '@/elements'

const meta: Meta<typeof Barcode> = {
  title: 'Elements/Barcode',
  component: Barcode,
  args: {
    value: 'SKU-128-2048',
    format: 'CODE128',
    height: 96,
    width: 2,
    margin: 10,
    displayValue: true,
    color: 'slate',
    backgroundColor: '#ffffff',
  },
  argTypes: {
    format: {
      control: 'select',
      options: barcodeFormats,
    },
    color: {
      control: 'select',
      options: ['slate', 'primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Barcode>

export const Default: Story = {}

export const ProductFormats: Story = {
  render: args => {
    const samples: Array<{ format: BarcodeFormat; value: string }> = [
      { format: 'CODE128', value: 'SKU-128-2048' },
      { format: 'EAN13', value: '1234567890128' },
      { format: 'UPC', value: '123456789012' },
      { format: 'CODE39', value: 'CODE39' },
    ]

    return (
      <div className="grid gap-4">
        {samples.map(sample => (
          <div key={sample.format} className="rounded-md border bg-background p-4">
            <div className="mb-3 font-medium text-sm">{sample.format}</div>
            <Barcode {...args} format={sample.format} value={sample.value} />
          </div>
        ))}
      </div>
    )
  },
}

export const CompactCell: Story = {
  args: {
    value: 'INV-2048',
    height: 44,
    width: 1,
    margin: 4,
    displayValue: false,
  },
}
