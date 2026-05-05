# Local Storage Policy

This document uses "local storage" in the broad product sense: data stored locally by the browser or attached to browser requests. It includes `sessionStorage`, `localStorage`, cookies, and related browser-local mechanisms.

This policy is for UI preferences, session context, authentication request state, and theme/editor drafts. It is not the persistence model for serious local-first application documents. Durable local-first app data belongs behind the repository/worker boundary described in `docs/declarative-ui/local-first.md`.

When a feature needs durable product data, treat storage placement and sync behavior as separate decisions. Tenant policy decides whether durable browser-local storage is allowed at all. Each persisted object decides whether it syncs automatically, waits for an explicit commit, or never syncs.

## Storage Scopes

| Scope | Lifetime | Visible To Server | Cross-Tab Behavior | Use For |
| --- | --- | --- | --- | --- |
| `sessionStorage` | Current browser tab; survives refresh; clears when tab closes | No | Isolated per tab | Active project/workspace/document context |
| `localStorage` | Browser profile until cleared | No | Shared across tabs for the same origin | Non-sensitive durable browser preferences and drafts |
| Cookie | Until expiry/session end | Yes, on matching requests | Shared across tabs for the same cookie jar | Auth session id, SSR-visible rendering hints |
| Backend | Product-defined | Yes | Shared across devices/sessions | Source-of-truth user/org/theme config |

## `sessionStorage`

Use `sessionStorage` for tab-local context that should survive refresh but should not synchronize across tabs.

Good fits:

- `currentProject`
- current workspace/document selection when different tabs may work in different projects
- active workbench context that should recover after refresh in the same tab
- transient route state that should not become a durable preference

Avoid:

- auth tokens
- shared user preferences
- backend-owned theme config
- data that must survive tab close

Acceptance rule: two tabs must be able to select different `currentProject` values, and each tab should retain its own value after refresh.

Implementation:

- Use `useSessionStorage` from `@bwalkt/ui/hooks` for tab-scoped values.
- Key project context by product surface when needed, for example `af:docs:current-project` or `af:workspace:current-project`.
- Keep project ids as routing/context hints only. Resolve permissions and project membership from the backend.

## `localStorage`

Use `localStorage` for non-sensitive, durable browser-local state that should be shared across tabs on the same origin.

Good fits:

- unsaved ThemePanel draft values, keyed by user/app/theme id
- dismissed UI hints
- local-only editor preferences
- fallback appearance preference for client-only surfaces

Avoid:

- auth tokens, bearer tokens, refresh tokens, API keys, or secrets
- project membership, permissions, or anything the backend must trust
- saved product theme config when the backend is the source of truth
- large document/workspace data

`localStorage` writes should tolerate read/write failures and invalid JSON. Treat stored values as untrusted input and validate or sanitize before use.

## Cookies

Use cookies for request-visible state that the server or SSR renderer needs before React hydrates.

Good fits:

- authenticated session id in an `HttpOnly`, `Secure`, `SameSite=Lax` or `SameSite=Strict` cookie
- appearance hint for SSR first paint, such as `light`, `dark`, or `inherit`
- small org/project routing hints only when the server needs them before app boot

Avoid:

- large theme JSON
- high-churn editor state
- arbitrary drafts
- secrets in non-`HttpOnly` cookies
- values the server trusts without backend validation

Authentication state should prefer secure server-managed cookies. Do not store bearer tokens or refresh tokens in `localStorage` or `sessionStorage`.

## Backend

Use the backend as the source of truth for durable product state.

Good fits:

- saved theme config
- org/project membership
- permissions
- user profile
- shared workspace settings

Theme config examples:

- `radius`
- future scoped radius values such as `radius.sidebar` or `radius.content`
- `avatarRadius`
- `sidebarColor`
- `sidebarVariant`
- `contentBodyColor`
- `contentBodyVariant`
- semantic color lanes
- typography
- scaling when it is part of the app/brand theme

## Application Data Persistence

Application documents, page definitions, dashboard templates, composite widget definitions, component registry entries, and similar product records must not be stored directly in `localStorage`, `sessionStorage`, or cookies. They should go through the repository boundary.

Tenant policy controls storage placement:

```ts
type TenantPersistencePolicy = {
  mode: 'local-first' | 'remote-only'
  defaultSync?: 'automatic'
}
```

The tenant-level `mode` is a compliance decision:

- `local-first`: durable browser-local persistence is allowed. Use TinyBase/OPFS behind the repository boundary, then sync to the backend according to object policy.
- `remote-only`: durable browser-local persistence is not allowed. The backend is the durable store, and local state should be limited to ephemeral runtime state.

Sync behavior is object-level, not tenant-level:

```ts
type PersistedObjectSyncPolicy = {
  sync: 'automatic' | 'manual' | 'disabled'
  space?: 'private' | 'workspace' | 'published'
}
```

Object sync modes:

