'use client'

import '../theme/typography-tokens.css'

export { Blockquote, type BlockquoteProps } from './blockquote/Blockquote'
export { Code, type CodeProps } from './code/Code'
export { Em, type EmProps } from './em/Em'
export { Heading, type HeadingProps } from './heading/Heading'
export { Kbd, type KbdProps } from './kbd/Kbd'
export { Link, type LinkProps } from './link/Link'
export {
  LinkWrapper,
  type LinkWrapperData,
  type LinkWrapperItem,
  type LinkWrapperProps,
  type LinkWrapperRenderItem,
} from './link/LinkWrapper'
export { Quote, type QuoteProps } from './quote/Quote'
export { Strong, type StrongProps } from './strong/Strong'
// Typography components
export { Text, type TextProps } from './text/Text'

// Typography tokens
export {
  type TypographyColor,
  type TypographySize,
  typographyTokens,
  type Weight,
} from './tokens'
