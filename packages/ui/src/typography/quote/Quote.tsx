import * as React from 'react'
import { cn } from '@/lib/utils'
import { quoteBase } from '../inline-elements.css'

export interface QuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  /** Whether to truncate text with ellipsis */
  truncate?: boolean
  /** Text wrapping behavior */
  wrap?: 'wrap' | 'nowrap' | 'pretty' | 'balance'
}

/**
 * Quote component for short inline quotations.
 * Renders as a `<q>` element which automatically adds quotation marks.
 */
/** Quote export. */
export const Quote = React.forwardRef<HTMLQuoteElement, QuoteProps>(
  ({ truncate = false, wrap = 'wrap', className, ...props }, ref) => {
    return (
      <q
        ref={ref}
        className={cn(
          quoteBase,
          // Truncation
          truncate && 'truncate',

          // Text wrapping
          wrap === 'nowrap' && 'whitespace-nowrap',
          wrap === 'pretty' && 'text-pretty',
          wrap === 'balance' && 'text-balance',

          className,
        )}
        {...props}
      />
    )
  },
)

Quote.displayName = 'Quote'
