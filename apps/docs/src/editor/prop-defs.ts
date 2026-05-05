import { barChartPropDefs as uiBarChartPropDefs } from '@/charts/bar-chart/props'
import { compactHorizontalChartPropDefs as uiCompactHorizontalChartPropDefs } from '@/charts/compact-horizontal-chart/props'
import { mapChartPropDefs as uiMapChartPropDefs } from '@/charts/map-chart/props'
import { gradientPresets } from '@/elements/gradient-background/gradient-presets'
import { timelinePropDefs as uiTimelinePropDefs } from '@/elements/timeline/timeline.props'
import { layoutCompositionPropDefs as uiLayoutCompositionPropDefs } from '@/theme/props/layout-composition.props'
import {
  accordionPropDefs as uiAccordionPropDefs,
  alertDialogPropDefs as uiAlertDialogPropDefs,
  avatarGroupPropDefs as uiAvatarGroupPropDefs,
  avatarPropDefs as uiAvatarPropDefs,
  badgePropDefs as uiBadgePropDefs,
  buttonPropDefs as uiButtonPropDefs,
  calloutPropDefs as uiCalloutPropDefs,
  cardPropDefs as uiCardPropDefs,
  contextMenuPropDefs as uiContextMenuPropDefs,
  dataListPropDefs as uiDataListPropDefs,
  dialogPropDefs as uiDialogPropDefs,
  dropdownMenuPropDefs as uiDropdownMenuPropDefs,
  iconButtonPropDefs as uiIconButtonPropDefs,
  iconPropDefs as uiIconPropDefs,
  imagePropDefs as uiImagePropDefs,
  insetPropDefs as uiInsetPropDefs,
  popoverPropDefs as uiPopoverPropDefs,
  scrollAreaPropDefs as uiScrollAreaPropDefs,
  segmentedControlPropDefs as uiSegmentedControlPropDefs,
  spinnerPropDefs as uiSpinnerPropDefs,
  tabsPropDefs as uiTabsPropDefs,
  toastPropDefs as uiToastPropDefs,
  tooltipPropDefs as uiTooltipPropDefs,
} from './elements/props'
import {
  checkboxGroupRootPropDefs as uiCheckboxGroupRootPropDefs,
  checkboxPropDefs as uiCheckboxPropDefs,
  radioGroupRootPropDefs as uiRadioGroupRootPropDefs,
  selectPropDefs as uiSelectPropDefs,
  sliderPropDefs as uiSliderPropDefs,
  switchGroupRootPropDefs as uiSwitchGroupRootPropDefs,
  switchPropDefs as uiSwitchPropDefs,
  textAreaPropDefs as uiTextAreaPropDefs,
  textFieldRootPropDefs as uiTextFieldRootPropDefs,
} from './form/props'
import {
  appShellPropDefs as uiAppShellPropDefs,
  aspectRatioPropDefs as uiAspectRatioPropDefs,
  boxPropDefs as uiBoxPropDefs,
  containerPropDefs as uiContainerPropDefs,
  flexPropDefs as uiFlexPropDefs,
  gridPropDefs as uiGridPropDefs,
  sectionPropDefs as uiSectionPropDefs,
  sidebarRootPropDefs as uiSidebarRootPropDefs,
} from './layouts/props'
import {
  asTypeUnion,
  createDocsPropDefs,
  enumType,
  type PropDef,
  withGapPropDocs,
  withMarginPropDocs,
  withPaddingPropDocs,
} from './prop-def-utils'

const baseBadgePropDefs = createDocsPropDefs(uiBadgePropDefs).filter(prop => prop.name !== 'asChild')
const avatarSizeType =
  createDocsPropDefs(uiAvatarPropDefs, {
    size: { typeSimple: enumType(uiAvatarPropDefs.size) },
  }).find(prop => prop.name === 'size')?.typeSimple ?? enumType(uiAvatarPropDefs.size)
const avatarRadiusType =
  createDocsPropDefs(uiAvatarPropDefs, {
    radius: { typeSimple: enumType(uiAvatarPropDefs.radius) },
  }).find(prop => prop.name === 'radius')?.typeSimple ?? enumType(uiAvatarPropDefs.radius)
