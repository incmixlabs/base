import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { I18nProvider } from 'react-aria-components'
import { Text } from '@/typography'
import { DateRangePickerNext } from './DateRangePickerNext'
import {
  dateNextColorValues,
  dateNextNavButtonVariantValues,
  dateNextRadiusValues,
  dateNextSizeValues,
  dateNextVariantValues,
  dateNextVisibleMonthControlLabels,
  dateNextVisibleMonthControlMapping,
  dateNextVisibleMonthControlOptions,
} from './date-next.props'
import type { DateRangeValue } from './date-range-value-boundary'

const meta: Meta<typeof DateRangePickerNext> = {
  title: 'Form/Date Next/DateRangePickerNext (Spike)',
  component: DateRangePickerNext,
  parameters: {
    layout: 'centered',
  },
  args: {
    ariaLabel: 'Travel dates',
    label: 'Travel dates',
    name: 'tripDate',
    variant: 'outline',
    color: 'neutral',
    navButtonVariant: 'soft',
    size: 'md',
    radius: 'md',
    isDisabled: false,
    dateFormat: 'yyyy-MM-dd',
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: dateNextVariantValues },
    color: { control: 'select', options: dateNextColorValues },
    navButtonVariant: { control: 'select', options: dateNextNavButtonVariantValues },
    size: { control: 'select', options: dateNextSizeValues },
    radius: { control: 'select', options: dateNextRadiusValues },
    isDisabled: { control: 'boolean' },
    dateFormat: { control: 'text' },
    visibleMonths: {
      control: { type: 'select' },
      options: dateNextVisibleMonthControlOptions,
      mapping: dateNextVisibleMonthControlMapping,
      labels: dateNextVisibleMonthControlLabels,
    },
  },
}

export default meta
type Story = StoryObj<typeof DateRangePickerNext>
const toLocalYmd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const defaultRange: DateRangeValue = { from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }
const boundsDefaultRange: DateRangeValue = { from: new Date(2026, 0, 17), to: new Date(2026, 0, 20) }
const minRangeDate = new Date(2026, 0, 10)
const maxRangeDate = new Date(2026, 0, 24)
const disabledRangeDates = [new Date(2026, 0, 16), new Date(2026, 0, 21)]

export const Default: Story = {
  render: args => {
    const [value, setValue] = React.useState<DateRangeValue | undefined>(defaultRange)

    return (
      <div className="w-[420px] space-y-2">
        <DateRangePickerNext {...args} value={value} onChange={setValue} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Selected: {value?.from ? toLocalYmd(value.from) : 'none'} to {value?.to ? toLocalYmd(value.to) : 'none'}
        </Text>
      </div>
    )
  },
}

export const InteractiveKnobs: Story = {
  args: {
    defaultValue: defaultRange,
    visibleMonths: 2,
  },
  render: args => {
    return (
      <div className="w-[520px] space-y-2">
        <DateRangePickerNext {...args} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Knobs: set `visibleMonths=2`, then click month headings to open month/year wheel picker.
        </Text>
      </div>
    )
  },
}

export const Playground: Story = {
  args: {
    defaultValue: defaultRange,
    visibleMonths: 2,
  },
  render: args => <DateRangePickerNext {...args} />,
}

export const BoundsAndDisabledDates: Story = {
  render: args => {
    const [value, setValue] = React.useState<DateRangeValue | undefined>(boundsDefaultRange)

    return (
      <div className="w-[420px] space-y-2">
        <DateRangePickerNext
          {...args}
          value={value}
          onChange={setValue}
          minValue={minRangeDate}
          maxValue={maxRangeDate}
          disabledDates={disabledRangeDates}
        />
        <Text as="p" size="sm" className="text-muted-foreground">
          Selected: {value?.from ? toLocalYmd(value.from) : 'none'} to {value?.to ? toLocalYmd(value.to) : 'none'}
        </Text>
        <Text as="p" size="sm" className="text-muted-foreground">
          Bounds: {toLocalYmd(minRangeDate)} to {toLocalYmd(maxRangeDate)}
        </Text>
      </div>
    )
  },
}

