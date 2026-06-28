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
import { aspectRatioByRatio } from './src/layouts/aspect-ratio/aspect-ratio.class'
import { boxRootBase, boxSurfaceColorClassNames } from './src/layouts/box/box.class'
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

const splitClasses = (values: string[]) => values.flatMap(value => value.split(/\s+/))
const classMapValues = <Value extends string>(map: Record<string, Record<string, Value>>) =>
  Object.values(map).flatMap(variantMap => Object.values(variantMap))

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
      // Box styles
      boxRootBase,
      ...splitClasses(boxSurfaceColorClassNames),
      // Container styles
      containerBase,
      ...Object.values(containerBySize),
      ...classMapValues(containerDisplayResponsive),
      ...classMapValues(containerAlignResponsive),
      ...classMapValues(containerSizeResponsive),
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
    ]),
  ],
})
