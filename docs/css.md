# CSS and Declarative UI Runtime Notes

## Current Direction

This section supersedes the earlier exploratory comparisons below.

If designing today from scratch for the generated/runtime platform goal, the preferred direction is:

- JSON token schema as the source of truth
- CSS custom properties for tenant/runtime theming
- stable semantic Tailwind utilities that resolve against those CSS variables
- AutoForm for form rendering
- XState later for workflow/orchestration

This recommendation assumes:

- ground-up design for the new generated/runtime layer
- no legacy or backward-compatibility constraints as the primary driver
- the right architecture is chosen first, and migration can be planned separately if needed

In other words:

- keep theme/token semantics first-class
- do not persist raw class strings in backend JSON
- do not make UnoCSS the default migration target right now
- do not make "move away from vanilla-extract" the roadmap headline

The main idea is simpler than the earlier tool comparison:

1. Figma Variables / Workbench / backend JSON define tenant tokens
2. runtime or SSR injects CSS variables
3. semantic utility classes like `bg-primary`, `text-surface`, `rounded-base`, `font-body` stay stable
4. generated UI JSON stores structured props, not arbitrary class names

This keeps:

- the theming layer simple
- the generated UI contract simple
- the runtime render path deterministic

## Container Queries In This Model

Container queries now belong in the main CSS/runtime contract, not in a separate implementation track.

That means:

- local surface width should be the default responsiveness seam for embeddable components
- viewport breakpoints still matter for page-shell and app-shell layout contracts
- container-query thresholds should come from exported token sources, not ad hoc literals spread through components
- compile-time CSS should continue to own actual `@container` thresholds
- runtime theme/config should select profiles, tokens, or derived variables, but should not try to inject raw query conditions

In practice, the model is:

1. token sources define breakpoints and responsive-profile inputs
2. generated CSS emits `@container` rules at compile time
3. components consume the resulting vars, classes, and derived states
4. `ThemeProvider` can expose profile selections and emitted CSS vars for inspection/editor seams

This is the same architectural direction now reflected in the container-query and responsive-profile work:

- local container breakpoints for embeddable surfaces
- typography/container breakpoints exported from token sources
- profile-driven CSS variable output for runtime theming and preview/debugging
- component styling that consumes those outputs through `css.ts` and tokens rather than one-off prop threading

### What This Means For `css.ts`

Container queries should not be treated as a second styling doctrine alongside `css.ts`.

Instead:

- `css.ts` remains the implementation layer for component styling
- container queries are one of the responsive mechanisms that `css.ts` should encode
- tokenized helpers and shared breakpoint exports should be preferred over hand-authored query literals
- component migrations should move styling and container responsiveness together when they are part of the same surface contract

So the question is no longer:

- "should this component be updated for `css.ts` first and container queries later?"

It is more often:

- "what is the responsive contract of this surface, and how should `css.ts` encode it using tokens and container queries?"

### Current Contract Boundaries

Use container queries only when a surface demonstrably depends on local embedding width rather than viewport width.

Typical candidates are:

- typography or layout variants that genuinely change based on the width of the embedding surface
- dense editor/workbench surfaces where local width, not viewport width, determines usability
- intentionally responsive container-owned layouts that cannot be modeled cleanly at the page-shell breakpoint layer

They should not be treated as the default responsive tool for migrated primitives such as:

- `Accordion`
- `Badge`
- `Button`
- `Callout`

Do not treat container queries as:

- a runtime-substituted string contract
- a `ThemeProvider`-driven threshold system
- a reason to bypass semantic tokens or CSS variables

The stable contract remains:

- token-defined thresholds
- compile-time generated query rules
- runtime-selected profile/token values
- semantic component styling layered on top
- case-by-case adoption only where the responsive contract clearly requires local container width

## Versioning

For persisted theme JSON, versioning should live in the payload, not in the TypeScript type name.

Preferred pattern:

- code type: `ThemeContract`
- persisted version marker: `metadata.schemaVersion = '1.0.0'`

Why:

- the stored JSON is what actually needs compatibility and migration handling
- type names should stay simple unless the codebase is actively carrying multiple parallel schema generations
- the runtime loader/validator can branch on `metadata.schemaVersion` when needed

So if the contract changes incompatibly later, the migration story is:

1. incoming persisted JSON declares its `metadata.schemaVersion`
2. validation/migration logic checks that version
3. old payloads are migrated forward before normal runtime use

