# Introduction

Autoform UI exists because most UI frameworks force a tradeoff too early. They either give you polished components that are hard to steer, or they give you low-level primitives and leave too much of the system design unfinished. This project is an attempt to sit in the middle: opinionated enough to be useful, but still token-driven enough to be shaped into a real product system.

It is heavily informed by a few projects that each solve part of the problem well:

- `shadcn/ui` for practical, adoptable component patterns
- base-ui 
- Heavily inspired by `Radix UI Themes` for a token-first approach to visual consistency
- `AutoForm` for declarative form generation
- `json-render` for schema-driven composition of richer content
- `casl` for roles and permissions
- `orama` https://github.com/oramasearch/orama for search
- `tinybase` for localfirst persistence

The goal is not to reproduce any one of them. The goal is to combine the strongest parts into a framework that works for application interfaces: surfaces, forms, navigation, content blocks, and the design tokens that tie them together.

## Token-Based by Default

The system is built around tokens so visual decisions can be made at the right level. Instead of hardcoding styling choices into every component instance, the framework tries to expose the underlying variables that define color, spacing, radius, typography, density, and interaction feel.

That matters because customization should not mean rewriting components. The intent is to let teams adapt the system by shaping tokens first, and then make local adjustments only where they are actually needed.

## Styling Stack

The implementation uses `Vanilla Extract` and `Tailwind`, but for different jobs.

- `Vanilla Extract` is used for token definition, theme structure, and static style generation.
- `Tailwind` is used for ad hoc layout work and one-off utility classes where that is the simpler tool.

This split is deliberate. Tokens and shared component styling need structure. Local page composition often benefits from speed and directness. The framework uses both without pretending they solve the same problem.

## Built on Base UI

The component layer is built on the newer `Base UI` primitives. That gives the system an accessible, modern behavioral foundation while still leaving room to define its own visual language and API conventions.

The aim is not only to render components, but to make them dependable under real product conditions: keyboard interaction, focus management, overlays, states, and composition.

## Responsive by Container, Not Just Viewport

A major part of the design philosophy is that many components should respond to the space they are given, not only to the page viewport. That is why the framework uses container queries and applies them to components where proportional behavior actually matters.

This is especially relevant for components such as:

- `Card`
- `Container`
- form layouts and form-adjacent surfaces

The intent is to keep content feeling proportional when it appears in a narrow panel, a wide canvas, or an embedded layout. In other words, responsiveness should belong to the component as well as the page.

## Declarative Forms and Rich Content

Another core idea is composition through schema. The framework leans into a composed JSON-schema approach for building declarative forms and richer content structures.

That means the system is not only about individual buttons, badges, or cards. It also tries to support higher-level assembly:

- forms described through structured schema
- content rendered from declarative data
- reusable wrappers that connect design tokens, UI primitives, and domain structure

This is where the influence of `AutoForm` and `json-render` is most visible. The ambition is to make rich interfaces easier to declare, not just easier to style.

## Why Another UI Framework?

Because the gap is still real.

Teams need more than primitive libraries, but they also need more control than most ready-made component kits allow. Autoform UI is an attempt to provide a middle path: a token-based framework for application interfaces, grounded in modern primitives, responsive at the component level, and capable of supporting declarative forms and content.

That is the thesis. The docs should show how well the implementation actually lives up to it.
