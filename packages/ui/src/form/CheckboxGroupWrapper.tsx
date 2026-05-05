'use client'

import * as React from 'react'
import { CheckboxGroup } from './CheckboxGroup'
import type { CheckboxGroupWrapperProps } from './checkbox-group-wrapper.types'

export function CheckboxGroupWrapper({ data, renderItem, ...rootProps }: CheckboxGroupWrapperProps) {
  return (
    <CheckboxGroup.Root {...rootProps}>
      {data.map(item => {
        const defaultRender = (
          <CheckboxGroup.Item
            key={item.value}
            value={item.value}
            label={typeof item.label === 'string' ? item.label : undefined}
            description={typeof item.description === 'string' ? item.description : undefined}
            disabled={item.disabled}
          >
            {item.children ?? (typeof item.label !== 'string' ? item.label : undefined)}
          </CheckboxGroup.Item>
        )

        return renderItem ? (
          <React.Fragment key={item.value}>{renderItem(item, defaultRender)}</React.Fragment>
        ) : (
          defaultRender
        )
      })}
    </CheckboxGroup.Root>
  )
}

CheckboxGroupWrapper.displayName = 'CheckboxGroupWrapper'

export type {
  CheckboxGroupWrapperItem,
  CheckboxGroupWrapperProps,
  CheckboxGroupWrapperRenderItem,
} from './checkbox-group-wrapper.types'
