import type * as React from 'react'
import { asChildPropDef } from '@/theme/props/as-child.prop'
import type { HeightProps } from '@/theme/props/height.props'
import { heightPropDefs } from '@/theme/props/height.props'
import type { GetPropDefTypes, PropDef } from '@/theme/props/prop-def'
import type { WidthProps } from '@/theme/props/width.props'
import { widthPropDefs } from '@/theme/props/width.props'
import type { Radius } from '@/theme/tokens'

const alignValues = ['start', 'center'] as const
const contentSizes = ['sm', 'md', 'lg', 'xl'] as const

const dialogContentPropDefs = {
  ...asChildPropDef,
  align: {
    type: 'enum',
    values: alignValues,
    default: 'center',
  },
  size: {
    type: 'enum',
    values: contentSizes,
    default: 'md',
    responsive: true,
  },
  width: widthPropDefs.width,
  minWidth: widthPropDefs.minWidth,
  maxWidth: { ...widthPropDefs.maxWidth, default: '600px' },
  ...heightPropDefs,
} satisfies {
  align: PropDef<(typeof alignValues)[number]>
  size: PropDef<(typeof contentSizes)[number]>
  width: PropDef<string>
  minWidth: PropDef<string>
  maxWidth: PropDef<string>
}

type DialogContentSize = (typeof contentSizes)[number]
type DialogContentAlign = (typeof alignValues)[number]
type DialogContentOwnProps = GetPropDefTypes<typeof dialogContentPropDefs>

export interface DialogRootProps {
  /** Whether the dialog is open */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state */
  defaultOpen?: boolean
  /** Children elements */
  children: React.ReactNode
}

export interface DialogTriggerProps {
  /** Trigger content */
  children: React.ReactNode
  /** Additional class names */
  className?: string
}

export interface DialogContentProps extends HeightProps, WidthProps {
  /** Content size token */
  size?: DialogContentSize
  /** Border radius token */
  radius?: Radius
  /** Vertical alignment */
  align?: DialogContentAlign
  /** Max width override for the popup */
  maxWidth?: WidthProps['maxWidth']
  /** Additional class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
  /** Portal container element. Defaults to the active theme container. */
  container?: HTMLElement | null
  /** Dialog content */
  children: React.ReactNode
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogTitleProps {
  /** Additional class names */
  className?: string
  /** Title content */
  children: React.ReactNode
}

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names */
  className?: string
  /** Description content */
  children: React.ReactNode
}

export interface DialogCloseProps {
  /** Render as child element (for custom close buttons) */
  asChild?: boolean
  /** Additional class names */
  className?: string
  /** Close button content */
  children?: React.ReactNode
}

export namespace DialogProps {
  export type Root = DialogRootProps
  export type Trigger = DialogTriggerProps
  export type Content = DialogContentProps
  export type Header = DialogHeaderProps
  export type Body = DialogBodyProps
  export type Footer = DialogFooterProps
  export type Title = DialogTitleProps
  export type Description = DialogDescriptionProps
  export type Close = DialogCloseProps
}

export type { DialogContentAlign, DialogContentOwnProps, DialogContentSize }
export { alignValues as dialogContentAlignValues, contentSizes as dialogContentSizes, dialogContentPropDefs }
