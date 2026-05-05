const createHoverPropDef = (defaultValue: boolean) =>
  ({
    hover: { type: 'boolean', className: 'hover', default: defaultValue },
  }) as const

const hoverPropDefFalse = createHoverPropDef(false)
const hoverPropDefTrue = createHoverPropDef(true)

export { createHoverPropDef, hoverPropDefFalse, hoverPropDefTrue }
