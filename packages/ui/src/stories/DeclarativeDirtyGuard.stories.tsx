import { normalizePageDocument, type PageDocument } from '@incmix/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import {
  createDeclarativePageActionHandler,
  createDeclarativePageActor,
  DeclarativePageRenderer,
  type DeclarativePageRuntimeDirtyGuardContext,
} from '@/declarative'
import { Button, DirtyGuardDialog } from '@/elements'
import { useDirtyGuard } from '@/hooks'

const dirtyGuardPage: PageDocument = {
  kind: 'page',
  id: 'dirty-guard.demo',
  title: 'Dirty Guard Demo',
  root: {
    type: 'layout',
    props: {
      gap: 12,
    },
    children: [
      {
        type: 'template',
        props: {
          template: 'A declarative action can ask for dirty confirmation before it reaches the page runtime.',
        },
      },
      {
        type: 'component',
        props: {
          component: 'Button',
          label: 'Open next record',
        },
        meta: {
          on: {
            click: {
              type: 'navigate',
              to: '/records/next',
              confirm: {
                guard: 'dirty',
                title: 'Abandon changes?',
                message: 'Discard the current draft and open the next record?',
                cancelLabel: 'Keep editing',
                confirmLabel: 'Abandon changes',
                confirmColor: 'error',
              },
            },
          },
        },
      },
    ],
  },
}

const normalizedDirtyGuardPage = normalizePageDocument(dirtyGuardPage)

const meta: Meta = {
  title: 'Declarative/Dirty Guard',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const GuardedAction: Story = {
  render: () => {
    const [isDirty, setIsDirty] = React.useState(true)
    const [lastAction, setLastAction] = React.useState('No action yet.')
    const dirtyGuard = useDirtyGuard<DeclarativePageRuntimeDirtyGuardContext>({ isDirty })
    const actorRef = React.useMemo(
      () =>
        createDeclarativePageActor({
          page: normalizedDirtyGuardPage,
          services: {
            action: async action => {
              setLastAction(`Ran ${action.type} to ${'to' in action ? action.to : 'runtime action'}.`)
              setIsDirty(false)
              return undefined
            },
          },
        }),
      [],
    )

    React.useEffect(() => {
      actorRef.start()
      return () => actorRef.stop()
    }, [actorRef])

    const handleAction = React.useMemo(
      () => createDeclarativePageActionHandler(actorRef, { dirtyGuard }),
      [actorRef, dirtyGuard],
    )

    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button size="sm" variant={isDirty ? 'solid' : 'outline'} onClick={() => setIsDirty(value => !value)}>
            Dirty: {isDirty ? 'true' : 'false'}
          </Button>
          <span className="text-sm text-muted-foreground">{lastAction}</span>
        </div>

        <DeclarativePageRenderer page={normalizedDirtyGuardPage} actorRef={actorRef} onAction={handleAction} />

        <DirtyGuardDialog
          guard={dirtyGuard}
          title={context => context?.confirm.title ?? 'Abandon changes?'}
          description={context => context?.confirm.message ?? 'Discard the current draft?'}
          cancelLabel="Keep editing"
          confirmLabel="Abandon changes"
          confirmColor="error"
        />
      </div>
    )
  },
}
