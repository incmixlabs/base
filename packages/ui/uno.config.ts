import { baseUnoConfig } from '@incmix/config/uno.config'
import { defineConfig } from 'unocss'
import {
  avatarGroupOverflowStackMarginBySize,
  avatarGroupSpreadBySize,
  avatarGroupStackBySize,
  avatarListItemBase,
  avatarListItemBySize,
  avatarPresenceBusyLineBySize,
  avatarPresenceBySize,
  avatarSizeBySize,
} from './src/elements/avatar/avatar.class'
import {
  calloutColorVariants,
  calloutHighContrastByVariant,
  calloutHoverColorVariants,
  calloutIconBaseCls,
  calloutIconSizeVariants,
  calloutInverseByVariant,
  calloutRootBaseCls,
  calloutRootSizeVariants,
  calloutSplitIconBase,
  calloutSplitIconColorVariants,
  calloutSplitSlotSizeVariants,
  calloutSplitTextBase,
  calloutSplitTextColorVariants,
  calloutSplitTextHover,
  calloutTextBase,
  calloutTextSizeVariants,
} from './src/elements/callout/callout.class'
import {
  cardContentBase,
  cardFooterBase,
  cardHeaderBase,
  cardRootBase,
  cardRootSizeClassName,
  cardRootSizeWrapperBase,
  cardSizeRules,
  cardTitleBase,
} from './src/elements/card/card.class'
import {
  dataListItemBase,
  dataListItemByAlign,
  dataListItemByOrientation,
  dataListItemGapBySize,
  dataListItemGapResponsive,
  dataListLabelBase,
  dataListLabelByOrientation,
  dataListLabelMinWidthBySize,
  dataListLabelMinWidthResponsive,
  dataListRootBase,
  dataListRootByOrientation,
  dataListRootBySize,
  dataListRootByTrim,
  dataListRootContainer,
  dataListRootSizeResponsive,
  dataListValueBase,
} from './src/elements/data-list/data-list.class'
import {
  alertDialogFooterBySize,
  dialogBackdropBase,
  dialogBackdropBaseCls,
  dialogBodyBySize,
  dialogContentByAlign,
  dialogContentBySize,
  dialogContentPaddingBySize,
  dialogDescriptionBySize,
  dialogFooterBySize,
  dialogHeaderBySize,
  dialogPopupBase,
  dialogPopupBaseCls,
  dialogTitleBySize,
} from './src/elements/dialog/dialog.class'
import { filterClassNames } from './src/elements/filter/filter.class'
import { menuSharedClassNames } from './src/elements/menu/menu.shared.class'
import { navigationMenuClassNames } from './src/elements/navigation-menu/NavigationMenu.class'
import {
  floatingSurfaceArrowColorVariants,
  floatingSurfaceColorVariants,
  floatingSurfaceHighContrastArrowColorVariants,
  floatingSurfaceHighContrastColorVariants,
  floatingSurfaceHighContrastEffectByVariant,
  floatingSurfaceMaxWidthVariants,
  floatingSurfaceSizeVariants,
  popoverContentBase,
} from './src/elements/popover/popover.class'
import { progressClassNames } from './src/elements/progress/progress.class'
import { scrollAreaClassNames } from './src/elements/scroll-area/scroll-area.class'
import {
  separatorAlignEnd,
  separatorAlignStart,
  separatorBase,
  separatorColorVariants,
  separatorDefaultColor,
  separatorHorizontal,
  separatorHorizontalStructural,
  separatorHorizontalWithContent,
  separatorSizeVariants,
  separatorVertical,
  separatorVerticalStructural,
  separatorVerticalWithContent,
  separatorWithContent,
} from './src/elements/separator/separator.class'
import { sheetClassNames } from './src/elements/sheet/sheet.class'
import { spinnerClassNames } from './src/elements/spinner/spinner.class'
import { tooltipContentBase, tooltipPositionerBase } from './src/elements/tooltip/tooltip.class'
import { avatarPickerClassNames } from './src/form/avatar-picker.class'
import { checkboxClassNames } from './src/form/checkbox.class'
import { checkboxCardsClassNames } from './src/form/checkbox-cards.class'
import { checkboxGroupClassNames } from './src/form/checkbox-group.class'
import { fieldGroupClassNames } from './src/form/FieldGroup.class'
import { floatingToolbarClassNames } from './src/form/FloatingToolbar.class'
import { formControlClassNames } from './src/form/form-control.class'
import { mentionTextareaClassNames } from './src/form/MentionTextarea.class'
import { pickerPopupClassNames } from './src/form/picker-popup.class'
import { ratingClassNames } from './src/form/Rating.class'
import { radioCardsClassNames } from './src/form/radio-cards.class'
import { radioGroupClassNames } from './src/form/radio-group.class'
import { sliderClassNames } from './src/form/Slider.class'
import { switchClassNames } from './src/form/switch.class'
import { textFieldClassNames } from './src/form/text-field.class'
import { aspectRatioByRatio } from './src/layouts/aspect-ratio/aspect-ratio.class'
import { boxRootBase, boxSurfaceColorClassNames } from './src/layouts/box/box.class'
import {
  commandDialogContent,
  commandDialogRoot,
  commandEmptyState,
  commandGroup,
  commandInput,
  commandInputRow,
  commandItem,
  commandItemDescription,
  commandItemLabel,
  commandItemText,
  commandList,
  commandSearchIcon,
  commandSearchTrigger,
  shortcutKey,
  shortcutRow,
} from './src/layouts/command-search/command-search.class'
import {
  containerAlignResponsive,
  containerBase,
  containerBySize,
  containerDisplayResponsive,
  containerSizeResponsive,
} from './src/layouts/container/container.class'
import {
  flexBase,
  flexBaseCls,
  flexByAlign,
  flexByDirection,
  flexByDisplay,
  flexByJustify,
  flexByWrap,
} from './src/layouts/flex/Flex.classes'
import {
  gridBase,
  gridBaseCls,
  gridByAlign,
  gridByAlignContent,
  gridByDisplay,
  gridByFlow,
  gridByJustify,
  gridByJustifyItems,
  gridColumns,
  gridColumnsResponsive,
  gridRows,
  gridRowsResponsive,
  gridTemplateAreasCustomResponsive,
  gridTemplateColumnsCustomResponsive,
  gridTemplateRowsCustomResponsive,
} from './src/layouts/grid/Grid.classes'
import { headerRoot, headerSticky } from './src/layouts/header/header.class'
import {
  sectionBase,
  sectionBaseCls,
  sectionByDisplay,
  sectionBySize,
  sectionDisplayResponsive,
  sectionSizeResponsive,
} from './src/layouts/section/section.class'
import { containerBreakpoints } from './src/theme/tokens'
import {
  codeBase,
  codeByColor,
  codeBySize,
  codeHighContrast,
  codeSizeResponsive,
  emBase,
  quoteBase,
  strongBase,
} from './src/typography/inline-elements.class'
import { kbdBase, kbdBaseCls, kbdBySize, kbdByVariant, kbdSizeResponsive } from './src/typography/kbd/kbd.class'
import {
  linkWrapperGap,
  linkWrapperGapResponsive,
  linkWrapperInner,
  linkWrapperQueryHost,
} from './src/typography/link/LinkWrapper.class'
import {
  linkBase,
  linkBaseCls,
  linkByColor,
  linkBySize,
  linkByUnderline,
  linkHighContrast,
  linkSizeResponsive,
} from './src/typography/link/link.class'
import {
  embeddedResponsiveShell,
  embeddedResponsiveState,
} from './src/typography/storybook/embedded-responsive-preview.class'
import {
  headingBase,
  headingBySize,
  headingByWeight,
  headingSizeResponsive,
  textBase,
  textBySize,
  textByWeight,
  textSizeResponsive,
  typographyTrimByTrim,
} from './src/typography/typography.class'