const withStringArrayValueProps = (defs: PropDef[]): PropDef[] => [
  ...defs,
  { name: 'value', typeSimple: 'string[]' },
  { name: 'defaultValue', typeSimple: 'string[]' },
]
const layoutModeType = enumType(uiLayoutCompositionPropDefs.layout)
const layoutCompositionDocOverrides = {
  layout: {
    typeSimple: layoutModeType,
    description: 'Optional child layout mode applied to the component root.',
  },
  direction: {
    typeSimple: 'Responsive<"row" | "row-reverse" | "column" | "column-reverse">',
    description: 'Flex direction when layout="flex". Use layout="row" or layout="column" for common cases.',
  },
  align: { typeSimple: 'Responsive<AlignItems>', description: 'Align items for flex or grid layout modes.' },
  justify: {
    typeSimple: 'Responsive<JustifyContent>',
    description: 'Justify content for flex or grid layout modes.',
  },
  wrap: { typeSimple: 'Responsive<FlexWrap>', description: 'Flex wrapping when using a flex layout mode.' },
  gap: { typeSimple: 'Responsive<Spacing>', description: 'Gap between children in flex or grid layout modes.' },
  gapX: { typeSimple: 'Responsive<Spacing>', description: 'Horizontal gap for flex or grid layout modes.' },
  gapY: { typeSimple: 'Responsive<Spacing>', description: 'Vertical gap for flex or grid layout modes.' },
  areas: {
    typeSimple: 'Responsive<string>',
    description: 'Grid template areas when layout="grid".',
  },
  columns: {
    typeSimple: 'Responsive<GridColumns | string>',
    description: 'Grid template columns when layout="grid".',
  },
  rows: {
    typeSimple: 'Responsive<GridRows | string>',
    description: 'Grid template rows when layout="grid".',
  },
  flow: {
    typeSimple: 'Responsive<GridFlow>',
    description: 'Grid auto-flow direction when layout="grid".',
  },
  alignContent: {
    typeSimple: 'Responsive<AlignContent>',
    description: 'Align wrapped flex lines or grid content.',
  },
  justifyItems: {
    typeSimple: 'Responsive<JustifyItems>',
    description: 'Justify grid items when layout="grid".',
  },
}
export const accordionPropDefs: PropDef[] = createDocsPropDefs(uiAccordionPropDefs)
export const appShellPropDefs = {
  Root: createDocsPropDefs(uiAppShellPropDefs.Root, {
    color: { typeSimple: 'Color' },
  }),
  Secondary: createDocsPropDefs(uiAppShellPropDefs.Secondary),
  Content: createDocsPropDefs(uiAppShellPropDefs.Content),
} as const
export const accordionSchemaWrapperPropDefs: PropDef[] = [
  { name: 'schema', typeSimple: 'AccordionSchema', required: true },
  { name: 'onActionSelect', typeSimple: '(action, item) => void' },
  { name: 'renderItem', typeSimple: '(item, defaults) => { trigger?: ReactNode; content?: ReactNode }' },
  { name: 'multiple', typeSimple: 'boolean', default: false },
  { name: 'value', typeSimple: 'string | string[]' },
  { name: 'defaultValue', typeSimple: 'string | string[]' },
  { name: 'onValueChange', typeSimple: '(value) => void' },
  {
    name: 'size',
    typeSimple: enumType(uiAccordionPropDefs.size),
    default: String(uiAccordionPropDefs.size.default),
  },
  {
    name: 'triggerIconPosition',
    typeSimple: enumType(uiAccordionPropDefs.triggerIconPosition),
    default: String(uiAccordionPropDefs.triggerIconPosition.default),
  },
  { name: 'radius', typeSimple: '"none" | "sm" | "md" | "lg" | "full"' },
  { name: 'className', typeSimple: 'string' },
]
export const alertDialogPropDefs: PropDef[] = createDocsPropDefs(uiAlertDialogPropDefs, {
  size: { typeSimple: `Responsive<${enumType(uiAlertDialogPropDefs.size)}>` },
})
export const avatarPropDefs: PropDef[] = createDocsPropDefs(uiAvatarPropDefs, {
  size: { typeSimple: avatarSizeType },
  radius: { typeSimple: avatarRadiusType },
})
export const avatarGroupPropDefs: PropDef[] = [
  { name: 'max', typeSimple: 'number' },
  {
    name: 'size',
    typeSimple: enumType(uiAvatarGroupPropDefs.size),
    default: String(uiAvatarGroupPropDefs.size.default),
  },
  {
    name: 'layout',
    typeSimple: enumType(uiAvatarGroupPropDefs.layout),
    default: String(uiAvatarGroupPropDefs.layout.default),
  },
  { name: 'showPresence', typeSimple: 'boolean', default: Boolean(uiAvatarGroupPropDefs.showPresence.default) },
  {
    name: 'hoverCard',
    typeSimple: 'boolean | { title, color, variant, highContrast, radius }',
    default: true,
  },
  {
    name: 'overflowHoverCard',
    typeSimple: 'boolean | { title, color, variant, highContrast, radius }',
    default: true,
  },
  { name: 'onOverflowClick', typeSimple: '(overflowCount: number, overflowChildren: ReactNode[]) => void' },
  { name: 'renderOverflow', typeSimple: '(count: number) => ReactNode' },
  { name: 'children', typeSimple: 'ReactNode', required: true },
]
export const avatarPiePropDefs: PropDef[] = [
  { name: 'children', typeSimple: 'ReactNode', required: true },
  { name: 'size', typeSimple: avatarSizeType, default: String(uiAvatarPropDefs.size.default) },
  {
    name: 'hoverCard',
    typeSimple: 'boolean | { title, color, variant, highContrast, radius }',
    default: true,
  },
  { name: 'className', typeSimple: 'string' },
]
export const badgePropDefs: PropDef[] = [
  ...baseBadgePropDefs,
  { name: 'icon', typeSimple: 'IconComponent' },
  { name: 'avatar', typeSimple: 'AvatarProps (without size/className)' },
  { name: 'onDelete', typeSimple: '() => void' },
  { name: 'deleteIcon', typeSimple: 'IconComponent' },
  { name: 'deleteLabel', typeSimple: 'string', default: 'Remove' },
]