- `automatic`: sync as soon as possible. Use this for OLTP-like records and other objects where local and remote should converge without a user commit.
- `manual`: persist the draft, but keep it private until the user explicitly commits, publishes, or submits it for review. In `remote-only` mode, that private draft still lives remotely in the user's private space.
- `disabled`: do not sync the object remotely. This is only valid when durable local storage is allowed, or for explicit development/test sandboxes.

`local-only` is therefore an object behavior, not a tenant storage placement mode: it means `mode: 'local-first'` with `sync: 'disabled'`. If tenant policy is `remote-only`, a product feature that needs durable private work should use `sync: 'manual'` and store the draft in a backend private space.

`memory-local` is not a product persistence mode. It is an internal development/test fallback for sandboxes where OPFS or a backend is unavailable. Data stored this way is not durable and can disappear on refresh.

## Provider Responsibilities

`TenantProvider` should own tenant and app policy:

- persistence placement policy
- default object sync behavior, usually `automatic`
- tenant-owned CSS variable defaults
- radius, color lanes, and other brand/system defaults
- shell or dashboard configuration that belongs to the tenant or product surface

`ThemeProvider` should own user/session presentation preferences:

- light/dark appearance
- future user scale or density preferences
- controlled rendering state and CSS var application
- callbacks that let the app adapter persist changes elsewhere

`AdminThemeProvider` should eventually be renamed or split toward `TenantProvider` semantics. The key rule is that compliance and repository policy should not be hidden inside `ThemeProvider`.

## Theme Persistence

`ThemeProvider` should remain storage-agnostic. Apps should control it from a root adapter that combines backend theme config, user preferences, and session state.

Recommended split:

| Theme Data | Storage |
| --- | --- |
| `appearance` user preference | Cookie for SSR first paint, optionally mirrored to `localStorage` |
| ThemePanel unsaved draft | `localStorage` |
| Saved theme config | Backend |
| Active project/theme being edited | `sessionStorage` when per-tab selection matters |
| Temporary preview/hover state | React state or xstate/store only |

Example app integration:

```tsx
<ThemeProvider
  {...themeConfig}
  appearance={userPreferences.appearance}
  onAppearanceChange={setUserAppearance}
  onRadiusChange={patchThemeConfig}
  onSidebarColorChange={patchThemeConfig}
  onSidebarVariantChange={patchThemeConfig}
  onContentBodyColorChange={patchThemeConfig}
  onContentBodyVariantChange={patchThemeConfig}
/>
```

The adapter owns persistence. `ThemeProvider` owns rendering, CSS vars, controlled/uncontrolled state, and callbacks.

Current implementation:

- UI package exports `usePersistentThemePreferences` from `@bwalkt/ui/theme`.
- UI package exports `readCookie`, `writeCookie`, `deleteCookie`, and `useCookie` from `@bwalkt/ui/hooks` for client-readable cookies. The helper prefers the Cookie Store API and keeps `document.cookie` as one centralized compatibility fallback.
- The hook stores `ThemeUserPreferences` in `localStorage` under `af:theme:user-preferences`.
- UI package exports `usePersistentThemeConfig` from `@bwalkt/ui/theme` and stores app/theme config, including accent color, gray color, panel background, content body color, content body variant, sidebar color, sidebar variant, radius, typography, avatar, and scaling, under `af:theme:config`.
- UI package exports `usePersistentThemeVarsTokens` from `@bwalkt/ui/theme` and stores runtime theme var tokens, including semantic hues and variant steps, under `af:theme:vars-tokens`.
- The docs app controls `ThemeProvider.appearance` from those persisted preferences.
- The docs app mirrors only the appearance value to the `af_docs_appearance` cookie for first paint.
- The docs app injects a small pre-hydration script that reads the cookie first, falls back to `localStorage`, resolves `inherit` through `prefers-color-scheme`, then applies the root `dark` class and `color-scheme`.

The cookie is a rendering hint only. The durable preference remains browser-local `localStorage`, and saved theme config still belongs in the backend.

## Security Rules

- Never store auth tokens, refresh tokens, API keys, or secrets in `localStorage` or `sessionStorage`.
- Treat all browser-readable storage as user-controlled input.
- Use `HttpOnly` cookies for login session identifiers.
- Use `Secure` cookies in production.
- Use `SameSite=Lax` or `SameSite=Strict` unless a specific cross-site flow requires otherwise.
- Keep cookie values small and low-churn.
- Do not rely on local browser state for authorization decisions.

## Decision Guide

Use `sessionStorage` when the value is tab-local.

Use `localStorage` when the value is non-sensitive, browser-local, durable, and okay to share across tabs.

Use a cookie when the server needs the value during the request or SSR first paint.

Use the backend when the value is product state, shared state, permissioned state, or the source of truth.

Use TinyBase/OPFS only for serious local-first application data behind the repository boundary, not for simple theme preferences, current-tab context, or login request state.

Use the repository boundary for application documents, dashboard templates, composite widgets, and component registry entries. Select `local-first` or `remote-only` from tenant policy, then select `automatic`, `manual`, or `disabled` sync from the object policy.

Use backend private space for durable manual drafts when tenant policy is `remote-only`.

Do not use `memory-local` for product persistence. It is only a non-durable development/test fallback.
