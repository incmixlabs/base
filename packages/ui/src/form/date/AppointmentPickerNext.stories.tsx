'use client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { AppointmentPickerNext, type AppointmentValueNext, type TimeSlotNext } from './AppointmentPickerNext'
import { dateNextColorValues, dateNextRadiusValues, dateNextSizeValues } from './date-next.props'

const meta: Meta<typeof AppointmentPickerNext> = {
  title: 'Form/Date Next/AppointmentPickerNext (Spike)',
  component: AppointmentPickerNext,
  parameters: {
    layout: 'centered',
  },
  args: {
    color: 'slate',
    radius: 'full',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    color: { control: 'select', options: dateNextColorValues },
    radius: { control: 'select', options: dateNextRadiusValues },
    size: { control: { type: 'radio' }, options: dateNextSizeValues },
  },
}

export default meta
type Story = StoryObj<typeof AppointmentPickerNext>

export const Default: Story = {
  render: args => {
    const [appointment, setAppointment] = React.useState<AppointmentValueNext | undefined>()
    return (
      <AppointmentPickerNext
        {...args}
        value={appointment}
        onChange={setAppointment}
        onConfirm={val => alert(`Booked: ${val.date.toLocaleDateString()} at ${val.time}`)}
      />
    )
  },
}

export const WithValue: Story = {
  render: args => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [appointment, setAppointment] = React.useState<AppointmentValueNext | undefined>({
      date: tomorrow,
      time: '10:00',
    })
    return (
      <AppointmentPickerNext
        {...args}
        value={appointment}
        onChange={setAppointment}
        onConfirm={val => alert(`Booked: ${val.date.toLocaleDateString()} at ${val.time}`)}
      />
    )
  },
}

export const CustomTitle: Story = {
  render: args => {
    const [appointment, setAppointment] = React.useState<AppointmentValueNext | undefined>()
    return (
      <AppointmentPickerNext
        {...args}
        value={appointment}
        onChange={setAppointment}
        title="Schedule a consultation"
        confirmText="Book Now"
        onConfirm={val => alert(`Booked: ${val.date.toLocaleDateString()} at ${val.time}`)}
      />
    )
  },
}

export const CustomTimeSlots: Story = {
  render: args => {
    const [appointment, setAppointment] = React.useState<AppointmentValueNext | undefined>()

    const customSlots: TimeSlotNext[] = [
      { time: '09:00', label: '9:00 AM', available: true },
      { time: '09:30', label: '9:30 AM', available: true },
      { time: '10:00', label: '10:00 AM', available: false },
      { time: '10:30', label: '10:30 AM', available: true },
      { time: '11:00', label: '11:00 AM', available: true },
      { time: '11:30', label: '11:30 AM', available: false },
      { time: '12:00', label: '12:00 PM', available: true },
      { time: '14:00', label: '2:00 PM', available: true },
      { time: '14:30', label: '2:30 PM', available: true },
      { time: '15:00', label: '3:00 PM', available: true },
      { time: '15:30', label: '3:30 PM', available: false },
      { time: '16:00', label: '4:00 PM', available: true },
    ]

    return (
      <AppointmentPickerNext
        {...args}
        value={appointment}
        onChange={setAppointment}
        defaultTimeSlots={customSlots}
        title="Select available time"
        onConfirm={val => alert(`Booked: ${val.date.toLocaleDateString()} at ${val.time}`)}
      />
    )
  },
}

export const DynamicSlots: Story = {
  render: args => {
    const [appointment, setAppointment] = React.useState<AppointmentValueNext | undefined>()

    const getAvailableTimeSlots = (date: Date): TimeSlotNext[] => {
      const dayOfWeek = date.getDay()

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return [
          { time: '10:00', label: '10:00 AM', available: true },
          { time: '11:00', label: '11:00 AM', available: true },
          { time: '12:00', label: '12:00 PM', available: true },
        ]
      }

      return [
        { time: '09:00', label: '9:00 AM', available: true },
        { time: '10:00', label: '10:00 AM', available: true },
        { time: '11:00', label: '11:00 AM', available: true },
        { time: '12:00', label: '12:00 PM', available: true },
        { time: '14:00', label: '2:00 PM', available: true },
        { time: '15:00', label: '3:00 PM', available: true },
        { time: '16:00', label: '4:00 PM', available: true },
        { time: '17:00', label: '5:00 PM', available: true },
      ]
    }

    return (
      <AppointmentPickerNext
        {...args}
        value={appointment}
        onChange={setAppointment}
        getAvailableTimeSlots={getAvailableTimeSlots}
        title="Book appointment (different hours on weekends)"
        onConfirm={val => alert(`Booked: ${val.date.toLocaleDateString()} at ${val.time}`)}
      />
    )
  },
}

export const Disabled: Story = {
  render: args => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    return <AppointmentPickerNext {...args} value={{ date: tomorrow, time: '10:00' }} disabled />
  },
}

export const AllSizes: Story = {
  render: args => {
    const Picker = ({ size }: { size: (typeof dateNextSizeValues)[number] }) => {
      const [appointment, setAppointment] = React.useState<AppointmentValueNext | undefined>()
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">size=&quot;{size}&quot;</p>
          <AppointmentPickerNext
            {...args}
            size={size}
            value={appointment}
            onChange={setAppointment}
            showConfirmButton={false}
            showConfirmation={false}
          />
        </div>
      )
    }

    return (
      <div className="flex flex-wrap gap-6">
        {dateNextSizeValues.map(size => (
          <Picker key={size} size={size} />
        ))}
      </div>
    )
  },
}

export const AllColors: Story = {
  render: args => {
    const Picker = ({ color }: { color: (typeof dateNextColorValues)[number] }) => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const [appointment, setAppointment] = React.useState<AppointmentValueNext | undefined>({
        date: tomorrow,
        time: '10:00',
      })
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{color}</p>
          <AppointmentPickerNext
            {...args}
            size="sm"
            color={color}
            value={appointment}
            onChange={setAppointment}
            showConfirmButton={false}
          />
        </div>
      )
    }

    return (
      <div className="flex flex-wrap gap-6">
        {dateNextColorValues.map(color => (
          <Picker key={color} color={color} />
        ))}
      </div>
    )
  },
}
