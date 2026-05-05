import * as React from 'react'
import { cn } from '@/lib/utils'
import { emBase } from '../inline-elements.css'

export interface EmProps extends React.HTMLAttributes<HTMLElement> {}

/** Em export. */
export const Em = React.forwardRef<HTMLElement, EmProps>(({ className, ...props }, ref) => {
  return <em ref={ref} className={cn(emBase, className)} {...props} />
})

Em.displayName = 'Em'
