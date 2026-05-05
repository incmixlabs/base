'use client'

import { badgeCatalogEntry, calloutCatalogEntry, spinnerCatalogEntry } from '@bwalkt/ui/editor/catalog'
import { Button, Toast } from '@bwalkt/ui/elements'
import { elementPropDefsByComponent, toastPropDefs } from '@bwalkt/ui/elements/props'
import { toastPropDefs as toastDocsPropDefs } from '@bwalkt/ui/props'
import { Bell, CheckCircle2, Info } from 'lucide-react'
import * as React from 'react'
import { autoProps, createAutogenEntry, type ElementDocsBaseEntry } from '../element-docs-types'

const badgeElementPropDefs = elementPropDefsByComponent.badge
const calloutElementPropDefs = elementPropDefsByComponent.callout
const spinnerElementPropDefs = elementPropDefsByComponent.spinner
const toastElementPropDefs = toastPropDefs

function createElementBaseEntry(config: {
  slug: string
  title: string
  description: string
  sourcePath: string
  overviewCode: string
  propDefs: ElementDocsBaseEntry['propDefs']
  runtimeScope: ElementDocsBaseEntry['runtimeScope']
}): ElementDocsBaseEntry {
  return {
    slug: config.slug,
    title: config.title,
    description: config.description,
    sourcePath: config.sourcePath,
    propDefs: config.propDefs,
    overviewCode: config.overviewCode,
    runtimeScope: config.runtimeScope,
  }
}