export const MultiMonth: Story = {
  args: {
    visibleMonths: 2,
  },
  render: args => {
    const [value, setValue] = React.useState<DateRangeValue | undefined>({
      from: new Date(2026, 0, 30),
      to: new Date(2026, 1, 3),
    })

    return (
      <div className="w-[760px] space-y-2">
        <DateRangePickerNext {...args} value={value} onChange={setValue} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Multi-month: two months visible for easier cross-month range selection.
        </Text>
        <Text as="p" size="sm" className="text-muted-foreground">
          Selected: {value?.from ? toLocalYmd(value.from) : 'none'} to {value?.to ? toLocalYmd(value.to) : 'none'}
        </Text>
      </div>
    )
  },
}
export const KeyboardParity: Story = {
  render: args => (
    <div className="w-[420px] space-y-2">
      <DateRangePickerNext {...args} defaultValue={defaultRange} />
      <Text as="p" size="sm" className="text-muted-foreground">
        Keyboard check: focus trigger and press Enter to open, Escape to close, Tab to move across segments.
      </Text>
    </div>
  ),
}

export const LocaleArabicEgypt: Story = {
  render: args => (
    <div className="w-[420px] space-y-2">
      <I18nProvider locale="ar-EG">
        <DateRangePickerNext {...args} defaultValue={defaultRange} />
      </I18nProvider>
      <Text as="p" size="sm" className="text-muted-foreground">
        Locale: `ar-EG` (Arabic numerals in date segments).
      </Text>
    </div>
  ),
}

export const SurfaceColorVariants: Story = {
  render: () => {
    return (
      <div className="w-[680px] space-y-3">
        {dateNextColorValues.map(color => (
          <div key={color} className="space-y-1">
            <Text as="p" size="sm" className="text-muted-foreground capitalize">
              {color}
            </Text>
            <DateRangePickerNext
              ariaLabel={`Travel dates ${color}`}
              name={`tripDate_${color}`}
              defaultValue={defaultRange}
              variant="surface"
              color={color}
            />
          </div>
        ))}
      </div>
    )
  },
}

export const AllVariants: Story = {
  render: () => {
    return (
      <div className="w-[680px] space-y-3">
        {dateNextVariantValues.map(variant => (
          <div key={variant} className="space-y-1">
            <Text as="p" size="sm" className="text-muted-foreground capitalize">
              {variant}
            </Text>
            <DateRangePickerNext
              ariaLabel={`Travel dates ${variant}`}
              name={`tripDate_${variant}`}
              defaultValue={defaultRange}
              variant={variant}
            />
          </div>
        ))}
      </div>
    )
  },
}

export const AllColorsByVariant: Story = {
  render: () => {
    return (
      <div className="w-[920px] space-y-5">
        {dateNextVariantValues.map(variant => (
          <div key={variant} className="space-y-2">
            <Text as="p" size="sm" className="text-muted-foreground capitalize">
              {variant}
            </Text>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {dateNextColorValues.map(color => (
                <div key={`${variant}_${color}`} className="space-y-1">
                  <Text as="p" size="sm" className="text-muted-foreground capitalize">
                    {color}
                  </Text>
                  <DateRangePickerNext
                    ariaLabel={`Travel dates ${variant} ${color}`}
                    name={`tripDate_${variant}_${color}`}
                    defaultValue={defaultRange}
                    variant={variant}
                    color={color}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

export const AllSizesByVariant: Story = {
  render: () => {
    return (
      <div className="w-[760px] space-y-5">
        {dateNextVariantValues.map(variant => (
          <div key={variant} className="space-y-2">
            <Text as="p" size="sm" className="text-muted-foreground capitalize">
              {variant}
            </Text>
            <div className="space-y-3">
              {dateNextSizeValues.map(size => (
                <div key={`${variant}_${size}`} className="space-y-1">
                  <Text as="p" size="sm" className="text-muted-foreground">
                    Size: {size}
                  </Text>
                  <DateRangePickerNext
                    ariaLabel={`Travel dates ${variant} ${size}`}
                    name={`tripDate_${variant}_${size}`}
                    defaultValue={defaultRange}
                    variant={variant}
                    size={size}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}
