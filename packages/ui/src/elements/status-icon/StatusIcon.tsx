'use client'

import * as React from 'react'
import { Icon } from '@/elements/button/Icon'
import { lucideStatusIcons, type StatusIconStatus, statusIconColorTokenByValue } from './status-icon.shared'

type StatusIconSize = 'xs' | 'sm' | 'md' | 'lg'

export type { StatusIconStatus } from './status-icon.shared'
export { statusToneByValue } from './status-icon.shared'

export interface StatusIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color' | 'title'> {
  status: StatusIconStatus
  size?: StatusIconSize
}

export const StatusIcon = React.forwardRef<HTMLSpanElement, StatusIconProps>(function StatusIcon(
  { status, size = 'sm', className, style, ...props },
  ref,
) {
  return (
    <Icon
      ref={ref}
      icon={lucideStatusIcons[status]}
      size={size}
      className={className}
      color={statusIconColorTokenByValue[status]}
      style={style}
      aria-hidden="true"
      {...props}
    />
  )
})