export const feedbackEntries = {
  badge: createAutogenEntry({
    base: badgeCatalogEntry,
    propDefsByName: badgeElementPropDefs,
    props: autoProps.filter(prop => prop !== 'variant'),
    display: 'inline',
    inlineComponent: 'Badge',
    extraSections: [
      {
        id: 'icons',
        title: 'Icons',
        description:
          'Pass icon components with icon or deleteIcon. Badge controls the icon size so each usage stays consistent.',
        code: `<Flex wrap="wrap" align="center" gap="3">
  <Badge color="success" variant="soft" icon="check-circle">Synced</Badge>
  <Badge color="primary" variant="surface" icon="sparkle">Featured</Badge>
  <Badge color="neutral" variant="outline" onDelete={() => undefined} deleteIcon="close">
    Filter applied
  </Badge>
</Flex>`,
      },
      {
        id: 'avatar-and-delete',
        title: 'Avatar And Delete',
        description:
          'Use avatar and delete affordances for chip-style filters, assignees, and lightweight ownership UI.',
        code: `<Flex wrap="wrap" align="center" gap="3">
  <Badge avatar={{ name: 'Alex Rivera' }} variant="soft">Assignee</Badge>
  <Badge avatar={{ name: 'Nora Patel' }} color="primary" variant="surface" onDelete={() => undefined}>
    Owner
  </Badge>
</Flex>`,
      },
    ],
  }),
  callout: createAutogenEntry({
    base: calloutCatalogEntry,
    propDefsByName: calloutElementPropDefs,
    props: autoProps,
    display: 'callout',
    codeByProp: {
      size: (valuesLiteral: string) => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {sizes.map(size => (
        <Flex key={size} direction="column" gap="2">
          <div className="text-xs font-mono text-muted-foreground">{size}</div>
          <Callout.Root size={size} color="info" icon="info" text={'Size ' + size + ' keeps icon and text in sync.'} />
        </Flex>
      ))}
    </Flex>
  )
}`,
      color: (valuesLiteral: string) => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex direction="column" gap="3">
      {colors.map(color => {
        const icon = color === 'success' ? "check-circle" : color === 'warning' ? "warning" : "info"
        return (
          <Callout.Root
            key={color}
            variant="surface"
            color={color}
            icon={icon}
            text={color + ' adapts the semantic emphasis without changing layout'}
          />
        )
      })}
    </Flex>
  )
}`,
      variant: (valuesLiteral: string) => `export default function Example() {
  const values = ${valuesLiteral}
  return (
    <Flex direction="column" gap="3">
      {values.map(value => (
        <Callout.Root
          key={value}
          variant={value}
          color="info"
          icon="info"
          text={value + ' keeps the same content model with different chrome.'}
        />
      ))}
    </Flex>
  )
}`,
      highContrast: () => `export default function Example() {
  const items = [
    { color: 'info', variant: 'soft', icon: 'info' },
    { color: 'success', variant: 'surface', icon: 'check-circle' },
    { color: 'warning', variant: 'outline', icon: 'warning' },
    { color: 'error', variant: 'solid', icon: 'circle-alert' },
  ]

  return (
    <Flex direction="column" gap="3">
      {items.map(item => (
        <Callout.Root
          key={item.color + item.variant}
          color={item.color}
          variant={item.variant}
          icon={item.icon}
          highContrast
          text={item.color + ' ' + item.variant + ' stays legible with high contrast enabled.'}
        />
      ))}
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'icons',
        title: 'Icons',
        description: 'Use the root icon prop for the common case, or the explicit icon slot when composition needs it.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      <Callout.Root color="info" icon="info">
        <Callout.Text>The root can render the controlled icon for you.</Callout.Text>
      </Callout.Root>
      <Callout.Root color="warning">
        <Callout.Icon icon="warning" />
        <Callout.Text>Use the icon slot when you need explicit composition.</Callout.Text>
      </Callout.Root>
      <Callout.Root color="success">
        <Callout.Text>Callout.Text spans the full width when no icon is present.</Callout.Text>
      </Callout.Root>
    </Flex>
  )
}`,
      },
    ],
  }),
  spinner: createAutogenEntry({
    base: spinnerCatalogEntry,
    propDefsByName: spinnerElementPropDefs,
    props: autoProps.filter(prop => prop !== 'highContrast'),
    display: 'stacked',
    codeByProp: {
      size: (valuesLiteral: string) => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex align="center" gap="4" wrap="wrap">
      {sizes.map(size => (
        <Flex key={size} direction="column" align="center" gap="2">
          <Spinner size={size} />
          <Text size="xs" className="text-muted-foreground">{size}</Text>
        </Flex>
      ))}
    </Flex>
  )
}`,
      color: (valuesLiteral: string) => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex align="center" gap="4" wrap="wrap">
      {colors.map(color => (
        <Flex key={color} direction="column" align="center" gap="2">
          <Spinner color={color} />
          <Text size="xs" className="text-muted-foreground capitalize">{color}</Text>
        </Flex>
      ))}
    </Flex>
  )
}`,
      variant: (valuesLiteral: string) => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4" style={{ width: 360 }}>
      {variants.map(variant => (
        <Flex key={variant} align="center" gap="3">
          <Spinner variant={variant} size="md" />
          <Text size="sm" className="capitalize">{variant}</Text>
        </Flex>
      ))}
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'with-text',
        title: 'With Text',
        description: 'Pair spinner with status text when asynchronous work needs more context than motion alone.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="3">
      <Flex align="center" gap="2">
        <Spinner size="sm" />
        <Text size="sm">Loading dashboard\u2026</Text>
      </Flex>
      <Flex align="center" gap="2">
        <Spinner size="sm" color="primary" />
        <Text size="sm" className="text-primary">Processing your request\u2026</Text>
      </Flex>
    </Flex>
  )
}`,
      },
      {
        id: 'loading-branch',
        title: 'Conditional Loading',
        description: 'Use the loading prop when the spinner should replace content until work completes.',
        code: `export default function Example() {
  const [loading, setLoading] = React.useState(true)

  return (
    <Flex direction="column" gap="4">
      <Button variant="outline" onClick={() => setLoading(value => !value)}>
        Toggle loading
      </Button>
      <Spinner loading={loading}>
        <div className="rounded-xl border border-border/70 p-4">
          <Text size="sm" weight="medium">Loaded content</Text>
          <Text size="sm" className="mt-1 text-muted-foreground">
            Spinner returns children once loading becomes false.
          </Text>
        </div>
      </Spinner>
    </Flex>
  )
}`,
        scope: { React, Button },
      },
    ],
  }),
  toast: createAutogenEntry({
    base: createElementBaseEntry({
      slug: 'toast',
      title: 'Toast',
      description:
        'Toast notifications built on Base UI with Callout visual tokens. Supports stacked behavior, timeout, and dismiss placement.',
      sourcePath: 'packages/ui/src/elements/toast/Toast.tsx',
      propDefs: toastDocsPropDefs,
      overviewCode: `<Toast.Provider timeout={5}>
  <ToastDemo />
  <Toast.Viewport side="bottom" />