Example:

- `ThemeContract` remains the main code type
- persisted payloads may carry:
  - `metadata.schemaVersion = '1.0.0'`
  - later `metadata.schemaVersion = '2.0.0'`

That keeps versioning attached to the persisted schema, not baked into every type reference.

## Recommended Roadmap

### Phase 1

Define a canonical tenant token JSON schema.

This should cover:

- colors
- typography
- radii
- spacing/density where relevant
- brand assets such as logo references

### Phase 2

Define the semantic CSS variable contract.

Examples:

- `--color-primary`
- `--color-surface`
- `--color-text`
- `--radius-base`
- `--font-body`

These should be stable and not tied to tenant names.

### Phase 3

Update Tailwind to consume those semantic CSS variables through stable utility names.

Examples:

- `bg-primary`
- `text-surface`
- `border-primary`
- `rounded-base`
- `font-body`

This avoids the safelist/runtime-class problem because the class vocabulary stays finite.

### Phase 4

Build runtime token application.

Prefer:

- SSR or edge-side scoped style injection
- or tenant-scoped root/container CSS variable assignment

This avoids FOUC and keeps multi-tenant theming deterministic.

### Phase 5

Drive generated UI from persisted JSON using:

- structured props
- semantic variants
- semantic layout/style choices

Do not store:

- arbitrary class strings
- arbitrary CSS values as the main authored contract

For composed form wrappers, contract coverage does not require a brand-new token namespace for every wrapper.

Examples:

- `Textarea` and `Select` can legitimately resolve through the `textField` contract
- `MultiSelect` can legitimately resolve through `textField`, `pickerPopup`, `badge`, and `button`
- but standalone group surfaces such as `CheckboxGroup`, `RadioGroup`, and `SwitchGroup` should keep group-specific layout spacing in the runtime contract rather than hardcoded utility gaps

## Current Documentation Boundary

The docs surface should distinguish between:

- element docs for first-class primitives and authored components
- wrapper docs only where a real data-driven wrapper component exists

That means:

- do add element docs for primitives even when they do not have wrappers
- do not add wrapper docs for simple controls unless the library actually exports a wrapper surface

Current remaining docs gaps after the latest wrapper/docs pass are:

- `CheckboxCards`
- `RadioCards`
- `MultiSelect`
- `FileUpload`
- `MentionTextarea`

These still need dedicated element documentation.
They are not, by default, evidence that wrapper docs are missing.

### Phase 6

Only revisit UnoCSS if a concrete generated-layout/runtime-composition problem appears that Tailwind + semantic vars cannot solve cleanly.

So the current recommendation is:

- no broad UnoCSS migration roadmap yet
- no broad VE removal roadmap yet
- build the token/CSS-var/semantic-utility architecture first

## Current Migrated Component Coverage

The runtime-token migration under `#419` is already partially implemented on `main`.

Today, the following `component.*` branches are real runtime token consumers:

- `component.button`
  - `Button`
- `component.surface`
  - `Surface`
- `component.accordion`
  - `Accordion`
- `component.badge`
  - `Badge`
- `component.callout`
  - `Callout`
- `component.card`
  - `Card`
- `component.popover`
  - `Popover`
- `component.tooltip`
  - `Tooltip`
- `component.progress`
  - `Progress`
- `component.slider`
  - form `Slider`
- `component.scrollArea`
  - `ScrollArea`
- `component.textField`
  - `TextField`
- `component.checkbox`
  - `Checkbox`
- `component.radio`
  - `RadioGroup` / radio control sizing
- `component.switch`
  - `Switch`
- `component.iconButton`
  - `IconButton`
- `component.appShell`
  - `AppShell.Content`
- `component.toggle`
  - `Toggle`
  - `ToggleGroup`
- `component.fieldGroup`
  - `FieldGroup`
- `component.checkboxCards`
  - `CheckboxCards`
- `component.radioCards`
  - `RadioCards`
- `component.pickerPopup`
  - `PickerPopup`
- `component.fileUpload`
  - `FileUpload`
- `component.mentionTextarea`
  - `MentionTextarea`
- `component.dateNext`
  - `DatePickerNext`
  - `DateRangePickerNext`
  - `MiniCalendarNext`
  - shared date-next calendar panel/popover sizing and spacing

This list reflects the merged `#419` rollout batches so far:

