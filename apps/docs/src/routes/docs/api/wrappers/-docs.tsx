import type { PropDef } from '@incmix/ui/editor/docs'
import {
  accordionSchemaWrapperPropDefs,
  calloutWrapperPropDefs,
  cardWrapperPropDefs,
  checkboxGroupWrapperPropDefs,
  commandWrapperPropDefs,
  dialogWrapperPropDefs,
  linkWrapperPropDefs,
  menuWrapperPropDefs,
  popoverWrapperPropDefs,
  radioGroupWrapperPropDefs,
  sidebarWrapperPropDefs,
  switchGroupWrapperPropDefs,
  tableWrapperPropDefs,
  tabsWrapperPropDefs,
  tooltipWrapperPropDefs,
} from '@incmix/ui/props'
import type { ReactNode } from 'react'

export type WrapperDoc = {
  title: string
  description: ReactNode
  overview: ReactNode[]
  basicUsageCode: string
  propDefs: PropDef[]
}

const treeViewWrapperPropDefs: PropDef[] = [
  { name: 'data', typeSimple: 'TreeDataItem[]', required: true },
  { name: 'size', typeSimple: '"sm" | "md" | "lg" | "xl" | "2x"', default: 'md' },
  { name: 'initialSelectedItemId', typeSimple: 'string' },
  { name: 'onSelectChange', typeSimple: '(item: TreeDataItem | undefined) => void' },
  { name: 'expandAll', typeSimple: 'boolean', default: false },
  { name: 'defaultNodeIcon', typeSimple: 'React.ComponentType<{ className?: string }>' },
  { name: 'defaultLeafIcon', typeSimple: 'React.ComponentType<{ className?: string }>' },
  { name: 'onItemDrag', typeSimple: '(source: TreeDataItem, target: TreeDataItem) => void' },
  { name: 'renderItem', typeSimple: '(params: TreeRenderItemParams) => ReactNode' },
]

