import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bold, Code, Italic, Strikethrough } from 'lucide-react'
import * as React from 'react'
import { Label } from '@/form'
import { FloatingToolbar, type FloatingToolbarAction, type FloatingToolbarRect } from './FloatingToolbar'
import { useTextareaSelection } from './useTextareaSelection'

const meta: Meta<typeof FloatingToolbar> = {
  title: 'Form/FloatingToolbar',
  component: FloatingToolbar,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof FloatingToolbar>

// ── Story: Standalone with textarea via useTextareaSelection ──

const inlineActions: FloatingToolbarAction[] = [
  { id: 'bold', icon: <Bold size={15} />, label: 'Bold', group: 'inline' },
  { id: 'italic', icon: <Italic size={15} />, label: 'Italic', group: 'inline' },
  { id: 'strikethrough', icon: <Strikethrough size={15} />, label: 'Strikethrough', group: 'inline' },
  { id: 'code', icon: <Code size={15} />, label: 'Code', group: 'code' },
]

export const Standalone: Story = {
  render: () => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const [value, setValue] = React.useState(
      'Select some text in this textarea to see the floating toolbar appear above the selection.',
    )
    const [lastAction, setLastAction] = React.useState<string | null>(null)

    const { hasSelection, selectionRect, mirrorRef, toolbarRef } = useTextareaSelection(textareaRef)

    return (
      <div className="w-[500px] space-y-2">
        <Label>Standalone FloatingToolbar + useTextareaSelection</Label>
        <div className="relative">
          <div ref={mirrorRef} aria-hidden="true" />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={4}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <FloatingToolbar
          open={hasSelection}
          selectionRect={selectionRect}
          actions={inlineActions}
          onAction={action => setLastAction(action.id)}
          toolbarRef={toolbarRef}
        />

        {lastAction && <p className="text-xs text-muted-foreground">Last action: {lastAction}</p>}
        <p className="text-xs text-muted-foreground">
          This uses FloatingToolbar directly with useTextareaSelection — no SelectionToolbar wrapper. The same
          FloatingToolbar can be wired to Lexical or any other source.
        </p>
      </div>
    )
  },
}

// ── Story: Fixed position demo (no textarea) ──

export const FixedPosition: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    const rect: FloatingToolbarRect = { top: 200, left: 300, width: 100, height: 20 }

    return (
      <div className="w-[500px] space-y-4">
        <Label>Fixed position demo</Label>
        <p className="text-sm text-muted-foreground">
          Toolbar positioned at a fixed rect — demonstrates that FloatingToolbar is independent of any text input.
        </p>
        <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'Show'} toolbar
        </button>

        <FloatingToolbar
          open={open}
          selectionRect={rect}
          actions={inlineActions}
          onAction={action => console.log('Action:', action.id)}
        />

        {/* Visual indicator of the rect */}
        <div
          className="fixed border-2 border-dashed border-primary/30 pointer-events-none"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      </div>
    )
  },
}

// ── Story: With active state ──

export const WithActiveState: Story = {
  render: () => {
    const [activeIds, setActiveIds] = React.useState<Set<string>>(new Set(['bold']))

    const actions: FloatingToolbarAction[] = inlineActions.map(a => ({
      ...a,
      active: activeIds.has(a.id),
    }))

    const rect: FloatingToolbarRect = { top: 200, left: 350, width: 80, height: 20 }

    return (
      <div className="w-[500px] space-y-4">
        <Label>Active state toggle</Label>
        <p className="text-sm text-muted-foreground">
          Click toolbar buttons to toggle active state. Active buttons are highlighted. This pattern is how Lexical
          integration would work — buttons reflect editor state.
        </p>

        <FloatingToolbar
          open
          selectionRect={rect}
          actions={actions}
          onAction={action => {
            setActiveIds(prev => {
              const next = new Set(prev)
              if (next.has(action.id)) next.delete(action.id)
              else next.add(action.id)
              return next
            })
          }}
        />
      </div>
    )
  },
}
