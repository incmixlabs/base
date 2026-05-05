import { createVar, style, styleVariants } from '@vanilla-extract/css'
import type { Transition, Variants } from 'motion/react'
import { connectorIndicatorBase, connectorSeparatorColor, connectorSeparatorCompleted } from '@/shared/connector.css'
import { semanticColorVar } from '@/theme/props/color.prop'
import { stepperSizeVar } from '@/theme/runtime/component-vars'

const stepperRootGapVar = createVar()
const stepperNavGapVar = createVar()
const stepperItemGapVar = createVar()
const stepperTriggerGapVar = createVar()
const stepperTriggerFontSizeVar = createVar()
const stepperIndicatorSizeVar = createVar()
const stepperTitleFontSizeVar = createVar()
const stepperDescriptionFontSizeVar = createVar()
const stepperPanelPaddingVar = createVar()
const stepperFooterGapVar = createVar()
const stepperFooterMetaFontSizeVar = createVar()
const stepperSeparatorOffsetVar = createVar()

export const stepperSizeVars = styleVariants({
  xs: {
    vars: {
      [stepperRootGapVar]: stepperSizeVar('xs', 'rootGap', '1rem'),
      [stepperNavGapVar]: stepperSizeVar('xs', 'navGap', '0.75rem'),
      [stepperItemGapVar]: stepperSizeVar('xs', 'itemGap', '0.75rem'),
      [stepperTriggerGapVar]: stepperSizeVar('xs', 'triggerGap', '0.75rem'),
      [stepperTriggerFontSizeVar]: stepperSizeVar('xs', 'triggerFontSize', '0.75rem'),
      [stepperIndicatorSizeVar]: stepperSizeVar('xs', 'indicatorSize', '1.25rem'),
      [stepperTitleFontSizeVar]: stepperSizeVar('xs', 'titleFontSize', '0.75rem'),
      [stepperDescriptionFontSizeVar]: stepperSizeVar('xs', 'descriptionFontSize', '0.6875rem'),
      [stepperPanelPaddingVar]: stepperSizeVar('xs', 'panelPadding', '1rem'),
      [stepperFooterGapVar]: stepperSizeVar('xs', 'footerGap', '0.5rem'),
      [stepperFooterMetaFontSizeVar]: stepperSizeVar('xs', 'footerMetaFontSize', '0.875rem'),
      [stepperSeparatorOffsetVar]: stepperSizeVar('xs', 'separatorOffset', 'calc(0.625rem - 0.5px)'),
    },
  },
  sm: {
    vars: {
      [stepperRootGapVar]: stepperSizeVar('sm', 'rootGap', '1rem'),
      [stepperNavGapVar]: stepperSizeVar('sm', 'navGap', '0.75rem'),
      [stepperItemGapVar]: stepperSizeVar('sm', 'itemGap', '0.75rem'),
      [stepperTriggerGapVar]: stepperSizeVar('sm', 'triggerGap', '0.75rem'),
      [stepperTriggerFontSizeVar]: stepperSizeVar('sm', 'triggerFontSize', '0.875rem'),
      [stepperIndicatorSizeVar]: stepperSizeVar('sm', 'indicatorSize', '1.5rem'),
      [stepperTitleFontSizeVar]: stepperSizeVar('sm', 'titleFontSize', '0.875rem'),
      [stepperDescriptionFontSizeVar]: stepperSizeVar('sm', 'descriptionFontSize', '0.75rem'),
      [stepperPanelPaddingVar]: stepperSizeVar('sm', 'panelPadding', '1rem'),
      [stepperFooterGapVar]: stepperSizeVar('sm', 'footerGap', '0.5rem'),
      [stepperFooterMetaFontSizeVar]: stepperSizeVar('sm', 'footerMetaFontSize', '0.875rem'),
      [stepperSeparatorOffsetVar]: stepperSizeVar('sm', 'separatorOffset', 'calc(0.75rem - 0.5px)'),
    },
  },
  md: {
    vars: {
      [stepperRootGapVar]: stepperSizeVar('md', 'rootGap', '1rem'),
      [stepperNavGapVar]: stepperSizeVar('md', 'navGap', '0.75rem'),
      [stepperItemGapVar]: stepperSizeVar('md', 'itemGap', '0.75rem'),
      [stepperTriggerGapVar]: stepperSizeVar('md', 'triggerGap', '0.75rem'),
      [stepperTriggerFontSizeVar]: stepperSizeVar('md', 'triggerFontSize', '0.9375rem'),
      [stepperIndicatorSizeVar]: stepperSizeVar('md', 'indicatorSize', '1.75rem'),
      [stepperTitleFontSizeVar]: stepperSizeVar('md', 'titleFontSize', '0.9375rem'),
      [stepperDescriptionFontSizeVar]: stepperSizeVar('md', 'descriptionFontSize', '0.8125rem'),
      [stepperPanelPaddingVar]: stepperSizeVar('md', 'panelPadding', '1rem'),
      [stepperFooterGapVar]: stepperSizeVar('md', 'footerGap', '0.5rem'),
      [stepperFooterMetaFontSizeVar]: stepperSizeVar('md', 'footerMetaFontSize', '0.875rem'),
      [stepperSeparatorOffsetVar]: stepperSizeVar('md', 'separatorOffset', 'calc(0.875rem - 0.5px)'),
    },
  },
  lg: {
    vars: {
      [stepperRootGapVar]: stepperSizeVar('lg', 'rootGap', '1rem'),
      [stepperNavGapVar]: stepperSizeVar('lg', 'navGap', '0.75rem'),
      [stepperItemGapVar]: stepperSizeVar('lg', 'itemGap', '0.75rem'),
      [stepperTriggerGapVar]: stepperSizeVar('lg', 'triggerGap', '0.75rem'),
      [stepperTriggerFontSizeVar]: stepperSizeVar('lg', 'triggerFontSize', '1rem'),
      [stepperIndicatorSizeVar]: stepperSizeVar('lg', 'indicatorSize', '2rem'),
      [stepperTitleFontSizeVar]: stepperSizeVar('lg', 'titleFontSize', '1rem'),
      [stepperDescriptionFontSizeVar]: stepperSizeVar('lg', 'descriptionFontSize', '0.875rem'),
      [stepperPanelPaddingVar]: stepperSizeVar('lg', 'panelPadding', '1rem'),
      [stepperFooterGapVar]: stepperSizeVar('lg', 'footerGap', '0.5rem'),
      [stepperFooterMetaFontSizeVar]: stepperSizeVar('lg', 'footerMetaFontSize', '0.875rem'),
      [stepperSeparatorOffsetVar]: stepperSizeVar('lg', 'separatorOffset', 'calc(1rem - 0.5px)'),
    },
  },
})

