#!/bin/sh
set -eu

upstream_ref="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"

if [ -n "$upstream_ref" ]; then
  base_ref="$(git merge-base HEAD "$upstream_ref")"
else
  base_ref="$(git merge-base HEAD origin/main)"
fi

changed_files="$(git diff --name-only "$base_ref"...HEAD)"

if [ -z "$changed_files" ]; then
  echo "pre-push: no changed files detected"
  exit 0
fi

echo "pre-push: evaluating checks for changed paths since $base_ref"

has_changes_in_prefix() {
  prefix="$1"
  echo "$changed_files" | grep -E -q "^$prefix"
}

has_any_shared_changes() {
  echo "$changed_files" | grep -E -q '^(package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|biome\.json|tsconfig\.base\.json|\.husky/|scripts/)'
}

if has_any_shared_changes || has_changes_in_prefix 'apps/' || has_changes_in_prefix 'packages/'; then
  echo "pre-push: running public frontend checks"
  pnpm lint
  pnpm test
  pnpm build
fi
