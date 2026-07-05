import * as React from 'react'
import { Heading, type HeadingProps } from '../heading/Heading'

export interface TitleProps extends HeadingProps {}

export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ as = 'h3', size = 'lg', weight = 'semibold', color = 'neutral', variant = 'solid', ...props }, ref) => {
    return <Heading ref={ref} as={as} size={size} weight={weight} color={color} variant={variant} {...props} />
  },
)

Title.displayName = 'Title'
