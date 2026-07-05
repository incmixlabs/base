import * as React from 'react'
import { Text, type TextProps } from '../text/Text'

export interface SubTitleProps extends TextProps {}

export const SubTitle = React.forwardRef<HTMLElement, SubTitleProps>(
  ({ as = 'p', size = 'sm', color = 'neutral', variant = 'muted', ...props }, ref) => {
    return <Text ref={ref} as={as} size={size} color={color} variant={variant} {...props} />
  },
)

SubTitle.displayName = 'SubTitle'
