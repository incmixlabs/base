# PLM (Product Lifecycle Management)

PLM extends beyond PIM — it manages a product from concept to retirement, not just its catalog data.

  Phases it covers

  1. Concept & Ideation
  - Idea capture, scoring, prioritization
  - Market research & competitive analysis
  - Feasibility studies, business cases

  2. Design & Development
  - BOM (Bill of Materials) — multi-level, engineering vs manufacturing BOMs
  - CAD/document management — versioned files, format conversion
  - Specifications & requirements tracking
  - Prototyping stages, design reviews

  3. Process & Manufacturing
  - Routing & work instructions
  - Supplier/vendor management — sourcing, RFQs, approved vendor lists
  - Quality planning — inspection criteria, test protocols
  - Cost rollups — material, labor, overhead

  4. Launch & Production
  - ECO/ECR (Engineering Change Orders/Requests) — formal change control
  - Release management — revision control, effectivity dates
  - Compliance & certifications — regulatory docs, safety standards
  - Manufacturing handoff packages

  5. Service & Support
  - Service BOMs, spare parts catalogs
  - Field issue tracking, CAPA (Corrective/Preventive Action)
  - Maintenance schedules

  6. End of Life
  - Phase-out planning, last-time-buy
  - Replacement/successor mapping
  - Archival

  Key differentiators from PIM

  ┌───────────────┬──────────────────────┬─────────────────────────────────────────────┐
  │               │         PIM          │                     PLM                     │
  ├───────────────┼──────────────────────┼─────────────────────────────────────────────┤
  │ Focus         │ Product content      │ Product engineering & lifecycle             │
  ├───────────────┼──────────────────────┼─────────────────────────────────────────────┤
  │ Users         │ Marketing, ecommerce │ Engineering, manufacturing, quality         │
  ├───────────────┼──────────────────────┼─────────────────────────────────────────────┤
  │ Core object   │ SKU + attributes     │ Part + BOM + change order                   │
  ├───────────────┼──────────────────────┼─────────────────────────────────────────────┤
  │ Versioning    │ Content revisions    │ Formal revision control with approval gates │
  ├───────────────┼──────────────────────┼─────────────────────────────────────────────┤
  │ Relationships │ Cross-sell/upsell    │ BOM hierarchy, where-used                   │
  ├───────────────┼──────────────────────┼─────────────────────────────────────────────┤
  │ Workflow      │ Publish approvals    │ ECO/ECR with multi-stage sign-off           │
  └───────────────┴──────────────────────┴─────────────────────────────────────────────┘

  Overlapping UI needs with PIM

  - Tree/hierarchy views (categories vs BOMs)
  - Versioned detail editors with approval workflows
  - Relationship management (drag-and-drop linking)
  - Search, filtering, bulk operations
  - Document/media management

Are you thinking of building one or both? There's significant UI component overlap — the autoform library could serve as the
form/input layer for either system.

## UI Component Map: PIM + PLM

