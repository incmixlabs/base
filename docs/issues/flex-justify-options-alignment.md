# Align Flex `justify` Prop Contract and Story Controls

## Summary
`packages/ui/src/layouts/flex/Flex.stories.tsx` currently limits `justify` controls to the values in `flexPropDefs.justify` and includes a TODO noting missing `around` / `evenly` support.

## Problem
The Storybook TODO is not tracked by an issue ID, and Flex `justify` option scope can drift between:
- `flex.props.tsx` (`justifyValues`)
- `Flex.tsx` prop type / mapping
- `Flex.stories.tsx` controls and examples

## Proposed Change
1. Decide whether Flex should support only `start|center|end|between` or also `around|evenly`.
2. Update `packages/ui/src/layouts/flex/flex.props.tsx` values.
3. Update `packages/ui/src/layouts/flex/Flex.tsx` type + VE/TW mapping.
4. Update `packages/ui/src/layouts/flex/Flex.stories.tsx` controls/examples.
5. Replace inline TODO with this issue ID once created.

## Acceptance Criteria
- `flex.props.tsx`, `Flex.tsx`, and `Flex.stories.tsx` use the same `justify` contract.
- No inline TODO remains without an issue reference.
- `pnpm --filter @bwalkt/ui run lint:fix` passes.
- `pnpm --filter @bwalkt/ui test` passes.
