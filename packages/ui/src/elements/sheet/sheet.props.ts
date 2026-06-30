export const sheetSides = ['left', 'right', 'top', 'bottom'] as const

export type SheetSide = (typeof sheetSides)[number]
