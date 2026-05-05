import type * as React from 'react'
import type { Radius } from '@/theme/tokens'
import type { DialogContentAlign, DialogContentSize } from './dialog.props'

export type {
  DialogContentAlign as AlertDialogContentAlign,
  DialogContentOwnProps as AlertDialogContentOwnProps,
  DialogContentSize as AlertDialogContentSize,
} from './dialog.props'

export interface AlertDialogRootProps {
  /** Whether the dialog is open */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state */
  defaultOpen?: boolean
  /** Children elements */
  children: React.ReactNode
}

export interface AlertDialogTriggerProps {
  /** Trigger content */
  children: React.ReactNode
  /** Additional class names */
  className?: string
}

export interface AlertDialogContentProps {
  /** Content size token */
  size?: DialogContentSize
  /** Border radius token */
  radius?: Radius
  /** Vertical alignment */
  align?: DialogContentAlign
  /** Max width override for the popup */
  maxWidth?: string
  /** Additional class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
  /** Portal container element. Defaults to the active theme container. */
  container?: HTMLElement | null
  /** Dialog content */
  children: React.ReactNode
}

export interface AlertDialogTitleProps {
  /** Additional class names */
  className?: string
  /** Title content */
  children: React.ReactNode
}

export interface AlertDialogDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional class names */
  className?: string
  /** Description content */
  children: React.ReactNode
}

export interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface AlertDialogActionProps {
  /** Render as child element */
  asChild?: boolean
  /** Additional class names */
  className?: string
  /** Action button content */
  children: React.ReactNode
}

export interface AlertDialogCancelProps {
  /** Render as child element */
  asChild?: boolean
  /** Additional class names */
  className?: string
  /** Cancel button content */
  children: React.ReactNode
}

export namespace AlertDialogProps {
  export type Root = AlertDialogRootProps
  export type Trigger = AlertDialogTriggerProps
  export type Content = AlertDialogContentProps
  export type Title = AlertDialogTitleProps
  export type Description = AlertDialogDescriptionProps
  export type Footer = AlertDialogFooterProps
  export type Action = AlertDialogActionProps
  export type Cancel = AlertDialogCancelProps
}
export {
  dialogContentAlignValues as alertDialogContentAlignValues,
  dialogContentPropDefs as alertDialogContentPropDefs,
  dialogContentSizes as alertDialogContentSizes,
} from './dialog.props'
