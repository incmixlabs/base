import type { Meta, StoryObj } from '@storybook/react-vite'
import { Grid } from '@/layouts'
import { getPropDefValues } from '@/theme/props/prop-def'
import { DeviceOverlay } from './DeviceOverlay'
import { deviceOverlayPropDefs } from './device-overlay.props'

const meta: Meta<typeof DeviceOverlay> = {
  title: 'Editor/DeviceOverlay',
  component: DeviceOverlay,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    device: {
      control: { type: 'select' },
      options: getPropDefValues(deviceOverlayPropDefs.device),
    },
    showGridInside: {
      control: { type: 'boolean' },
    },
  },
  args: {
    device: 'desktop',
    showGridInside: true,
  },
}

export default meta
type Story = StoryObj<typeof DeviceOverlay>

function DemoForm() {
  return (
    <form className="mx-auto max-w-2xl space-y-5 p-6">
      <h2 className="text-2xl font-semibold">Project Intake</h2>
      <div className="space-y-2">
        <label htmlFor="project-name" className="text-sm font-medium">
          Project name
        </label>
        <input
          id="project-name"
          className="w-full rounded-md border bg-background px-3 py-2"
          placeholder="Landing page redesign"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="owner" className="text-sm font-medium">
          Owner
        </label>
        <input id="owner" className="w-full rounded-md border bg-background px-3 py-2" placeholder="Alex Rivera" />
      </div>
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          className="min-h-28 w-full rounded-md border bg-background px-3 py-2"
          placeholder="Scope, risks, and milestones"
        />
      </div>
      <button type="button" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
        Save draft
      </button>
    </form>
  )
}

export const Desktop: Story = {
  args: {
    device: 'desktop',
  },
  render: args => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <DeviceOverlay {...args} showGridInside>
        <DemoForm />
      </DeviceOverlay>
    </div>
  ),
}

export const Laptop: Story = {
  args: {
    device: 'laptop',
  },
  render: args => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <DeviceOverlay {...args} showGridInside>
        <DemoForm />
      </DeviceOverlay>
    </div>
  ),
}

export const Phone: Story = {
  args: {
    device: 'phone',
  },
  render: args => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <DeviceOverlay {...args} showGridInside>
        <DemoForm />
      </DeviceOverlay>
    </div>
  ),
}

export const Gallery: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <Grid columns={{ initial: '1', md: '2', xl: '4' }} gap="6" className="mx-auto max-w-[1920px] items-start">
        <DeviceOverlay device="phone-small" showGridInside>
          <DemoForm />
        </DeviceOverlay>
        <DeviceOverlay device="phone" showGridInside>
          <DemoForm />
        </DeviceOverlay>
        <DeviceOverlay device="phone-large" showGridInside>
          <DemoForm />
        </DeviceOverlay>
        <DeviceOverlay device="tablet-portrait" showGridInside>
          <DemoForm />
        </DeviceOverlay>
        <DeviceOverlay device="tablet-landscape" showGridInside>
          <DemoForm />
        </DeviceOverlay>
        <DeviceOverlay device="laptop" showGridInside>
          <DemoForm />
        </DeviceOverlay>
        <DeviceOverlay device="desktop" showGridInside>
          <DemoForm />
        </DeviceOverlay>
        <DeviceOverlay device="desktop-wide" showGridInside>
          <DemoForm />
        </DeviceOverlay>
        <DeviceOverlay device="tv" showGridInside>
          <DemoForm />
        </DeviceOverlay>
      </Grid>
    </div>
  ),
}
