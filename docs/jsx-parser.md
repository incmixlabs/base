# JSX Parser Plan

## Goal

Support user-authored JSX with:

- syntax parsing
- compile-to-preview
- error reporting
- optional type-aware validation
- controlled execution

This should be treated as a layered system, not a single parser feature.

## Recommendation

Do not build a JSX parser from scratch.

Use existing libraries for:

- parsing
- transforms
- syntax diagnostics
- source maps
- optional TypeScript diagnostics

Keep these parts custom:

- allowed component registry
- allowed props and authoring rules
- sandbox/runtime scope
- validation rules specific to this repo
- editor error UX

## Suggested Stack

Minimum practical stack:

- parser/transform: `esbuild`, `swc`, Babel, or TypeScript
- validation: custom AST rules plus existing component/catalog metadata
- runtime: controlled preview scope with explicit allowed imports/components

If the priority is fast live preview, prefer:

- `esbuild` or `swc`

If the priority is richer type diagnostics, add:

- TypeScript compiler API

## Architecture

### 1. Parse and transform

Input:

- user-authored JSX/TSX string

Output:

- syntax diagnostics
- transformed runnable module code
- source location mapping

Responsibilities:

- parse JSX
- catch syntax errors early
- transform JSX to executable code

### 2. Static validation

Checks:

- disallowed imports
- disallowed globals
- unsupported JSX patterns
- unknown components
- unsupported props
- invalid prop values where statically detectable

This layer should use the local component registry and prop metadata rather than relying only on generic parsing.

### 3. Runtime scope

The preview should not execute against unrestricted app globals.

Provide:

- explicit component scope
- explicit helper scope
- error boundary around execution
- isolated evaluation path where possible

This is the hardest part to get right safely.

### 4. Type-aware diagnostics

Optional, but valuable.

Use TypeScript-backed checking to surface:

- prop type errors
- missing required props
- invalid unions
- better editor diagnostics than syntax-only parsing

## Effort

### MVP

2 PRs:

1. parse/transform pipeline with syntax errors
2. preview runtime with controlled scope

### Good internal tool

4 PRs:

1. parse/transform pipeline
2. preview runtime and sandbox boundary
3. static validation rules
4. TypeScript diagnostics and editor error surfacing

### More polished/public-facing

5+ PRs:

1. parse/transform pipeline
2. runtime sandbox
3. static validation
4. TS diagnostics
5. UX polish, recovery states, caching, incremental performance improvements

## Recommended PR Plan

### PR 1

Add JSX/TSX parsing and transform pipeline:

- input string to transformed module
- syntax diagnostics
- source positions

### PR 2

Add controlled preview runtime:

- allowed component scope
- runtime error boundary
- no unrestricted execution

### PR 3

Add repo-specific validation:

- allowlist components
- allowlist props
- disallowed imports/globals
- custom AST rules

### PR 4

Add type-aware diagnostics:

- TypeScript prop checking
- better inline messages
- incremental caching if needed

## Risks

- safe execution is harder than parsing
- type-checking can become slow without caching
- JSX support without clear authoring constraints can become too permissive
- error UX matters as much as parsing correctness for usability

## Recommendation Summary

Build this as a hybrid:

- library-based parser/compiler
- custom validation and sandbox rules

Do not make `jsx-parser` a single giant PR. Split it into parse, runtime, validation, and diagnostics.
