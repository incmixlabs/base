# CSS Audit — Container Component

Date: 2026-04-24

## Follow-up: Token-backed Tailwind Arbitrary Sizing

Date: 2026-04-26

The `InfiniteTableWrapper` filter checkbox regression exposed a gap in the CSS audit rules. The checkbox indicator used Tailwind arbitrary sizing:

```tsx
className="... w-[var(--cb-icon-size)] h-[var(--cb-icon-size)]"
```

In the Storybook table wrapper path, the checkbox state and selected fill were applied, but the checkmark SVG computed to roughly `2px x 14px`, making the white check visually disappear. Moving the SVG indicator dimensions to `checkbox.css.ts` made the token plumbing deterministic.

### Rule Clarification

Use Tailwind for static layout and simple utility classes. Use VE for component-token plumbing when the style is applied to:

- SVG/icon internals
- primitive indicators (`CheckboxPrimitive.Indicator`, `RadioPrimitive.Indicator`, switch thumbs, slider thumbs)
- generated descendant selectors or global child selectors
- pseudo-elements or stateful slots
- any CSS-var backed size that must survive Storybook/docs/app build differences

Tailwind arbitrary values such as `w-[var(...)]`, `h-[var(...)]`, `min-h-[var(...)]`, and `px-[var(...)]` are acceptable only when the value is applied to a normal outer layout/control node and has been checked in Storybook. They should not be used for small indicator/icon internals.

### Candidate Follow-up PR

Scope: audit token-backed Tailwind arbitrary values in `packages/ui/src/form` and move risky primitive-slot/icon sizing to `.css.ts`.

Initial candidates from `rg`:

| File | Pattern | Recommendation |
|---|---|---|
| `packages/ui/src/form/RadioGroup.tsx` | `w-[var(--radio-indicator-size)] h-[var(--radio-indicator-size)]` on `RadioPrimitive.Indicator` | Move indicator dimensions to `radio-group.css.ts`. |
| `packages/ui/src/form/RadioCards.tsx` | `w-[var(--rc-indicator-size)]`, `w-[var(--rc-indicator-inner)]` on radio indicators | Move card indicator dimensions to `radio-cards.css.ts`. |
| `packages/ui/src/form/CheckboxCards.tsx` | `w-[var(--cbc-cb-size)]`, `w-[var(--cbc-icon-size)]` on checkbox indicator slots | Move card checkbox and icon dimensions to `checkbox-cards.css.ts`. |
| `packages/ui/src/form/Switch.tsx` and `SwitchGroup.tsx` | `w/h-[var(--sw-...)]` on root/thumb slots | Review; move thumb/root token sizing to `switch.css.ts` if visual tests show drift. |
| `packages/ui/src/form/FileUpload.tsx` | `w/h-[var(--file-upload-icon-size)]` on icon shell content | Review; likely VE if applied directly to icon internals. |

Lower-risk outer control/layout uses can stay in TW for now, for example `TextField`, `Select`, `MultiSelect`, and sidebar width classes, provided they are ordinary component root/layout nodes and not primitive internals.

### Guardrail Idea

Add an audit-script warning for new `w-[var(...)]`, `h-[var(...)]`, or `size-[var(...)]` usage under `packages/ui/src/form` and `packages/ui/src/elements` unless the file is a `.css.ts` file or the usage is allowlisted. The warning should be advisory at first because some outer layout nodes still intentionally use CSS-var-backed Tailwind sizing.

---

Audit of `packages/ui/src/layouts/container/` against three rules:

1. All props defined in `props.ts`
2. `.css.ts` contains only VE-required styles; everything else uses TW
3. Flex/grid layouts use `Flex`, `Row`, `Column`, `Grid` components

---

## 1. Props: `Container.tsx` vs `container.props.tsx`

There are **two independent prop definitions** that have drifted apart.

### `Container.tsx` (runtime — what the component actually uses)

```ts
export interface ContainerOwnProps extends SharedLayoutProps {
  asChild?: boolean
  display?: Responsive<ContainerDisplay>
  size?: Responsive<ContainerSize>
  align?: Responsive<ContainerAlign>
}
```

Types `ContainerSize`, `ContainerAlign`, `Responsive` come from `layout-utils.tsx`.

### `container.props.tsx` (editor prop defs — consumed by `editor/layouts/props.ts`)

```ts
const containerPropDefs = {
  ...asChildPropDef,
  ...layoutPropDefs,
  size: { type: 'enum', values: ['1','2','3','4'], default: '4', responsive: true },
  display: { type: 'enum', values: ['none','initial'], responsive: true },
  align: { type: 'enum', values: ['left','center','right'], responsive: true },
}
```

### Findings

| Issue | Detail |
|---|---|
| **Duplicate `ContainerOwnProps`** | Defined in both `Container.tsx:37` and `container.props.tsx:83`. The component does **not** import from `container.props.tsx`. |
| **Props file not used at runtime** | `container.props.tsx` is only consumed by the editor prop-def system (`editor/layouts/props.ts`, `editor/prop-defs.ts`). The component itself ignores it. |
| **SharedLayoutProps inline in component** | All layout props (`p`, `px`, `radius`, `bg`, `position`, etc.) are destructured inline in `Container.tsx:66–111` rather than derived from a single prop definition. |

