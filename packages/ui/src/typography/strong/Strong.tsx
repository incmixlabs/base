import * as React from 'react'
import { cn } from '@/lib/utils'
import { strongBase } from '../inline-elements.css'

export interface StrongProps extends React.HTMLAttributes<HTMLElement> {}

/** Strong export. */
export const Strong = React.forwardRef<HTMLElement, StrongProps>(({ className, ...props }, ref) => {
  return <strong ref={ref} className={cn(strongBase, className)} {...props} />
})

Strong.displayName = 'Strong'
