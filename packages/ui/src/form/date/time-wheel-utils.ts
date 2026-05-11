import type { WheelPickerOption } from '@/elements/wheel-picker/wheel-picker'
import type { DateSize } from './date.props'

export function normalizeMinuteStep(step: number): number {
  if (!Number.isFinite(step)) return 1
  const normalized = Math.trunc(step)
  if (normalized <= 0) return 1
  return Math.min(normalized, 59)
}

export function buildHourOptions(use12Hour = false): WheelPickerOption<number>[] {
  if (use12Hour) {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: String(i + 1).padStart(2, '0'),
    }))
  }
  return Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: String(i).padStart(2, '0'),
  }))
}

export function buildMinuteOptions(step: number): WheelPickerOption<number>[] {
  const options: WheelPickerOption<number>[] = []
  for (let m = 0; m < 60; m += step) {
    options.push({ value: m, label: String(m).padStart(2, '0') })
  }
  return options
}

export function buildSecondOptions(): WheelPickerOption<number>[] {
  return Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: String(i).padStart(2, '0'),
  }))
}

export function snapMinute(minutes: number, step: number): number {
  if (step === 1) return minutes
  const options = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step).filter(m => m < 60)
  return options.reduce((prev, curr) => (Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev))
}

export const buttonSizeByDateSize: Record<DateSize, 'sm' | 'md'> = {
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'md',
  xl: 'md',
  '2x': 'md',
}
