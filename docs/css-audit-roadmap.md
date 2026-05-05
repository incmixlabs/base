# CSS Audit Roadmap

Date: 2026-04-24

This roadmap turns the consolidated audit findings in `docs/css-audit-codex2.md` into small PRs.

## PR Count

Do this as 7 PRs, matching the roadmap phases:

1. **Container pilot**: prove prop/style split on one small layout primitive.
2. **Table pilot**: table shared props plus static VE cleanup plus obvious layout primitive usage.
3. **Menu/Dialog overlays**: props extraction and static layout cleanup for overlay primitives.
4. **AppShell/Sidebar**: structural layout cleanup and prop extraction.
5. **Form controls**: public form prop files and wrapper layout cleanup.
6. **Editor/AutoForm**: careful static cleanup while preserving container-query and schema-driven behavior.
7. **Guardrails**: CI/audit scripts after patterns are established.

## Principles

- Do not run a repo-wide mechanical refactor.
- Keep runtime behavior unchanged unless the PR explicitly fixes a bug.
- Move one ownership area at a time.
- Separate type-contract cleanup from visual styling cleanup when possible.
- Keep VE where it carries dynamic prop behavior, selectors, primitive state, animations, or container queries.

## Phase 1: Container Pilot

Goal: prove the pattern on a small layout primitive.

Files:

- `packages/ui/src/layouts/container/Container.tsx`
- `packages/ui/src/layouts/container/Container.css.ts`
- `packages/ui/src/layouts/container/container.props.tsx`

Work:

- Consolidate `ContainerOwnProps` so runtime and editor definitions do not drift.
- Move static layout styles from `containerInnerBase` to Tailwind classes.
- Replace non-responsive `display` and `align` VE variants with class maps.
- Keep responsive container-query variants and max-width CSS variable handling in VE.
- Keep the inner host element if importing `Flex` would couple layout primitives too tightly.

Acceptance:

- `Container.tsx` has one prop contract source.
- `Container.css.ts` contains only container-query, CSS-var, and dynamic style logic.
- Container tests still pass.

## Phase 2: Table Pilot

Goal: apply the same rules to the active table work.

Files:

- `packages/ui/src/table/shared/TableEditableCell.tsx`
- `packages/ui/src/table/shared/table-editable-cell.css.ts`
- `packages/ui/src/table/shared/TableHeader.tsx`
- `packages/ui/src/table/shared/table-header.css.ts`
- `packages/ui/src/table/shared/TableShell.tsx`
- `packages/ui/src/table/shared/table-shell.css.ts`
- `packages/ui/src/table/basic/TableWrapper.tsx`

Work:

- Move exported shared table props to colocated prop files.
- Move static table header/shell/editable-cell styles to Tailwind classes.
- Keep focus, hover, invalid, and complex selector styles in VE.
- Replace obvious structural wrappers with `Flex`, `Row`, or `Column`.
- Keep native table semantics untouched.

Acceptance:

- No exported table shared props are newly declared in implementation files.
- Static layout declarations are removed from the table VE files where Tailwind is sufficient.
- Existing table keyboard/editing behavior remains unchanged.

## Phase 3: Menu And Dialog Primitives

Goal: clean public overlay component contracts without breaking Base UI host behavior.

Files:

- `packages/ui/src/elements/menu/DropdownMenu.tsx`
- `packages/ui/src/elements/menu/ContextMenu.tsx`
- `packages/ui/src/elements/dialog/Dialog.tsx`
- `packages/ui/src/elements/dialog/AlertDialog.tsx`
- `packages/ui/src/elements/dialog/DirtyGuardDialog.tsx`
- `packages/ui/src/elements/popover/Popover.tsx`
- `packages/ui/src/elements/tooltip/Tooltip.tsx`
- `packages/ui/src/elements/sheet/Sheet.tsx`

Work:

- Extract exported props to prop files.
- Keep internal render-prop and primitive adapter types local when they are not public API.
- Convert static wrapper layout to Tailwind or layout primitives where safe.
- Keep portal, positioning, animation, state selector, and primitive attribute styles in VE.

Acceptance:

- Public overlay props are colocated in prop files.
- Base UI render prop behavior is unchanged.
- Portal/theme behavior remains covered by existing tests/stories.

## Phase 4: App Shell And Sidebar

Goal: reduce raw structural flex usage in major layout surfaces.

Files:

