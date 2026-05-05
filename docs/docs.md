# docs Coverage

This file tracks what is still missing in `apps/docs`.

Primary goal:

- migrate anything still needed from `packages/docs`
- sunset `packages/docs`
- remove the old Next.js docs app

Secondary goal:

- identify Storybook-only coverage that may later deserve docs pages

## Already In docs

### Getting Started / Infrastructure

- `autoform`
- `theme/color`
- `token-grid`
- `container-queries`
- `vanilla-extract`
- shared `mdx-components.tsx`

### AutoForm

- `autoform`
- `autoform/audit`
- `autoform/e2e`
- `autoform/renderer`
- `autoform/runtime`
- `autoform/schema-ast`
- `autoform/schema-contract`

### Layouts

- `masonry`
- `box`
- `flex`
- `grid`
- `container`
- `section`
- `aspect-ratio`
- `sidebar`

### Elements

- `accordion`
- `avatar`
- `avatar-group`
- `avatar-pie`
- `badge`
- `button`
- `callout`
- `card`
- `image`
- `icon-button`
- `popover`
- `segmented-control`
- `slider`
- `spinner`
- `tabs`
- `toast`

### Typography

- `text`
- `heading`
- `link`
- `kbd`

### Form

- `checkbox`
- `checkbox-group`
- `radio-group`
- `rating`
- `select`
- `stepper`
- `switch`
- `switch-group`
- `text-field`
- `textarea`

### Media

- `image`
- `media-player`
- `video`

## In packages/docs But Not docs

### Content / Route Parity

- `/docs/introduction`
- `/docs/tokens` (content exists as `/docs/token-grid`)
- `/docs/containers`
- `/docs/components`

These are route-name parity questions, not missing core docs content.

## Already Covered Well Enough To Sunset packages/docs

These old docs areas already have workable `docs` equivalents:

### Layouts

- `box`
- `flex`
- `grid`
- `container`
- `section`
- `aspect-ratio`
- `sidebar`

### Typography

- `text`
- `heading`
- `link`
- `kbd`

### Shared Infrastructure

- MDX component mapping
- viewport preview support
- live code preview support
- theme color page
- token grid page
- media `media-player` page
- media `video` page

## Storybook-Only Gaps

This section is lower priority than removing `packages/docs`, but it captures components that still have Storybook coverage without `docs` pages.

### Elements

- `hover-card`
- `progress`
- `surface`
- `toggle`
- `toggle-group`
- `tooltip`
- `tree-view`

Autogen-first candidates:

- `progress`
- `tooltip`

### Layouts / Wrappers

- `app-shell`
- `command-wrapper`
- `sidebar-wrapper`

### Typography

- `code`
- `blockquote`
- `quote`
- `inline-elements`
- `link-wrapper`

### Tables

- `table-pagination`
- `table-wrapper`
- `infinite-table`
- `infinite-table-wrapper`

### Form

`docs` now has a real Form section, but it is still missing many Storybook-only form components.

Missing coverage includes:

- `avatar-picker`
- `checkbox-cards`
- `credit-card-input`
- `field-group`
- `fieldset`
- `file-upload`
- `floating-toolbar`
- `input-mask`
- `input-otp`
- `location-input`
- `mention-textarea`
- `multi-select`
- `number-input`
- `password-input`
- `phone-input`
- `radio-cards`
- `signature-input`
- `slider`
- all `date` stories
- all `date-next` stories

## Suggested Priority

1. Decide whether route-name parity matters for:
   - `introduction`
   - `tokens`
   - `containers`
   - `components`
2. After `packages/docs` can be sunset, expand `docs` toward Storybook parity:
   - `progress`
   - `tooltip`
   - `hover-card`
   - `surface`
3. Add table docs.
4. Add missing typography docs:
   - `code`
   - `blockquote`
   - `quote`
   - `inline-elements`

## Notes

- Prefer prop values from autogen / prop defs instead of hardcoded arrays wherever possible.
- For `progress`, `scroll-area`, `tooltip`, and basic `dialog` coverage, start from autogen pages and only hand-author behavior/composition guidance around them.
- TODO: expand `docs` token documentation so `TokenGrid` fully replaces the old `packages/docs` tokens page; this can stay curated / hand-authored rather than autogen.
- `docs` route additions often require a full dev-server restart because file-route HMR is flaky.
