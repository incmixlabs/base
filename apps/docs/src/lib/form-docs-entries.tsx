'use client'

import { COMPONENT_REGISTRY_ENTRY_KIND, COMPONENT_REGISTRY_SCHEMA_VERSION } from '@incmix/core'
import { Stepper } from '@incmix/ui/elements'
import {
  Checkbox,
  CheckboxGroup,
  CheckboxWithLabel,
  RadioGroup,
  Rating,
  Select,
  SelectItem,
  Switch,
  SwitchGroup,
  SwitchWithLabel,
  Textarea,
  TextField,
} from '@incmix/ui/form'
import { Flex } from '@incmix/ui/layouts'
import { Search } from 'lucide-react'
import type { CatalogEntry } from '@/editor/catalog'
import { stepperPropDefs as stepperThemePropDefs } from '@/editor/elements/props'
import {
  checkboxPropDefs as checkboxThemePropDefs,
  radioGroupRootPropDefs,
  ratingPropDefs as ratingThemePropDefs,
  switchPropDefs as switchThemePropDefs,
  textAreaPropDefs as textAreaThemePropDefs,
  textFieldRootPropDefs,
} from '@/editor/form/props'
import { createDocsPropDefs } from '@/editor/live'
import {
  checkboxGroupPropDefs,
  checkboxPropDefs,
  radioGroupPropDefs,
  selectPropDefs,
  switchGroupPropDefs,
  switchPropDefs,
  textAreaPropDefs,
  textFieldPropDefs,
} from '@/editor/prop-defs'
import { autoProps, createAutogenEntry } from './element-docs-types'