export const wrapperDocsBySlug = {
  accordion: {
    title: 'Accordion',
    description: <>Schema-driven accordion wrapper with metadata blocks and action buttons per panel.</>,
    overview: [
      <>
        <code>AccordionSchemaWrapper</code> is a typed data wrapper over <code>Accordion</code> primitives. It supports
        item descriptions, metadata pairs, and item-level actions while keeping the primitive API available for custom
        cases.
      </>,
    ],
    basicUsageCode: `<AccordionSchemaWrapper
  schema={{
    title: "Workspace onboarding",
    items: [
      {
        value: "provisioning",
        title: "Provisioning status",
        description: "Tenant resources and queues",
        content: "Provisioning completed.",
        meta: [
          { id: "env", label: "Environment", value: "Production" },
          { id: "region", label: "Region", value: "us-west-2" },
        ],
        actions: [
          { id: "logs", label: "View logs", variant: "outline" },
          { id: "rerun", label: "Re-run", variant: "soft" },
        ],
      },
    ],
  }}
/>`,
    propDefs: accordionSchemaWrapperPropDefs,
  },
  callout: {
    title: 'Callout',
    description: (
      <>
        Data-driven wrapper over <code>Callout</code> primitives for title, message, and actions from typed input.
      </>
    ),
    overview: [
      <>
        <code>CalloutWrapper</code> is sugar over <code>Callout.Root/Icon/Text</code>. It keeps primitives as the escape
        hatch while supporting backend, CMS, and config-driven callout content.
      </>,
    ],
    basicUsageCode: `<CalloutWrapper
  data={{
    title: "Usage limit reached",
    message: "Archive inactive projects or upgrade to continue.",
    variant: "surface",
    color: "warning",
    actions: [
      { id: "upgrade", label: "Upgrade", variant: "solid", color: "warning" },
      { id: "archive", label: "Archive inactive", variant: "outline" },
    ],
  }}
/>`,
    propDefs: calloutWrapperPropDefs,
  },
  card: {
    title: 'CardWrapper',
    description: (
      <>
        Typed data-driven wrapper over <code>Card</code> primitives for common title, content, footer, and action
        layouts.
      </>
    ),
    overview: [
      <>
        <code>CardWrapper</code> is sugar over <code>Card.Root/Header/Title/Description/Content/Footer</code>. Use it
        for backend, CMS, or config-driven card content while keeping primitives for highly custom structures.
      </>,
    ],
    basicUsageCode: `<CardWrapper
  data={{
    title: "Team Plan",
    description: "Usage and billing summary",
    content: (
      <div className="space-y-2">
        <div>Projects: 18 / 25</div>
        <div>Seats: 12 / 15</div>
        <div>Storage: 132 GB / 250 GB</div>
      </div>
    ),
    footer: <Badge color="info">Renews in 9 days</Badge>,
    actions: [
      { id: "upgrade", label: "Upgrade", variant: "solid", color: "primary" },
      { id: "billing", label: "Billing", variant: "outline" },
    ],
  }}
/>`,
    propDefs: cardWrapperPropDefs,
  },
  'checkbox-group': {
    title: 'CheckboxGroupWrapper',
    description: <>Data-driven checkbox group rendered from a typed array of items.</>,
    overview: [
      <>Use it when the item list comes from config or schema-driven data and you still want a thin escape hatch.</>,
    ],
    basicUsageCode: `<CheckboxGroupWrapper
  defaultValue={['email']}
  data={[
    { value: 'email', label: 'Email', description: 'Weekly updates' },
    { value: 'push', label: 'Push' },
    { value: 'sms', label: 'SMS', disabled: true },
  ]}
/>`,
    propDefs: checkboxGroupWrapperPropDefs,
  },
  command: {
    title: 'Command',
    description: (
      <>
        Data-driven command palette wrapper over <code>CommandSearchProvider</code> and
        <code> CommandSearchInput</code>.
      </>
    ),
    overview: [
      <>
        <code>CommandWrapper</code> accepts structured sections and items, then converts them into command actions.
        Primitive command search APIs remain available when you need custom behavior.
      </>,
      <>
        The underlying command surface preserves keyboard navigation, active-item scrolling, filtering, and grouped
        results while standardizing the data model.
      </>,
    ],
    basicUsageCode: `<CommandWrapper
  triggerLabel="Search docs..."
  data={{
    sections: [
      {
        id: "navigation",
        label: "Navigation",
        items: [
          { id: "intro", label: "Introduction", description: "Open docs intro" },
          { id: "tokens", label: "Tokens", description: "Browse design tokens" },
        ],
      },
    ],
  }}
/>`,
    propDefs: commandWrapperPropDefs,
  },
  dialog: {
    title: 'Dialog',
    description: (
      <>
        Data-driven wrapper over <code>Dialog</code> primitives with schema-based form rendering.
      </>
    ),
    overview: [
      <>
        <code>DialogWrapper</code> accepts a JSON-schema-compatible object and renders a complete dialog form with
        title, description, fields, and footer actions. Primitive <code>Dialog.*</code> composition remains available
        for fully custom content.
      </>,
      <>
        Current data flow for this wrapper is direct: <code>schema -&gt; DialogWrapper</code>. The newer AutoForm path
        uses a normalized runtime model instead.
      </>,
    ],
    basicUsageCode: `<DialogWrapper
  trigger={<Button>Create account</Button>}
  schema={{
    type: "object",
    title: "Create account",
    description: "Provision a workspace user",
    required: ["fullName", "email", "plan"],
    properties: {
      fullName: { type: "string", title: "Full name", placeholder: "Alex Morgan" },
      email: { type: "string", format: "email", title: "Email" },
      plan: { type: "string", title: "Plan", enum: ["Starter", "Pro", "Enterprise"] },
      notes: { type: "string", title: "Notes", format: "textarea" },
      termsAccepted: { type: "boolean", title: "I agree to the terms" },
    },
  }}
  onSubmit={values => console.log(values)}
/>`,
    propDefs: dialogWrapperPropDefs,
  },
  link: {
    title: 'LinkWrapper',
    description: <>Typed data wrapper for rendering link lists from config, CMS, or API payloads.</>,
    overview: [
      <>
        Use <code>LinkWrapper</code> when the links are data-driven but you still want size, direction, color, and
        render override controls from one typed surface.
      </>,
    ],
    basicUsageCode: `<LinkWrapper
  direction="column"
  data={[
    { id: "tokens", label: "Tokens", href: "/docs/tokens", color: "primary" },
    { id: "theme", label: "Theme", href: "/docs/theming", color: "accent" },
    { id: "wrappers", label: "API Wrappers", href: "/docs/api/wrappers/menu", color: "info" },
  ]}
/>`,
    propDefs: linkWrapperPropDefs,
  },
  menu: {
    title: 'Menu',
    description: (
      <>
        Typed data-driven wrapper for <code>DropdownMenu</code> and <code>ContextMenu</code>.
      </>
    ),
    overview: [
      <>
        <code>MenuWrapper</code> renders a full menu tree from typed data groups. It supports action items, checkboxes,
        radio groups, labels, separators, and nested submenus.
      </>,
    ],
    basicUsageCode: `<MenuWrapper
  mode="dropdown"
  trigger={<Button variant="soft">Open actions</Button>}
  data={[
    {
      id: "file",
      label: "File",
      items: [
        { id: "new", label: "New file", shortcut: "⌘N" },
        { id: "open", label: "Open", shortcut: "⌘O" },
        { kind: "separator", id: "sep-1" },
        {
          kind: "submenu",
          id: "share",
          label: "Share",
          items: [{ id: "copy-link", label: "Copy link" }],
        },
      ],
    },
  ]}
/>`,
    propDefs: menuWrapperPropDefs,
  },
  popover: {
    title: 'Popover',
    description: (
      <>
        Data-driven wrapper over <code>Popover</code> primitives for structured sections, fields, and actions.
      </>
    ),
    overview: [
      <>
        <code>PopoverWrapper</code> renders typed content blocks from a <code>data</code> object. It keeps the primitive
        API available for custom layouts while making the common case fast and consistent.
      </>,
    ],
    basicUsageCode: `<PopoverWrapper
  trigger={<Button variant="surface">Open profile</Button>}
  data={{
    title: "Profile quick actions",
    description: "Structured content from typed data",
    sections: [
      {
        id: "identity",
        title: "Identity",
        fields: [
          { id: "name", label: "Name", value: "Alex Morgan" },
          { id: "email", label: "Email", value: "alex@autoform.dev" },
        ],
      },
    ],
  }}
/>`,
    propDefs: popoverWrapperPropDefs,
  },
  'radio-group': {
    title: 'RadioGroupWrapper',
    description: <>Data-driven radio group rendered from a typed item list.</>,
    overview: [
      <>Use it when selection choices are coming from data but you still want layout and render override support.</>,
    ],
    basicUsageCode: `<RadioGroupWrapper
  defaultValue="pro"
  data={[
    { value: 'starter', label: 'Starter' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ]}
/>`,
    propDefs: radioGroupWrapperPropDefs,
  },
  sidebar: {
    title: 'Sidebar',
    description: (
      <>
        Data-driven sidebar wrapper that renders <code>Sidebar.*</code> primitives from a typed data array.
      </>
    ),
    overview: [
      <>
        <code>SidebarWrapper</code> is a convenience layer on top of the composable <code>Sidebar.*</code> primitives.
        Instead of manually composing providers, groups, menus, and items, you pass a typed data array and let the
        wrapper render the tree.
      </>,
      <>The primitive API remains the primary escape hatch for highly custom or incremental cases.</>,
    ],
    basicUsageCode: `<SidebarWrapper
  variant="surface"
  collapsible="icon"
  data={[
    {
      group: "Workspace",
      anchor: "top",
      items: [
        { label: "Home", icon: Home, href: "/", isActive: true },
        { label: "Inbox", icon: Inbox, badge: 8, href: "/inbox" },
        { label: "Documents", icon: FileText, href: "/docs" },
      ],
    },
  ]}
/>`,
    propDefs: sidebarWrapperPropDefs,
  },
  'switch-group': {
    title: 'SwitchGroupWrapper',
    description: <>Data-driven switch group rendered from a typed item array for settings-style toggles.</>,
    overview: [
      <>Use it when you need schema- or config-sourced settings with consistent switch layout and item rendering.</>,
    ],
    basicUsageCode: `<SwitchGroupWrapper
  defaultValue={['email']}
  data={[
    { name: 'email', label: 'Email', description: 'Weekly digest' },
    { name: 'push', label: 'Push' },
    { name: 'sms', label: 'SMS alerts' },
  ]}
/>`,
    propDefs: switchGroupWrapperPropDefs,
  },
  table: {
    title: 'TableWrapper',
    description: (
      <>
        Typed data-driven wrapper for <code>Table</code> primitives built on TanStack Table for sorting and hierarchy.
      </>
    ),
    overview: [
      <>
        <code>TableWrapper</code> preserves the existing data payload and render override escape hatches while handling
        common table structure and interaction concerns for you.
      </>,
      <>
        Cell renderer contracts are shared with <code>InfiniteTableWrapper</code>, so label, avatar, checkbox, timeline,
        and sparkline renderers can move between basic and infinite table modes without redefining the cell model.
      </>,
      <>
        Editable-cell behavior is intended to converge on that same shared contract next, including consistent cell
        focus and tab navigation semantics.
      </>,
    ],
    basicUsageCode: `<TableWrapper
  size="sm"
  variant="surface"
  striped
  data={{
    caption: "Live accounts",
    columns: [
      { id: "name", header: "Customer", rowHeader: true, minWidth: "220px" },
      { id: "email", header: "Email", minWidth: "240px" },
      { id: "plan", header: "Plan" },
      {
        id: "status",
        header: "Status",
        renderer: {
          type: "label",
          values: [
            { value: "active", color: "success", label: "Active" },
            { value: "trial", color: "warning", label: "Trial" },
          ],
        },
      },
    ],
    rows: [
      {
        id: "alex",
        values: { name: "Alex Morgan", email: "alex@autoform.dev", plan: "Growth", status: "active" },
      },
      {
        id: "sam",
        values: { name: "Sam Lee", email: "sam@autoform.dev", plan: "Starter", status: "trial" },
      },
    ],
  }}
/>`,
    propDefs: tableWrapperPropDefs,
  },
  tabs: {
    title: 'Tabs',
    description: (
      <>
        Typed data-driven wrapper for <code>Tabs</code> primitives.
      </>
    ),
    overview: [
      <>
        <code>TabsWrapper</code> is sugar over <code>Tabs.Root/List/Trigger/Content</code>. It keeps the primitive API
        for custom layouts and adds a typed <code>data</code> model for backend- or CMS-driven tab sets.
      </>,
    ],
    basicUsageCode: `<TabsWrapper
  data={[
    { value: "overview", label: "Overview", content: "Overview panel", active: true },
    { value: "activity", label: "Activity", content: "Activity panel" },
    { value: "settings", label: "Settings", content: "Settings panel" },
  ]}
  variant="surface"
  color="primary"
/>`,
    propDefs: tabsWrapperPropDefs,
  },
  tooltip: {
    title: 'TooltipWrapper',
    description: (
      <>
        Data-driven wrapper over <code>Tooltip</code> with Surface variants, semantic color lanes, and typed content
        items.
      </>
    ),
    overview: [
      <>
        <code>TooltipWrapper</code> is sugar over <code>Tooltip.Root/Trigger/Content/Arrow</code>. It keeps the
        primitive API as the escape hatch while simplifying structured tooltip content from typed data.
      </>,
    ],
    basicUsageCode: `<TooltipWrapper
  trigger={<Button variant="outline">Hover for details</Button>}
  variant="surface"
  color="slate"
  data={{
    title: "Field details",
    description: "Structured content from data",
    items: [
      { id: "source", label: "Source", value: "CRM sync" },
      { id: "updated", label: "Updated", value: "2 minutes ago" },
    ],
    }}
/>`,
    propDefs: tooltipWrapperPropDefs,
  },
  'tree-view': {
    title: 'TreeViewWrapper',
    description: (
      <>
        Data-driven wrapper over <code>TreeView.Root</code> for hierarchical item lists with expand/collapse, selection,
        drag-and-drop, and custom icons.
      </>
    ),
    overview: [
      <>
        <code>TreeViewWrapper</code> accepts a nested <code>TreeDataItem[]</code> array and renders a full tree UI.
        Ensure every <code>id</code> is globally unique across the tree; duplicate IDs throw an error.
      </>,
    ],
    basicUsageCode: `<TreeViewWrapper
  data={[
    {
      id: "1",
      name: "Documents",
      children: [
        {
          id: "1-1",
          name: "Reports",
          children: [
            { id: "1-1-1", name: "Q1 Report.pdf" },
            { id: "1-1-2", name: "Q2 Report.pdf" },
          ],
        },
        { id: "1-2", name: "Invoices", children: [{ id: "1-2-1", name: "Invoice #001.pdf" }] },
      ],
    },
    {
      id: "2",
      name: "Images",
      children: [
        { id: "2-1", name: "photo.jpg" },
        { id: "2-2", name: "banner.png" },
      ],
    },
    { id: "3", name: "README.md" },
  ]}
  onSelectChange={(item) => console.log("Selected:", item?.name)}
/>`,
    propDefs: treeViewWrapperPropDefs,
  },
} satisfies Record<string, WrapperDoc>

export type WrapperDocSlug = keyof typeof wrapperDocsBySlug
