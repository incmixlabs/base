'use client'

import * as React from 'react'
import { RadioGroup } from './RadioGroup'
import type { RadioGroupWrapperProps } from './radio-group-wrapper.types'

export function RadioGroupWrapper({ data, renderItem, ...rootProps }: RadioGroupWrapperProps) {
  return (
    <RadioGroup.Root {...rootProps}>
      {data.map(item => {
        const defaultRender = (
          <RadioGroup.Item
            key={item.value}
            value={item.value}
            label={typeof item.label === 'string' ? item.label : undefined}
            disabled={item.disabled}
          >
            {item.children ?? (typeof item.label !== 'string' ? item.label : undefined)}
          </RadioGroup.Item>
        )

        return renderItem ? (
          <React.Fragment key={item.value}>{renderItem(item, defaultRender)}</React.Fragment>
        ) : (
          defaultRender
        )
      })}
    </RadioGroup.Root>
  )
}

RadioGroupWrapper.displayName = 'RadioGroupWrapper'

export type {
  RadioGroupWrapperItem,
  RadioGroupWrapperProps,
  RadioGroupWrapperRenderItem,
} from './radio-group-wrapper.types'
