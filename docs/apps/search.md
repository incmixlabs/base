For PIM/PLM/PDM context, here's how I'd think about it:

  Postgres Full-Text Search

  Strengths:
  - Zero infrastructure overhead — one database, always consistent
  - tsvector/tsquery + GIN indexes handle structured search well
  - pg_trgm extension adds fuzzy/similarity matching
  - Combines naturally with SQL joins (category filters, BOM lookups, revision status)
  - ACID — search results are never stale

  Weaknesses:
  - No built-in typo tolerance (pg_trgm helps but is limited)
  - Faceted filtering requires manual aggregation queries — gets slow at scale
  - Basic relevance ranking compared to dedicated engines
  - No search-as-you-type out of the box

  Meilisearch (via meilibridge)

  Strengths:
  - Instant search (~50ms), typo tolerance, faceted filtering are first-class
  - Excellent for PIM product catalog UX (search by name, SKU, attributes)
  - Lightweight compared to Elasticsearch
  - meilibridge auto-syncs Postgres changes

  Weaknesses:
  - Extra service to deploy and monitor
  - Eventual consistency (sync lag)
  - meilibridge is a small project — evaluate maturity and bus factor
  - Data duplication

  Recommendation

  Start with Postgres full-text search + pg_trgm. Reasons:

  1. PIM Phase 1 is about building the component layer and data model — Postgres search is sufficient and keeps architecture simple
  2. Always-consistent search avoids a whole class of sync bugs
  3. For structured queries (part number lookup, revision filtering, BOM traversal), Postgres is actually better since it's just SQL
  4. PIM catalog size in early phases won't stress Postgres search

  Layer Meilisearch later when you hit one of these triggers:
  - Product catalog exceeds ~50-100K items and faceted queries slow down
  - Users need search-as-you-type with typo tolerance
  - You're building a customer-facing product search (not just internal admin)

  When that time comes, evaluate meilibridge's maturity vs a simple CDC/trigger-based sync. The schema you build in Phase 1 won't need
  to change — you'd just add a read-through search layer on top.
