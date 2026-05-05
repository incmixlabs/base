'use client'

import * as React from 'react'
import { ActionButton } from '@/elements/button/ActionButton'
import { Flex } from '@/layouts/flex/Flex'
import { normalizeChartColor } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { Card } from './Card'
import type { CardWrapperProps, CardWrapperRenderSlot } from './card-wrapper.types'

function renderSlot(
  slot: 'media' | 'header' | 'content' | 'footer',
  defaultRender: React.ReactNode,
  override?: CardWrapperRenderSlot,
) {
  return override ? override(slot, defaultRender) : defaultRender
}

function hasContent(value: React.ReactNode) {
  return value !== null && value !== undefined && value !== false
}

function resolveActionButtonColor(color: CardWrapperProps['color'] | undefined): Color {
  if (!color || normalizeChartColor(color)) return 'slate'
  return color as Color
}

export function CardWrapper({
  data,
  size,
  variant,
  color,
  radius,
  onActionSelect,
  renderAction,
  renderSlot: renderSlotOverride,
  ...rootProps
}: CardWrapperProps) {
  const resolvedSize = size ?? data.size ?? 'xs'
  const resolvedVariant = variant ?? data.variant ?? 'surface'
  const resolvedColor = color ?? data.color ?? 'neutral'
  const resolvedActionColor = resolveActionButtonColor(resolvedColor)
  const resolvedRadius = radius ?? data.radius

  const mediaSlot = hasContent(data.media) ? <Card.Content className="pt-0">{data.media}</Card.Content> : null
  const headerSlot =
    hasContent(data.title) || hasContent(data.description) ? (
      <Card.Header>
        {hasContent(data.title) ? <Card.Title>{data.title}</Card.Title> : null}
        {hasContent(data.description) ? <Card.Description>{data.description}</Card.Description> : null}
      </Card.Header>
    ) : null
  const contentSlot = <Card.Content>{data.content}</Card.Content>
  const footerSlot =
    hasContent(data.footer) || (data.actions && data.actions.length > 0) ? (
      <Card.Footer className="justify-between gap-2">
        <div>{data.footer}</div>
        {data.actions && data.actions.length > 0 ? (
          <Flex align="center" gap="2" wrap="wrap" justify="end">
            {data.actions.map(action => {
              const defaultAction = (
                <ActionButton
                  action={action}
                  defaultColor={resolvedActionColor}
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
      </Card.Footer>
    ) : null

  return (
    <Card.Root
      size={resolvedSize}
      variant={resolvedVariant}
      color={resolvedColor}
      radius={resolvedRadius}
      {...rootProps}
    >
      {mediaSlot ? renderSlot('media', mediaSlot, renderSlotOverride) : null}
      {headerSlot ? renderSlot('header', headerSlot, renderSlotOverride) : null}
      {renderSlot('content', contentSlot, renderSlotOverride)}
      {footerSlot ? renderSlot('footer', footerSlot, renderSlotOverride) : null}
    </Card.Root>
  )
}

CardWrapper.displayName = 'CardWrapper'

export type {
  CardWrapperAction,
  CardWrapperData,
  CardWrapperProps,
  CardWrapperRenderAction,
  CardWrapperRenderSlot,
} from './card-wrapper.types'
