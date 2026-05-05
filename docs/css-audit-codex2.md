# CSS Audit Findings

Date: 2026-04-24

This consolidates the findings from:

- `docs/css-audit.md`
- `docs/tw-audit.md`
- `docs/css-audit-codex.md`

The source docs should stay as historical audit notes. This file is the current consolidated findings view.

## Audit Rules

1. Exported component props should live in colocated `*.props.ts` or established repo-style `*.props.tsx` files.
2. Vanilla Extract should be used for dynamic prop styles, token variables, selectors, primitive state, animations, media queries, and container queries.
3. Static layout, spacing, typography, and simple alignment should use Tailwind classes in component files.
4. Structural flex/grid layout should use `Flex`, `Row`, `Column`, or `Grid` where semantics allow.
5. Background colors should use semantic tokens/component vars rather than hard-coded Tailwind palettes.

## Findings

### 1. Prop Contracts Are Split

The strongest concrete example is `Container`.

- `packages/ui/src/layouts/container/Container.tsx` defines runtime `ContainerOwnProps`.
- `packages/ui/src/layouts/container/container.props.tsx` defines editor prop defs and its own `ContainerOwnProps`.
- The component does not consume the prop type from the prop file.

This same pattern exists across other layout primitives:

- `packages/ui/src/layouts/box/Box.tsx`
- `packages/ui/src/layouts/container/Container.tsx`
- `packages/ui/src/layouts/flex/Flex.tsx`
- `packages/ui/src/layouts/grid/Grid.tsx`
- `packages/ui/src/layouts/section/Section.tsx`

Broader exported props still live directly in component files:

- `packages/ui/src/layouts/app-shell/AppShell.tsx`
- `packages/ui/src/layouts/sidebar/Sidebar.tsx`
- `packages/ui/src/elements/menu/DropdownMenu.tsx`
- `packages/ui/src/elements/menu/ContextMenu.tsx`
- `packages/ui/src/elements/dialog/Dialog.tsx`
- `packages/ui/src/elements/dialog/AlertDialog.tsx`
- `packages/ui/src/elements/dialog/DirtyGuardDialog.tsx`
- `packages/ui/src/elements/popover/Popover.tsx`
- `packages/ui/src/elements/tooltip/Tooltip.tsx`
- `packages/ui/src/elements/sheet/Sheet.tsx`
- `packages/ui/src/table/basic/Table.tsx`
- `packages/ui/src/table/shared/TableEditableCell.tsx`
- `packages/ui/src/table/shared/TableHeader.tsx`
- `packages/ui/src/table/shared/TableFooter.tsx`
- `packages/ui/src/table/shared/TableShell.tsx`
- `packages/ui/src/form/TextField.tsx`
- `packages/ui/src/form/Select.tsx`
- `packages/ui/src/form/Checkbox.tsx`
- `packages/ui/src/form/Switch.tsx`
- `packages/ui/src/form/RadioGroup.tsx`
- `packages/ui/src/form/CheckboxCards.tsx`
- `packages/ui/src/form/RadioCards.tsx`
- `packages/ui/src/form/date/DateRangePickerNext.tsx`
- `packages/ui/src/form/date/CalendarWithPresetsNext.tsx`

Guidance: move exported/public props first. Keep truly local helper props in the implementation file.

### 2. Vanilla Extract Contains Static Utility Styles

`Container.css.ts` is the clearest scoped example.

Keep in VE:

- `containerType: 'inline-size'`
- responsive `@container` maps
- CSS variable assignment such as `--container-max-width`

Move out of VE:

- `display: 'flex'`
- `flexDirection: 'column'`
- `alignItems: 'center'`
- `width: '100%'`
- `marginInline: 'auto'`
- `flexShrink: 0`
- `flexGrow: 1`
- non-responsive `display` and `align` variants that can be simple class maps

Other cleanup candidates:

