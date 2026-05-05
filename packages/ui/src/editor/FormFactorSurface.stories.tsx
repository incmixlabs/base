import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Grid } from '@/layouts'
import { getPropDefValues } from '@/theme/props/prop-def'
import { formFactorSurfacePropDefs } from './form-factor-surface.props'
import { FormFactorSurface } from './FormFactorSurface'

const meta: Meta<typeof FormFactorSurface> = {
  title: 'Editor/FormFactorSurface',
  component: FormFactorSurface,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    formFactor: {
      control: { type: 'select' },
      options: getPropDefValues(formFactorSurfacePropDefs.formFactor),
    },
    showGridInside: {
      control: { type: 'boolean' },
    },
    showOutlineInside: {
      control: { type: 'boolean' },
    },
  },
  args: {
    formFactor: 'desktop',
    showGridInside: true,
    showOutlineInside: false,
  },
}

export default meta
type Story = StoryObj<typeof FormFactorSurface>

function SurfaceForm() {
  const id = React.useId()
  const fullNameId = `${id}-full-name`
  const emailId = `${id}-email`
  const notesId = `${id}-notes`

  return (
    <form className="mx-auto max-w-2xl space-y-5 p-6 md:p-8">
      <h2 className="text-2xl font-semibold">Customer Profile</h2>
      <div className="space-y-2">
        <label htmlFor={fullNameId} className="text-sm font-medium">
          Full name
        </label>
        <input id={fullNameId} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Full name" />
      </div>
      <div className="space-y-2">
        <label htmlFor={emailId} className="text-sm font-medium">
          Email
        </label>
        <input id={emailId} className="w-full rounded-md border bg-background px-3 py-2" placeholder="Email" />
      </div>
      <div className="space-y-2">
        <label htmlFor={notesId} className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id={notesId}
          className="min-h-28 w-full rounded-md border bg-background px-3 py-2"
          placeholder="Notes"
        />
      </div>
      <button type="button" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
        Continue
      </button>
    </form>
  )
}

export const Desktop: Story = {
  args: { formFactor: 'desktop' },
  render: args => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <FormFactorSurface {...args} showGridInside>
        <SurfaceForm />
      </FormFactorSurface>
    </div>
  ),
}

export const Laptop: Story = {
  args: { formFactor: 'laptop' },
  render: args => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <FormFactorSurface {...args} showGridInside>
        <SurfaceForm />
      </FormFactorSurface>
    </div>
  ),
}

export const Phone: Story = {
  args: { formFactor: 'phone' },
  render: args => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <FormFactorSurface {...args} showGridInside>
        <SurfaceForm />
      </FormFactorSurface>
    </div>
  ),
}

export const Gallery: Story = {
  render: () => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <Grid columns={{ initial: '1', md: '2', xl: '4' }} gap="6" className="mx-auto max-w-[1920px] items-start">
        <FormFactorSurface formFactor="phone-small" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
        <FormFactorSurface formFactor="phone" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
        <FormFactorSurface formFactor="phone-large" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
        <FormFactorSurface formFactor="tablet-portrait" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
        <FormFactorSurface formFactor="tablet-landscape" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
        <FormFactorSurface formFactor="laptop" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
        <FormFactorSurface formFactor="desktop" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
        <FormFactorSurface formFactor="desktop-wide" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
        <FormFactorSurface formFactor="tv" showGridInside>
          <SurfaceForm />
        </FormFactorSurface>
      </Grid>
    </div>
  ),
}

export const GridAndOutline: Story = {
  args: {
    formFactor: 'desktop',
    showGridInside: true,
    showOutlineInside: true,
    outlineProps: {
      lineWidth: 1,
    },
  },
  render: args => (
    <div className="min-h-screen w-full bg-background p-6 md:p-10">
      <FormFactorSurface {...args}>
        <SurfaceForm />
      </FormFactorSurface>
    </div>
  ),
}
