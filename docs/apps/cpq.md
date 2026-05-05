# CPQ (Configure, Price, Quote)

CPQ turns a product catalog into a guided selling workflow. It helps a user configure a valid solution, calculate price, generate a quote, and move that quote through approval and order handoff.

  Core scope:

    PIM / PLM / ERP          CPQ                    CRM / Commerce
    ◄────────────────►◄─────────────────►◄────────────────────────►
    product data       guided config       opportunity / cart
    options            pricing rules       quote document
    constraints        approvals           order handoff
    cost inputs        discounts           customer lifecycle

CPQ depends on product, option, pricing, and customer context, but its core value is the interactive decision flow between a seller and a buyer.

## Components Needed

### Shared Foundation

  These components should reuse the same platform primitives as PIM, PDM, and PLM:

  - HierarchicalEditableDataGrid — quote lines, bundles, option groups, rollups, price books, quote comparisons
  - TreeView — product families, configuration groups, bundle structure
  - DetailEditor — entity detail shell around AutoForm for quote/account/opportunity detail panels
  - AutoForm — schema-driven option forms, quote metadata, approval forms
  - RuleBuilder — shared condition/effect authoring for eligibility, dependency, validation, pricing, and approval rules
  - WorkflowEngine — submit, review, approve, revise, expire, convert
  - VersionHistory — quote revisions, pricing changes, approval audit
  - SearchBar — products, customers, price books, quote templates
  - ImportExport — price book import, option matrix import, quote export
  - DocumentPreview — generated proposal, order form, statement of work
  - RBAC / Permissions — discount limits, approval authority, field access

### CPQ-Specific Components

  ┌─────────────────────────────────────────────────┐
  │  CPQ ONLY                                       │
  ├─────────────────────────────────────────────────┤
  │                                                 │
  │  ProductConfigurator                            │
  │  ├── Guided steps / sections                    │
  │  ├── Option groups and dependent options        │
  │  ├── Required / incompatible option validation  │
  │  ├── Live configuration summary                 │
  │  └── Schema-driven option rendering             │
  │                                                 │
  │  ConfigurationRuleBuilder                       │
  │  ├── Requires / excludes rules                  │
  │  ├── Min/max quantity constraints               │
  │  ├── Conditional visibility                     │
  │  ├── Compatibility matrix editor                │
  │  └── Test panel for sample configurations       │
  │                                                 │
  │  PriceBuilder                                   │
  │  ├── Base price + option price rollup           │
  │  ├── Tiered pricing                             │
  │  ├── Region / currency / customer price books   │
  │  ├── Promotions and discount rules              │
  │  └── Margin and floor-price checks              │
  │                                                 │
  │  QuoteWorkbench                                 │
  │  ├── Customer and opportunity context           │
  │  ├── Configured line-item table                 │
  │  ├── Discount and margin controls               │
  │  ├── Tax, shipping, services, and terms         │
  │  └── Quote totals with warnings                 │
  │                                                 │
  │  ApprovalMatrix                                 │
  │  ├── Discount threshold routing                 │
  │  ├── Margin exception routing                   │
  │  ├── Legal / finance / manager approval lanes   │
  │  ├── Comments and decision history              │
  │  └── Re-approval rules after quote edits        │
  │                                                 │
  │  ProposalGenerator                              │
  │  ├── Template picker                            │
  │  ├── Dynamic sections from quote data           │
  │  ├── Terms and exclusions                       │
  │  ├── PDF / DOCX / HTML preview                  │
  │  └── Customer-facing share link                 │
  │                                                 │
  │  QuoteRevisionManager                           │
  │  ├── Revision compare                           │
  │  ├── Clone / revise / expire                    │
  │  ├── Lock approved quote snapshots              │
  │  └── Convert accepted quote to order            │
  │                                                 │
  └─────────────────────────────────────────────────┘

### Composite Components To Dogfood

  CPQ is a good forcing function for dynamic composite components because configuration pages are not static forms:

  - QuoteSummaryCard — totals, margin, status, and next action
  - ConfigStepPanel — schema-driven option section with validation state
  - PriceWaterfall — list price, option delta, discounts, taxes, total
  - ApprovalTimeline — requested, approved, rejected, revised events
  - LineItemConfigurator — table row that can expand into option editing
  - ProposalPreview — generated customer-facing quote document
  - RuleTester — sample input, rule output, and failure explanation

## RuleBuilder Architecture

