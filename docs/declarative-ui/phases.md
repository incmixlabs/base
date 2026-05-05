Phase 4 slices:

  1. Validation ownership

  - Move validation transitions from “local hook
    computes, runtime observes” to explicit
    machine-driven semantics.
  - Target:
      - field validate
      - form validate
      - submit validate
      - clearer validation status in actor context
  - Goal:
      - runtime becomes the authority for
        validation lifecycle, not just an event
        sink.

  2. Touch/dirty ownership cleanup

  - Reintroduce touched/dirty runtime ownership
    carefully, without the unstable sync loop.
  - Target:
      - single ownership model
      - no bi-directional churn between local state
        and actor
      - stable workbench/test behavior
  - Goal:
      - touched, dirtyFields, isDirty come from
        runtime cleanly.

  3. Final AutoForm runtime boundary

  - Decide and codify what stays local vs what
    moves into runtime.
  - Target:
      - values/errors/server-errors/form-errors
        either:
          - remain local by design, or
          - partially move into runtime with
            explicit rules
      - remove duplicated bookkeeping from
        useAutoFormRuntime
      - update docs to mark Phase 4 complete only
        after this is stable
  - Goal:
      - one clear contract, not mixed ownership by
        accident.

  Short version:

  - PR 1: machine-driven validation
  - PR 2: stable touched/dirty ownership
  - PR 3: finalize local vs runtime state contract
    and clean up duplication

  Current boundary after PR 3:

  - shared runtime owns submit lifecycle,
    validation status/result metadata,
    touched/dirty tracking, and condition
    evaluation
  - local AutoForm runtime state owns values,
    validation errors, server errors, and form
    errors
  - renderers own branch-aware filtering and
    submit-time pruning


Phase 5
 Phase 5 should be split into a few small PRs, in the order already implied by docs/declarative-ui/
  declarative_ui_roadmap.md.

  I’d structure it like this:

  1. PR 1: Broaden page grammar pressure
     Goal: prove the declarative runtime against more real page shapes before touching persistence.
     Scope:

  - add more sample declarative pages
  - add in-page view variants
  - add tabs
  - add explicit read-only / view-only cases
  - add mixed page compositions beyond the current narrow examples
    Output:
  - docs/examples/tests that stress the current app/page grammar
  - any normalization/runtime fixes needed to support those shapes

  2. PR 2: Separate app/page document contracts
     Goal: stop overloading the current model and make the next runtime/storage steps explicit.
     Scope:

  - define typed AppDocument, PageDocument, and normalized runtime shapes in core
  - document route, query, action, and condition contracts
  - define invalid-state and normalization rules more explicitly
    Output:
  - typed document contracts
  - normalization updates
  - docs for authoring shape vs normalized runtime shape

  3. PR 3: JSON-defined component/widget proof
     Goal: prove local JSON-specified components before discovery/persistence.
     Scope:

  - allow a small in-repo set of JSON-defined widgets/components
  - resolve them through known renderer-backed component mappings
  - keep this local, probably under a path like packages/ui/src/widgets
    Output:
  - minimal component registry contract
  - renderer-backed JSON component resolution
  - tests/examples showing the grammar holds up