### Recommendation

Consolidate so `Container.tsx` imports its own prop types from `container.props.tsx` (or a shared source), eliminating the duplicate `ContainerOwnProps`.

---

## 2. `.css.ts` — VE vs TW

### Styles that **require VE** (cannot be TW)

These are correctly in `Container.css.ts`:

| Style | Why VE |
|---|---|
| `containerBase` — `containerType: 'inline-size'` | Container queries (`@container`) not standard in TW without plugin. |
| `containerBySize` — `vars: { '--container-max-width': '...' }` | Setting CSS custom properties per variant. |
| `containerDisplayResponsive` — `@container (min-width: ...)` | Container-query breakpoints (not media-query breakpoints). |
| `containerAlignResponsive` — `@container (min-width: ...)` | Same. |
| `containerSizeResponsive` — `@container (min-width: ...)` + vars | Same + CSS vars. |

### Styles that **should be TW** (currently in VE)

| Location | Current VE | TW equivalent |
|---|---|---|
| `containerInnerBase:11` | `display: 'flex'` | `flex` |
| `containerInnerBase:12` | `flexDirection: 'column'` | `flex-col` |
| `containerInnerBase:13` | `alignItems: 'center'` | `items-center` |
| `containerInnerBase:14` | `width: '100%'` | `w-full` |
| `containerInnerBase:15` | `maxWidth: 'var(--container-max-width, 71rem)'` | **Keep VE** — references CSS var |
| `containerInnerBase:16` | `marginInline: 'auto'` | `mx-auto` |
| `containerInnerBase:17` | `flexShrink: 0` | `shrink-0` |
| `containerInnerBase:18` | `flexGrow: 1` | `grow` |
| `containerByDisplay:22` | `none: { display: 'none' }` | `hidden` |
| `containerByDisplay:23` | `initial: { display: 'flex' }` | `flex` |
| `containerByAlign:27` | `left: { alignItems: 'flex-start' }` | `items-start` |
| `containerByAlign:28` | `center: { alignItems: 'center' }` | `items-center` |
| `containerByAlign:29` | `right: { alignItems: 'flex-end' }` | `items-end` |

**Note:** `containerByDisplay` and `containerByAlign` are used as prop-driven variant maps (keyed by prop value). Moving them to TW would mean building classname maps or using `cn()` conditionals. The non-responsive base variants (`containerByDisplay`, `containerByAlign`) can be replaced with TW class lookups. The responsive `@container` variants must stay in VE.

### Summary

```
containerInnerBase:
  VE-required:  maxWidth (CSS var reference)
  Move to TW:   flex, flex-col, items-center, w-full, mx-auto, shrink-0, grow

containerByDisplay:
  Move to TW:   hidden / flex (as class lookup map)

containerByAlign:
  Move to TW:   items-start / items-center / items-end (as class lookup map)
```

### `containerBaseCls` (line 4)

Already a TW class string: `'box-border'`. Correct pattern.

---

## 3. Flex/Grid — Use layout components

### Current

`Container.tsx:230`:
```tsx
<div className={innerClasses} style={innerStyles}>
  {children}
</div>
```

The inner `<div>` acts as a flex column container (`flex flex-col items-center`). It should use the project's `Flex` or `Column` component instead of a raw `<div>` with flex styles applied through VE.

### Recommendation

If the inner wrapper is a vertical flex:
```tsx
<Flex direction="column" align="center" className={innerClasses} style={innerStyles}>
  {children}
</Flex>
```

Or if using TW directly on a raw div (acceptable when the component IS a layout primitive):
```tsx
<div className={cn('flex flex-col items-center w-full mx-auto shrink-0 grow', innerClasses)} style={innerStyles}>
```

Since `Container` is itself a layout primitive in the same package as `Flex`, using TW classes directly on the `<div>` is reasonable here — importing `Flex` into `Container` would create a peer dependency between layout primitives. The key fix is moving the static flex/layout properties out of VE and into TW classes.

---

## Action items

| # | Action | Files |
|---|---|---|
| 1 | Consolidate `ContainerOwnProps` — single source of truth in `container.props.tsx`, import in `Container.tsx` | `Container.tsx`, `container.props.tsx` |
| 2 | Extract static flex/layout styles from `containerInnerBase` VE style to TW classes | `Container.css.ts`, `Container.tsx` |
| 3 | Replace `containerByDisplay` / `containerByAlign` base variants with TW class lookup maps | `Container.css.ts`, `Container.tsx` |
| 4 | Keep `@container` responsive variants and CSS var styles in VE | `Container.css.ts` (no change) |
| 5 | Replace inner `<div>` raw flex with TW classes (or `Flex` component if appropriate) | `Container.tsx` |
| 6 | Fix failing test — `borderRadius` not applied when `Theme radius="lg"` is set | `Container.test.tsx` or `Container.tsx` |
