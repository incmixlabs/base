import type { SheetSide } from './sheet.props'

export const sheetBackdropBase =
  'fixed inset-0 z-[100] bg-black/25 duration-200 ease-in-out data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[ending-style]:animate-out data-[ending-style]:fade-out-0'

export const sheetPanelBase =
  'fixed z-[110] bg-neutral-surface shadow-[var(--shadow-2xl,0_25px_50px_-12px_rgba(0,0,0,0.25))] border-solid duration-200 ease-out data-[starting-style]:animate-in data-[ending-style]:animate-out'

export const sheetPanelBySide: Record<SheetSide, string> = {
  right:
    'right-0 top-0 h-full w-full max-w-[420px] border-l border-neutral data-[starting-style]:slide-in-from-right-full data-[ending-style]:slide-out-to-right-full',
  left: 'left-0 top-0 h-full w-full max-w-[420px] border-r border-neutral data-[starting-style]:slide-in-from-left-full data-[ending-style]:slide-out-to-left-full',
  top: 'left-0 top-0 h-[min(420px,100dvh)] w-full border-b border-neutral data-[starting-style]:slide-in-from-top-full data-[ending-style]:slide-out-to-top-full',
  bottom:
    'bottom-0 left-0 h-[min(420px,100dvh)] w-full border-t border-neutral data-[starting-style]:slide-in-from-bottom-full data-[ending-style]:slide-out-to-bottom-full',
}

export const sheetResizeHandle =
  'absolute inset-y-0 z-30 w-3 border-0 bg-transparent p-0 cursor-col-resize touch-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:h-12 after:w-1 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[var(--color-neutral-border)] hover:after:bg-primary focus-visible:after:bg-primary data-[resizing]:after:bg-primary'

export const sheetResizeHandleLeft = 'right-0'

export const sheetResizeHandleRight = 'left-0'

export const sheetClassNames = [
  sheetBackdropBase,
  sheetPanelBase,
  ...Object.values(sheetPanelBySide),
  sheetResizeHandle,
  sheetResizeHandleLeft,
  sheetResizeHandleRight,
]