- `packages/ui/src/layouts/app-shell/AppShell.tsx`
- `packages/ui/src/layouts/app-shell/AppShell.css.ts`
- `packages/ui/src/layouts/sidebar/Sidebar.tsx`
- `packages/ui/src/layouts/sidebar/Sidebar.css.ts`
- `packages/ui/src/layouts/sidebar/SidebarWrapper.tsx`

Work:

- Extract public props.
- Replace structural wrapper `div`s with `Row`, `Column`, or `Flex`.
- Keep sidebar token/state styling in VE.
- Keep host semantics where `aside`, `header`, or Base UI behavior matters.

Acceptance:

- App shell/sidebar props are not split across implementation and ad hoc local types.
- Scroll and secondary-sidebar behavior do not regress.
- No broad unrelated visual changes.

## Phase 5: Form Controls

Goal: make form controls follow the same prop/style split.

Files:

- `packages/ui/src/form/TextField.tsx`
- `packages/ui/src/form/Select.tsx`
- `packages/ui/src/form/Checkbox.tsx`
- `packages/ui/src/form/Switch.tsx`
- `packages/ui/src/form/RadioGroup.tsx`
- `packages/ui/src/form/CheckboxCards.tsx`
- `packages/ui/src/form/RadioCards.tsx`
- `packages/ui/src/form/MultiSelect.tsx`
- `packages/ui/src/form/InputOTP.tsx`
- `packages/ui/src/form/date/*Next.tsx`

Work:

- Extract exported props for public form controls.
- Convert simple wrapper layout to Tailwind or layout primitives.
- Keep size, radius, field state, focus, invalid, and primitive-state styling in VE.

Acceptance:

- Form controls remain accessible and keyboard-compatible.
- No Base UI warnings are introduced.
- Existing AutoForm rendering is unchanged.

## Phase 6: Editor And AutoForm Layout

Goal: clean static layout without damaging schema-driven responsive behavior.

Files:

- `packages/ui/src/autoform/AutoFormModelRenderer.tsx`
- `packages/ui/src/autoform/AutoFormModelRenderer.css.ts`
- `packages/ui/src/editor/autoform/*`
- `packages/ui/src/editor/live/LiveCodeBlock.css.ts`

Work:

- Preserve container-query and schema-driven column-span behavior.
- Move static spacing/layout out of VE.
- Prefer layout primitives for editor chrome and panels.

Acceptance:

- Container query behavior is preserved.
- AutoForm model renderer stories and tests continue to behave the same.

## Phase 7: Guardrails

Goal: prevent the drift from returning.

Initial guardrails:

- CI grep for hard-coded runtime palette backgrounds outside stories/tests.
- Optional lint/check script for exported `Props` declarations in `.tsx`.
- Optional lint/check script for obvious static layout properties inside `.css.ts`.

Run:

```sh
pnpm css:guardrails
```

Current behavior:

- Fails on hard-coded palette background utility classes in runtime source outside stories/tests.
- Fails on newly added exported `Props` declarations in `packages/ui/src/**/*.tsx`.
- Warns on newly added static layout declarations in `packages/ui/src/**/*.css.ts`.

The static vanilla-extract check is warning-only because VE still legitimately owns dynamic selectors, token variables, state styles, animations, and container queries.

Start narrow:

```sh
rg -n "\bbg-(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-" \
  packages/ui/src apps/docs/src apps/presspoint/src \
  -g '*.{tsx,ts,jsx,js,mdx,md}' \
  -g '!*.stories.*' \
  -g '!*.test.*'
```

Defer broader static-VE linting until the first cleanup phases establish accepted patterns.

## Phase 8: Theme Style Tokens

Goal: make selected structural styles theme-overridable after the prop/style split is stable.

Guidelines: `docs/theme/style-token-guidelines.md`.

Start narrow:

- Pilot one component surface at a time.
- Prefer token paths that match the component structure, such as `component.appShell.layout.*`.
- Keep runtime CSS fallbacks equal to the current hard-coded behavior.
- Do not tokenize every static style. Only promote styles that tenants or generated themes should reasonably override.

Initial pilot:

- `component.appShell.layout.bodyGridTemplateColumns`
- `component.appShell.layout.bodyWithSecondaryGridTemplateColumns`
- `component.appShell.layout.bodyWithSecondaryRightGridTemplateColumns`

Acceptance:

- Existing layouts render the same without tokens.
- Theme compiler exposes the new JSON token paths as CSS variables.
- Component styles consume the CSS variables with current behavior as fallback.