</Toast.Provider>`,
      runtimeScope: {
        Toast,
        Button,
        CheckCircle2,
        ToastDemo: function ToastDemo() {
          const { notify } = Toast.useToast()

          return (
            <Button
              onClick={() => {
                notify({
                  title: 'Saved changes',
                  description: 'Your profile has been updated.',
                  icon: <CheckCircle2 className="h-4 w-4" />,
                  variant: 'soft',
                  color: 'success',
                  dismissable: 'top',
                  timeout: 5,
                })
              }}
            >
              Show toast
            </Button>
          )
        },
      },
    }),
    propDefsByName: toastElementPropDefs,
    props: autoProps,
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}

  function Demo() {
    const { notify } = Toast.useToast()

    return (
      <Flex wrap="wrap" gap="3">
        {sizes.map(size => (
          <Button
            key={size}
            variant="outline"
            onClick={() =>
              notify({
                title: 'Saved',
                description: 'Toast size ' + size,
                size,
              })
            }
          >
            {size}
          </Button>
        ))}
      </Flex>
    )
  }

  return (
    <Toast.Provider timeout={4}>
      <Demo />
      <Toast.Viewport side="bottom" />
    </Toast.Provider>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}

  function Demo() {
    const { notify } = Toast.useToast()

    return (
      <Flex wrap="wrap" gap="3">
        {variants.map(variant => (
          <Button
            key={variant}
            variant="outline"
            className="capitalize"
            onClick={() =>
              notify({
                title: variant,
                description: 'Toast variant ' + variant,
                variant,
              })
            }
          >
            {variant}
          </Button>
        ))}
      </Flex>
    )
  }

  return (
    <Toast.Provider timeout={4}>
      <Demo />
      <Toast.Viewport side="bottom" />
    </Toast.Provider>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}

  function Demo() {
    const { notify } = Toast.useToast()

    return (
      <Flex wrap="wrap" gap="3">
        {colors.map(color => (
          <Button
            key={color}
            variant="outline"
            className="capitalize"
            onClick={() =>
              notify({
                title: color,
                description: color + ' toast',
                color,
              })
            }
          >
            {color}
          </Button>
        ))}
      </Flex>
    )
  }

  return (
    <Toast.Provider timeout={4}>
      <Demo />
      <Toast.Viewport side="bottom" />
    </Toast.Provider>
  )
}`,
      highContrast: () => `export default function Example() {
  function Demo() {
    const { notify } = Toast.useToast()

    return (
      <Flex gap="3">
        <Button
          variant="outline"
          onClick={() =>
            notify({
              title: 'Standard',
              description: 'Standard toast',
              color: 'info',
            })
          }
        >
          Standard
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            notify({
              title: 'High contrast',
              description: 'High contrast toast',
              color: 'info',
              highContrast: true,
            })
          }
        >
          High Contrast
        </Button>
      </Flex>
    )
  }

  return (
    <Toast.Provider timeout={4}>
      <Demo />
      <Toast.Viewport side="bottom" />
    </Toast.Provider>
  )
}`,
    },
    extraSections: [
      {
        id: 'stacked-toasts',
        title: 'Stacked Toasts',
        description: 'Use provider limit and repeated notify calls to build stacked notification flows.',
        code: `export default function Example() {
  function StackDemo() {
    const { notify } = Toast.useToast()

    return (
      <Button
        variant="outline"
        onClick={() => {
          notify({
            title: 'Info',
            description: 'Background sync completed.',
            icon: <Info className="h-4 w-4" />,
            color: 'info',
            variant: 'surface',
            dismissable: 'center',
          })
          notify({
            title: 'Notification',
            description: 'New comment from Alex.',
            icon: <Bell className="h-4 w-4" />,
            color: 'primary',
            variant: 'soft',
          })
        }}
      >
        Push stacked toasts
      </Button>
    )
  }

  return (
    <Toast.Provider timeout={6} limit={4}>
      <StackDemo />
      <Toast.Viewport side="top" />
    </Toast.Provider>
  )
}`,
        scope: { Info, Bell },
      },
      {
        id: 'dismissable',
        title: 'Dismissable Positions',
        description:
          'Dismiss placement controls whether the close affordance appears at the top, center, or not at all.',
        code: `export default function Example() {
  function DismissDemo() {
    const { notify } = Toast.useToast()

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() =>
            notify({ title: 'Top close', description: 'Dismiss button at top.', dismissable: 'top', variant: 'outline' })
          }
        >
          dismissable="top"
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            notify({ title: 'Center close', description: 'Dismiss button centered.', dismissable: 'center', variant: 'outline' })
          }
        >
          dismissable="center"
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            notify({ title: 'No close button', description: 'Auto or manual close only.', dismissable: 'none', timeout: 3 })
          }
        >
          dismissable="none"
        </Button>
      </div>
    )
  }

  return (
    <Toast.Provider timeout={0}>
      <DismissDemo />
      <Toast.Viewport />
    </Toast.Provider>
  )
}`,
      },
    ],
  }),
} as const