• Title: feat: add constrained jsx authoring bridge for declarative widgets

  Summary:
  Add a Phase 5 PR 3.5 bridge that lets users author declarative widgets/pages in constrained JSX, validate them
  against the catalog contract, lower them into declarative JSON, and project that JSON back into JSX for editing.
  JSON remains the runtime and persistence source of truth, while the JSX layer is an authoring surface backed by
  known catalog components rather than arbitrary React code.

  Scope:

  - constrained JSX/TSX authoring only
  - catalog-backed component and prop validation
  - JSX -> declarative JSON lowering
  - declarative JSON -> stable JSX projection
  - localized parser/validation errors with line/column when available
  - keep last valid JSON/rendered preview on authoring errors
  - one docs workbench showing JSX input, JSON output, rendered result

  Out of scope:

  - arbitrary React code execution
  - hooks/custom logic in authored JSX
  - external imports
  - persistence/discovery/storage
  - exact source-fidelity round-tripping

  Suggested phases.md entry:

  - PR 3.5: Constrained JSX authoring bridge
  - add bounded JSX authoring for declarative pages/widgets
  - validate authored JSX against catalog-backed component contracts
  - lower authored JSX into declarative JSON as the canonical runtime form
  - project declarative JSON back into stable JSX for editor workflows
  - surface localized parser/validation errors while preserving last valid preview/output
  - prove the flow in docs with a JSX -> JSON -> rendered

  
  4. PR 4: Registry contract and discovery metadata
     Goal: define the contract without committing to persistence yet.
     Scope:

  - define component registry entry shape
  - include scope/tags/discovery metadata
  - document persistence semantics without implementing full persistence
    Output:
  - registry schema/types
  - docs for discovery/search metadata
  - clear separation between runtime resolution and discovery concerns

  5. PR 5: Worker/repository boundary
     Goal: prepare for real local-first storage without binding the runtime to a storage engine.
     Scope:

  - define worker boundary
  - define query/mutation adapter contracts
  - define repository interface between UI/runtime and persistence
  - define cross-tab notification semantics separately from storage so other tabs can refresh local documents without coupling the runtime to a specific sync mechanism
    Output:
  - storage-agnostic boundary
  - no serious storage engine commitment yet beyond interface shape

    Reference:
  - `docs/declarative-ui/worker_repository_boundary.md`

  6. PR 6: First local-first persistence slice
     Goal: introduce persistence only after the runtime/document model is stable.
     Scope:

  - wire the repository boundary to a browser-local adapter
  - use TinyBase behind the repository boundary
  - preferred persistent client target: OPFS, with SQLite/WASM still a later storage evolution if needed
  - support a memory-only client mode selected by org configuration
  - keep same-browser propagation separate from backend merge semantics
    Output:
  - first end-to-end local-first data slice
  - worker-backed persistence path
  - runtime stays independent from backing store details
  - no client CRDT requirement in this slice unless concurrent multi-editor merge semantics become an explicit product requirement