export const stepperRoot = style({
  display: 'grid',
  gap: stepperRootGapVar,
  width: '100%',
})

export const stepperNav = styleVariants({
  horizontal: {
    alignItems: 'stretch',
    display: 'flex',
    gap: stepperNavGapVar,
    width: '100%',
  },
  vertical: {
    display: 'grid',
    gap: stepperNavGapVar,
    width: '100%',
  },
})

export const stepperItem = styleVariants({
  horizontal: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 0%',
    gap: stepperItemGapVar,
    minWidth: 0,
  },
  vertical: {
    alignItems: 'flex-start',
    display: 'grid',
    gap: stepperItemGapVar,
    minWidth: 0,
  },
})

export const stepperTriggerBase = style({
  alignItems: 'center',
  appearance: 'none',
  background: 'transparent',
  border: 0,
  boxSizing: 'border-box',
  color: semanticColorVar('neutral', 'text'),
  cursor: 'pointer',
  display: 'flex',
  gap: stepperTriggerGapVar,
  fontSize: stepperTriggerFontSizeVar,
  minWidth: 0,
  outline: 'none',
  padding: 0,
  selectors: {
    '&[aria-disabled="true"]': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    '&:focus-visible': {
      outline: `2px solid ${semanticColorVar('primary', 'primary-alpha')}`,
      outlineOffset: '2px',
    },
  },
})

export const stepperTriggerOrientation = styleVariants({
  horizontal: {
    flex: '1 1 auto',
    justifyContent: 'flex-start',
  },
  vertical: {
    width: '100%',
  },
})

