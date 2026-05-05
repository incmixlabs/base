import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { useDirtyGuard } from '@/hooks'
import { Button } from '../button/Button'
import { DirtyGuardDialog } from './DirtyGuardDialog'

const meta: Meta<typeof DirtyGuardDialog> = {
  title: 'Elements/DirtyGuardDialog',
  component: DirtyGuardDialog,
}

export default meta
type Story = StoryObj<typeof DirtyGuardDialog>

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Switch record</Button>
        <DirtyGuardDialog
          open={open}
          context={{ currentLabel: 'Quote draft', nextLabel: 'Approved quote' }}
          description={context =>
            `"${context?.currentLabel ?? 'Current item'}" has unsaved changes. Are you sure you want to open "${
              context?.nextLabel ?? 'the next item'
            }"?`
          }
          onOpenChange={setOpen}
        />
      </>
    )
  },
}

export const WithGuardHook: Story = {
  render: () => {
    const [isDirty, setIsDirty] = React.useState(true)
    const [message, setMessage] = React.useState('No navigation yet.')
    const guard = useDirtyGuard<{ label: string }>({ isDirty })

    return (
      <>
        <Button
          onClick={() => void guard.confirmOrRun(() => setMessage('Navigated to Next item.'), { label: 'Next item' })}
        >
          Navigate away
        </Button>
        <Button variant="outline" onClick={() => setIsDirty(dirty => !dirty)}>
          Toggle dirty: {isDirty ? 'true' : 'false'}
        </Button>
        <p>{message}</p>
        <DirtyGuardDialog
          guard={guard}
          description={context => `Discard changes and open ${context?.label ?? 'next item'}?`}
        />
      </>
    )
  },
}
