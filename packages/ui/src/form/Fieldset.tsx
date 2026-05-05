'use client'

import * as React from 'react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: React.ReactNode
  description?: React.ReactNode
  legendClassName?: string
  contentClassName?: string
}

export const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ legend, description, className, legendClassName, contentClassName, children, ...props }, ref) => {
    const descriptionId = useId()

    return (
      <fieldset
        ref={ref}
        className={cn('min-w-0 rounded-2xl border border-border bg-background px-5 py-5', className)}
        aria-describedby={description ? descriptionId : undefined}
        {...props}
      >
        {legend ? (
          <legend className={cn('px-1 text-base font-medium text-foreground', legendClassName)}>{legend}</legend>
        ) : null}
        <div className={cn(legend ? 'mt-3' : undefined, contentClassName)}>
          {description ? (
            <p id={descriptionId} className="mb-4 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </fieldset>
    )
  },
)

Fieldset.displayName = 'Fieldset'
