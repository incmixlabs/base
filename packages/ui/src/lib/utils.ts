import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** cn export. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
