'use client'

import * as React from 'react'
import type { Size } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'
import type { TextFieldVariant } from './TextField'

interface FieldGroupAwareProps {
  size?: Size
  variant?: TextFieldVariant
}

/**
 * HOC that injects FieldGroup context values into wrapped components.
 * Props passed directly to the component take precedence over context values.
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
    const fieldGroup = useFieldGroup()

    const mergedProps = {
      ...props,
      size: props.size ?? fieldGroup.size,
      variant: props.variant ?? fieldGroup.variant,
      ref,
    } as P & { ref: typeof ref }

    return <WrappedComponent {...mergedProps} />
  })

  WithFieldGroup.displayName = `withFieldGroup(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return WithFieldGroup
}