### Shared Foundation (used by both)

  ┌─────────────────────────────────────────────────┐
  │  SHARED COMPONENTS                              │
  ├─────────────────────────────────────────────────┤
  │                                                 │
  │  DataGrid                                       │
  │  ├── Column config, resize, reorder             │
  │  ├── Inline editing                             │
  │  ├── Row selection + bulk actions bar           │
  │  ├── Filterable/sortable/groupable              │
  │  └── Virtual scrolling (large datasets)         │
  │                                                 │
  │  TreeView                                       │
  │  ├── Expandable/collapsible hierarchy           │
  │  ├── Drag-and-drop reorder/reparent             │
  │  ├── Multi-select                               │
  │  ├── Context menu (add child, delete, move)     │
  │  └── Search/filter within tree                  │
  │                                                 │
  │  DetailEditor                                   │
  │  ├── Tabbed attribute groups                    │
  │  ├── Dynamic form from schema (autoform!)       │
  │  ├── Inline validation + completeness bar       │
  │  ├── Dirty state tracking + save/discard        │
  │  └── Side-by-side locale editing                │
  │                                                 │
  │  RelationshipManager                            │
  │  ├── Link picker (search + select)              │
  │  ├── Linked items table                         │
  │  ├── Drag-and-drop ordering                     │
  │  └── Relationship type selector                 │
  │                                                 │
  │  MediaLibrary                                   │
  │  ├── Grid/list toggle                           │
  │  ├── Upload (drag-drop, browse)                 │
  │  ├── Preview (image, PDF, video)                │
  │  ├── Crop/transform                             │
  │  └── Tag + associate to entities                │
  │                                                 │
  │  VersionHistory                                 │
  │  ├── Timeline/list of revisions                 │
  │  ├── Diff viewer (field-by-field changes)       │
  │  ├── Restore/rollback action                    │
  │  └── Author + timestamp                         │
  │                                                 │
  │  WorkflowEngine                                 │
  │  ├── Status badge + transition buttons          │
  │  ├── Approval chain viewer                      │
  │  ├── Comment/note thread per transition         │
  │  └── Assignment (who's responsible)             │
  │                                                 │
  │  SearchBar                                      │
  │  ├── Full-text + faceted filters                │
  │  ├── Saved searches                             │
  │  ├── Recent items                               │
  │  └── Scope selector (products, parts, docs)     │
  │                                                 │
  │  ImportExport                                   │
  │  ├── File upload (CSV, Excel, XML)              │
  │  ├── Column mapping UI                          │
  │  ├── Validation preview (errors/warnings)       │
  │  ├── Progress tracker                           │
  │  └── Export template builder                    │
  │                                                 │
  │  Dashboard                                      │
  │  ├── KPI cards                                  │
  │  ├── Chart widgets                              │
  │  ├── Activity feed                              │
  │  └── Task/action items list                     │
  │                                                 │
  │  RBAC / Permissions                             │
  │  ├── Role editor                                │
  │  ├── Field-level permission matrix              │
  │  └── Team/user assignment                       │
  │                                                 │
  └─────────────────────────────────────────────────┘

  PIM-Specific

  ┌─────────────────────────────────────────────────┐
  │  PIM ONLY                                       │
  ├─────────────────────────────────────────────────┤
  │                                                 │
  │  CategoryManager (extends TreeView)             │
  │  ├── Attribute family assignment per node       │
  │  ├── Inheritance rules (parent → child)         │
  │  └── Product count badges                       │
  │                                                 │
  │  ChannelScopedEditor (extends DetailEditor)     │
  │  ├── Channel switcher tabs                      │
  │  ├── "Same as default" toggle per field         │
  │  ├── Completeness % per channel                 │
  │  └── Publish/unpublish per channel              │
  │                                                 │
  │  VariantMatrix                                  │
  │  ├── Axis config (color × size)                 │
  │  ├── Grid cell editing (price, stock, image)    │
  │  ├── Bulk generate variants                     │
  │  └── Enable/disable individual variants         │
  │                                                 │
  │  CompletenessScorecard                          │
  │  ├── Per-attribute fill status                  │
  │  ├── Per-channel readiness ring/bar             │
  │  ├── Missing fields list (clickable)            │
  │  └── Aggregate dashboard (% catalog ready)      │
  │                                                 │
  │  FeedBuilder                                    │
  │  ├── Channel template editor                    │
  │  ├── Attribute → feed field mapping             │
  │  ├── Transform rules (concat, truncate, etc.)   │
  │  └── Preview + validation                       │
  │                                                 │
  │  EnrichmentWorkbench                            │
  │  ├── Side-by-side: product + competitor data    │
  │  ├── AI suggestion panel                        │
  │  ├── SEO score + recommendations                │
  │  └── Rich text editor (MentionTextarea!)        │
  │                                                 │
  └─────────────────────────────────────────────────┘

  PLM-Specific

  ┌─────────────────────────────────────────────────┐
  │  PLM ONLY                                       │
  ├─────────────────────────────────────────────────┤
  │                                                 │
  │  BOMEditor (extends TreeView)                   │
  │  ├── Multi-level indented BOM table             │
  │  ├── Quantity / unit per line                   │
  │  ├── Where-used (reverse lookup)                │
  │  ├── BOM comparison (eng vs mfg)                │
  │  └── Cost rollup column                         │
  │                                                 │
  │  ChangeOrderWorkflow (extends WorkflowEngine)   │
  │  ├── ECR → ECO promotion                        │
  │  ├── Affected items list                        │
  │  ├── Red-line / markup viewer                   │
  │  ├── Multi-stage approval (sign-off matrix)     │
  │  └── Effectivity date picker                    │
  │                                                 │
  │  RevisionControl (extends VersionHistory)       │
  │  ├── Formal rev scheme (A, B, C → 1, 2, 3)     │
  │  ├── Release state machine (WIP→Review→Release) │
  │  ├── Supersede / obsolete actions               │
  │  └── Revision comparison (overlay diff)         │
  │                                                 │
  │  SupplierPortal                                 │
  │  ├── Vendor list + qualification status         │
  │  ├── RFQ builder                                │
  │  ├── Quote comparison table                     │
  │  └── Approved vendor list per part              │
  │                                                 │
  │  ComplianceTracker                              │
  │  ├── Regulation checklist per product           │
  │  ├── Certificate upload + expiry alerts         │
  │  ├── Substance/material declaration             │
  │  └── Audit trail (who certified what)           │
  │                                                 │
  │  GateReview                                     │
  │  ├── Phase/stage timeline (Gantt-lite)          │
  │  ├── Gate criteria checklist                    │
  │  ├── Go/No-Go voting                            │
  │  └── Deliverables tracker                       │
  │                                                 │
  └─────────────────────────────────────────────────┘

  Overlap Diagram

            PIM                    PLM
       ┌───────────┐          ┌───────────┐
       │           │          │           │
       │ Category  │          │ BOM       │
       │ Channel   │          │ ECO/ECR   │
       │ Variant   │          │ Revision  │
       │ Complete- │          │ Supplier  │
       │  ness     │          │ Compliance│
       │ Feed      │          │ Gate      │
       │ Enrich    │          │  Review   │
       │           │          │           │
       └─────┬─────┘          └─────┬─────┘
             │                      │
             └──────────┬───────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            │  DataGrid             │
            │  TreeView             │
            │  DetailEditor         │
            │  RelationshipManager  │
            │  MediaLibrary         │
            │  VersionHistory       │
            │  WorkflowEngine       │
            │  SearchBar            │
            │  ImportExport         │
            │  Dashboard            │
            │  RBAC                 │
            │                       │
            └───────────────────────┘
                 ~60% shared

  Where autoform fits

  The DetailEditor is the heart of both systems — dynamic forms driven by schema. That's exactly what autoform does. The schema-driven
  approach maps perfectly:

  - PIM: attribute families → JSON schema → autoform renders the product editor
  - PLM: part type definitions → JSON schema → autoform renders the part editor
  - Both: change/workflow forms, import mapping config, filter builders