- `packages/ui/src/table/shared/table-header.css.ts`
- `packages/ui/src/table/shared/table-editable-cell.css.ts`
- `packages/ui/src/table/shared/table-shell.css.ts`
- `packages/ui/src/editor/live/LiveCodeBlock.css.ts`
- `packages/ui/src/elements/dialog/dialog.css.ts`
- `packages/ui/src/layouts/sidebar/Sidebar.css.ts`
- `packages/ui/src/elements/data-list/DataList.css.ts`
- `packages/ui/src/elements/stepper/Stepper.css.ts`
- `packages/ui/src/layouts/command-search/CommandSearch.css.ts`
- `packages/ui/src/autoform/AutoFormModelRenderer.css.ts`

Good VE usage to preserve:

- `packages/ui/src/elements/button/Button.css.ts`
- `packages/ui/src/elements/button/IconButton.css.ts`
- `packages/ui/src/elements/badge/Badge.css.ts`
- `packages/ui/src/elements/surface/Surface.css.ts`
- `packages/ui/src/elements/spinner/Spinner.css.ts`
- `packages/ui/src/layouts/flex/Flex.css.ts`
- `packages/ui/src/layouts/grid/Grid.css.ts`
- `packages/ui/src/theme/helpers/*responsive.css.ts`

### 3. Tailwind Backgrounds Are Mostly Clean

The background audit found no hard-coded Tailwind palette classes in non-story runtime component files after prior cleanup.

Safe patterns:

- `bg-background`
- `bg-card`
- `bg-popover`
- `bg-muted`
- `bg-primary`
- `bg-secondary`
- `bg-accent`
- `bg-sidebar`
- `bg-transparent`
- CSS-var arbitrary backgrounds like `bg-[var(--color-surface)]`

Remaining caution:

- Story files still use hard-coded palette backgrounds and gradients.
- Runtime app-shell/content surfaces should prefer component vars where generic `bg-background` is too broad.
- If the deny pattern is added to CI, fixed media overlays may need a narrow allowlist.

### 4. Raw Flex/Grid Is Common In Runtime Components

High-density production files:

- `packages/ui/src/layouts/app-shell/AppShell.tsx`
- `packages/ui/src/layouts/sidebar/Sidebar.tsx`
- `packages/ui/src/layouts/sidebar/SidebarWrapper.tsx`
- `packages/ui/src/table/basic/TableWrapper.tsx`
- `packages/ui/src/table/shared/table-cell-renderers.tsx`
- `packages/ui/src/table/shared/TableEditableCell.tsx`
- `packages/ui/src/table/shared/TableDetailDrawer.tsx`
- `packages/ui/src/form/FieldGroup.tsx`
- `packages/ui/src/form/MultiSelect.tsx`
- `packages/ui/src/form/NumberInput.tsx`
- `packages/ui/src/form/FileUpload.tsx`
- `packages/ui/src/form/InputOTP.tsx`
- `packages/ui/src/form/date/*Next.tsx`
- `packages/ui/src/blocks/kanban/KanbanBoard.tsx`
- `packages/ui/src/media/media-player/MediaPlayer.tsx`

Guidance: convert layout wrappers to `Flex`, `Row`, `Column`, or `Grid`, but do not replace elements where semantics matter: `table`, `thead`, `tbody`, `tr`, `td`, `th`, `dl`, `ul`, `li`, native form controls, SVG, and Base UI render-prop hosts.

### 5. Layout Primitive Self-Use Needs Care

For layout primitives such as `Container`, importing `Flex` or `Column` can create unnecessary coupling between primitives. It is acceptable for a layout primitive to use a raw host element plus Tailwind static classes internally.

The key rule is not “every flex div must become `Flex`.” The rule is:

- app/component structure should prefer layout primitives
- primitive internals can use host elements when that keeps the primitive layer independent
- static flex styles should still not live in VE unless they are part of dynamic prop maps

## Open Questions

- Should prop files be named strictly `props.ts`, or continue the repo’s current `*.props.tsx` convention?
- Should story files be held to the same no-hard-coded-palette rule now, or handled after runtime code?
- Should CI initially warn only on hard-coded palette backgrounds, or also on static VE layout declarations?