- `#420` Button and Surface
- `#422` Accordion, Badge, Callout, Card, Popover, Progress, Slider
- `#424` Checkbox, Radio, Switch, TextField
- `#429` FieldGroup, CheckboxCards, RadioCards
- `#432` FileUpload, MentionTextarea, PickerPopup
- `#437` Date-next surface family
- `#496` shared semantic token remap for Tailwind, sprinkles, and globals
- `#497` Sidebar, Filter, and Table contract cleanup

Additional migrated coverage on `main` now includes:

- `component.sidebar`
  - `Sidebar`
- `component.filter`
  - `Filter`
- `component.table`
  - `Table`
  - `InfiniteTable`

This is intentionally narrower than "all components in the library".
It only lists components that currently read runtime theme values from the `component.*` CSS variable contract.

## Current Remaining Batch Candidates

The next `#419` batches should focus on live semantic-contract surfaces that still read legacy globals directly.

Current likely next candidates are:

- editor autoform pair
  - `JsonViewEditor.css.ts`
  - `JsonDiffView.css.ts`
- tree surface
  - `TreeView.css.ts`
- accordion follow-up
  - `Accordion.css.ts`
- form popup/text-field follow-up
  - `picker-popup.css.ts`
  - `TextField.css.ts`

`Accordion.css.ts` is not fully migrated yet.
It still reads legacy globals such as `--border`, `--background`, `--foreground`, `--muted-foreground`, and `--accent`, so it should stay in the remaining-work list until those are repointed to semantic tokens.

## Why This Direction Won

This direction is cleaner because:

- it is not tied to legacy styling decisions
- it is not constrained by backward-compatibility-first thinking
- it is compatible with Figma-driven tenant theming
- it avoids a three-system styling stack
- it avoids turning Tailwind classes themselves into the persisted platform contract
- it keeps the generated runtime UI path simple and explainable

## What This Means For Vanilla-Extract

`vanilla-extract` is no longer the primary migration target in either direction.

Instead:

- do not expand VE as the authored generated-runtime contract
- do not rush to rip VE out everywhere either

If VE remains useful internally for existing component implementation or token tooling, that can be decided later.

But the platform direction should now be defined independently of that legacy choice.

## Context

We discussed the styling direction for a future generated UI/runtime platform built on top of AutoForm.

The target is not code-authored UI like `webix.ui(...)`.

The page-composition target is closer to `vercel-labs/json-render`:

- backend/authored JSON describes page structure
- rendering is constrained to a known component catalog / registry
- runtime output is deterministic and schema-validated
- actions/events are structured, not arbitrary code
- pages can be composed and evolved without a compile step for every content/config change

The actual goal is:

- backend-persisted JSON
- Workbench-authored definitions
- runtime-interpreted UI
- no compile step required for behavior changes
- XState-based workflow/orchestration
- React Query-based CRUD, data fetching, cache synchronization, and stitching of corresponding data

That changes the styling decision significantly.

## Main Conclusion

For a generated, backend-persisted declarative UI platform:

- pure `vanilla-extract` is not a good authored contract
- mixed `vanilla-extract + Tailwind` is an acceptable transition state
- a utility-first contract plus design tokens is the cleaner long-term direction

Bluntly:

- `vanilla-extract` is fine for component-library internals
- the generated/runtime layer should not depend on VE concepts
- the persisted contract should be JSON-safe, token-driven, and utility-like

## Why Mixed VE + Tailwind Is Awkward

If different orgs should generate their own styling from Figma and config:

- Org A may want different button radius
- Org B may want different fonts or surface treatments
- those differences need to be expressed through persisted config and tokens

In that world, mixed `VE + TW` becomes hard to reason about:

- some styling is compile-time and component-internal
- some styling is utility-driven and runtime-friendly
- it becomes unclear what is truly themeable vs hardcoded
- Workbench has no single clear target contract

So mixed `VE + TW` is workable as a transition, but not ideal as the final platform contract.

## Tailwind vs UnoCSS

### Tailwind

Pros:

- familiar
- mature ecosystem
- easy to explain to most developers

Cons:

- safelist / extraction model is awkward for backend-generated JSON
- arbitrary runtime-generated classes are risky
- more friction if we want a custom utility dialect around our own tokens

### UnoCSS

Pros:

- better fit for generated/runtime-oriented UI
- easier to define custom rules and shortcuts
- better fit for token-aware utility contracts
- reduces the safelist maintenance problem

