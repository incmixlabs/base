
⏺ Design & Engineering
  - Generative design — AI explores thousands of part geometries given constraints (weight, material, load)
  - Topology optimization — minimize material while meeting structural requirements
  - Auto-generate BOMs from 3D models / drawings
  - Detect interference/clash between assemblies

  Change Management
  - Predict ECO impact — which downstream parts, assemblies, suppliers are affected
  - Risk scoring on change orders (cost, schedule, quality impact)
  - Auto-route approvals based on change scope and affected domains
  - Anomaly detection — flag unusual change patterns (too many ECOs on one part)

  Quality & Compliance
  - Predict failure modes from design parameters + historical CAPA data
  - Auto-check regulatory compliance (RoHS, REACH, UL) against part materials
  - Inspection anomaly detection from sensor/test data
  - Root cause analysis from defect patterns

  Supplier & Sourcing
  - Predict lead times and supply disruptions from market signals
  - Auto-match alternative parts/suppliers when a component goes EOL
  - Optimize BOM cost by suggesting equivalent parts at lower cost
  - Supplier risk scoring from financial/delivery history

  Manufacturing
  - Process parameter optimization (CNC speeds, injection mold temps)
  - Predictive maintenance from machine sensor data
  - Auto-generate work instructions from 3D models + routing
  - Yield prediction based on material lot + process variables

  Knowledge & Reuse
  - Semantic search across past designs — "find parts similar to this bracket"
  - Suggest existing parts before engineers design new ones (reduce part proliferation)
  - Extract specs/requirements from unstructured docs (PDFs, emails, contracts)
  - Lessons-learned retrieval from historical project data

  Where it fits in your stack:

  ┌────────────────────────┬───────────────────────────────────────────────┐
  │     AI Capability      │              UI Component Needed              │
  ├────────────────────────┼───────────────────────────────────────────────┤
  │ Impact prediction      │ Graph/relationship viewer in ECO workflow     │
  ├────────────────────────┼───────────────────────────────────────────────┤
  │ Part similarity search │ Semantic search bar + results grid            │
  ├────────────────────────┼───────────────────────────────────────────────┤
  │ BOM optimization       │ BOM tree with cost rollup + suggestion badges │
  ├────────────────────────┼───────────────────────────────────────────────┤
  │ Compliance checking    │ Checklist with auto-pass/fail indicators      │
  ├────────────────────────┼───────────────────────────────────────────────┤
  │ Design reuse           │ Side-by-side comparison panels                │
  ├────────────────────────┼───────────────────────────────────────────────┤
  │ Failure prediction     │ Risk heatmap / scoring dashboard              │
  └────────────────────────┴───────────────────────────────────────────────┘

  Highest-ROI starting point: part reuse search + ECO impact prediction. Part proliferation is the #1 cost driver in engineering orgs
  (companies often redesign parts that already exist). ECO impact prediction reduces change order cycle time from weeks to days.

