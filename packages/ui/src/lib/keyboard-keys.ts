export const KEYBOARD_KEYS = {
  arrowDown: 'ArrowDown',
  arrowUp: 'ArrowUp',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  enter: 'Enter',
  escape: 'Escape',
  home: 'Home',
  end: 'End',
  shift: 'Shift',
  space: ' ',
  tab: 'Tab',
} as const

export const ACTIVATION_KEYS = [KEYBOARD_KEYS.enter, KEYBOARD_KEYS.space] as const
export const VERTICAL_ARROW_KEYS = [KEYBOARD_KEYS.arrowUp, KEYBOARD_KEYS.arrowDown] as const
export const HORIZONTAL_ARROW_KEYS = [KEYBOARD_KEYS.arrowLeft, KEYBOARD_KEYS.arrowRight] as const

export const isActivationKey = (key: string): key is (typeof ACTIVATION_KEYS)[number] =>
  ACTIVATION_KEYS.includes(key as (typeof ACTIVATION_KEYS)[number])