const splitClasses = (values: string[]) => values.flatMap(value => value.split(/\s+/).filter(Boolean))
const classMapValues = <Value extends string>(map: Record<string, Record<string, Value>>) =>
  Object.values(map).flatMap(variantMap => Object.values(variantMap))

const floatingSurfaceSafelist = splitClasses([
  ...Object.values(floatingSurfaceSizeVariants),
  ...Object.values(floatingSurfaceMaxWidthVariants),
  ...Object.values(floatingSurfaceHighContrastEffectByVariant),
  ...classMapValues(floatingSurfaceColorVariants),
  ...classMapValues(floatingSurfaceHighContrastColorVariants),
  ...classMapValues(floatingSurfaceArrowColorVariants),
  ...classMapValues(floatingSurfaceHighContrastArrowColorVariants),
])

const typographySafelist = splitClasses([
  textBase,
  headingBase,
  ...Object.values(textBySize),
  ...Object.values(headingBySize),
  ...Object.values(textByWeight),
  ...Object.values(headingByWeight),
  ...Object.values(typographyTrimByTrim),
  ...classMapValues(textSizeResponsive),
  ...classMapValues(headingSizeResponsive),
  strongBase,
  emBase,
  quoteBase,
  codeBase,
  ...Object.values(codeBySize),
  ...classMapValues(codeSizeResponsive),
  ...classMapValues(codeByColor),
  codeHighContrast,
  kbdBaseCls,
  kbdBase,
  ...Object.values(kbdBySize),
  ...classMapValues(kbdSizeResponsive),
  ...Object.values(kbdByVariant),
  linkBaseCls,
  linkBase,
  ...Object.values(linkBySize),
  ...classMapValues(linkSizeResponsive),
  ...Object.values(linkByUnderline),
  ...Object.values(linkByColor),
  linkHighContrast,
  linkWrapperQueryHost,
  linkWrapperInner,
  ...Object.values(linkWrapperGap),
  ...classMapValues(linkWrapperGapResponsive),
  embeddedResponsiveShell,
  embeddedResponsiveState,
])