A single combined PR for this phase mixes four concerns that should
  stay separable:

  - repository contract integration
  - worker/runtime boundaries
  - local persistence backend
  - cross-tab behavior

  If you do all of that in one PR, it becomes very hard to reason about regressions and very easy to
  let TinyBase leak upward into the runtime model.

  My recommendation is to reinterpret “PR 6” as a phase, not literally one GitHub PR.

  Recommended Split

  1. Repository integration PR

  - Add a local-first repository implementation behind the existing worker/repository boundary.
  - No persistence yet, or memory-only persistence.
  - Goal: prove that the runtime reads/writes through the repository seam cleanly.

  2. Persistence adapter PR

  - Introduce the actual client storage adapter.
  - If you truly want TinyBase, this is where it enters.
  - Start with TinyBase `Store`.
  - Support:
      - persistent client mode via TinyBase `OpfsPersister`
      - memory-only client mode for orgs that disallow local persistence

  3. Cross-tab notifications PR

  - Add same-browser multi-tab refresh/update propagation.
  - If using TinyBase, this is the natural place to use TinyBase synchronization infrastructure rather than custom app-level channel wiring.
  - Keep this framed as same-device coordination, not “sync”.

  4. Worker runtime proof PR

  - Add the concrete worker transport on top of the existing repository boundary.
  - Prove that queries, mutations, and document notifications can flow through `postMessage`
    without changing the runtime-facing repository contract.
  - Keep this slice focused on worker-backed execution and lifecycle cleanup, not migrations or recovery policy.

  On TinyBase
  It’s a reasonable choice if you keep it behind the repository boundary.

  What TinyBase gives you:

  - official local persistence options
  - same-browser synchronization primitives
  - MergeableStore if the backend later needs CRDT-style merge behavior

  But I would still not make CRDTs the default architecture for this slice.

  Your quoted Phase 6 scope is correct:

  - first persistence slice
  - worker-backed local storage
  - cross-tab notifications
  - no CRDT requirement unless concurrent multi-editor merge is explicitly needed

  That still holds even if TinyBase is the engine.

  My recommendation on TinyBase mode
  For this phase:

  - use TinyBase as infrastructure
  - keep client-side `Store` first
  - do not use CRDT semantics as the product model on the client yet
  - prefer:
      - repository owns document revisions
      - org config chooses persistent or memory-only client storage
      - cross-tab uses same-browser coordination of local state
      - backend merge semantics stay explicit later
  - use backend `MergeableStore` as the real merge strategy when concurrent multi-writer reconciliation becomes necessary

  Why:

  - multi-tab is not the same as collaborative merge
  - CRDT support is nice, but adopting it too early can distort your document and mutation model
  - the repo docs already lean toward revisioned local documents first

  Concrete planning recommendation
  I’d define Phase 6 like this:

  - Phase 6A: repository-backed local document service
  - Phase 6B: browser persistence backend
  - Phase 6C: cross-tab propagation
  - Phase 6D: resilience and migrations

  Decision points to settle before coding

  1. Is TinyBase only a storage/sync engine behind the repo, or does the app read it directly?
     Decision: TinyBase, if adopted, stays behind the repository boundary. The app/runtime does not read it directly.
  2. Do you want Store or MergeableStore first?
     Decision: start with TinyBase Store, not MergeableStore.
  3. Is cross-tab behavior “reload/refresh on change” or “live merged collaboration”?
     Decision: same-browser local propagation only. This phase does not introduce collaborative merge semantics.
  4. What is the persisted unit?
     Decision: persist full revisioned documents, not ad hoc UI state.
  5. What is the fallback if OPFS is unavailable?
     Decision: for the initial version, assume OPFS is supported by the underlying browser/runtime. Unsupported environments are out of scope for this phase.
  6. Where should merge semantics live?
     Decision: backend `MergeableStore` talking to Postgres, not the initial client runtime.
  7. Do we need a non-persistent client mode?
     Decision: yes. Support per-org client storage policy, including memory-only mode with backend durability.

  Bottom line

  - Yes, break it into multiple PRs.
  - TinyBase is fine.
  - Do not let “TinyBase has CRDT support” force CRDTs into the first persistence slice.
  - Multi-tab support is useful now.
  - Collaborative merge semantics are a later decision.

  If you want, I can turn this into:

  1. a concrete PR-by-PR Phase 6 plan, or
  2. a new GitHub issue stack for the persistence phase.

  Proposed Phase 7 sequence:

  - see the detailed `Phase 7` section below for the authoritative PR-by-PR rollout
  - in short: repository-backed flow, local subscriptions, persisted discovery, authoring polish, then hardening

  Proposed Phase 10 sequence:

  10. PR 1: Explicit sync contract
      Goal: define sync only after local repository usage is proven in a real flow.
      Scope:

  - define remote topology assumptions
  - define pull/push contract
  - define cursor, conflict, and retry semantics
  - keep sync separate from the local repository API
      Output:
  - sync contract
  - static examples
  - no sync implementation yet

  11. PR 2: First sync implementation
      Goal: prove one narrow sync flow after the contract exists.
      Scope:

  - implement sync for one document type first
  - keep it manual-triggered first
  - prefer revision conflict detection and explicit resolution before automatic merge
  - do not assume CRDTs unless collaborative concurrent editing becomes a firm requirement
      Output:
  - first end-to-end sync slice
  - conflict handling proven on one narrow path
      Concrete split:

  - add one executable sync adapter behind the new contract
  - keep scope to page documents only
  - add one repository-adjacent sync service for the docs workbench path
  - add one product-facing Sync now action to prove push, pull, and conflict handling
  - keep all refresh behavior flowing back through repository mutation/watch, not a second event system

  Proposed Phase 11 sequence:

  12. PR 1: Sync hardening
      Goal: make the first sync slice operationally safer without broadening scope.
      Scope:

  - persist or otherwise stabilize sync metadata handling
  - tighten cursor and base-revision handling
  - add repeat-run and conflict-recovery tests
  - keep scope to page sync
      Output:
  - hardened sync core
  - better-tested conflict and cursor behavior
      Concrete split:

  - persist sync cursor and per-page sync bookkeeping across workbench reinitialization
  - make invalid cursor and invalid request failures typed at the adapter boundary
  - document terminal-cursor behavior and resume semantics explicitly
  - add regression coverage for replay, repeated delete, and malformed cursor/limit cases
  - keep product UI changes minimal unless required by recovery behavior

  13. PR 2: Sync UX hardening
      Goal: make the product-facing sync path clearer and more durable.
      Scope:

  - improve sync status and conflict messaging
  - show last-sync state
  - tighten empty-state/page-switch interactions with sync
  - document the supported sync lifecycle and limits
      Output:
  - clearer sync UX
  - documented product-facing sync behavior
      Concrete split:

  - surface durable sync status in the workbench, not only transient banner text
  - distinguish retryable, auth, rate-limited, and fatal sync failures in the product-facing path
  - show conflict details that name the affected page and the required recovery action
  - show last-sync timestamp and whether more remote changes remain
  - ensure sync stays coherent through empty-state recovery, page switching, and repository reinitialization
  - add one short docs note for the supported sync UX and current limits

  Short version:

  - PR 1: grammar pressure
  - PR 2: app/page contracts
  - PR 3: JSON-defined components
  - PR 4: registry/discovery contract
  - PR 5: worker/repository boundary
  - PR 6: first local-first persistence slice
  - PR 7: repository-backed document flows
  - PR 8: local subscriptions and invalidation
  - PR 9: persisted discovery/editor workflows
  - PR 10: explicit sync contract
  - PR 11: first sync implementation
  - PR 12: sync hardening
  - PR 13: sync UX hardening

  The main rule for Phase 5 is: do not start with storage. Start by broadening grammar and consumption, then prove
  JSON-defined components, then define boundaries, then add persistence.

  Validation surface for PR 1:

  - docs route: /docs/declarative/grammar
  - core normalization tests
  - declarative runtime/renderer tests
