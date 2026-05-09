import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import {
  Tour,
  TourArrow,
  TourClose,
  TourDescription,
  TourHeader,
  TourPortal,
  TourSpotlight,
  TourSpotlightRing,
  TourStep,
  TourTitle,
  tourAlignments,
  tourSides,
} from '@/elements/tour'

const meta: Meta<typeof Tour> = {
  title: 'Elements/Tour',
  component: Tour,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sideOffset: { control: 'number' },
    spotlightPadding: { control: 'number' },
    dismissible: { control: 'boolean' },
    modal: { control: 'boolean' },
    showSkip: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof Tour>

function TourDemo({
  defaultOpen = false,
  sideOffset = 16,
  spotlightPadding = 6,
  dismissible = true,
  modal = true,
  showSkip = false,
}: {
  defaultOpen?: boolean
  sideOffset?: number
  spotlightPadding?: number
  dismissible?: boolean
  modal?: boolean
  showSkip?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div className="min-h-[520px] bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 id="tour-overview-title" className="font-semibold text-2xl">
              Operations Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">Review fulfillment health and team activity.</p>
          </div>
          <Button id="tour-start-button" onClick={() => setOpen(true)}>
            Start Tour
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section id="tour-card-orders" className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="text-muted-foreground text-sm">Orders</div>
            <div className="mt-2 font-semibold text-3xl">1,284</div>
            <p className="mt-2 text-muted-foreground text-sm">Live order intake across connected stores.</p>
          </section>
          <section id="tour-card-risk" className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="text-muted-foreground text-sm">Risk Queue</div>
            <div className="mt-2 font-semibold text-3xl">18</div>
            <p className="mt-2 text-muted-foreground text-sm">Verification holds that need operator review.</p>
          </section>
          <section id="tour-card-team" className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="text-muted-foreground text-sm">Team</div>
            <div className="mt-2 font-semibold text-3xl">42</div>
            <p className="mt-2 text-muted-foreground text-sm">Active teammates across warehouse shifts.</p>
          </section>
        </div>
      </div>

      <Tour
        open={open}
        onOpenChange={setOpen}
        sideOffset={sideOffset}
        spotlightPadding={spotlightPadding}
        dismissible={dismissible}
        modal={modal}
        showSkip={showSkip}
      >
        <TourPortal>
          <TourSpotlight />
          <TourSpotlightRing className="rounded-lg" />
          <TourStep target="#tour-overview-title" side="bottom" align="start">
            <TourHeader>
              <TourTitle>Dashboard context</TourTitle>
              <TourDescription>
                The tour starts with the page title so operators know which workflow is being introduced.
              </TourDescription>
            </TourHeader>
            <TourClose />
          </TourStep>
          <TourStep target="#tour-card-orders" side="top" align="center">
            <TourArrow />
            <TourHeader>
              <TourTitle>Order intake</TourTitle>
              <TourDescription>Highlight key metrics that operators scan repeatedly during a shift.</TourDescription>
            </TourHeader>
            <TourClose />
          </TourStep>
          <TourStep target="#tour-card-risk" side="top" align="center" required>
            <TourArrow />
            <TourHeader>
              <TourTitle>Required review</TourTitle>
              <TourDescription>
                Required steps keep completion controls unavailable until the operator advances.
              </TourDescription>
            </TourHeader>
            <TourClose />
          </TourStep>
          <TourStep target="#tour-card-team" side="top" align="end">
            <TourArrow />
            <TourHeader>
              <TourTitle>Team coverage</TourTitle>
              <TourDescription>
                Finish on the people or resource panel for the current operational view.
              </TourDescription>
            </TourHeader>
            <TourClose />
          </TourStep>
        </TourPortal>
      </Tour>
    </div>
  )
}

export const Default: Story = {
  render: args => <TourDemo {...args} />,
  args: {
    sideOffset: 16,
    spotlightPadding: 6,
    dismissible: true,
    modal: true,
    showSkip: false,
  },
}

export const Open: Story = {
  render: args => <TourDemo {...args} defaultOpen />,
  args: {
    sideOffset: 16,
    spotlightPadding: 8,
    dismissible: true,
    modal: true,
    showSkip: false,
  },
}

export const Placements: Story = {
  render: () => (
    <div className="min-h-[520px] bg-background p-8 text-foreground">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8">
        {tourSides.map((side, index) => (
          <div
            key={side}
            id={`tour-placement-${side}`}
            className="flex h-28 items-center justify-center rounded-lg border bg-card text-sm shadow-sm"
          >
            {side}
            <Tour open modal={false}>
              <TourPortal>
                <TourStep
                  target={`#tour-placement-${side}`}
                  side={side}
                  align={tourAlignments[index % tourAlignments.length]}
                >
                  <TourArrow />
                  <TourHeader>
                    <TourTitle>{side}</TourTitle>
                    <TourDescription>Placement uses Floating UI side and align values.</TourDescription>
                  </TourHeader>
                </TourStep>
              </TourPortal>
            </Tour>
          </div>
        ))}
      </div>
    </div>
  ),
}