function toRuntimeComponentName(value: string): string {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

function createFormBaseEntry(config: {
  slug: string
  title: string
  description: string
  sourcePath: string
  overviewCode: string
  propDefs: CatalogEntry['propDefs']
  runtimeScope: CatalogEntry['runtimeScope']
  rendererId?: CatalogEntry['runtime']['rendererId']
}): CatalogEntry {
  return {
    schemaVersion: COMPONENT_REGISTRY_SCHEMA_VERSION,
    kind: COMPONENT_REGISTRY_ENTRY_KIND,
    id: `ui.form.${config.slug}`,
    slug: config.slug,
    title: config.title,
    description: config.description,
    family: 'form',
    category: 'inputs',
    runtime: {
      kind: 'known-renderer',
      rendererId: config.rendererId ?? 'ui.form',
      componentName: toRuntimeComponentName(config.title),
    },
    discovery: {
      summary: config.description,
      group: 'Form',
      hierarchy: ['form', config.slug],
      tags: ['form', ...config.slug.split('-')],
      keywords: [config.title, config.slug, ...config.title.toLowerCase().split(/\s+/)],
    },
    ownership: {
      scope: 'public',
    },
    persistence: {
      source: 'code',
      mutable: false,
      scope: 'repository',
      notes: 'Code-authored docs form entry seed.',
    },
    sourcePath: config.sourcePath,
    overviewCode: config.overviewCode,
    propDefs: config.propDefs,
    runtimeScope: config.runtimeScope,
  }
}

export const formEntries = {
  checkbox: createAutogenEntry({
    base: createFormBaseEntry({
      slug: 'checkbox',
      title: 'Checkbox',
      description: 'Single boolean control with token-aware size, variant, color, and indeterminate support.',
      sourcePath: 'packages/ui/src/form/Checkbox.tsx',
      propDefs: checkboxPropDefs,
      overviewCode: `<Flex gap="4" align="center">
  <Checkbox defaultChecked />
  <Checkbox variant="outline" />
  <Checkbox indeterminate />
</Flex>`,
      runtimeScope: { Checkbox, Flex },
    }),
    propDefsByName: checkboxThemePropDefs,
    props: autoProps,
    display: 'inline',
    inlineComponent: 'Button',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex align="center" gap="4" wrap="wrap">
      {sizes.map(size => (
        <Checkbox key={size} size={size} defaultChecked aria-label={size + ' checkbox'} />
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const values = ${valuesLiteral}
  return (
    <Flex align="center" gap="4" wrap="wrap">
      {values.map(value => (
        <Checkbox key={value} variant={value} defaultChecked aria-label={value + ' checkbox'} />
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex align="center" gap="4" wrap="wrap">
      {colors.map(color => (
        <Checkbox key={color} color={color} defaultChecked aria-label={color + ' checkbox'} />
      ))}
    </Flex>
  )
}`,
      highContrast: () => `export default function Example() {
  return (
    <Flex align="center" gap="4" wrap="wrap">
      <Checkbox defaultChecked aria-label="Standard checkbox" />
      <Checkbox defaultChecked highContrast aria-label="High contrast checkbox" />
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'with-label',
        title: 'With Label',
        description: 'Use the labeled wrapper when the control and caption should remain semantically grouped.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="3">
      <CheckboxWithLabel label="Email notifications" defaultChecked />
      <CheckboxWithLabel label="Require approval" variant="outline" />
      <CheckboxWithLabel label="Archive after 30 days" disabled />
    </Flex>
  )
}`,
        scope: { CheckboxWithLabel },
      },
    ],
  }),
  'checkbox-group': {
    ...createFormBaseEntry({
      slug: 'checkbox-group',
      title: 'Checkbox Group',
      description: 'Multi-select checkbox list with shared group size, variant, color, and orientation controls.',
      sourcePath: 'packages/ui/src/form/CheckboxGroup.tsx',
      propDefs: checkboxGroupPropDefs,
      overviewCode: `<CheckboxGroup.Root defaultValue={['email']}>
  <CheckboxGroup.Item value="email" label="Email" description="Account and product updates" />
  <CheckboxGroup.Item value="sms" label="SMS" description="Urgent alerts only" />
  <CheckboxGroup.Item value="push" label="Push" />
</CheckboxGroup.Root>`,
      runtimeScope: { CheckboxGroup },
    }),
    sections: [
      {
        id: 'orientation',
        title: 'Horizontal Layout',
        description: 'Use horizontal orientation when the option count is small and labels are short.',
        code: `export default function Example() {
  return (
    <CheckboxGroup.Root orientation="horizontal" defaultValue={['a']}>
      <CheckboxGroup.Item value="a" label="Alpha" />
      <CheckboxGroup.Item value="b" label="Beta" />
      <CheckboxGroup.Item value="c" label="Gamma" />
    </CheckboxGroup.Root>
  )
}`,
      },
    ],
  },
  'radio-group': createAutogenEntry({
    base: createFormBaseEntry({
      slug: 'radio-group',
      title: 'Radio Group',
      description: 'Single-select radio list with shared variant, color, and tokenized group spacing.',
      sourcePath: 'packages/ui/src/form/RadioGroup.tsx',
      propDefs: radioGroupPropDefs,
      overviewCode: `<RadioGroup.Root defaultValue="pro">
  <RadioGroup.Item value="free" label="Free" />
  <RadioGroup.Item value="pro" label="Pro" />
  <RadioGroup.Item value="enterprise" label="Enterprise" />
</RadioGroup.Root>`,
      runtimeScope: { RadioGroup, Flex },
    }),
    propDefsByName: radioGroupRootPropDefs,
    props: autoProps,
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {sizes.map(size => (
        <RadioGroup.Root key={size} size={size} defaultValue="pro">
          <RadioGroup.Item value="free" label="Free" />
          <RadioGroup.Item value="pro" label={'Pro · ' + size} />
        </RadioGroup.Root>
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {variants.map(variant => (
        <RadioGroup.Root key={variant} variant={variant} defaultValue="pro">
          <RadioGroup.Item value="free" label="Free" />
          <RadioGroup.Item value="pro" label={variant} />
        </RadioGroup.Root>
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {colors.map(color => (
        <RadioGroup.Root key={color} color={color} defaultValue="pro">
          <RadioGroup.Item value="free" label="Free" />
          <RadioGroup.Item value="pro" label={color} />
        </RadioGroup.Root>
      ))}
    </Flex>
  )
}`,
      highContrast: () => `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      <RadioGroup.Root defaultValue="standard">
        <RadioGroup.Item value="standard" label="Standard" />
      </RadioGroup.Root>
      <RadioGroup.Root defaultValue="contrast" highContrast>
        <RadioGroup.Item value="contrast" label="High contrast" />
      </RadioGroup.Root>
    </Flex>
  )
}`,
    },
  }),
  rating: createAutogenEntry({
    base: createFormBaseEntry({
      slug: 'rating',
      title: 'Rating',
      description: 'Star-based rating input with configurable size, color, orientation, and clearable selection.',
      sourcePath: 'packages/ui/src/form/Rating.tsx',
      propDefs: createDocsPropDefs(ratingThemePropDefs),
      overviewCode: `<Rating defaultValue={3} color="warning" aria-label="Rate the experience" />`,
      runtimeScope: { Rating, Flex },
    }),
    propDefsByName: ratingThemePropDefs,
    props: ['size', 'color'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {sizes.map(size => (
        <Rating key={size} size={size} defaultValue={3} aria-label={'Rating · ' + size} />
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {colors.map(color => (
        <Rating key={color} color={color} defaultValue={4} aria-label={color + ' rating'} />
      ))}
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'interaction',
        title: 'Interaction Modes',
        description: 'Use clearable and step to control how precisely users can score an item.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      <Rating defaultValue={4} clearable aria-label="Clearable rating" />
      <Rating defaultValue={3.5} step={0.5} aria-label="Half-step rating" />
      <Rating defaultValue={2} orientation="vertical" aria-label="Vertical rating" />
    </Flex>
  )
}`,
      },
    ],
  }),
  select: {
    ...createFormBaseEntry({
      slug: 'select',
      title: 'Select',
      description: 'Trigger-based single-select field that shares the text-field contract and a themed popup surface.',
      sourcePath: 'packages/ui/src/form/Select.tsx',
      propDefs: [...selectPropDefs.Root, ...selectPropDefs.Trigger, ...selectPropDefs.Content],
      overviewCode: `<Select label="Region" placeholder="Select region">
  <SelectItem value="us">United States</SelectItem>
  <SelectItem value="eu">Europe</SelectItem>
  <SelectItem value="apac">Asia Pacific</SelectItem>
</Select>`,
      runtimeScope: { Flex, Select, SelectItem },
    }),
    apiSections: [
      { id: 'root-props', title: 'Root Props', propDefs: selectPropDefs.Root },
      { id: 'trigger-props', title: 'Trigger Props', propDefs: selectPropDefs.Trigger },
      { id: 'content-props', title: 'Content Props', propDefs: selectPropDefs.Content },
    ],
    sections: [
      {
        id: 'sizes',
        title: 'Sizes',
        description: 'Root size controls the trigger density and field rhythm for the whole component.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      {['sm', 'md', 'lg'].map(size => (
        <Select key={size} size={size} label={'Region · ' + size} placeholder="Select region">
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="eu">Europe</SelectItem>
          <SelectItem value="apac">Asia Pacific</SelectItem>
        </Select>
      ))}
    </Flex>
  )
}`,
      },
      {
        id: 'trigger-variants',
        title: 'Trigger Variants',
        description: 'Use trigger variants to match surrounding field chrome without changing the popup surface.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      {['outline', 'surface', 'soft'].map(variant => (
        <Select key={variant} variant={variant} label={variant} placeholder="Select region">
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="eu">Europe</SelectItem>
          <SelectItem value="apac">Asia Pacific</SelectItem>
        </Select>
      ))}
    </Flex>
  )
}`,
      },
      {
        id: 'content-variants',
        title: 'Content Variants',
        description: 'Popup content can use a separate semantic treatment from the field trigger.',
        code: `export default function Example() {
  return (
    <Flex direction="column" gap="4">
      {['solid', 'soft'].map(contentVariant => (
        <Select key={contentVariant} contentVariant={contentVariant} label={contentVariant} placeholder="Select region">
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="eu">Europe</SelectItem>
          <SelectItem value="apac">Asia Pacific</SelectItem>
        </Select>
      ))}
    </Flex>
  )
}`,
      },
    ],
  },
  stepper: createAutogenEntry({
    base: createFormBaseEntry({
      slug: 'stepper',
      title: 'Stepper',
      description:
        'Sequential progress component for multi-step flows with tokenized size, orientation, and visual variants.',
      sourcePath: 'packages/ui/src/elements/stepper/Stepper.tsx',
      rendererId: 'ui.elements',
      propDefs: createDocsPropDefs(stepperThemePropDefs),
      overviewCode: `<Stepper
  currentStep={1}
  steps={[
    { id: 'account', title: 'Account' },
    { id: 'details', title: 'Details' },
    { id: 'review', title: 'Review' },
  ]}
/>`,
      runtimeScope: { Flex, Stepper },
    }),
    propDefsByName: stepperThemePropDefs,
    props: ['size', 'variant'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  const steps = [
    { id: 'account', title: 'Account' },
    { id: 'details', title: 'Details' },
    { id: 'review', title: 'Review' },
  ]

  return (
    <Flex direction="column" gap="4">
      {sizes.map(size => (
        <Stepper key={size} size={size} currentStep={1} steps={steps} />
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  const steps = [
    { id: 'account', title: 'Account' },
    { id: 'details', title: 'Details' },
    { id: 'review', title: 'Review' },
  ]

  return (
    <Flex direction="column" gap="4">
      {variants.map(variant => (
        <Stepper key={variant} variant={variant} currentStep={1} steps={steps} />
      ))}
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'orientation',
        title: 'Orientation',
        description: 'Use vertical orientation when each step needs more room for labels or supporting descriptions.',
        code: `export default function Example() {
  const steps = [
    { id: 'account', title: 'Account', description: 'Create the base profile' },
    { id: 'details', title: 'Details', description: 'Add project information' },
    { id: 'review', title: 'Review', description: 'Confirm and submit' },
  ]

  return (
    <Stepper orientation="vertical" currentStep={1} steps={steps} />
  )
}`,
      },
    ],
  }),
  switch: createAutogenEntry({
    base: createFormBaseEntry({
      slug: 'switch',
      title: 'Switch',
      description: 'Binary toggle control for immediate on/off state with tokenized size, radius, and variant styles.',
      sourcePath: 'packages/ui/src/form/Switch.tsx',
      propDefs: switchPropDefs,
      overviewCode: `<Flex gap="4" align="center">
  <Switch defaultChecked />
  <Switch variant="classic" />
  <Switch variant="soft" color="success" defaultChecked />
</Flex>`,
      runtimeScope: { Flex, Switch },
    }),
    propDefsByName: switchThemePropDefs,
    props: ['size', 'variant', 'color', 'highContrast'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex align="center" gap="4" wrap="wrap">
      {sizes.map(size => (
        <Switch key={size} size={size} defaultChecked aria-label={size + ' switch'} />
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex align="center" gap="4" wrap="wrap">
      {variants.map(variant => (
        <Switch key={variant} variant={variant} defaultChecked aria-label={variant + ' switch'} />
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex align="center" gap="4" wrap="wrap">
      {colors.map(color => (
        <Switch key={color} color={color} defaultChecked aria-label={color + ' switch'} />
      ))}
    </Flex>
  )
}`,
      highContrast: () => `export default function Example() {
  return (
    <Flex align="center" gap="4" wrap="wrap">
      <Switch defaultChecked aria-label="Standard switch" />
      <Switch defaultChecked highContrast aria-label="High contrast switch" />
    </Flex>
  )
}`,
    },
    extraSections: [
      {
        id: 'with-label',
        title: 'With Label',
        description: 'Use the labeled wrapper when the control and descriptive text should stay bundled.',
        code: `export default function Example() {
  return <SwitchWithLabel label="Enable automations" defaultChecked />
}`,
        scope: { SwitchWithLabel },
      },
    ],
  }),
  'switch-group': {
    ...createFormBaseEntry({
      slug: 'switch-group',
      title: 'Switch Group',
      description: 'Multi-toggle control for grouped preferences with shared size, color, radius, and orientation.',
      sourcePath: 'packages/ui/src/form/SwitchGroup.tsx',
      propDefs: switchGroupPropDefs,
      overviewCode: `<SwitchGroup.Root defaultValue={['email']}>
  <SwitchGroup.Item name="email" label="Email" description="Weekly digest" />
  <SwitchGroup.Item name="push" label="Push" />
  <SwitchGroup.Item name="sms" label="SMS" />
</SwitchGroup.Root>`,
      runtimeScope: { SwitchGroup },
    }),
    sections: [
      {
        id: 'orientation',
        title: 'Horizontal Layout',
        description: 'Horizontal orientation works well for short labels in compact preference panels.',
        code: `export default function Example() {
  return (
    <SwitchGroup.Root orientation="horizontal" defaultValue={['email']}>
      <SwitchGroup.Item name="email" label="Email" />
      <SwitchGroup.Item name="push" label="Push" />
      <SwitchGroup.Item name="sms" label="SMS" />
    </SwitchGroup.Root>
  )
}`,
      },
    ],
  },
  'text-field': createAutogenEntry({
    base: createFormBaseEntry({
      slug: 'text-field',
      title: 'Text Field',
      description: 'Single-line text input with outline and floating variants, shared size tokens, and icon slots.',
      sourcePath: 'packages/ui/src/form/TextField.tsx',
      propDefs: textFieldPropDefs,
      overviewCode: `<TextField label="Workspace name" placeholder="Acme Operations" leftIcon={<Search className="h-4 w-4" />} />`,
      runtimeScope: { Flex, Search, TextField },
    }),
    propDefsByName: textFieldRootPropDefs,
    props: ['size', 'variant', 'color'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {sizes.map(size => (
        <TextField key={size} size={size} label={'Workspace name · ' + size} placeholder="Acme Operations" />
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {variants.map(variant => (
        <TextField key={variant} variant={variant} label={variant} placeholder="Acme Operations" />
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {colors.map(color => (
        <TextField key={color} color={color} label={color} placeholder="Acme Operations" />
      ))}
    </Flex>
  )
}`,
    },
  }),
  textarea: createAutogenEntry({
    base: createFormBaseEntry({
      slug: 'textarea',
      title: 'Textarea',
      description: 'Multi-line text input that reuses the text-field contract for size, color, and floating variants.',
      sourcePath: 'packages/ui/src/form/Textarea.tsx',
      propDefs: textAreaPropDefs,
      overviewCode: `<Textarea label="Notes" placeholder="Add implementation notes..." autoSize minRows={3} />`,
      runtimeScope: { Flex, Textarea },
    }),
    propDefsByName: textAreaThemePropDefs,
    props: ['size', 'variant', 'color'],
    display: 'stacked',
    codeByProp: {
      size: valuesLiteral => `export default function Example() {
  const sizes = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {sizes.map(size => (
        <Textarea key={size} size={size} label={'Notes · ' + size} placeholder="Add implementation notes..." />
      ))}
    </Flex>
  )
}`,
      variant: valuesLiteral => `export default function Example() {
  const variants = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {variants.map(variant => (
        <Textarea key={variant} variant={variant} label={variant} placeholder="Add implementation notes..." />
      ))}
    </Flex>
  )
}`,
      color: valuesLiteral => `export default function Example() {
  const colors = ${valuesLiteral}
  return (
    <Flex direction="column" gap="4">
      {colors.map(color => (
        <Textarea key={color} color={color} label={color} placeholder="Add implementation notes..." />
      ))}
    </Flex>
  )
}`,
    },
  }),
} as const
