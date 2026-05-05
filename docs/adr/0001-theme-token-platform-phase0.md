# ADR-0001: Theme Token Platform Phase 0 Decisions

- Status: Accepted
- Date: 2026-03-11
- Issue: https://github.com/bwalkt/autoform/issues/234
- Owners: UI Platform

## Context

We need one theming platform that supports:

1. Runtime theming via ThemeProvider for SaaS tenants.
2. Theme editing (ThemeEditor) with live preview and publishing.
3. Figma MCP synchronization (one-way first, then two-way) without token drift.

PR #287 added a DTCG-like token export foundation, but Phase 0 governance decisions were not explicitly locked.

## Decision

### 1. v1 token scope is fixed to these domains

1. Global foundations
- `color.hue.*`
- `size.*`
- `fontWeight.*`
- `borderRadius.*`
- `spacing.*`
- `breakpoint.*`
- `typography.*`

2. Semantic tokens
- `color.semantic.{lane}.{token}`
- lanes in v1: `default`, `primary`, `secondary`, `accent`, `neutral`, `info`, `success`, `warning`, `error`, `inverse`, `light`, `dark`

3. Component token namespaces (v1)
- `component.button.*`
- `component.textField.*`
- `component.badge.*`

No other component namespaces are in v1 unless explicitly approved by follow-up ADR.

### 2. Conflict policy is Repo-first for v1

When JSON and Figma diverge:

1. Canonical source: repository token JSON (validated contract).
2. Figma updates are imported as proposals and must be reviewed before publish.
3. No silent overwrite of canonical JSON from Figma in v1.

### 3. Publish lifecycle is draft -> review -> published

1. Draft: editable, non-runtime.
2. Review: frozen candidate; validation + diff required.
3. Published: immutable version used by tenants.

Rollback is by repointing tenant to a previously published immutable version.

## Consequences

1. Reduces drift risk by establishing one canonical contract.
2. Keeps v1 manageable by limiting component token surface area.
3. Adds process overhead (review step), but improves safety for multi-tenant updates.

## Alternatives considered

1. Figma-first canonical source
- Rejected for v1 due drift/audit/reproducibility risk.

2. Two-state lifecycle (draft/published)
- Rejected to avoid direct publish without explicit review gate.

3. Broad component token scope in v1
- Rejected to reduce delivery risk and unblock Phase 1/2 implementation.

## Follow-up tasks

1. Create a canonical theme schema aligned to this ADR.
2. Implement validator + migration hooks.
3. Add ThemeProvider merge chain: base -> brand -> tenant -> user override.
4. Build component adapters for Button/TextField/Badge.
