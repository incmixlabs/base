# PDM (Product Data Management)

PDM sits between PLM and PIM — it's the engineering data backbone.

  Scope spectrum:

    PDM              PLM                    PIM
    ◄──────────►◄─────────────────►◄──────────────►
    CAD files    Full lifecycle      Marketing content
    BOMs         Concept → EOL       Channel syndication
    Part data    Change mgmt         Enrichment
    Revisions    Manufacturing       Localization
                 Supplier/Quality

  PLM includes PDM. PIM is a parallel system that often consumes PDM/PLM data.

  PDM Core Scope

  What it manages:
  - CAD files + native/neutral formats (STEP, IGES, PDF drawings)
  - Part master records (part number, description, material, weight)
  - BOMs (engineering BOM, as-designed)
  - Revisions + release states
  - File vaulting (check-in/check-out, locking)

  What it does NOT do (PLM adds these):
  - Full lifecycle phases (concept, gate reviews)
  - Manufacturing process planning
  - Supplier management, RFQs
  - Quality/CAPA, compliance
  - Service/field support

  PDM-Specific UI Components

  ┌─────────────────────────────────────────────────┐
  │  PDM ONLY                                       │
  ├─────────────────────────────────────────────────┤
  │                                                 │
  │  FileVault                                      │
  │  ├── Check-in / check-out with lock icon        │
  │  ├── Version stack (v1, v2, v3...)              │
  │  ├── Format variants (native + derived)         │
  │  ├── Download / open-in-CAD action              │
  │  └── Thumbnail preview (3D viewer optional)     │
  │                                                 │
  │  PartMaster                                     │
  │  ├── Part number generator (scheme config)      │
  │  ├── Classification / part type selector        │
  │  ├── Unit of measure, material, weight          │
  │  └── Linked files list                          │
  │                                                 │
  │  BOMViewer (lighter than PLM's BOMEditor)       │
  │  ├── Indented list (read-heavy, edit-light)     │
  │  ├── Where-used reverse tree                    │
  │  ├── Quantity / find number                     │
  │  └── Flatten / roll-up toggle                   │
  │                                                 │
  │  DrawingViewer                                  │
  │  ├── 2D PDF/DXF inline viewer                  │
  │  ├── Markup / redline overlay                   │
  │  ├── Dimension callout inspection               │
  │  └── Compare revisions side-by-side             │
  │                                                 │
  │  RevisionManager                                │
  │  ├── State machine (WIP → In Review → Released) │
  │  ├── Check-out status indicator                 │
  │  ├── Promotion action (with sign-off)           │
  │  └── Supersede chain visualization              │
  │                                                 │
  └─────────────────────────────────────────────────┘

  Updated Overlap: PDM + PLM + PIM

      PIM              PDM                PLM
   ┌────────┐      ┌────────┐       ┌────────┐
   │Channel │      │FileVaul│       │ECO/ECR │
   │Variant │      │Drawing │       │Gate    │
   │Complete│      │  Viewer│       │ Review │
   │Feed    │      │PartMast│       │Supplier│
   │Enrich  │      │Check-in│       │Complian│
   │        │      │ /out   │       │Quality │
   └───┬────┘      └───┬────┘       └───┬────┘
       │               │                │
       │          ┌────┴────┐           │
       │          │PDM ∩ PLM│           │
       │          │         │           │
       │          │BOM      │───────────┘
       │          │Revision │
       │          │Control  │
       │          └────┬────┘
       │               │
       └───────┬───────┘
               │
     ┌─────────┴──────────┐
     │   ALL THREE SHARE  │
     │                    │
     │  DataGrid          │
     │  TreeView          │
     │  DetailEditor      │
     │  RelationshipMgr   │
     │  MediaLibrary      │
     │  VersionHistory    │
     │  WorkflowEngine    │
     │  SearchBar         │
     │  ImportExport      │
     │  Dashboard         │
     │  RBAC              │
     │                    │
     └────────────────────┘

  Decision matrix: what to build

  ┌───────────────────────────────────────────┬────────────────────────┐
  │              If you need...               │         Build          │
  ├───────────────────────────────────────────┼────────────────────────┤
  │ Manage product content for sales channels │ PIM                    │
  ├───────────────────────────────────────────┼────────────────────────┤
  │ Manage CAD files + part data + BOMs       │ PDM                    │
  ├───────────────────────────────────────────┼────────────────────────┤
  │ Full concept-to-retirement lifecycle      │ PLM (includes PDM)     │
  ├───────────────────────────────────────────┼────────────────────────┤
  │ Sell engineered products online           │ PLM/PDM + PIM (linked) │
  └───────────────────────────────────────────┴────────────────────────┘

  The common integration pattern

  PDM/PLM (source of truth)
      │
      │  part number, description, specs,
      │  BOM, images, documents
      │
      ▼
  PIM (enrichment layer)
      │
      │  + marketing copy, SEO, localization,
      │  + channel-specific pricing/content
      │
      ▼
  Channels (ecommerce, marketplace, print)

  Are you building all three as an integrated system, or starting with one? The shared component layer (~60%) means you'd build that
  foundation once and specialize from there.

## Recommended rollout

Start with PIM first, then layer on PDM/PLM.

### Why PIM first

  - Fastest to value — you can demo and use it quickly (product data in, content out)
  - Simplest data model — attributes + categories + media, no file vaulting or change control
  - Builds the shared foundation — DataGrid, TreeView, DetailEditor, SearchBar, ImportExport — these are the same ~60% shared components
   all three need
  - autoform is a natural fit — schema-driven attribute editing is PIM's core UX
  - Standalone useful — PIM works on its own; PDM/PLM without PIM is incomplete for commerce

  Layering strategy

  Phase 1: PIM
    └── Shared foundation (DataGrid, TreeView, DetailEditor, etc.)
    └── Product catalog, categories, attributes, media, channels

  Phase 2: +PDM
    └── Add FileVault, PartMaster, RevisionManager
    └── Link parts → products (PDM feeds PIM)
    └── Extend VersionHistory → formal revision control

  Phase 3: +PLM
    └── Add ECO/ECR, GateReview, SupplierPortal, Compliance
    └── Extend WorkflowEngine → multi-stage approval chains
    └── Full lifecycle phases

  Each phase extends the previous — no rewrites. The key architectural decision is designing the shared components in Phase 1 to be
  extensible enough for Phase 2/3 (e.g., TreeView that works for both categories and BOMs, VersionHistory that can later support formal
  revision schemes).
