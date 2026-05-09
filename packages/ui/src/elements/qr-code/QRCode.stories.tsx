import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/elements'
import { QRCode, qrCodeLevels } from '@/elements/qr-code'

const meta: Meta<typeof QRCode> = {
  title: 'Elements/QRCode',
  component: QRCode,
  args: {
    value: 'https://incmix.com/verify/INV-2048',
    width: 180,
    height: 180,
    level: 'M',
    margin: 1,
    radius: 'md',
    color: 'neutral',
    backgroundColor: '#ffffff',
  },
  argTypes: {
    level: {
      control: 'select',
      options: qrCodeLevels,
    },
    color: {
      control: 'select',
      options: ['slate', 'primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'],
    },
  },
}

export default meta

type Story = StoryObj<typeof QRCode>

export const Canvas: Story = {
  render: args => (
    <QRCode {...args}>
      <QRCode.Skeleton />
      <QRCode.Canvas />
    </QRCode>
  ),
}

export const Svg: Story = {
  render: args => (
    <QRCode {...args}>
      <QRCode.Skeleton />
      <QRCode.Svg />
    </QRCode>
  ),
}

export const WithOverlay: Story = {
  args: {
    level: 'H',
  },
  render: args => (
    <QRCode {...args} className="rounded-lg border bg-background p-4">
      <QRCode.Skeleton />
      <QRCode.Canvas />
      <QRCode.Overlay className="h-10 w-10 border font-semibold text-xs">ID</QRCode.Overlay>
    </QRCode>
  ),
}

export const Download: Story = {
  render: args => (
    <QRCode {...args}>
      <QRCode.Skeleton />
      <QRCode.Image />
      <div className="flex gap-2">
        <QRCode.Download>Download PNG</QRCode.Download>
        <QRCode.Download format="svg">Download SVG</QRCode.Download>
      </div>
    </QRCode>
  ),
}

export const DownloadButton: Story = {
  render: args => (
    <QRCode {...args}>
      <QRCode.Skeleton />
      <QRCode.Image />
      <Button asChild variant="outline" size="sm">
        <QRCode.Download>Download PNG</QRCode.Download>
      </Button>
    </QRCode>
  ),
}
