import { createVar, style, styleVariants } from '@vanilla-extract/css'
import type { Transition, Variants } from 'motion/react'
import { dialogSizeVar } from '@/theme/runtime/component-vars'
import { fontSizes, lineHeights } from '@/theme/token-maps'
import { type DialogContentSize, dialogContentSizes } from './dialog.props'

const dialogMaxWidthVar = createVar()
const dialogTitleFontSizeVar = createVar()
const dialogTitleLineHeightVar = createVar()
const dialogDescriptionFontSizeVar = createVar()
const dialogDescriptionLineHeightVar = createVar()
const dialogPaddingVar = createVar()
const dialogFooterGapVar = createVar()

export const dialogBackdropBaseCls =
  'fixed inset-0 z-50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0'

export const dialogBackdropBase = style({
  backgroundColor: 'rgb(0 0 0 / 0.24)',
  backdropFilter: 'blur(4px)',
})

export const dialogPopupBaseCls =
  'fixed z-50 rounded-[var(--element-border-radius)] border bg-background shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'

export const dialogPopupBase = style({
  insetInline: '1rem',
  width: 'auto',
  marginInline: 'auto',
  maxHeight: 'calc(100dvh - 2rem)',
  maxWidth: dialogMaxWidthVar,
  overflowY: 'auto',
})

/** Dialog panel maxWidth per size (dialog-specific, not a design token). */
const dialogMaxWidth: Record<DialogContentSize, string> = { sm: '24rem', md: '28rem', lg: '32rem', xl: '36rem' }
/** Description text uses one step down from the title size in the designTokens scale. */
const sizeScale = Object.keys(fontSizes) as Array<keyof typeof fontSizes>
const oneStepDown = (size: keyof typeof fontSizes): keyof typeof fontSizes =>
  sizeScale[Math.max(0, sizeScale.indexOf(size) - 1)] ?? size

export const dialogContentBySize = styleVariants(
  Object.fromEntries(
    dialogContentSizes.map(size => {
      const descSize = oneStepDown(size)
      return [
        size,
        {
          vars: {
            [dialogMaxWidthVar]: dialogSizeVar(size, 'maxWidth', dialogMaxWidth[size]),
            [dialogTitleFontSizeVar]: dialogSizeVar(size, 'titleFontSize', fontSizes[size]),
            [dialogTitleLineHeightVar]: dialogSizeVar(size, 'titleLineHeight', lineHeights[size]),
            [dialogDescriptionFontSizeVar]: dialogSizeVar(size, 'descriptionFontSize', fontSizes[descSize]),
            [dialogDescriptionLineHeightVar]: dialogSizeVar(size, 'descriptionLineHeight', lineHeights[descSize]),
            [dialogPaddingVar]: dialogSizeVar(size, 'padding', '1.5rem'),
            [dialogFooterGapVar]: dialogSizeVar(size, 'footerGap', '0.5rem'),
          },
        },
      ]
    }),
  ) as Record<DialogContentSize, { vars: Record<string, string> }>,
)

export const dialogContentByAlign = styleVariants({
  center: { top: '50%', transform: 'translateY(-50%)' },
  start: { top: '10vh' },
})

export const dialogHeader = style({
  padding: dialogPaddingVar,
  paddingBottom: 0,
})

const dialogPadding = style({
  padding: dialogPaddingVar,
})

export const dialogBody = dialogPadding

export const dialogContentPadding = dialogPadding

export const dialogFooter = style({
  gap: dialogFooterGapVar,
  padding: dialogPaddingVar,
  paddingTop: 0,
})

export const alertDialogFooter = style({
  gap: dialogFooterGapVar,
})

export const dialogTitle = style({
  fontSize: dialogTitleFontSizeVar,
  lineHeight: dialogTitleLineHeightVar,
})

export const dialogDescription = style({
  fontSize: dialogDescriptionFontSizeVar,
  lineHeight: dialogDescriptionLineHeightVar,
})

// ── Motion variants ──

export const dialogBackdropVariants: Variants = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: { opacity: 1, backdropFilter: 'blur(4px)' },
  exit: { opacity: 0, backdropFilter: 'blur(0px)' },
}

export const dialogBackdropTransition: Transition = { duration: 0.2, ease: 'easeInOut' }

export const dialogPopupVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const dialogPopupTransition: Transition = { type: 'spring', stiffness: 150, damping: 25 }
