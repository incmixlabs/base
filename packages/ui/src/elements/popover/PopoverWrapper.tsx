'use client'

import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Popover } from './Popover'
import type {
  PopoverWrapperAction,
  PopoverWrapperField,
  PopoverWrapperProps,
  PopoverWrapperSection,
} from './popover-wrapper.types'

function FieldRow({
  field,
  renderField,
  section,
}: {
  field: PopoverWrapperField
  section: PopoverWrapperSection
  renderField?: PopoverWrapperProps['renderField']
}) {
  const defaultRender = (
    <div className="rounded-md border border-border/70 bg-background/60 p-2">
      <div className="text-xs text-muted-foreground">{field.label}</div>
      {field.value != null ? <div className="text-sm font-medium text-foreground">{field.value}</div> : null}
      {field.description != null ? <div className="mt-1 text-xs text-muted-foreground">{field.description}</div> : null}
    </div>
  )

  return <>{renderField ? renderField(section, field, defaultRender) : defaultRender}</>
}

function ActionRow({
  action,
  onSelect,
  renderAction,
  section,
}: {
  action: PopoverWrapperAction
  onSelect: () => void
  section: PopoverWrapperSection
  renderAction?: PopoverWrapperProps['renderAction']
}) {
  const defaultRender = (
    <Button
      size="xs"
      variant={action.variant ?? 'soft'}
      color={action.color}
      disabled={action.disabled}
      onClick={onSelect}
    >
      {action.label}
    </Button>
  )

  return <>{renderAction ? renderAction(section, action, defaultRender) : defaultRender}</>
}

export function PopoverWrapper({
  data,
  trigger,
  showClose = true,
  open,
  defaultOpen,
  onOpenChange,
  onActionSelect,
  renderField,
  renderSection,
  renderAction,
  variant = 'surface',
  color = 'slate',
  highContrast = false,
  radius,
  size = 'sm',
  maxWidth = 'sm',
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  className,
  contentClassName,
}: PopoverWrapperProps) {
  const isOpenControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const resolvedOpen = isOpenControlled ? open : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(next)
      }
      onOpenChange?.(next)
    },
    [isOpenControlled, onOpenChange],
  )

  const close = React.useCallback(() => handleOpenChange(false), [handleOpenChange])
  const elementTrigger = React.isValidElement(trigger)
    ? (trigger as React.ReactElement<{ className?: string; children?: React.ReactNode }>)
    : null

  return (
    <Popover.Root open={resolvedOpen} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
      {elementTrigger ? (
        <Popover.Trigger
          render={
            className
              ? React.cloneElement(elementTrigger, {
                  className: cn(elementTrigger.props.className, className),
                })
              : elementTrigger
          }
        >
          {elementTrigger.props.children}
        </Popover.Trigger>
      ) : (
        <Popover.Trigger className={cn('inline-flex', className)}>{trigger}</Popover.Trigger>
      )}
      <Popover.Content
        variant={variant}
        color={color}
        highContrast={highContrast}
        radius={radius}
        size={size}
        maxWidth={maxWidth}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={contentClassName}
      >
        <Popover.Arrow />
        {showClose ? <Popover.Close /> : null}

        <Flex direction="column" gap="3">
          {data.title != null ? <div className="text-sm font-semibold">{data.title}</div> : null}
          {data.description != null ? <div className="text-xs text-muted-foreground">{data.description}</div> : null}

          {data.sections.map(section => {
            const defaultSectionRender = (
              <Flex key={section.id} direction="column" gap="2" className="rounded-md border border-border/60 p-2">
                {section.title != null ? (
                  <div className="text-xs font-semibold uppercase text-muted-foreground">{section.title}</div>
                ) : null}
                {section.description != null ? (
                  <div className="text-xs text-muted-foreground">{section.description}</div>
                ) : null}

                {section.fields?.length ? (
                  <Flex direction="column" gap="2">
                    {section.fields.map(field => (
                      <FieldRow key={field.id} field={field} section={section} renderField={renderField} />
                    ))}
                  </Flex>
                ) : null}

                {section.actions?.length ? (
                  <Flex align="center" gap="2" wrap="wrap">
                    {section.actions.map(action => {
                      const shouldClose = action.closeOnSelect ?? true
                      return (
                        <ActionRow
                          key={action.id}
                          action={action}
                          section={section}
                          renderAction={renderAction}
                          onSelect={() => {
                            action.onSelect?.()
                            onActionSelect?.(action, section)
                            if (shouldClose) {
                              close()
                            }
                          }}
                        />
                      )
                    })}
                  </Flex>
                ) : null}
              </Flex>
            )

            return (
              <React.Fragment key={section.id}>
                {renderSection ? renderSection(section, defaultSectionRender) : defaultSectionRender}
              </React.Fragment>
            )
          })}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  )
}

PopoverWrapper.displayName = 'PopoverWrapper'

export type {
  PopoverWrapperAction,
  PopoverWrapperData,
  PopoverWrapperField,
  PopoverWrapperProps,
  PopoverWrapperRenderAction,
  PopoverWrapperRenderField,
  PopoverWrapperRenderSection,
  PopoverWrapperSection,
} from './popover-wrapper.types'
