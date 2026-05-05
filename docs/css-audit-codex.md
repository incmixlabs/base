# CSS And Props Audit

## Scope

This audit looked at `packages/ui/src` for three conventions:

1. Public/exported component props should live in a colocated `*.props.ts` or existing repo-style `*.props.tsx` file.
2. Vanilla Extract should hold dynamic prop styles, state selectors, token plumbing, animations, and selectors that Tailwind cannot express cleanly. Static layout/spacing/typography utilities should move to Tailwind classes in the component.
3. Flex/grid structure should use `Flex`, `Row`, `Column`, or `Grid` where possible instead of raw `div` plus `flex`/`grid` classes.

This is not a recommendation to remove Vanilla Extract. The issue is mixed responsibility: many files currently use VE as a static class bucket.

## Working Rules

- Use `*.props.ts` for exported component props that do not need JSX types.
- Use `*.props.tsx` only where the prop contract needs JSX-specific imported types or follows an existing prop-def convention.
- Keep local non-exported helper props in the component file when they are truly internal.
- Keep VE for prop-driven variants like size, radius, color, spacing tokens, semantic state, `@container`, `@media`, `selectors`, `globalStyle`, and `keyframes`.
- Move static rules such as `display: flex`, `padding: 0`, `width: 100%`, `gap`, `flex: 1`, `minWidth: 0`, and simple alignment to Tailwind where they are not part of a reusable dynamic prop map.
- Prefer `Row`, `Column`, `Flex`, and `Grid` for structure. Use raw host elements only when semantics or a third-party primitive requires the exact element.

## Findings

### Props Still In Component Files

High-priority exported props still live directly in `.tsx` files:

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

Some layout primitives already have prop files, but still duplicate or redefine public types in the component file:

- `packages/ui/src/layouts/box/Box.tsx` and `packages/ui/src/layouts/box/box.props.tsx`
- `packages/ui/src/layouts/container/Container.tsx` and `packages/ui/src/layouts/container/container.props.tsx`
- `packages/ui/src/layouts/flex/Flex.tsx` and `packages/ui/src/layouts/flex/flex.props.tsx`
- `packages/ui/src/layouts/grid/Grid.tsx` and `packages/ui/src/layouts/grid/grid.props.tsx`
- `packages/ui/src/layouts/section/Section.tsx` and `packages/ui/src/layouts/section/section.props.tsx`

Recommendation: do not do a repo-wide mechanical move in one PR. Start with one folder, move only exported contracts, and keep internal helper props local.

### Static Styles In `.css.ts`

These files have static utility styles that are good cleanup candidates:

- `packages/ui/src/table/shared/table-header.css.ts`: mostly padding, flex, shrink, and min-width helpers.
- `packages/ui/src/table/shared/table-editable-cell.css.ts`: static read/control layout can move to Tailwind; keep focus/hover/invalid selectors in VE.
- `packages/ui/src/table/shared/table-shell.css.ts`: static column layout and shrink behavior.
- `packages/ui/src/editor/live/LiveCodeBlock.css.ts`: static flex, spacing, and padding.
- `packages/ui/src/elements/dialog/dialog.css.ts`: some size and token selectors should stay; static header/body/footer flex and padding should be reviewed.
- `packages/ui/src/layouts/sidebar/Sidebar.css.ts`: token/state styles should stay; static width/padding/sticky helpers should be reviewed.
- `packages/ui/src/elements/data-list/DataList.css.ts`: dynamic trim/subgrid behavior can stay; static flex/grid layout should be reviewed.
- `packages/ui/src/elements/stepper/Stepper.css.ts`: size/token variables can stay; static layout should be reduced.
- `packages/ui/src/layouts/command-search/CommandSearch.css.ts`: likely mostly static layout/state classes.
- `packages/ui/src/autoform/AutoFormModelRenderer.css.ts`: container-query and computed column spans should stay; static display/padding rules should be reviewed.

Good VE usage examples to preserve:

- `packages/ui/src/elements/button/Button.css.ts`
- `packages/ui/src/elements/button/IconButton.css.ts`
- `packages/ui/src/elements/badge/Badge.css.ts`
- `packages/ui/src/elements/surface/Surface.css.ts`
- `packages/ui/src/elements/spinner/Spinner.css.ts`
- `packages/ui/src/layouts/flex/Flex.css.ts`
- `packages/ui/src/layouts/grid/Grid.css.ts`
- `packages/ui/src/theme/helpers/*responsive.css.ts`

These are prop/token/variant driven and should not be flattened into ad hoc Tailwind.

### Raw Flex/Grid Usage

Production files with high raw flex/grid density:

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

Recommendation: convert structural wrappers to `Row`, `Column`, `Flex`, or `Grid`, but do not force primitives into places where Base UI render props, table semantics, SVG, `dl`, `ul`, `li`, `button`, or native form semantics matter.

## Suggested Cleanup Order

1. **Table pilot PR**
   - Move table shared public props to `*.props.ts`.
   - Move static utility styles out of `table-header.css.ts`, `table-shell.css.ts`, and parts of `table-editable-cell.css.ts`.
   - Convert obvious table wrapper layout `div`s to `Row`, `Column`, or `Flex`.
   - Keep table state selectors and invalid/focus selectors in VE.

2. **Menu/Dialog overlay PR**
   - Extract menu, dialog, alert dialog, dirty guard, popover, tooltip, and sheet props.
   - Keep Base UI host element constraints intact.
   - Move static layout wrappers from VE to Tailwind or primitives where safe.

3. **App shell/sidebar PR**
   - Extract `AppShell` and `Sidebar` props.
   - Replace raw structural flex wrappers with `Row`/`Column`.
   - Keep sidebar token/state styling in VE.

4. **Form controls PR**
   - Extract exported props for field controls and date controls.
   - Convert simple wrapper layout to primitives.
   - Keep size, control token, focus, invalid, and primitive-state styling in VE.

5. **Editor/AutoForm PR**
   - Review autoform/editor CSS separately because container-query behavior is intentional.
   - Move only static layout and spacing out of VE.
   - Preserve dynamic schema-driven layout and container-query rules.

## Acceptance Criteria For Follow-Up PRs

- New exported component props are not introduced in `.tsx` files unless explicitly internal.
- New `.css.ts` files do not contain plain static utility classes that can be expressed with Tailwind.
- VE additions are justified by dynamic props, token variables, selectors, media/container queries, animations, or complex third-party primitive state.
- New structural flex/grid wrappers use `Flex`, `Row`, `Column`, or `Grid` unless native semantics require a different host element.
- Story/test files are allowed more flexibility, but examples should still prefer primitives when they demonstrate library usage.
