'use client'

import * as React from 'react'
import { ActionButton } from '@/elements/button/ActionButton'
import { Flex } from '@/layouts/flex/Flex'
import { Callout } from './Callout'
import type { CalloutWrapperProps } from './callout-wrapper.types'

export function CalloutWrapper({
  data,
  variant,
  color,
  onActionSelect,
  renderAction,
  ...rootProps
}: CalloutWrapperProps) {
  const resolvedVariant = data.variant ?? variant ?? 'surface'
  const resolvedColor = data.color ?? color ?? 'slate'

  return (
    <Callout.Root variant={resolvedVariant} color={resolvedColor} icon={data.icon} {...rootProps}>
      <Flex direction="column" gap="2" className="min-w-0 flex-1">
        <Callout.Text>
          {data.title ? <span className="font-semibold">{data.title}</span> : null}
          {data.title ? ' ' : null}
          {data.message}
        </Callout.Text>
        {data.actions && data.actions.length > 0 ? (
          <Flex align="center" gap="2" wrap="wrap">
            {data.actions.map(action => {
              const defaultAction = (
                <ActionButton
                  action={action}
                  defaultColor={resolvedColor}
                  onActionSelect={onActionSelect}
                  size="xs"
                  defaultVariant="soft"
                />
              )
              return (
                <React.Fragment key={action.id}>
                  {renderAction ? renderAction(action, defaultAction) : defaultAction}
                </React.Fragment>
              )
            })}
          </Flex>
        ) : null}
      </Flex>
    </Callout.Root>
  )
}

export type {
  CalloutWrapperAction,
  CalloutWrapperData,
  CalloutWrapperProps,
  CalloutWrapperRenderAction,
} from './callout-wrapper.types'
