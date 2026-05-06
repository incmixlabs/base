'use client'

import * as React from 'react'
import type { Radius, Size } from '@/theme/tokens'
import { useFieldGroupOptional } from './FieldGroupContext'
import type { TextFieldVariant } from './TextField'

interface FieldGroupAwareProps {
  size?: Size
  radius?: Radius
  variant?: TextFieldVariant
  readOnly?: boolean
}

/**
 * HOC that injects FieldGroup context values into wrapped components.
 * Props passed directly to the component take precedence over context values.
 * Outside a FieldGroupProvider, props pass through without injected defaults.
 *
 * @example
 * ```tsx
 * import { withFieldGroup, Textarea, FieldGroup, TextField } from "@/form";
 *
 * const FieldGroupTextarea = withFieldGroup(Textarea);
 *
 * // Now inherits size/variant from FieldGroup context
 * <FieldGroup size="3" variant="soft">
 *   <TextField placeholder="Title" />
 *   <FieldGroupTextarea placeholder="Description" />
 * </FieldGroup>
 * ```
 */
/** withFieldGroup export. */
export function withFieldGroup<P extends FieldGroupAwareProps>(WrappedComponent: React.ComponentType<P>) {
  const WithFieldGroup = React.forwardRef<unknown, P>((props, ref) => {
    const fieldGroup = useFieldGroupOptional()

    const mergedProps = {
      ...props,
      ...(fieldGroup
        ? {
            size: props.size ?? fieldGroup.size,
            radius: props.radius ?? fieldGroup.radius,
            variant: props.variant ?? fieldGroup.variant,
            readOnly: fieldGroup.readOnly || props.readOnly === true,
          }
        : {}),
      ref,
    } as P & { ref: typeof ref }

    return <WrappedComponent {...mergedProps} />
  })

  WithFieldGroup.displayName = `withFieldGroup(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return WithFieldGroup
}
