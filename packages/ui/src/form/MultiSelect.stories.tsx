import type { Meta, StoryObj } from '@storybook/react-vite'
import { Apple, Banana, Cherry, Citrus, Grape } from 'lucide-react'
import { type ComponentProps, useState } from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { sizesXsToLgAnd2x, variantsSolidSoftOutlineGhost } from '@/theme/props/scales'
import { Label } from './Label'
import { MultiSelect, type MultiSelectOption } from './MultiSelect'

const meta: Meta<typeof MultiSelect> = {
  title: 'Form/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: sizesXsToLgAnd2x,
    },
    variant: {
      control: 'select',
      options: variantsSolidSoftOutlineGhost,
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
    },
    radius: {
      control: 'select',
      options: getPropDefValues(radiusPropDef.radius),
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showBadges: { control: 'boolean' },
    searchable: { control: 'boolean' },
    creatable: { control: 'boolean' },
    max: { control: 'number' },
    maxSelected: { control: 'number' },
    maxVisibleBadges: { control: 'number' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    maxSelectedText: { control: 'text' },
    options: { control: false },
    onChange: { control: false },
    value: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof MultiSelect>

const fruitOptions: MultiSelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'orange', label: 'Orange' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'mango', label: 'Mango' },
  { value: 'pineapple', label: 'Pineapple' },
]

const skillOptions: MultiSelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'nodejs', label: 'Node' },
  { value: 'python', label: 'Python' },
]

function LocalMultiSelectWrapper(props: ComponentProps<typeof MultiSelect>) {
  const [selected, setSelected] = useState<string[]>(['apple'])

  return <MultiSelect {...props} value={selected} onChange={setSelected} />
}

function ControlledMultiSelectStory() {
  const [selected, setSelected] = useState<string[]>(['react', 'typescript'])

  return (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <Label>Selected Skills</Label>
        <MultiSelect options={skillOptions} value={selected} onChange={setSelected} placeholder="Select skills..." />
      </div>
      <div className="p-3 bg-muted rounded-md text-sm">
        <strong>Selected:</strong> {selected.length > 0 ? selected.join(', ') : 'None'}
      </div>
    </div>
  )
}

function MaxSelectedMultiSelectStory() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="w-80 space-y-2">
      <Label>Select up to 3 items</Label>
      <MultiSelect
        options={fruitOptions}
        value={selected}
        onChange={setSelected}
        maxSelected={3}
        placeholder="Select up to 3..."
      />
      <p className="text-xs text-muted-foreground">{selected.length}/3 selected</p>
    </div>
  )
}

function NoBadgesMultiSelectStory() {
  const [selected, setSelected] = useState<string[]>(['apple', 'banana'])

  return (
    <div className="w-80 space-y-2">
      <Label>Without Badges</Label>
      <MultiSelect
        options={fruitOptions}
        value={selected}
        onChange={setSelected}
        showBadges={false}
        placeholder="Select fruits..."
      />
    </div>
  )
}

function OverflowBadgeMultiSelectStory() {
  const [selected, setSelected] = useState<string[]>(['apple', 'banana', 'cherry', 'grape', 'orange', 'mango'])

  return (
    <div className="w-80 space-y-2">
      <Label>Visible 3, then +N</Label>
      <MultiSelect
        options={fruitOptions}
        value={selected}
        onChange={setSelected}
        max={3}
        placeholder="Select fruits..."
      />
    </div>
  )
}

function OverflowDropdownMultiSelectStory() {
  const [selected, setSelected] = useState<string[]>(['react', 'typescript', 'javascript', 'nodejs', 'python', 'vue'])

  return (
    <div className="w-[32rem] space-y-2">
      <Label>Visible badges with overflow dropdown</Label>
      <MultiSelect
        options={skillOptions}
        value={selected}
        onChange={setSelected}
        max={3}
        placeholder="Select skills..."
      />
      <p className="text-xs text-muted-foreground">
        Extra selections collapse into the <code>+N</code> chip. Open it to remove hidden items without reopening the
        main list.
      </p>
    </div>
  )
}

function FormExampleMultiSelectStory() {
  const [skills, setSkills] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])

  const interestOptions: MultiSelectOption[] = [
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'reading', label: 'Reading' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'travel', label: 'Travel' },
  ]

  return (
    <div className="w-96 p-6 border rounded-lg space-y-6">
      <h3 className="font-semibold text-lg">Profile Setup</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Technical Skills *</Label>
          <MultiSelect
            options={skillOptions}
            value={skills}
            onChange={setSkills}
            placeholder="Select your skills..."
            error={skills.length === 0}
          />
          {skills.length === 0 && <p className="text-xs text-destructive">Select at least one skill</p>}
        </div>

        <div className="space-y-2">
          <Label>Interests (up to 3)</Label>
          <MultiSelect
            options={interestOptions}
            value={interests}
            onChange={setInterests}
            maxSelected={3}
            placeholder="Select interests..."
          />
        </div>
      </div>

      <button
        type="button"
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50"
        disabled={skills.length === 0}
      >
        Save Profile
      </button>
    </div>
  )
}