Phase 7

  1. PR 1: Repository-backed document flow

  - pick one narrow surface, preferably the declarative JSX workbench in docs
  - load one page document through the worker-backed repository
  - save edits back through the repository
  - keep normalization/runtime rendering downstream of repository reads
  - no direct storage access from UI code

  2. PR 2: Local subscriptions and invalidation

  - add repository subscription/watch semantics above the current notification channel
  - refresh the active document/view when local mutations happen
  - connect same-tab and cross-tab invalidation into one consumer-facing refresh path

  3. PR 3: Persisted discovery and listing

  - drive one list/discovery surface from repository list-documents
  - show persisted summaries, not hardcoded example metadata
  - keep scope to one document kind first, likely page

  4. PR 4: Persisted authoring surface polish

  - revision-aware save/reload flow
  - conflict and stale-data messaging
  - explicit loading/error/empty states for the chosen surface
  - narrow hydration/lifecycle cleanup for that path

  5. PR 5: Hardening hooks

  - schema/version marker for persisted docs in the chosen flow
  - migration hook points
  - recovery behavior for corrupted or unreadable local data
  - worker startup/shutdown cleanup for the product-facing path
What stays out of Phase 7

  - backend sync
  - backend MergeableStore + Postgres
  - org policy UI for storage mode
  - multi-user merge/conflict resolution
  - broad app-wide repository adoption

  Why this order

  - PR 1 proves the repository is actually useful to a user-facing surface
  - PR 2 makes it reactive
  - PR 3 makes persisted content discoverable
  - PR 4 makes the chosen flow usable
  - PR 5 adds the operational hooks you need before expanding further

