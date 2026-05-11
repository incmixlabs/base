import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { I18nProvider } from 'react-aria-components'
import { Text } from '@/typography'
import { DatePicker } from './DatePicker'
import { dateColorValues, dateRadiusValues, dateSizeValues, dateVariantValues } from './date.props'

const meta: Meta<typeof DatePicker> = {
  title: 'Form/Date/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  args: {
    ariaLabel: 'Start date',
    label: 'Start date',
    name: 'startDate',
    enableNaturalLanguage: false,
    color: 'neutral',
    size: 'md',
    radius: 'md',
    variant: 'outline',
    isDisabled: false,
    dateFormat: 'yyyy-MM-dd',
  },
  argTypes: {
    label: { control: 'text' },
    color: { control: 'select', options: dateColorValues },
    size: { control: 'select', options: dateSizeValues },
    radius: { control: 'select', options: dateRadiusValues },
    variant: { control: 'select', options: dateVariantValues },
    isDisabled: { control: 'boolean' },
    enableNaturalLanguage: { control: 'boolean' },
    placeholder: {
      control: 'text',
      description: 'Used only by natural-language mode; segmented date inputs use locale-aware segment placeholders.',
    },
    dateFormat: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date | undefined>()
    return (
      <div className="w-[320px] space-y-2">
        <DatePicker {...args} value={value} onChange={setValue} />
        <Text as="p" size="sm" className="text-muted-foreground">
          {value ? value.toDateString() : 'No date selected'}.
          {!args.enableNaturalLanguage ? ' Segmented placeholders are locale-aware.' : ''}
        </Text>
      </div>
    )
  },
}

export const Playground: Story = {
  args: {
    ariaLabel: 'Start date',
    name: 'startDate',
    defaultValue: new Date(2026, 0, 15),
    color: 'neutral',
    size: '2x',
    radius: 'full',
    isDisabled: false,
    dateFormat: 'yyyy-MM-dd',
  },
  render: args => <DatePicker {...args} />,
}

export const WithBounds: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date | undefined>(new Date())
    const min = new Date()
    min.setHours(0, 0, 0, 0)
    const max = new Date(min)
    max.setDate(max.getDate() + 14)

    return (
      <div className="w-[320px] space-y-2">
        <DatePicker {...args} value={value} onChange={setValue} minValue={min} maxValue={max} />
        <p className="text-sm text-muted-foreground">
          {value ? `Selected: ${value.toDateString()}` : 'No date selected'} (next 14 days only)
        </p>
      </div>
    )
  },
}

export const WithDefaultValue: Story = {
  render: args => {
    return (
      <div className="w-[320px] space-y-2">
        <DatePicker {...args} defaultValue={new Date(2026, 0, 15)} />
        <p className="text-sm text-muted-foreground">Uncontrolled picker with default date (Jan 15, 2026)</p>
      </div>
    )
  },
}

export const WithCustomFormat: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date | undefined>(new Date(2026, 0, 15))
    return (
      <div className="w-[320px] space-y-2">
        <DatePicker {...args} value={value} onChange={setValue} dateFormat="dd/MM/yyyy" name="startDate" />
        <Text as="p" size="sm" className="text-muted-foreground">
          Hidden form value uses `dd/MM/yyyy` when `name` is provided.
        </Text>
      </div>
    )
  },
}

export const NaturalLanguage: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date | undefined>()
    return (
      <div className="w-[320px] space-y-2">
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
          enableNaturalLanguage
          placeholder="Tomorrow or next week"
        />
        <Text as="p" size="sm" className="text-muted-foreground">
          Type a natural-language date phrase; parsed value updates when valid and allowed.
        </Text>
      </div>
    )
  },
}

export const BoundaryDebug: Story = {
  render: args => {
    const toLocalYmd = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const min = new Date(2026, 0, 10)
    const max = new Date(2026, 0, 20)
    const [value, setValue] = React.useState<Date | undefined>(new Date(2026, 0, 15))

    return (
      <div className="w-[320px] space-y-2">
        <DatePicker {...args} value={value} onChange={setValue} minValue={min} maxValue={max} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Selected: {value ? toLocalYmd(value) : 'none'}
        </Text>
        <Text as="p" size="sm" className="text-muted-foreground">
          Bounds: {toLocalYmd(min)} to {toLocalYmd(max)}
        </Text>
      </div>
    )
  },
}