function CreatableMultiSelectStory() {
  const [selected, setSelected] = useState<string[]>(['react'])

  return (
    <div className="w-80 space-y-2">
      <Label>Creatable Tags</Label>
      <MultiSelect
        size="xs"
        options={skillOptions}
        value={selected}
        onChange={setSelected}
        creatable
        placeholder="Search or create tags..."
        searchPlaceholder="Search tags..."
      />
      <p className="text-xs text-muted-foreground">Search for a missing tag to reveal the create action.</p>
    </div>
  )
}

export const Playground: Story = {
  args: {
    size: 'xs',
    variant: 'outline',
    color: 'slate',
    radius: 'lg',
    error: false,
    disabled: false,
    showBadges: true,
    searchable: true,
    creatable: false,
    max: 3,
    maxSelected: undefined,
    maxVisibleBadges: undefined,
    placeholder: 'Select fruits...',
    searchPlaceholder: 'Search...',
    maxSelectedText: 'Max items selected',
  },
  render: args => (
    <div className="w-80">
      <LocalMultiSelectWrapper {...args} options={fruitOptions} />
    </div>
  ),
}

export const Default: Story = {
  render: args => (
    <div className="w-80">
      <MultiSelect {...args} options={fruitOptions} placeholder="Select fruits..." />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Favorite Fruits</Label>
      <MultiSelect options={fruitOptions} placeholder="Select fruits..." />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => <ControlledMultiSelectStory />,
}

export const MaxSelected: Story = {
  render: () => <MaxSelectedMultiSelectStory />,
}

export const WithIcons: Story = {
  render: () => {
    const iconOptions: MultiSelectOption[] = [
      { value: 'apple', label: 'Apple', icon: <Apple className="h-4 w-4" /> },
      { value: 'banana', label: 'Banana', icon: <Banana className="h-4 w-4" /> },
      { value: 'cherry', label: 'Cherry', icon: <Cherry className="h-4 w-4" /> },
      { value: 'grape', label: 'Grape', icon: <Grape className="h-4 w-4" /> },
      { value: 'orange', label: 'Orange', icon: <Citrus className="h-4 w-4" /> },
    ]

    return (
      <div className="w-80 space-y-2">
        <Label>With Icons</Label>
        <MultiSelect options={iconOptions} placeholder="Select fruits..." />
      </div>
    )
  },
}

export const WithDisabledOptions: Story = {
  render: () => {
    const options: MultiSelectOption[] = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue', disabled: true },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte', disabled: true },
    ]

    return (
      <div className="w-80 space-y-2">
        <Label>With Disabled Options</Label>
        <MultiSelect options={options} placeholder="Select frameworks..." />
        <p className="text-xs text-muted-foreground">Vue and Svelte are disabled</p>
      </div>
    )
  },
}

export const NoBadges: Story = {
  render: () => <NoBadgesMultiSelectStory />,
}

export const WithOverflowBadge: Story = {
  render: () => <OverflowBadgeMultiSelectStory />,
}

export const OverflowDropdown: Story = {
  render: () => <OverflowDropdownMultiSelectStory />,
}

export const NotSearchable: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Without Search</Label>
      <MultiSelect options={fruitOptions} searchable={false} placeholder="Select fruits..." />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="space-y-2">
          <Label>Size {size}</Label>
          <MultiSelect size={size} options={fruitOptions.slice(0, 4)} placeholder="Select..." />
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      {(['outline', 'soft', 'ghost'] as const).map(variant => (
        <div key={variant} className="space-y-2">
          <Label className="capitalize">{variant}</Label>
          <MultiSelect variant={variant} options={fruitOptions.slice(0, 4)} placeholder="Select..." />
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Disabled</Label>
      <MultiSelect options={fruitOptions} disabled value={['apple', 'banana']} placeholder="Select..." />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>With Error</Label>
      <MultiSelect options={fruitOptions} error placeholder="Select..." />
      <p className="text-xs text-destructive">Please select at least one item</p>
    </div>
  ),
}

export const FormExample: Story = {
  render: () => <FormExampleMultiSelectStory />,
}

export const CreatableXs: Story = {
  render: () => <CreatableMultiSelectStory />,
}