const containerQueryVariants = Object.entries(containerBreakpoints).map(([breakpoint, minWidth]) => ({
  name: `cq-${breakpoint}`,
  match(matcher: string) {
    const prefix = `cq-${breakpoint}:`
    if (!matcher.startsWith(prefix)) return

    return {
      matcher: matcher.slice(prefix.length),
      parent: `@container (min-width: ${minWidth})`,
    }
  },
}))

export default defineConfig({
  ...baseUnoConfig,
  content: {
    filesystem: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './docs/**/*.{js,ts,jsx,tsx,mdx}'],
  },
  theme: {
    ...baseUnoConfig.theme,
  },
  variants: [...containerQueryVariants],
  rules: [...(baseUnoConfig.rules ?? []), ...cardSizeRules],
  safelist: [
    ...(baseUnoConfig.safelist ?? []),
    ...splitClasses([
      ...Object.values(avatarSizeBySize),
      ...Object.values(avatarPresenceBySize),
      ...Object.values(avatarPresenceBusyLineBySize),
      ...Object.values(avatarGroupStackBySize),
      ...Object.values(avatarGroupSpreadBySize),
      ...Object.values(avatarGroupOverflowStackMarginBySize),
      avatarListItemBase,
      ...Object.values(avatarListItemBySize),
      // AspectRatio styles
      ...Object.values(aspectRatioByRatio),
      // Callout styles
      calloutRootBaseCls,
      calloutIconBaseCls,
      calloutTextBase,
      ...Object.values(calloutRootSizeVariants),
      ...Object.values(calloutTextSizeVariants),
      ...Object.values(calloutIconSizeVariants),
      calloutSplitIconBase,
      calloutSplitTextBase,
      calloutSplitTextHover,
      ...Object.values(calloutSplitSlotSizeVariants),
      ...Object.values(calloutHighContrastByVariant),
      ...classMapValues(calloutColorVariants),
      ...classMapValues(calloutHoverColorVariants),
      ...classMapValues(calloutInverseByVariant),
      ...classMapValues(calloutSplitIconColorVariants),
      ...classMapValues(calloutSplitTextColorVariants),
      // Card styles
      cardRootBase,
      cardRootSizeWrapperBase,
      cardRootSizeClassName,
      cardHeaderBase,
      cardTitleBase,
      cardContentBase,
      cardFooterBase,
      // Dialog styles
      ...splitClasses([
        dialogBackdropBaseCls,
        dialogBackdropBase,
        dialogPopupBaseCls,
        dialogPopupBase,
        ...Object.values(dialogContentBySize),
        ...Object.values(dialogContentByAlign),
        ...Object.values(dialogHeaderBySize),
        ...Object.values(dialogBodyBySize),
        ...Object.values(dialogContentPaddingBySize),
        ...Object.values(dialogFooterBySize),
        ...Object.values(alertDialogFooterBySize),
        ...Object.values(dialogTitleBySize),
        ...Object.values(dialogDescriptionBySize),
      ]),
      // DataList styles
      dataListRootContainer,
      dataListRootBase,
      ...Object.values(dataListRootBySize),
      ...classMapValues(dataListRootSizeResponsive),
      ...Object.values(dataListRootByOrientation),
      ...Object.values(dataListRootByTrim),
      dataListItemBase,
      ...Object.values(dataListItemByOrientation),
      ...Object.values(dataListItemGapBySize),
      ...classMapValues(dataListItemGapResponsive),
      ...Object.values(dataListItemByAlign),
      dataListLabelBase,
      ...Object.values(dataListLabelByOrientation),
      ...Object.values(dataListLabelMinWidthBySize),
      ...classMapValues(dataListLabelMinWidthResponsive),
      dataListValueBase,
      // Separator styles
      ...splitClasses([
        separatorBase,
        separatorDefaultColor,
        separatorWithContent,
        separatorAlignStart,
        separatorAlignEnd,
        separatorHorizontal,
        separatorHorizontalStructural,
        separatorHorizontalWithContent,
        separatorVertical,
        separatorVerticalStructural,
        separatorVerticalWithContent,
        ...classMapValues(separatorSizeVariants),
        ...Object.values(separatorColorVariants),
      ]),
      // Popover/Tooltip floating surface styles
      popoverContentBase,
      tooltipContentBase,
      tooltipPositionerBase,
      ...floatingSurfaceSafelist,
      // Menu styles
      ...splitClasses(menuSharedClassNames),
      // Navigation menu styles
      ...splitClasses(navigationMenuClassNames),
      // Filter styles
      ...splitClasses(filterClassNames),
      // Progress styles
      ...splitClasses(progressClassNames),
      // Scroll area styles
      ...splitClasses(scrollAreaClassNames),
      // Sheet styles
      ...splitClasses(sheetClassNames),
      // Spinner styles
      ...splitClasses(spinnerClassNames),
      // Avatar picker styles
      ...splitClasses(avatarPickerClassNames),
      // Checkbox styles
      ...splitClasses(checkboxClassNames),
      // Checkbox cards styles
      ...splitClasses(checkboxCardsClassNames),
      // Checkbox group styles
      ...splitClasses(checkboxGroupClassNames),
      // Field group styles
      ...splitClasses(fieldGroupClassNames),
      // Shared form control surface styles
      ...splitClasses(formControlClassNames),
      // Floating toolbar styles
      ...splitClasses(floatingToolbarClassNames),
      // Mention textarea styles
      ...splitClasses(mentionTextareaClassNames),
      // Picker popup styles
      ...splitClasses(pickerPopupClassNames),
      // Radio cards styles
      ...splitClasses(radioCardsClassNames),
      // Radio group styles
      ...splitClasses(radioGroupClassNames),
      // Rating styles
      ...splitClasses(ratingClassNames),
      // Slider styles
      ...splitClasses(sliderClassNames),
      // Switch styles
      ...splitClasses(switchClassNames),
      // Text field styles
      ...splitClasses(textFieldClassNames),
      // Box styles
      boxRootBase,
      ...splitClasses(boxSurfaceColorClassNames),
      // Container styles
      containerBase,
      ...Object.values(containerBySize),
      ...classMapValues(containerDisplayResponsive),
      ...classMapValues(containerAlignResponsive),
      ...classMapValues(containerSizeResponsive),
      // Command search styles
      ...splitClasses([
        commandDialogContent,
        commandDialogRoot,
        commandSearchTrigger,
        commandInputRow,
        commandSearchIcon,
        commandInput,
        commandList,
        commandEmptyState,
        commandGroup,
        commandItem,
        commandItemText,
        commandItemLabel,
        commandItemDescription,
        shortcutRow,
        shortcutKey,
      ]),
      // Flex styles
      flexBaseCls,
      flexBase,
      ...Object.values(flexByDisplay),
      ...Object.values(flexByDirection),
      ...Object.values(flexByAlign),
      ...Object.values(flexByJustify),
      ...Object.values(flexByWrap),
      // Grid styles
      gridBaseCls,
      gridBase,
      ...Object.values(gridByDisplay),
      ...Object.values(gridByFlow),
      ...Object.values(gridByAlign),
      ...Object.values(gridByAlignContent),
      ...Object.values(gridByJustify),
      ...Object.values(gridByJustifyItems),
      ...Object.values(gridColumns),
      ...Object.values(gridRows),
      ...classMapValues(gridColumnsResponsive),
      ...classMapValues(gridRowsResponsive),
      ...Object.values(gridTemplateAreasCustomResponsive),
      ...Object.values(gridTemplateColumnsCustomResponsive),
      ...Object.values(gridTemplateRowsCustomResponsive),
      // Header styles
      headerRoot,
      headerSticky,
      // Section styles
      sectionBaseCls,
      sectionBase,
      ...Object.values(sectionBySize),
      ...Object.values(sectionByDisplay),
      ...classMapValues(sectionDisplayResponsive),
      ...classMapValues(sectionSizeResponsive),
      // Typography styles
      ...typographySafelist,
    ]),
  ],
})
