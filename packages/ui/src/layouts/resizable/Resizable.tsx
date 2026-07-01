'use client'

import { GripVertical } from 'lucide-react'
import type * as React from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'
import { cn } from '@/lib/utils'
import { Flex } from '../flex/Flex'
import { layoutFocusOutline } from '../layout-focus.class'

export type ResizablePanelGroupProps = React.ComponentProps<typeof ResizablePrimitive.Group>
export type ResizablePanelProps = React.ComponentProps<typeof ResizablePrimitive.Panel>
export type ResizableHandleProps = React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean
}

function ResizablePanelGroup({ className, ...props }: ResizablePanelGroupProps) {
  return <ResizablePrimitive.Group className={cn('flex h-full w-full', className)} {...props} />
}

function ResizablePanel(props: ResizablePanelProps) {
  return <ResizablePrimitive.Panel {...props} />
}

function ResizableHandle({ withHandle, className, children, ...props }: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      className={cn(
        'relative flex w-px items-center justify-center bg-[var(--color-neutral-border)] transition-colors after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2',
        layoutFocusOutline,
        'data-[separator=active]:bg-primary data-[separator=focus]:bg-primary [&[aria-orientation=horizontal]]:h-px [&[aria-orientation=horizontal]]:w-full [&[aria-orientation=horizontal]]:after:left-0 [&[aria-orientation=horizontal]]:after:h-3 [&[aria-orientation=horizontal]]:after:w-full [&[aria-orientation=horizontal]]:after:-translate-y-1/2 [&[aria-orientation=horizontal]]:after:translate-x-0',
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <Flex
          align="center"
          className="z-10 border border-neutral bg-[var(--color-neutral-border)]"
          height="4"
          justify="center"
          radius="sm"
          width="3"
        >
          <GripVertical className="h-2.5 w-2.5" />
        </Flex>
      ) : (
        children
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