export const buttonPropDefs: PropDef[] = withMarginPropDocs(createDocsPropDefs(uiButtonPropDefs))
export const checkboxPropDefs: PropDef[] = createDocsPropDefs(uiCheckboxPropDefs)
export const checkboxGroupPropDefs: PropDef[] = withStringArrayValueProps(
  createDocsPropDefs(uiCheckboxGroupRootPropDefs),
)
export const checkboxGroupWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'CheckboxGroupWrapperItem[]', required: true },
  {
    name: 'size',
    typeSimple: enumType(uiCheckboxGroupRootPropDefs.size),
    default: String(uiCheckboxGroupRootPropDefs.size.default),
  },
  {
    name: 'variant',
    typeSimple: enumType(uiCheckboxGroupRootPropDefs.variant),
    default: String(uiCheckboxGroupRootPropDefs.variant.default),
  },
  { name: 'color', typeSimple: 'Color', default: 'slate' },
  { name: 'highContrast', typeSimple: 'boolean', default: false },
  { name: 'orientation', typeSimple: '"horizontal" | "vertical"', default: 'vertical' },
  { name: 'renderItem', typeSimple: '(item, defaultRender) => ReactNode' },
]
export const calloutPropDefs: PropDef[] = withPaddingPropDocs([
  ...createDocsPropDefs(uiCalloutPropDefs).filter(prop => prop.name !== 'asChild'),
  { name: 'icon', typeSimple: 'IconComponent' },
])
export const calloutWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'CalloutWrapperData', required: true },
  { name: 'variant', typeSimple: enumType(uiCalloutPropDefs.variant) },
  { name: 'color', typeSimple: 'Color' },
  { name: 'size', typeSimple: enumType(uiCalloutPropDefs.size), default: String(uiCalloutPropDefs.size.default) },
  { name: 'radius', typeSimple: enumType(uiCalloutPropDefs.radius) },
  { name: 'highContrast', typeSimple: 'boolean', default: false },
  { name: 'inverse', typeSimple: 'boolean', default: false },
  { name: 'hover', typeSimple: 'boolean', default: false },
  { name: 'onActionSelect', typeSimple: '(action: CalloutWrapperAction) => void' },
  { name: 'renderAction', typeSimple: '(action, defaultRender) => ReactNode' },
  { name: 'className', typeSimple: 'string' },
]
export const cardPropDefs: PropDef[] = withPaddingPropDocs(
  withMarginPropDocs([
    ...createDocsPropDefs(uiCardPropDefs, {
      ...layoutCompositionDocOverrides,
      size: { typeSimple: `Responsive<${enumType(uiCardPropDefs.size)}>` },
      tone: { typeSimple: 'SurfaceColorKey' },
      color: { typeSimple: 'SurfaceColorKey' },
      layout: {
        typeSimple: layoutModeType,
        description: 'Optional child layout mode applied to the card root.',
      },
    }).filter(prop => prop.name !== 'asChild'),
  ]),
)
export const cardWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'CardWrapperData', required: true },
  { name: 'size', typeSimple: enumType(uiCardPropDefs.size), default: String(uiCardPropDefs.size.default) },
  { name: 'variant', typeSimple: enumType(uiCardPropDefs.variant), default: String(uiCardPropDefs.variant.default) },
  { name: 'color', typeSimple: 'SurfaceColorKey', default: 'neutral' },
  { name: 'radius', typeSimple: enumType(uiCardPropDefs.radius) },
  { name: 'highContrast', typeSimple: 'boolean', default: false },
  { name: 'shape', typeSimple: enumType(uiCardPropDefs.shape), default: String(uiCardPropDefs.shape.default) },
  { name: 'square', typeSimple: 'boolean', default: false },
  { name: 'onActionSelect', typeSimple: '(action: CardWrapperAction) => void' },
  { name: 'renderAction', typeSimple: '(action, defaultRender) => ReactNode' },
  { name: 'renderSlot', typeSimple: '(slot, defaultRender) => ReactNode' },
  { name: 'className', typeSimple: 'string' },
]
export const commandWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'CommandWrapperData', required: true },
  { name: 'triggerLabel', typeSimple: 'string', default: 'Search...' },
  { name: 'triggerClassName', typeSimple: 'string' },
  { name: 'className', typeSimple: 'string' },
  { name: 'children', typeSimple: 'ReactNode' },
  { name: 'onSelectItem', typeSimple: '(item, section) => void' },
  { name: 'renderItem', typeSimple: '(section, item, defaultItem) => CommandSearchItem' },
  { name: 'renderTrigger', typeSimple: '(defaultTrigger) => ReactNode' },
]
function createMenuPropDefs(defs: {
  size: { values: readonly string[]; default: string }
  variant: { values: readonly string[]; default: string }
}): PropDef[] {
  return [
    { name: 'size', typeSimple: `Responsive<${enumType(defs.size)}>`, default: String(defs.size.default) },
    { name: 'variant', typeSimple: enumType(defs.variant), default: String(defs.variant.default) },
    { name: 'color', typeSimple: 'Color', default: 'slate' },
  ]
}