Phase 8

  PR 1
  core: add repository watch semantics above notifications

  Goal:
  define the consumer-facing subscription contract without yet broadening UI adoption.

  Scope:

  - add watch/subscribe semantics above the raw notification channel
  - support at least two shapes:
      - watch one document by documentKind + id
      - watch a list query, initially list-documents
  - keep raw document.changed|deleted|invalidated internal
  - normalize same-tab and external-tab events into one watch path
  - define delivery semantics:
      - initial emit behavior
      - unsubscribe behavior
      - invalidation vs full refresh
      - whether identical revisions should suppress re-emit

  Output:

  - repository watch API
  - tests for document watch and list watch
  - no docs UI migration yet

  Recommended API direction:

  type DeclarativeRepositoryWatch =
    | { type: 'document'; documentKind: DeclarativeRepositoryDocumentKind; id: string }
    | { type: 'list-documents'; documentKind?: DeclarativeRepositoryDocumentKind }

  type DeclarativeRepositorySubscriptionEvent<TResult> = {
    reason: 'initial' | 'changed' | 'deleted' | 'invalidated'
    source: DeclarativeRepositoryNotificationSource
    result: TResult
  }

  PR 2
  docs: move jsx authoring workbench onto repository watch flow

  Goal:
  prove the watch model on the existing page-editor surface.

  Scope:

  - replace ad hoc subscribe + subscribeToPages wiring in the workbench
  - drive active page refresh from document watch
  - drive persisted page summaries from list watch
  - keep dirty-edit gating behavior:
      - if local projection is dirty, mark stale instead of forcing overwrite
  - keep current conflict/reload UX
  - one consumer-facing refresh path for same-tab and cross-tab changes

  Output:

  - simpler workbench effects
  - one watch-driven document refresh path
  - one watch-driven list refresh path

  Success criteria:

  - local save updates list and active document coherently
  - external tab save marks stale or refreshes correctly
  - deleted document behavior still surfaces clearly

  PR 3
  core/docs: harden invalidation behavior and lifecycle

  Goal:
  finish the operational details so the watch contract is safe to expand.

  Scope:

  - dedupe/self-echo behavior for same revision
  - clarify broad invalidation behavior for list watchers
  - define deleted-document behavior for document watchers
  - verify teardown/unsubscribe correctness
  - add race coverage:
      - save while invalidation arrives
      - reload while list refresh is pending
      - initialize/destroy without leaked listeners
  - document contract decisions in the declarative-ui docs

  Output:

  - hardened tests
  - explicit watch semantics doc
  - confidence to expand beyond the workbench path

  Why 3 PRs
  One PR is too compressed: contract design, UI migration, and hardening will obscure each other in
  review. Four or more is unnecessary unless you want a generalized query cache layer.

  Non-goals
  Keep these out of this stack:

  - backend sync
  - a React Query-style cache system
  - app-wide repository adoption
  - automatic merge semantics
  - CRDT work

  Implementation note
  You already have the raw ingredients:

  - low-level notifications in /Users/umam3/projects/boardwalk/p-zero/autoform3/packages/core/src/
    worker-repository-boundary.ts
  - repo-specific wrappers in src/lib/declarative-jsx-authoring-repository.ts
  - UI stale/reload handling in src/components/declarative/JsxAuthoringWorkbench.tsx


Phase 9 should be 3 PRs.

  The naming in /Users/umam3/projects/boardwalk/p-zero/autoform3/docs/declarative-ui/phases.md:353
  is still terse, but from current state the next step is clearly “persisted discovery/editor
  workflows” beyond the single hardcoded workbench page.

  PR 1
  docs: add repository-backed page switching in the jsx workbench

  Goal:
  turn the current persisted page list into an actual editor workflow.

  Scope:

  - allow selecting a persisted page from pageSummaries
  - load the selected page through the repository wrapper, not from a static initial page
  - make route/search state or local selection state own the active page id
  - preserve dirty/stale/conflict protections when switching pages
  - require explicit confirmation if the user is leaving dirty local edits

  Output:

  - persisted page list becomes navigable
  - one workbench can open multiple saved pages
  - no create/delete yet

  PR 2
  docs: add create/duplicate/delete page workflows

  Goal:
  make persisted pages manageable, not just viewable/selectable.

  Scope:

  - create a new page document from a narrow starter/template
  - duplicate the current page into a new persisted page
  - delete a page with confirmation
  - keep page list/watch refresh coherent after mutations
  - define behavior when the active page is deleted:
      - fallback selection
      - empty state
      - clear user messaging

  Output:

  - end-to-end editor workflow for page lifecycle
  - persisted discovery is now actionable

  PR 3
  docs/core: harden multi-page editor workflow

  Goal:
  finish the operational behavior once multiple persisted pages can be opened and managed.

  Scope:

  - race coverage for switching while watch updates arrive
  - stale/dirty handling when active page changes externally
  - selection fallback after delete
  - empty/loading/error states for zero-page and missing-page cases
  - maybe small repository-wrapper cleanup if per-page watch setup is clumsy
  - document the multi-page editor workflow contract briefly

  Output:

  - stable persisted editor workflow
  - tested page-switch + mutation lifecycle

  Why 3 PRs
  One PR would mix navigation state, mutation workflows, and hardening into a messy review. Two PRs
  is possible, but page lifecycle mutations usually create enough edge cases that the hardening pass
  deserves its own cleanup PR.

  What I would keep out

  - backend sync
  - component-registry editing flows
  - broad app-wide repository adoption
  - generalized page templates
  - org/workspace permission/storage policy UI

  Branch names

  - feat/phase9-pr1-page-switching
  - feat/phase9-pr2-page-lifecycle
  - feat/phase9-pr3-editor-hardening