Cons:

- less mainstream
- requires more architecture discipline from us

### Recommendation

For this platform direction:

- if optimizing for architecture: choose `UnoCSS`
- if optimizing for external familiarity: Tailwind is easier to name-check

But the practical developer ergonomics can still look very Tailwind-like with UnoCSS.

So the real question is not "what do developers type?"

It is:

- which engine better supports persisted, generated, token-driven UI contracts?

That points toward UnoCSS.

### Tailwind Familiarity vs UnoCSS Ergonomics

We also clarified that Tailwind's advantage here is mostly:

- external familiarity
- ecosystem signaling
- team comfort with the brand name

It is **not** necessarily a major internal developer ergonomics advantage if UnoCSS is configured with a Tailwind-like utility surface.

So the real decision should be driven more by runtime/platform fit than by fear of developer adoption cost.

### UnoCSS Preset-Wind4

`@unocss/preset-wind4` makes UnoCSS more practical for this direction because it gives:

- a Tailwind-v4-like authoring model
- more familiar developer syntax
- UnoCSS flexibility under the hood

That reduces the tradeoff significantly:

- developers can keep a Tailwind-like mental model
- the platform still gets a more flexible engine for generated/runtime UI

## Semantic Tokens Still Matter

Even if we move toward a utility-first engine, semantic tokens should remain ours.

That means:

- keep semantic tokens like `primary`, `secondary`, `success`, `warning`, `surface`, `muted`
- let utility classes reference those tokens
- let org theming swap token values rather than changing the utility vocabulary

So the long-term contract should prefer:

- `color: "primary"`
- `tone: "surface"`
- `textColor: "muted"`

over:

- literal Tailwind palette choices like `bg-blue-500`

The utility engine is the transport/render layer, not the semantic source of truth.

## Typed Theme Contract vs Utility Engine

We also clarified an important distinction:

- theme/token contract
- utility/layout engine

These are related, but they are not the same thing.

### What VE Is Good At

`vanilla-extract` is strong at defining a typed semantic theme contract.

Conceptually, VE lets us define a schema like:

- `color.primary`
- `color.secondary`
- `color.surface`
- `radius.md`
- `font.body`

as an actual typed object contract.

That means:

- token keys are enforced by TypeScript
- missing token keys fail at build time
- renaming token keys breaks consumers in useful places
- component styles can reference semantic variables through typed paths

This is the main reason VE is attractive for SaaS dynamic theming.

### What UnoCSS Is Good At

UnoCSS is strong at:

- utility-style composition
- generated/runtime-friendly class systems
- flexible token-aware utility mapping

UnoCSS can absolutely use CSS variables.

For example, utility rules or shortcuts can reference:

- `var(--color-primary)`
- `var(--radius-md)`
- `var(--font-body)`

So UnoCSS is **not** incompatible with:

- multi-tenant theming
- runtime brand colors
- runtime font changes
- CSS variable driven tenant themes

### The Important Distinction

VE's advantage is not that it is the only tool that can support dynamic theming.

Its advantage is:

- a stronger built-in TypeScript-native theme contract experience

UnoCSS can still support the same semantic model, but the typed token contract would be something we define and own ourselves.

That means the likely best architecture is:

- preserve a typed semantic token contract
- expose those tokens as CSS variables
- let the utility engine reference those variables

In other words:

- the important asset is the semantic token schema
- not necessarily VE as the styling system for every authored surface

### Practical Conclusion

For user-driven UI generation, the real requirement is:

- a stable semantic token model
- runtime CSS variable assignment per tenant/org
- generated UI composition that can reference those tokens cleanly

So the viable long-term direction is:

- typed semantic token contract + runtime CSS vars
- utility-first generated/runtime UI composition

VE is one way to define the token contract.
UnoCSS can still consume the same token model through CSS variables.

The real architecture decision is therefore not:

- "VE or UnoCSS?"

but more:

- "where does the typed token contract live?"
- "where does the utility/layout engine live?"

## Important Tailwind Limitation

If a Tailwind class is not present in the build input or safelist:

- the class string may exist at runtime
- but the CSS will not exist
- so the UI silently renders wrong

For backend-persisted generated UI, that is a serious risk.

Because of that, persisted JSON should **not** store arbitrary raw Tailwind class strings.

Instead, persisted JSON should store structured style configuration, for example:

