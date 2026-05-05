import * as React from 'react'
import type { Responsive } from '@/layouts/layout-utils'
import { Slot } from '@/layouts/layout-utils'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { getResponsiveVariantClasses, typographyBreakpointKeys } from '../responsive'
import { kbdBase, kbdBaseCls, kbdBySize, kbdByVariant, kbdSizeResponsive } from './Kbd.css'
import { kbdPropDefs } from './kbd.props'

type KbdSize = (typeof kbdPropDefs.size.values)[number]
type KbdVariant = (typeof kbdPropDefs.variant.values)[number]

export interface KbdProps extends React.ComponentPropsWithoutRef<'kbd'> {
  asChild?: boolean
  size?: Responsive<KbdSize>
  variant?: KbdVariant
}

function getKbdSizeClasses(sizeProp: Responsive<KbdSize> | undefined): string {
  return getResponsiveVariantClasses(sizeProp, kbdBySize, kbdSizeResponsive, 'sm', typographyBreakpointKeys)
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ asChild, size = 'sm', variant = 'classic', className, children, ...props }, ref) => {
    const safeSize =
      typeof size === 'string' ? ((normalizeEnumPropValue(kbdPropDefs.size, size) ?? 'sm') as KbdSize) : 'sm'
    const safeVariant = (normalizeEnumPropValue(kbdPropDefs.variant, variant) ??
      kbdPropDefs.variant.default ??
      'classic') as KbdVariant

    const classes = cn(
      kbdBaseCls,
      kbdBase,
      typeof size === 'string' ? kbdBySize[safeSize] : getKbdSizeClasses(size),
      kbdByVariant[safeVariant],
      className,
    )

    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          {children}
        </Slot>
      )
    }

    return (
      <kbd ref={ref as React.Ref<HTMLElement>} className={classes} {...props}>
        {children}
      </kbd>
    )
  },
)

Kbd.displayName = 'Kbd'
