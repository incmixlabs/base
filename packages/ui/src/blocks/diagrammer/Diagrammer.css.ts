import { globalStyle, style } from '@vanilla-extract/css'
import { semanticColorVar } from '@/theme/props/color.prop'

export const diagrammerRootClass = style({
  minHeight: 360,
  overflow: 'hidden',
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  backgroundColor: semanticColorVar('neutral', 'surface'),
})

export const diagrammerCanvasClass = style({
  width: '100%',
  height: '100%',
  minHeight: 'inherit',
  backgroundColor: semanticColorVar('neutral', 'surface'),
  vars: {
    '--xy-node-border-default': semanticColorVar('neutral', 'border'),
    '--xy-node-background-color-default': semanticColorVar('neutral', 'surface'),
    '--xy-edge-stroke-default': semanticColorVar('neutral', 'text'),
    '--xy-edge-stroke-selected-default': semanticColorVar('primary', 'primary'),
    '--xy-attribution-background-color-default': 'transparent',
    '--xy-minimap-background-color-default': semanticColorVar('neutral', 'surface'),
  },
})

globalStyle(`${diagrammerCanvasClass} .react-flow__pane`, {
  cursor: 'grab',
})

globalStyle(`${diagrammerCanvasClass} .react-flow__pane.dragging`, {
  cursor: 'grabbing',
})

globalStyle(`${diagrammerCanvasClass} .react-flow__controls`, {
  overflow: 'hidden',
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  borderRadius: 'var(--radius-md, 0.375rem)',
  boxShadow: 'var(--shadow-sm)',
})

globalStyle(`${diagrammerCanvasClass} .react-flow__controls-button`, {
  borderBottom: `1px solid ${semanticColorVar('neutral', 'border')}`,
  backgroundColor: semanticColorVar('neutral', 'surface'),
  color: semanticColorVar('neutral', 'text'),
})

globalStyle(`${diagrammerCanvasClass} .react-flow__controls-button:hover`, {
  backgroundColor: semanticColorVar('neutral', 'soft'),
})

globalStyle(`${diagrammerCanvasClass} .react-flow__controls-button svg`, {
  fill: 'currentColor',
})

globalStyle(`${diagrammerCanvasClass} .react-flow__handle`, {
  width: 9,
  height: 9,
  border: `1px solid ${semanticColorVar('neutral', 'surface')}`,
  backgroundColor: semanticColorVar('primary', 'primary'),
})

globalStyle(`${diagrammerCanvasClass} .react-flow__edge-path`, {
  strokeWidth: 1.75,
})

export const diagrammerNodeClass = style({
  minWidth: 190,
  maxWidth: 280,
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  borderRadius: 'var(--radius-md, 0.375rem)',
  backgroundColor: semanticColorVar('neutral', 'surface'),
  color: semanticColorVar('neutral', 'text'),
  boxShadow: 'var(--shadow-sm)',
})

export const diagrammerNodeSelectedClass = style({
  borderColor: semanticColorVar('primary', 'primary'),
  boxShadow: `0 0 0 3px ${semanticColorVar('primary', 'primary-alpha')}`,
})

export const diagrammerNodeHeaderClass = style({
  borderBottom: `1px solid ${semanticColorVar('neutral', 'border')}`,
})

export const diagrammerNodeDescriptionClass = style({
  color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 68%, transparent)`,
})

export const diagrammerPortClass = style({
  color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 82%, transparent)`,
})
