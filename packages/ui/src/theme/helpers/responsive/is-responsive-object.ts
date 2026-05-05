import type { Breakpoint, Responsive } from '@/theme/props/prop-def'
import { responsiveBreakpointSet as breakpoints } from './breakpoints'

export function isResponsiveObject<Value extends string>(
  obj: Responsive<Value | Omit<string, Value>> | undefined,
): obj is Record<Breakpoint, string> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.keys(obj).some(key => {
      return breakpoints.has(key as any)
    })
  )
}