function createResponsiveEnumOverrides<
  TDefs extends Record<string, { values: readonly string[] }>,
  TName extends keyof TDefs,
>(defs: TDefs, names: readonly TName[]) {
  return Object.fromEntries(
    names.map(name => [name, { typeSimple: `Responsive<${enumType(defs[name] as { values: readonly string[] })}>` }]),
  ) as Record<TName, { typeSimple: string }>
}

export const contextMenuPropDefs: PropDef[] = createMenuPropDefs(uiContextMenuPropDefs)
export const dataListPropDefs = {
  Root: createDocsPropDefs(uiDataListPropDefs.Root),
  Item: createDocsPropDefs(uiDataListPropDefs.Item),
  Label: createDocsPropDefs(uiDataListPropDefs.Label),
} as const
export const dialogPropDefs: PropDef[] = createDocsPropDefs(uiDialogPropDefs, {
  size: { typeSimple: `Responsive<${enumType(uiDialogPropDefs.size)}>` },
})
export const dropdownMenuPropDefs = {
  Content: createMenuPropDefs(uiDropdownMenuPropDefs.Content),
  Trigger: createDocsPropDefs(uiDropdownMenuPropDefs.Trigger),
  TriggerButton: createDocsPropDefs(uiDropdownMenuPropDefs.TriggerButton),
  Item: createDocsPropDefs(uiDropdownMenuPropDefs.Item),
  CheckboxItem: createDocsPropDefs(uiDropdownMenuPropDefs.CheckboxItem),
  RadioItem: createDocsPropDefs(uiDropdownMenuPropDefs.RadioItem),
} as const
export const aspectRatioDocsPropDefs: PropDef[] = createDocsPropDefs(uiAspectRatioPropDefs)
export const boxDocsPropDefs: PropDef[] = withMarginPropDocs(
  withPaddingPropDocs(
    createDocsPropDefs(uiBoxPropDefs, {
      ...layoutCompositionDocOverrides,
      bg: { typeSimple: 'ThemeColorToken' },
      borderColor: { typeSimple: 'ThemeColorToken' },
      padding: {
        typeSimple: 'Responsive<Spacing | string>',
        description:
          'Alias for `p`. Sets padding on all sides. Supports spacing tokens, CSS strings, and responsive objects. Sparse responsive values inherit the last defined breakpoint.',
      },
      margin: {
        typeSimple: 'Responsive<Spacing | string>',
        description:
          'Alias for `m`. Sets margin on all sides. Supports spacing tokens, CSS strings, and responsive objects. Sparse responsive values inherit the last defined breakpoint.',
      },
      tone: { typeSimple: 'SurfaceColorKey' },
      color: { typeSimple: 'Color | ChartColorToken | ChartColorAlias' },
      variant: { typeSimple: '"solid" | "soft" | "surface"', default: 'surface' },
      text: { typeSimple: '"auto" | "contrast" | "text" | "primary" | "inverse"', default: 'auto' },
    }),
  ),
)
export const containerDocsPropDefs: PropDef[] = withMarginPropDocs(
  withPaddingPropDocs(
    createDocsPropDefs(uiContainerPropDefs, {
      size: { typeSimple: `Responsive<${enumType(uiContainerPropDefs.size)}>` },
      display: { typeSimple: `Responsive<${enumType(uiContainerPropDefs.display)}>` },
      align: { typeSimple: `Responsive<${enumType(uiContainerPropDefs.align)}>` },
      layout: layoutCompositionDocOverrides.layout,
      layoutProps: {
        typeSimple: "Omit<LayoutCompositionProps, 'layout'>",
        description: 'Nested layout props such as gap, columns, align, and justify applied to the inner container.',
      },
      bg: { typeSimple: 'ThemeColorToken' },
      borderColor: { typeSimple: 'ThemeColorToken' },
    }),
  ),
)
export const flexDocsPropDefs: PropDef[] = withPaddingPropDocs(
  withGapPropDocs(createDocsPropDefs(uiFlexPropDefs).filter(prop => prop.name !== 'asChild')),
)
export const gridDocsPropDefs: PropDef[] = withPaddingPropDocs(
  withGapPropDocs(
    createDocsPropDefs(uiGridPropDefs, {
      columns: {
        typeSimple: `Responsive<${uiGridPropDefs.columns.values.map(value => `'${value}'`).join(' | ')} | string>`,
      },
      rows: {
        typeSimple: `Responsive<${uiGridPropDefs.rows.values.map(value => `'${value}'`).join(' | ')} | string>`,
      },
    }).filter(prop => prop.name !== 'asChild'),
  ),
)
export const insetPropDefs: PropDef[] = withMarginPropDocs(
  createDocsPropDefs(
    uiInsetPropDefs,
    createResponsiveEnumOverrides(uiInsetPropDefs, ['side', 'clip', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl']),
  ).filter(prop => prop.name !== 'asChild'),
)
export const imagePropDefs: PropDef[] = createDocsPropDefs(uiImagePropDefs)
export const barChartPropDefs: PropDef[] = createDocsPropDefs(uiBarChartPropDefs, {
  data: { typeSimple: 'BarChartDatum[]' },
})
export const compactHorizontalChartPropDefs: PropDef[] = createDocsPropDefs(uiCompactHorizontalChartPropDefs, {
  data: { typeSimple: 'CompactHorizontalChartDatum[]' },
  valueFormat: {
    typeSimple: 'ChartValueFormatConfig',
    description:
      'Declarative formatter shorthand in generated controls. React callers may pass a full ChartValueFormatConfig object.',
  },
  emptyMessage: { typeSimple: 'ReactNode' },
})
export const mapChartPropDefs: PropDef[] = createDocsPropDefs(uiMapChartPropDefs, {
  features: { typeSimple: 'MapChartFeature[]' },
  locations: { typeSimple: 'MapChartLocationDatum[]' },
  mapMaxWidth: { typeSimple: 'CSSProperties["maxWidth"]' },
  title: { typeSimple: 'ReactNode' },
  metric: { typeSimple: 'ReactNode' },
  metricLabel: { typeSimple: 'ReactNode' },
  trend: { typeSimple: 'ReactNode' },
  otherLabel: { typeSimple: 'ReactNode' },
  otherValue: { typeSimple: 'ReactNode' },
  emptyMessage: { typeSimple: 'ReactNode' },
})
export const iconPropDefs: PropDef[] = withMarginPropDocs([
  ...createDocsPropDefs(uiIconPropDefs, {
    color: { typeSimple: 'Color | ThemeColorToken' },
    title: { typeSimple: 'string | ((data: { icon?: string; size }) => ReactNode)' },
  }),
  { name: 'iconProps', typeSimple: 'DynamicLucideIconProps (without name/className)' },
  { name: 'children', typeSimple: 'ReactNode' },
  { name: 'className', typeSimple: 'string' },
])
export const iconButtonPropDefs: PropDef[] = withMarginPropDocs(createDocsPropDefs(uiIconButtonPropDefs))
export const gradientBackgroundPropDefs: PropDef[] = withMarginPropDocs(
  withPaddingPropDocs([
    { name: 'as', typeSimple: '"div" | "Box" | "Card" | "Container"', default: 'div' },
    {
      name: 'preset',
      typeSimple: asTypeUnion(Object.keys(gradientPresets)),
      default: 'cosmic',
      description: 'Named built-in gradient preset. Ignored when colors is provided.',
    },
    { name: 'colors', typeSimple: 'string[]', description: 'CSS color stops. Provide at least two values.' },
    { name: 'duration', typeSimple: 'number', default: '15' },
    { name: 'direction', typeSimple: 'number', default: '135' },
    {
      name: 'radius',
      typeSimple: 'Radius',
      description: 'Border-radius token. Defaults to the current ThemeProvider radius when omitted.',
    },
    {
      name: 'layout',
      typeSimple: layoutModeType,
      description: 'Optional child layout mode applied to the rendered gradient root.',
    },
    {
      name: 'layoutProps',
      typeSimple: "Omit<LayoutCompositionProps, 'layout'>",
      description:
        'Nested layout props such as gap, columns, align, and justify. Kept separate from target props to avoid conflicts.',
    },
    {
      name: 'width',
      typeSimple: 'Responsive<Width | string>',
      description: 'Forwarded to Box and Container when selected via as.',
    },
    {
      name: 'minHeight',
      typeSimple: 'Responsive<Height | string>',
      description: 'Forwarded to Box and Container when selected via as.',
    },
    {
      name: 'size',
      typeSimple: 'Card size | Container size',
      description: 'Forwarded to Card or Container depending on the selected as value.',
    },
    {
      name: 'variant',
      typeSimple: enumType(uiCardPropDefs.variant),
      description: 'Forwarded when as="Card".',
    },
    {
      name: 'color',
      typeSimple: 'SurfaceColorKey',
      description: 'Forwarded when as="Card" or as="Box". The gradient background remains the visual fill.',
    },
    {
      name: 'align',
      typeSimple: `Responsive<${enumType(uiContainerPropDefs.align)}>`,
      description: 'Forwarded when as="Container".',
    },
    {
      name: 'display',
      typeSimple: `Responsive<${enumType(uiContainerPropDefs.display)}>`,
      description: 'Forwarded when as="Container".',
    },
    { name: 'className', typeSimple: 'string' },
    { name: 'style', typeSimple: 'CSSProperties' },
    { name: 'children', typeSimple: 'ReactNode' },
  ]),
)
export const linkWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'LinkWrapperData', required: true },
  { name: 'direction', typeSimple: '"row" | "column"', default: 'column' },
  { name: 'gap', typeSimple: 'Responsive<Spacing>', default: '2' },
  { name: 'onItemSelect', typeSimple: '(item: LinkWrapperItem) => void' },
  { name: 'renderItem', typeSimple: '(item, defaultRender) => ReactNode' },
  { name: 'className', typeSimple: 'string' },
]
export const masonryPropDefs: PropDef[] = [
  { name: 'columnWidth', typeSimple: 'number', default: '280' },
  { name: 'columnCount', typeSimple: 'number' },
  { name: 'maxColumnCount', typeSimple: 'number' },
  { name: 'gap', typeSimple: 'number | { column: number; row: number }', default: '16' },
  { name: 'itemHeight', typeSimple: 'number', default: '120' },
  { name: 'defaultWidth', typeSimple: 'number' },
  { name: 'defaultHeight', typeSimple: 'number' },
  { name: 'overscan', typeSimple: 'number', default: '2' },
  { name: 'scrollFps', typeSimple: 'number', default: '12' },
  { name: 'fallback', typeSimple: 'ReactNode' },
  { name: 'linear', typeSimple: 'boolean', default: false },
  { name: 'asChild', typeSimple: 'boolean', default: false },
]
export const mediaPlayerPropDefs: PropDef[] = [
  { name: 'asChild', typeSimple: 'boolean', default: false },
  { name: 'onPlay', typeSimple: '() => void' },
  { name: 'onPause', typeSimple: '() => void' },
  { name: 'onEnded', typeSimple: '() => void' },
  { name: 'onTimeUpdate', typeSimple: '(time: number) => void' },
  { name: 'onVolumeChange', typeSimple: '(volume: number) => void' },
  { name: 'onMuted', typeSimple: '(muted: boolean) => void' },
  { name: 'onMediaError', typeSimple: '(error: MediaError | null) => void' },
  { name: 'onPipError', typeSimple: '(error: unknown, state: "enter" | "exit") => void' },
  { name: 'onFullscreenChange', typeSimple: '(fullscreen: boolean) => void' },
  { name: 'dir', typeSimple: '"ltr" | "rtl"' },
  { name: 'label', typeSimple: 'string' },
  { name: 'tooltipDelayDuration', typeSimple: 'number', default: '600' },
  { name: 'tooltipSideOffset', typeSimple: 'number', default: '10' },
  { name: 'autoHide', typeSimple: 'boolean', default: false },
  { name: 'disabled', typeSimple: 'boolean', default: false },
  { name: 'withoutTooltip', typeSimple: 'boolean', default: false },
]
export const menuWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'MenuWrapperData', required: true },
  { name: 'mode', typeSimple: '"dropdown" | "context"', default: 'dropdown' },
  { name: 'trigger', typeSimple: 'ReactNode' },
  {
    name: 'size',
    typeSimple: enumType(uiDropdownMenuPropDefs.Content.size),
    default: String(uiDropdownMenuPropDefs.Content.size.default),
  },
  {
    name: 'variant',
    typeSimple: enumType(uiDropdownMenuPropDefs.Content.variant),
    default: String(uiDropdownMenuPropDefs.Content.variant.default),
  },
  { name: 'color', typeSimple: 'Color', default: 'slate' },
  { name: 'side', typeSimple: '"top" | "right" | "bottom" | "left"', default: 'bottom' },
  { name: 'align', typeSimple: '"start" | "center" | "end"', default: 'start' },
  { name: 'sideOffset', typeSimple: 'number', default: '4' },
  { name: 'open', typeSimple: 'boolean' },
  { name: 'defaultOpen', typeSimple: 'boolean' },
  { name: 'onOpenChange', typeSimple: '(open: boolean) => void' },
  { name: 'onItemSelect', typeSimple: '(item: MenuWrapperActionItem) => void' },
  { name: 'onCheckboxChange', typeSimple: '(item: MenuWrapperCheckboxItem, checked: boolean) => void' },
  { name: 'onRadioValueChange', typeSimple: '(group: MenuWrapperRadioGroup, value: string) => void' },
  { name: 'renderItem', typeSimple: '(item, defaultRender) => ReactNode' },
  { name: 'renderGroup', typeSimple: '(group, defaultRender) => ReactNode' },
  { name: 'className', typeSimple: 'string' },
  { name: 'contentClassName', typeSimple: 'string' },
]
export const popoverPropDefs: PropDef[] = createDocsPropDefs(uiPopoverPropDefs)
export const popoverWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'PopoverWrapperData', required: true },
  { name: 'trigger', typeSimple: 'ReactNode', required: true },
  { name: 'showClose', typeSimple: 'boolean', default: true },
  { name: 'open', typeSimple: 'boolean' },
  { name: 'defaultOpen', typeSimple: 'boolean' },
  { name: 'onOpenChange', typeSimple: '(open: boolean) => void' },
  { name: 'onActionSelect', typeSimple: '(action, section) => void' },
  { name: 'renderField', typeSimple: '(section, field, defaultRender) => ReactNode' },
  { name: 'renderSection', typeSimple: '(section, defaultRender) => ReactNode' },
  { name: 'renderAction', typeSimple: '(section, action, defaultRender) => ReactNode' },
  {
    name: 'variant',
    typeSimple: enumType(uiPopoverPropDefs.variant),
    default: String(uiPopoverPropDefs.variant.default),
  },
  { name: 'color', typeSimple: 'Color', default: 'slate' },
  { name: 'highContrast', typeSimple: 'boolean', default: false },
  { name: 'radius', typeSimple: enumType(uiPopoverPropDefs.radius), default: String(uiPopoverPropDefs.radius.default) },
  { name: 'size', typeSimple: enumType(uiPopoverPropDefs.size), default: String(uiPopoverPropDefs.size.default) },
  {
    name: 'maxWidth',
    typeSimple: enumType(uiPopoverPropDefs.maxWidthToken),
    default: String(uiPopoverPropDefs.maxWidthToken.default),
  },
  { name: 'side', typeSimple: '"top" | "right" | "bottom" | "left"', default: 'bottom' },
  { name: 'align', typeSimple: '"start" | "center" | "end"', default: 'center' },
  { name: 'sideOffset', typeSimple: 'number', default: '8' },
  { name: 'alignOffset', typeSimple: 'number', default: '0' },
  { name: 'className', typeSimple: 'string' },
  { name: 'contentClassName', typeSimple: 'string' },
]
export const radioGroupPropDefs: PropDef[] = withMarginPropDocs(createDocsPropDefs(uiRadioGroupRootPropDefs))
export const radioGroupWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'RadioGroupWrapperItem[]', required: true },
  {
    name: 'size',
    typeSimple: enumType(uiRadioGroupRootPropDefs.size),
    default: String(uiRadioGroupRootPropDefs.size.default),
  },
  {
    name: 'variant',
    typeSimple: enumType(uiRadioGroupRootPropDefs.variant),
    default: String(uiRadioGroupRootPropDefs.variant.default),
  },
  { name: 'color', typeSimple: 'Color', default: 'slate' },
  { name: 'highContrast', typeSimple: 'boolean', default: false },
  { name: 'orientation', typeSimple: '"horizontal" | "vertical"', default: 'vertical' },
  { name: 'renderItem', typeSimple: '(item, defaultRender) => ReactNode' },
]
export const segmentedControlPropDefs: PropDef[] = withMarginPropDocs(createDocsPropDefs(uiSegmentedControlPropDefs))
export const scrollAreaPropDefs: PropDef[] = withPaddingPropDocs(
  withMarginPropDocs(createDocsPropDefs(uiScrollAreaPropDefs)),
)
export const sectionDocsPropDefs: PropDef[] = withPaddingPropDocs(createDocsPropDefs(uiSectionPropDefs))
export const selectPropDefs = {
  Root: createDocsPropDefs(uiSelectPropDefs.Root),
  Trigger: createDocsPropDefs(uiSelectPropDefs.Trigger),
  Content: createDocsPropDefs(uiSelectPropDefs.Content),
} as const
export const sidebarDocsPropDefs: PropDef[] = createDocsPropDefs(uiSidebarRootPropDefs)
export const sidebarWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'SidebarWrapperData' },
  { name: 'remoteUrl', typeSimple: 'string' },
  { name: 'team', typeSimple: 'SidebarWrapperTeam' },
  { name: 'user', typeSimple: 'SidebarWrapperUser' },
  { name: 'search', typeSimple: 'SidebarWrapperSearch' },
  { name: 'variant', typeSimple: '"surface" | "solid" | "soft"', default: 'surface' },
  { name: 'collapsible', typeSimple: '"offcanvas" | "icon" | "none"', default: 'offcanvas' },
  { name: 'side', typeSimple: '"left" | "right"', default: 'left' },
  { name: 'color', typeSimple: 'Color', default: 'slate' },
  { name: 'defaultOpen', typeSimple: 'boolean', default: true },
  { name: 'open', typeSimple: 'boolean' },
  { name: 'onOpenChange', typeSimple: '(open: boolean) => void' },
  { name: 'renderItem', typeSimple: '(item, defaultRender) => ReactNode' },
  { name: 'renderGroup', typeSimple: '(group, defaultRender) => ReactNode' },
  { name: 'showRail', typeSimple: 'boolean', default: true },
  { name: 'className', typeSimple: 'string' },
  { name: 'children', typeSimple: 'ReactNode' },
]
export const sliderPropDefs: PropDef[] = withMarginPropDocs(createDocsPropDefs(uiSliderPropDefs))
export const switchPropDefs: PropDef[] = createDocsPropDefs(uiSwitchPropDefs)
export const switchGroupPropDefs: PropDef[] = withStringArrayValueProps(createDocsPropDefs(uiSwitchGroupRootPropDefs))
export const switchGroupWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'SwitchGroupWrapperItem[]', required: true },
  { name: 'size', typeSimple: enumType(uiSwitchPropDefs.size), default: String(uiSwitchPropDefs.size.default) },
  {
    name: 'variant',
    typeSimple: enumType(uiSwitchPropDefs.variant),
    default: String(uiSwitchPropDefs.variant.default),
  },
  { name: 'color', typeSimple: 'Color', default: 'primary' },
  { name: 'radius', typeSimple: enumType(uiSwitchPropDefs.radius), default: String(uiSwitchPropDefs.radius.default) },
  { name: 'orientation', typeSimple: '"horizontal" | "vertical"', default: 'vertical' },
  { name: 'renderItem', typeSimple: '(item, defaultRender) => ReactNode' },
]
export const spinnerPropDefs: PropDef[] = createDocsPropDefs(uiSpinnerPropDefs)
export const tabsPropDefs = {
  Root: withMarginPropDocs(createDocsPropDefs(uiTabsPropDefs.Root).filter(prop => prop.name !== 'asChild')),
  List: createDocsPropDefs(uiTabsPropDefs.List),
  Content: createDocsPropDefs(uiTabsPropDefs.Content),
} as const
export const tabsWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'TabsWrapperData', required: true },
  { name: 'value', typeSimple: 'string' },
  { name: 'defaultValue', typeSimple: 'string' },
  { name: 'onValueChange', typeSimple: '(value: string) => void' },
  { name: 'onTabChange', typeSimple: '(item: TabsWrapperItem, value: string) => void' },
  { name: 'renderItem', typeSimple: '(item, defaults) => { trigger?: ReactNode; content?: ReactNode }' },
  { name: 'size', typeSimple: enumType(uiTabsPropDefs.Root.size), default: String(uiTabsPropDefs.Root.size.default) },
  {
    name: 'variant',
    typeSimple: enumType(uiTabsPropDefs.Root.variant),
    default: String(uiTabsPropDefs.Root.variant.default),
  },
  { name: 'color', typeSimple: 'Color', default: 'slate' },
  { name: 'highContrast', typeSimple: 'boolean', default: false },
  { name: 'hover', typeSimple: 'boolean', default: true },
  { name: 'orientation', typeSimple: '"horizontal" | "vertical"', default: 'horizontal' },
  { name: 'className', typeSimple: 'string' },
]
export const textAreaPropDefs: PropDef[] = withMarginPropDocs(createDocsPropDefs(uiTextAreaPropDefs))
export const textFieldPropDefs: PropDef[] = withMarginPropDocs([
  {
    name: 'size',
    typeSimple: enumType(uiTextFieldRootPropDefs.size),
    default: String(uiTextFieldRootPropDefs.size.default),
  },
  {
    name: 'variant',
    typeSimple: enumType(uiTextFieldRootPropDefs.variant),
    default: String(uiTextFieldRootPropDefs.variant.default),
  },
  { name: 'color', typeSimple: 'Color', default: 'slate' },
  {
    name: 'radius',
    typeSimple: enumType(uiTextFieldRootPropDefs.radius),
    default: String(uiTextFieldRootPropDefs.radius.default),
  },
  { name: 'label', typeSimple: 'string' },
  { name: 'leftIcon', typeSimple: 'ReactNode' },
  { name: 'rightIcon', typeSimple: 'ReactNode' },
])
export const timelinePropDefs: PropDef[] = [
  {
    name: 'orientation',
    typeSimple: asTypeUnion(uiTimelinePropDefs.orientation.values as readonly string[]),
    default: String(uiTimelinePropDefs.orientation.default),
  },
  {
    name: 'size',
    typeSimple: asTypeUnion(uiTimelinePropDefs.size.values as readonly string[]),
    default: String(uiTimelinePropDefs.size.default),
  },
]
export const toastPropDefs: PropDef[] = createDocsPropDefs(uiToastPropDefs)
export const tooltipWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'TooltipWrapperData', required: true },
  { name: 'trigger', typeSimple: 'ReactNode', required: true },
  { name: 'open', typeSimple: 'boolean' },
  { name: 'defaultOpen', typeSimple: 'boolean' },
  { name: 'onOpenChange', typeSimple: '(open: boolean) => void' },
  { name: 'showArrow', typeSimple: 'boolean', default: true },
  { name: 'renderItem', typeSimple: '(item, defaultRender) => ReactNode' },
  {
    name: 'variant',
    typeSimple: enumType(uiTooltipPropDefs.variant),
    default: String(uiTooltipPropDefs.variant.default),
  },
  { name: 'color', typeSimple: 'Color', default: 'inverse' },
  { name: 'highContrast', typeSimple: 'boolean', default: false },
  { name: 'radius', typeSimple: enumType(uiTooltipPropDefs.radius), default: String(uiTooltipPropDefs.radius.default) },
  { name: 'size', typeSimple: enumType(uiTooltipPropDefs.size), default: String(uiTooltipPropDefs.size.default) },
  {
    name: 'maxWidth',
    typeSimple: enumType(uiTooltipPropDefs.maxWidthToken),
    default: String(uiTooltipPropDefs.maxWidthToken.default),
  },
  { name: 'side', typeSimple: '"top" | "right" | "bottom" | "left"', default: 'top' },
  { name: 'align', typeSimple: '"start" | "center" | "end"', default: 'center' },
  { name: 'sideOffset', typeSimple: 'number', default: '6' },
  { name: 'alignOffset', typeSimple: 'number', default: '0' },
  { name: 'className', typeSimple: 'string' },
  { name: 'contentClassName', typeSimple: 'string' },
]

export const docsPropDefinitions = {
  accordionPropDefs,
  appShellPropDefs,
  avatarGroupPropDefs,
  avatarPiePropDefs,
  avatarPropDefs,
  badgePropDefs,
  buttonPropDefs,
  calloutPropDefs,
  cardPropDefs,
  gradientBackgroundPropDefs,
  insetPropDefs,
  imagePropDefs,
  iconPropDefs,
  iconButtonPropDefs,
  segmentedControlPropDefs,
  sliderPropDefs,
  spinnerPropDefs,
  tabsPropDefs,
}

export type DocsPropDefinitionKey = keyof typeof docsPropDefinitions

export type { PropDef } from './prop-def-utils'
export { createDocsPropDefs, withGapPropDocs, withMarginPropDocs, withPaddingPropDocs } from './prop-def-utils'
