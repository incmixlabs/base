# Incmix

Public-facing frontend monorepo for Incmix UI, AutoForm, Storybook, and supporting packages.

This workspace follows the public-source boundary described in `../autoform/docs/unify-org-dirs.md`: reusable npm packages live in `packages/*`, public Storybook lives in `apps/storybook`, and docs, private apps, backend services, auth code, paid integrations, and product-specific surfaces stay outside this repo.

## Layout

```text
apps/
  storybook/

packages/
  core/
  react/
  autoform/
  ajv/
  ui/
  theme/
  table/
```

## Commands

```sh
pnpm install
pnpm packages
pnpm build
pnpm typecheck
pnpm dev:storybook
```