```json
{
  "paddingX": "3",
  "paddingY": "2",
  "radius": "xl",
  "textSize": "sm"
}
```

Then the runtime maps that structured config into a known class registry or utility mapping.

## Render-JSON Style Mapping

We also discussed a `render-json` style approach:

- persist structured props
- map them directly to Tailwind classes
- do not add UnoCSS yet

That is a valid first system.

The important caveat is:

- do **not** persist raw class strings as the platform contract
- do persist structured semantic props
- do keep the prop-to-class mapping centralized

If done that way, Tailwind as a first implementation is not another VE-scale strategic mistake.

The real trap would be:

- backend JSON storing raw freeform classes directly

because then Tailwind itself becomes the persisted platform contract.

## Important UnoCSS Clarification

UnoCSS is more flexible than Tailwind for generated systems, but it does **not** mean:

- arbitrary user-provided class strings should be trusted
- any random backend string will always work safely

UnoCSS helps because we can define broader rule-driven patterns instead of enumerating every allowed class.

That makes it a better fit for generated UI, but the persisted contract should still be structured JSON, not arbitrary class soup.

## PandaCSS

PandaCSS was also considered.

Assessment:

- stronger than Tailwind for token-first design-system work
- attractive for code-authored app/component styling
- but still not the best fit for a backend-persisted, runtime-interpreted UI platform

So for this specific direction, the ranking discussed was:

1. `UnoCSS`
2. `PandaCSS`
3. `Tailwind`

That ranking is specific to the generated-runtime use case, not to general frontend app development.

## Recommended Architecture

### Persisted Contract

Persist strict JSON in the backend.

Do not persist:

- JSX
- functions
- raw arbitrary styling code

Prefer:

- structured style props
- component variants
- design tokens
- registry references

### Composition Model

Page composition should follow a catalog/registry model similar to `json-render`, but with our own persisted contract and runtime:

- persisted JSON declares page/layout/component trees
- the runtime only renders registered components and approved actions
- structured props map into known component APIs
- styling choices map into semantic tokens/utilities, not raw arbitrary class strings
- data dependencies are declared in a way the runtime can bind safely

This means the authored/runtime contract should look more like:

- `component: "Card"`
- `props: { ... }`
- `children: [ ... ]`
- `action: "customer.update"`
- `query: "orders.byCustomer"`

and less like:

- arbitrary JSX
- freeform executable code
- raw class-string payloads as the main composition contract

### Runtime Responsibilities

At runtime, responsibilities should stay cleanly separated:

- JSON/catalog layer
  - defines what components, props, actions, and layout structures are allowed
- CSS/token layer
  - defines semantic tokens, CSS vars, and stable utility mappings
- XState layer
  - handles workflow, orchestration, state transitions, multi-step UI flows, and guarded interactions
- React Query layer
  - handles CRUD requests, caching, invalidation, background refresh, and stitching server data into rendered surfaces

In practice:

- React Query should own resource fetching/mutation concerns
- XState should coordinate user/task/workflow state
- rendered JSON nodes should bind to those systems through structured references, not bespoke component-local ad hoc wiring

### Styling Model

Use three layers:

1. token layer
- colors
- radius
- typography
- spacing
- shadows
- density

2. utility/layout layer
- flex/grid
- gap
- padding
- alignment
- width/height
- responsive behavior

3. component variant layer
- `button.variant = primary`
- `button.size = sm`
- `surface.tone = muted`

### Runtime Interpretation

The runtime should map persisted JSON into:

- stable components from a registry
- stable actions from a registry
- stable style mappings from a registry

## AutoForm and XState Roles

We also clarified the platform split:

- AutoForm = declarative form engine
- XState = declarative app/workflow engine

AutoForm should own:

- form normalization
- field/widget rendering
- validation
- form-specific conditions and dynamic branches

XState should own:

- transitions
- guards
- async orchestration
- workflow state
- multi-step application behavior

## Declarative Runtime Direction

The broader target is:

- persisted UI JSON in backend
- Workbench-authored definitions
- runtime-interpreted rendering
- registry-based execution
- no compile step for behavior changes

This is closer to:

- Excel-style persisted behavior + rendering model

than to:

- arbitrary low-code / arbitrary code in JSON

The goal is tenable if the platform stays constrained.

It is not tenable if it tries to become:

- arbitrary programming in JSON
- arbitrary UI with no constraints
- unrestricted custom side effects everywhere