export const stepperTriggerSize = style({})

export const stepperTriggerVariant = styleVariants({
  default: {
    borderRadius: '1rem',
    padding: '0.25rem 0.375rem',
  },
  pill: {
    backgroundColor: semanticColorVar('neutral', 'soft'),
    borderRadius: '999px',
    padding: '0.375rem 0.625rem',
  },
  minimal: {
    padding: '0.125rem 0',
  },
})

export const stepperIndicatorBase = style([
  connectorIndicatorBase,
  {
    border: `1px solid ${semanticColorVar('neutral', 'border')}`,
    height: stepperIndicatorSizeVar,
    fontWeight: 600,
    transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
    width: stepperIndicatorSizeVar,
  },
])

export const stepperIndicatorSize = style({
  fontSize: stepperTriggerFontSizeVar,
})

export const stepperIndicatorVariant = styleVariants({
  default: {
    selectors: {
      '&[data-state="active"]': {
        backgroundColor: semanticColorVar('primary', 'soft'),
        borderColor: semanticColorVar('primary', 'primary'),
        color: semanticColorVar('primary', 'text'),
      },
      '&[data-state="completed"]': {
        backgroundColor: semanticColorVar('primary', 'primary'),
        borderColor: semanticColorVar('primary', 'primary'),
        color: semanticColorVar('primary', 'contrast'),
      },
    },
  },
  pill: {
    backgroundColor: semanticColorVar('neutral', 'soft'),
    borderColor: 'transparent',
    selectors: {
      '&[data-state="active"]': {
        backgroundColor: semanticColorVar('primary', 'soft'),
        color: semanticColorVar('primary', 'text'),
      },
      '&[data-state="completed"]': {
        backgroundColor: semanticColorVar('primary', 'primary'),
        color: semanticColorVar('primary', 'contrast'),
      },
    },
  },
  minimal: {
    backgroundColor: 'transparent',
    selectors: {
      '&[data-state="active"]': {
        borderColor: semanticColorVar('primary', 'primary'),
        color: semanticColorVar('primary', 'text'),
      },
      '&[data-state="completed"]': {
        backgroundColor: semanticColorVar('primary', 'soft'),
        borderColor: semanticColorVar('primary', 'primary'),
        color: semanticColorVar('primary', 'text'),
      },
    },
  },
})

export const stepperText = style({
  display: 'grid',
  gap: '0.125rem',
  minWidth: 0,
})

export const stepperTitle = style({
  fontSize: stepperTitleFontSizeVar,
  fontWeight: 600,
  lineHeight: 1.4,
})

export const stepperDescription = style({
  color: semanticColorVar('neutral', 'text'),
  fontSize: stepperDescriptionFontSizeVar,
  opacity: 0.72,
})

export const stepperSeparator = styleVariants({
  horizontal: [
    connectorSeparatorColor,
    {
      alignSelf: 'center',
      flex: '1 1 auto',
      height: '1px',
      minWidth: '1rem',
    },
  ],
  vertical: [
    connectorSeparatorColor,
    {
      height: '2rem',
      width: '1px',
    },
  ],
})

export const stepperSeparatorOffset = style({
  marginInlineStart: stepperSeparatorOffsetVar,
})

export { connectorSeparatorCompleted as stepperSeparatorCompleted }

export const stepperPanel = style({
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  borderRadius: '1rem',
  minHeight: '10rem',
  padding: stepperPanelPaddingVar,
})

export const stepperFooter = style({
  alignItems: 'center',
  display: 'flex',
  gap: stepperFooterGapVar,
  justifyContent: 'space-between',
})

export const stepperFooterMeta = style({
  color: semanticColorVar('neutral', 'text'),
  fontSize: stepperFooterMetaFontSizeVar,
  opacity: 0.72,
})

export const stepperFooterActions = style({
  alignItems: 'center',
  display: 'flex',
  gap: stepperFooterGapVar,
})

export const stepperPanelVariants: Variants = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(4px)' },
}

export const stepperPanelTransition: Transition = { duration: 0.3, ease: 'easeInOut' }
