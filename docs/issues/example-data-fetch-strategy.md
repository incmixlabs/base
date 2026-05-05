## Summary
Presspoint currently regenerates local seeded data on every `fetchPresspointRequests()` call. That is acceptable as a temporary demo shim, but it is not the right long-term fetch model once the data becomes remote.

## Context
- Current source: `apps/presspoint/src/lib/presspoint-data.ts`
- Current behavior: every fetch call waits briefly, then regenerates the full dataset
- Expected direction: Presspoint view spec and data become remotely fetched / data-driven

## Follow-up
- Avoid refetching on every call once the source is remote
- Prefer interval-based refresh for relatively stable datasets
- Use streaming or incremental loading for larger datasets
- Keep Presspoint responsive when the table mounts, remounts, or refocuses

## Acceptance criteria
- A repeated mount/refetch path does not force a full data reload by default
- Refresh cadence is explicit rather than implicit per render/remount
- Large dataset loading strategy is documented and implemented via paging, streaming, or incremental fetch
