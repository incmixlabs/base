import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { Flex } from '@/layouts/flex/Flex'
import { colorPropDef, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import type { ToastNotifyOptions } from './Toast'
import { Toast } from './toast.namespace'
import { toastRootPropDefs, toastViewportPropDefs } from './toast.props'

type DemoArgs = {
  side: 'top' | 'bottom'
  timeout: number
  size: ToastNotifyOptions['size']
  variant: ToastNotifyOptions['variant']
  color: ToastNotifyOptions['color']
  dismissable: ToastNotifyOptions['dismissable']
}

const meta: Meta<DemoArgs> = {
  title: 'Elements/Toast',
  component: Toast.Viewport as unknown as React.ComponentType<DemoArgs>,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: getPropDefValues(toastViewportPropDefs.side),
      description: 'Viewport side for stack anchoring',
    },
    timeout: {
      control: 'number',
      description: 'Auto-dismiss timeout in seconds',
    },
    size: {
      control: 'select',
      options: getPropDefValues(toastRootPropDefs.size),
    },
    variant: {
      control: 'select',
      options: getPropDefValues(toastRootPropDefs.variant),
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
    },
    dismissable: {
      control: 'select',
      options: getPropDefValues(toastRootPropDefs.dismissable),
    },
  },
}

export default meta

type Story = StoryObj<DemoArgs>

function ToastDemo(args: DemoArgs) {
  const { notify } = Toast.useToast()
  const timersRef = React.useRef<Array<ReturnType<typeof setTimeout>>>([])

  React.useEffect(() => {
    return () => {
      for (const id of timersRef.current) {
        clearTimeout(id)
      }
      timersRef.current = []
    }
  }, [])

  const pushOne = React.useCallback(() => {
    notify({
      title: 'Saved changes',
      description: 'Your profile has been updated.',
      icon: <CheckCircle2 className="h-4 w-4" />,
      actionLabel: 'Undo',
      size: args.size,
      variant: args.variant,
      color: args.color,
      dismissable: args.dismissable,
    })
  }, [notify, args])

  const pushStack = React.useCallback(() => {
    for (const id of timersRef.current) {
      clearTimeout(id)
    }
    timersRef.current = []

    const payloads: Array<Pick<ToastNotifyOptions, 'title' | 'description' | 'icon' | 'color'>> = [
      {
        title: 'Info',
        description: 'Background sync completed.',
        icon: <Info className="h-4 w-4" />,
        color: 'info',
      },
      {
        title: 'Warning',
        description: '2 fields still need attention.',
        icon: <TriangleAlert className="h-4 w-4" />,
        color: 'warning',
      },
      {
        title: 'Notification',
        description: 'New comment from Alex.',
        icon: <Bell className="h-4 w-4" />,
        color: 'primary',
      },
    ]

    payloads.forEach((payload, index) => {
      const id = setTimeout(() => {
        notify({
          ...payload,
          size: args.size,
          variant: args.variant,
          dismissable: args.dismissable,
          timeout: args.timeout,
        })
      }, index * 120)
      timersRef.current.push(id)
    })
  }, [notify, args])

  return (
    <>
      <Flex className="min-h-screen p-8" direction="column" gap="4">
        <h3 className="text-xl font-semibold">Toast Playground</h3>
        <p className="text-muted-foreground">Trigger one toast or push multiple to verify stacking.</p>
        <div className="flex items-center gap-3">
          <Button variant="solid" onClick={pushOne}>
            Show toast
          </Button>
          <Button variant="outline" onClick={pushStack}>
            Show stacked toasts
          </Button>
        </div>
      </Flex>
      <Toast.Viewport side={args.side} />
    </>
  )
}

export const Playground: Story = {
  args: {
    side: 'bottom',
    timeout: 5,
    size: 'xl',
    variant: 'soft',
    color: SemanticColor.slate,
    dismissable: 'top',
  },
  render: args => (
    <Toast.Provider timeout={args.timeout}>
      <ToastDemo {...args} />
    </Toast.Provider>
  ),
}
