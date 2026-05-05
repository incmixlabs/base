# Incmix

Public-facing frontend monorepo for Incmix UI, Theme, and Storybook.

This workspace contains the public UI packages and public Storybook. Private apps, pro components, AutoForm, declarative UI, editor, table, backend services, auth code, paid integrations, and product-specific surfaces stay outside this repo.

## Layout

```text
apps/
  storybook/

packages/
  config/
  theme/
  ui/
```

## Commands

```sh
pnpm install
pnpm packages
pnpm build
pnpm typecheck
pnpm dev:storybook
```