export const WithDisabledDates: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date | undefined>(new Date(2026, 0, 15))
    const disabledDates = [new Date(2026, 0, 16), new Date(2026, 0, 18)]

    return (
      <div className="w-[320px] space-y-2">
        <DatePicker {...args} value={value} onChange={setValue} disabledDates={disabledDates} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Disabled dates: 2026-01-16, 2026-01-18
        </Text>
      </div>
    )
  },
}

export const KeyboardParity: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date | undefined>(new Date(2026, 0, 16))

    return (
      <div className="w-[320px] space-y-2">
        <DatePicker {...args} value={value} onChange={setValue} />
        <Text as="p" size="sm" className="text-muted-foreground">
          Keyboard checks: Enter opens calendar, Escape closes dialog, Tab leaves trigger, Arrow keys edit segments.
        </Text>
      </div>
    )
  },
}

export const LocaleArabicEgypt: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date | undefined>(new Date(2026, 0, 16))

    return (
      <I18nProvider locale="ar-EG">
        <div className="w-[320px] space-y-2">
          <DatePicker {...args} value={value} onChange={setValue} />
          <Text as="p" size="sm" className="text-muted-foreground">
            Locale: `ar-EG` (Arabic numerals in date segments).
          </Text>
        </div>
      </I18nProvider>
    )
  },
}

export const LocalePersianGregorian: Story = {
  render: args => {
    const [value, setValue] = React.useState<Date | undefined>(new Date(2026, 0, 16))

    return (
      <I18nProvider locale="fa-IR-u-ca-gregory">
        <div className="w-[320px] space-y-2">
          <DatePicker {...args} value={value} onChange={setValue} />
          <Text as="p" size="sm" className="text-muted-foreground">
            Locale: `fa-IR-u-ca-gregory` (Persian numerals, Gregorian calendar).
          </Text>
        </div>
      </I18nProvider>
    )
  },
}

export const AllSizes: Story = {
  render: () => {
    const sizes = dateSizeValues

    return (
      <div className="w-[420px] space-y-3">
        {sizes.map(size => (
          <div key={size} className="space-y-1">
            <Text as="p" size="sm" className="text-muted-foreground">
              Size: {size}
            </Text>
            <DatePicker
              ariaLabel={`Start date ${size}`}
              name={`startDate_${size}`}
              defaultValue={new Date(2026, 0, 16)}
              size={size}
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
      <div className="w-[420px] space-y-3">
        {dateVariantValues.map(variant => (
          <div key={variant} className="space-y-1">
            <Text as="p" size="sm" className="text-muted-foreground capitalize">
              {variant}
            </Text>
            <DatePicker
              ariaLabel={`Start date ${variant}`}
              label="Start date"
              name={`startDate_${variant}`}
              defaultValue={new Date(2026, 0, 16)}
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
        {dateVariantValues.map(variant => (
          <div key={variant} className="space-y-2">
            <Text as="p" size="sm" className="text-muted-foreground capitalize">
              {variant}
            </Text>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {dateColorValues.map(color => (
                <div key={`${variant}_${color}`} className="space-y-1">
                  <Text as="p" size="sm" className="text-muted-foreground capitalize">
                    {color}
                  </Text>
                  <DatePicker
                    ariaLabel={`Start date ${variant} ${color}`}
                    label="Start date"
                    name={`startDate_${variant}_${color}`}
                    defaultValue={new Date(2026, 0, 16)}
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
    const sizeVariantValues = ['outline', 'surface', 'solid'] as const

    return (
      <div className="w-[920px] space-y-5">
        {sizeVariantValues.map(variant => (
          <div key={variant} className="space-y-2">
            <Text as="p" size="sm" className="text-muted-foreground capitalize">
              {variant}
            </Text>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {dateSizeValues.map(size => (
                <div key={`${variant}_${size}`} className="space-y-1">
                  <Text as="p" size="sm" className="text-muted-foreground">
                    Size: {size}
                  </Text>
                  <DatePicker
                    ariaLabel={`Start date ${variant} ${size}`}
                    name={`startDate_${variant}_${size}`}
                    defaultValue={new Date(2026, 0, 16)}
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
