'use client'

import * as React from 'react'
import { SwitchGroup } from './SwitchGroup'
import type { SwitchGroupWrapperProps } from './switch-group-wrapper.types'

export function SwitchGroupWrapper({ data, renderItem, ...rootProps }: SwitchGroupWrapperProps) {
  return (
    <SwitchGroup.Root {...rootProps}>
      {data.map(item => {
        const defaultRender = (
          <SwitchGroup.Item
            key={item.name}
            name={item.name}
            label={typeof item.label === 'string' ? item.label : undefined}
            description={typeof item.description === 'string' ? item.description : undefined}
            disabled={item.disabled}
          >
            {item.children ?? (typeof item.label !== 'string' ? item.label : undefined)}
          </SwitchGroup.Item>
        )

        return renderItem ? (
          <React.Fragment key={item.name}>{renderItem(item, defaultRender)}</React.Fragment>
        ) : (
          defaultRender
        )
      })}
    </SwitchGroup.Root>
  )
}

SwitchGroupWrapper.displayName = 'SwitchGroupWrapper'

export type {
  SwitchGroupWrapperItem,
  SwitchGroupWrapperProps,
  SwitchGroupWrapperRenderItem,
} from './switch-group-wrapper.types'
