## Summary
Docs app is noticeably slow/unresponsive during local development. We need to separate expected dev overhead from real bottlenecks and tighten performance.

## Context
Observed in `packages/docs` while using MDX pages with `LiveCodeBlock`, CodeMirror, and interactive previews.

## Goals
- Improve perceived responsiveness in `next dev`.
- Ensure production (`next build` + `next start`) is fast and stable.
- Add lightweight guardrails to prevent regressions.

## Investigation checklist
- [ ] Benchmark startup + route change timings in `next dev` and production build.
- [ ] Measure impact of `LiveCodeBlock`/CodeMirror mounts per page.
- [ ] Check whether heavy MDX pages trigger excessive rerenders.
- [ ] Audit expensive client hooks (e.g., heading observers, query selectors, global listeners).
- [ ] Verify if `ThemePanel` and docs shell state updates trigger unnecessary subtree rerenders.

## Optimization checklist
- [ ] Lazy-load editor/runtime where possible (defer until block is visible or expanded).
- [ ] Memoize stable props/scope passed to live runner.
- [ ] Reduce preview work for off-screen code blocks.
- [ ] Consider splitting very large MDX pages.
- [ ] Ensure nav/quick-nav updates are throttled/debounced where appropriate.

## Acceptance criteria
- [ ] Dev interaction latency is materially improved on common docs pages.
- [ ] Production docs navigation and interaction feel responsive.
- [ ] Documented perf baseline and key measurements are checked into issue/PR notes.