Phase 10
  - PR 1: Explicit sync contract
  - PR 2: First sync implementation

  So for “Phase 10”, I’d plan it as:

  1. feat/phase10-pr1-sync-contract

  - define the repository-adjacent sync interface
  - define pull/push envelopes
  - define cursor/revision/conflict semantics
  - define retry/error classes
  - keep it contract-only, no real transport yet

  2. feat/phase10-pr2-first-sync-implementation

  - implement one narrow sync path for page documents
  - manual trigger first, not background sync
  - revision conflict detection only
  - on successful pull/push, reuse existing repository invalidation/watch behavior
  - no CRDTs, no broad multi-doc sync framework



  Phase 11
  PR 3: Sync workflow cleanup

  Goal:
  finish the current manual sync slice so the docs workbench behavior is stable enough to stop
  revisiting edge cases.

  Scope:

  - add docs-side tests if practical around sync status and page switching
  - tighten status clearing rules across save, reload, page switch, and delete
  - make sync conflict recovery clearer when the active page is involved
  - document final limits of the manual-sync proof

  Output:

  - stable manual sync workflow
  - reduced state drift between sync/save/reload/page-switch flows
  - final doc note for the current proof surface

  Phase 12
  PR 1: Repository-adjacent sync service extraction

  Goal:
  move sync orchestration out of the docs-specific repository wrapper into a reusable core seam.

  Scope:

  - extract the sync session/state machine from apps/docs
  - keep page-only scope
  - preserve current cursor/revision bookkeeping behavior
  - expose a small sync-service interface above repository + adapter
  - leave the workbench as a consumer

  Output:

  - reusable sync service seam
  - less docs-specific sync logic
  - same behavior, better architecture

  PR 2: Sync service tests and fixtures

  Goal:
  make the extracted sync service directly testable without the workbench.

  Scope:

  - add service-level tests for push/pull/conflict/retry flows
  - cover persisted metadata restore paths
  - cover invalid-cursor recovery
  - keep fixture adapter as the backing test transport

  Output:

  - sync behavior tested below the UI
  - easier future transport swap

  Phase 13
  PR 1: Replace fixture adapter with real transport seam

  Goal:
  stop proving sync against an in-memory fixture and define the real network boundary.

  Scope:

  - add an HTTP-backed or RPC-backed sync adapter interface implementation
  - keep manual trigger only
  - preserve current page-only envelopes
  - map remote errors into the typed sync error model
  - no background sync yet

  Output:

  - real transport-backed sync adapter
  - typed remote error mapping
  - manual sync still product-facing

  PR 2: Auth/retry/rate-limit hardening

  Goal:
  make the real transport usable under normal failure modes.

  Scope:

  - auth failure messaging
  - retryable/transient handling
  - rate-limit handling with retry-after
  - transport timeout/reconnect behavior
  - docs-side messaging stays narrow and explicit

  Output:

  - operationally usable remote sync
  - clearer retry semantics

  Phase 14
  PR 1: Background sync policy and scheduling

  Goal:
  add optional automatic sync without changing the core contract.

  Scope:

  - define when background sync is allowed
  - visibility/focus/network heuristics
  - debounce/throttle policy
  - keep manual sync available
  - no collaborative merge work

  Output:

  - background sync scheduler
  - documented policy and limits

  PR 2: Background sync UX

  Goal:
  make automatic sync understandable in product UI.

  Scope:

  - background sync status
  - in-progress indicator
  - last successful sync
  - passive conflict surfacing
  - avoid noisy banners

  Output:

  - understandable auto-sync UX
  - reduced manual-only friction

  Phase 15
  PR 1: Multi-document sync expansion

  Goal:
  broaden beyond page once the transport and workflow are stable.

  Scope:

  - choose next document type
  - extend sync descriptors/envelopes carefully
  - keep page behavior unchanged
  - add migration notes if sync metadata shape changes

  Output:

  - sync beyond pages
  - staged contract expansion

  PR 2: Cross-surface adoption

  Goal:
  use the broader sync model in another real UI surface.

  Scope:

  - one additional consumer flow
  - reuse shared sync service
  - keep repository/watch refresh path intact
  - no app-wide rollout yet

  Output:

  - second product-facing proof
  - confidence that sync is not workbench-specific

  If you want, I can turn that into a phases.md-ready block with the same formatting style as the
  existing doc.