RuleBuilder should not start as a giant visual programming canvas. It should start as a data-backed rule model, deterministic evaluator, focused authoring UI, and test/explain surface.

  Rule data model:

  - Rule metadata — id, name, description, scope, priority, active/draft state
  - Condition tree — all, any, not groups
  - Condition row — field path, operator, typed value
  - Effect — require option, exclude option, hide/show option, set default, adjust price, cap discount, require approval, block save
  - Version metadata — author, timestamp, revision, approval status

  Rule runtime:

  - Resolve field paths such as customer.region, quote.total, line.quantity, config.plan
  - Evaluate operators such as eq, neq, gt, gte, lt, lte, in, contains, exists
  - Evaluate nested all / any / not groups
  - Return effects, validation errors, warnings, and explanation traces
  - Avoid arbitrary user code in the core rule path

  Rule authoring UI:

  - Rule list and rule detail editor
  - Field picker backed by the active schema/context
  - Operator picker constrained by field type
  - Typed value editor rendered through AutoForm where possible
  - Effect editor with effect-specific fields
  - RuleTester panel with sample input, result, and explanation trace

  Domain wrappers:

  - ConfigurationRuleBuilder — require/exclude options, visibility, defaults, min/max quantity
  - PricingRuleBuilder — tiered price rules, promotions, price book selection, discount caps, floor-price warnings
  - ApprovalRuleBuilder — manager/finance/legal routing by discount, margin, amount, terms
  - ValidationRuleBuilder — block save, require fields, warn on risky combinations

  External reference:

  - [GoRules Zen](https://github.com/gorules/zen) is a useful reference point for a JSON-backed business rules engine. Its model is based on JSON Decision Model graphs, supports decision tables and expression-style rule evaluation, and has bindings across several runtimes. It is not necessarily the implementation choice, but it is a good benchmark for rule portability, testability, and explainability.

## Development Roadmap

### Phase 1: Quote Authoring MVP

  Goal: create and save a quote with manually selected products and editable metadata.

  - Quote shell — quote number, customer, owner, status, effective date
  - Line-item grid — product, quantity, unit price, discount, total
  - Quote totals — subtotal, discount total, tax placeholder, grand total
  - AutoForm-backed metadata editor
  - Local-first persistence and revision-safe save flow
  - Basic quote states: Draft, Submitted, Approved, Accepted, Expired

  This phase should prove the editor workflow: dirty state, save/cancel, revision tracking, and generated summary views.

### Phase 2: Guided Configuration

  Goal: configure products from schema-driven option definitions instead of manually editing every line.

  - Product family tree
  - Option group schemas rendered through AutoForm
  - Required option validation
  - Dependent visibility rules
  - Configuration summary component
  - Invalid configuration messages with actionable fixes
  - Sample-data-driven preview for configured products

  The important dogfood target: configuration behavior should come from declarative schema/rules, not hard-coded JSX.

### Phase 3: Pricing Engine

  Goal: calculate price from base products, options, customer context, and discount rules.

  - Price book model
  - Option price rollups
  - Tiered quantity pricing
  - Currency and region fields
  - Discount limits by role
  - Margin floor warnings
  - Price waterfall component
  - Pricing rule test harness

  This should stay explainable. Every computed price should be traceable to input data and rule output.

### Phase 4: Approval Workflow

  Goal: route quote exceptions through a finite-state workflow.

  - Approval thresholds by discount, margin, amount, and terms
  - Approval matrix editor
  - Submit / approve / reject / request changes transitions
  - Comments attached to transitions
  - Re-approval when sensitive fields change
  - Audit trail and version diff

  This is where xstate should become the visible behavior contract: quote state, allowed transitions, guards, and side effects.

### Phase 5: Proposal Generation

  Goal: turn an approved quote into a customer-facing document.

  - Proposal template model
  - Dynamic sections bound to quote data
  - Terms, exclusions, and legal blocks
  - PDF / HTML preview
  - Share link or export
  - Accepted quote snapshot

  Templates should be composite components with data bindings, not one-off document code.

### Phase 6: Integration Readiness

  Goal: make CPQ useful with surrounding systems.

  - Customer and opportunity import from CRM
  - Product and option data from PIM / PLM
  - Price book import from ERP
  - Accepted quote handoff to order system
  - Webhook/event model for quote lifecycle changes
  - Permission model for sales, finance, legal, and admin roles

## Data Model Sketch

  - ProductFamily — grouping for configurable products
  - ConfigurableProduct — base SKU plus option groups
  - OptionGroup — named schema section for choices
  - Option — selectable value with price and compatibility metadata
  - ConfigurationRule — requires, excludes, visibility, quantity, validation
  - PriceBook — customer/region/currency scoped pricing source
  - Quote — header, customer, status, totals, revision
  - QuoteLine — product/configuration, quantity, price, discount
  - ApprovalRequest — reason, approver, status, decision comments
  - ProposalTemplate — document layout and dynamic sections

## First Build Recommendation

Start with the QuoteWorkbench and a single simple ProductConfigurator.

  1. Build quote save/edit/revision flow with manual line items.
  2. Add one configurable product with three option groups.
  3. Add validation rules before pricing complexity.
  4. Add price waterfall after configuration is stable.
  5. Add approvals only after quote state transitions are clean.

This keeps CPQ aligned with the broader product direction: dynamic forms, declarative behavior, xstate-driven workflow, and composite components that can be reused in real app pages.
