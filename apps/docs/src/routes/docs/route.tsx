import { Avatar } from '@bwalkt/ui/elements'
import { AppShell, CommandSearchProvider, type CommandSearchRouteGroup } from '@bwalkt/ui/layouts'
import { Section as SectionComponent } from '@bwalkt/ui/layouts/section/Section'
import { SidebarWrapperShell } from '@bwalkt/ui/layouts/sidebar/SidebarWrapperShell'
import type { SidebarWrapperData } from '@bwalkt/ui/layouts/sidebar/sidebar-wrapper.types'
import { ThemePanel } from '@bwalkt/ui/theme-panel'
import { Heading } from '@bwalkt/ui/typography/heading/Heading'
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { elementDocsNav } from '../../lib/element-docs-nav'
import { formDocsNav } from '../../lib/form-docs-nav'
import { layoutDocsNav } from '../../lib/layout-docs-nav'
import { typographyDocsNav } from '../../lib/typography-docs-nav'
import { docsMdxComponents } from '../../mdx-components'
import IntroductionContent from './content.mdx'

const mediaSlugs = new Set(['image'])

function toNavItems(entries: typeof elementDocsNav, base: string) {
  return entries.map(entry => ({ title: entry.title, href: `${base}/${entry.slug}` }))
}

const sections = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Views', href: '/docs/views/overview' },
      { title: 'Preview', href: '/docs/preview' },
      { title: 'Theming', href: '/docs/theming' },
      { title: 'Theme Color', href: '/docs/theme/color' },
      { title: 'Gradient Background', href: '/docs/theme/gradient' },
      { title: 'Token Grid', href: '/docs/token-grid' },
      { title: 'Vanilla Extract', href: '/docs/vanilla-extract' },
      { title: 'Container Queries', href: '/docs/container-queries' },
    ],
  },
  {
    title: 'Layouts',
    items: toNavItems(layoutDocsNav, '/docs/layouts'),
  },
  {
    title: 'Elements',
    items: toNavItems(
      elementDocsNav.filter(e => !mediaSlugs.has(e.slug)),
      '/docs/elements',
    ),
  },
  {
    title: 'Typography',
    items: toNavItems(typographyDocsNav, '/docs/typography'),
  },
  {
    title: 'Form',
    items: toNavItems(formDocsNav, '/docs/form'),
  },
  {
    title: 'Media',
    items: [
      ...toNavItems(
        elementDocsNav.filter(e => mediaSlugs.has(e.slug)),
        '/docs/elements',
      ),
      { title: 'Media Player', href: '/docs/media/media-player' },
      { title: 'Video', href: '/docs/media/video' },
    ],
  },
  {
    title: 'Charts',
    items: [{ title: 'Bar Chart', href: '/docs/charts#bar-chart' }],
  },
  {
    title: 'Composites',
    items: [{ title: 'SWOT Matrix', href: '/docs/composites#swot-comparison-matrix' }],
  },
  {
    title: 'Blocks',
    items: [
      { title: 'Table', href: '/docs/declarative/registry#table' },
      { title: 'Table Shell', href: '/docs/declarative/registry#table-shell' },
      { title: 'Todos Block', href: '/docs/declarative/registry#todos-block' },
    ],
  },
  {
    title: 'AutoForm',
    items: [
      { title: 'Overview', href: '/docs/autoform' },
      { title: 'Lifecycle Audit', href: '/docs/autoform/audit' },
      { title: 'E2E Fixtures', href: '/docs/autoform/e2e' },
      { title: 'Renderer', href: '/docs/autoform/renderer' },
      { title: 'Runtime', href: '/docs/autoform/runtime' },
      { title: 'Schema AST', href: '/docs/autoform/schema-ast' },
      { title: 'Schema Contract', href: '/docs/autoform/schema-contract' },
    ],
  },
  {
    title: 'Declarative',
    items: [
      { title: 'Grammar Pressure', href: '/docs/declarative/grammar' },
      { title: 'Registry Contract', href: '/docs/declarative/registry' },
    ],
  },
  {
    title: 'Wrappers',
    items: [
      { title: 'Accordion', href: '/docs/api/wrappers/accordion' },
      { title: 'Callout', href: '/docs/api/wrappers/callout' },
      { title: 'Card', href: '/docs/api/wrappers/card' },
      { title: 'Checkbox Group', href: '/docs/api/wrappers/checkbox-group' },
      { title: 'Command', href: '/docs/api/wrappers/command' },
      { title: 'Dialog', href: '/docs/api/wrappers/dialog' },
      { title: 'Link', href: '/docs/api/wrappers/link' },
      { title: 'Menu', href: '/docs/api/wrappers/menu' },
      { title: 'Popover', href: '/docs/api/wrappers/popover' },
      { title: 'Radio Group', href: '/docs/api/wrappers/radio-group' },
      { title: 'Sidebar', href: '/docs/api/wrappers/sidebar' },
      { title: 'Switch Group', href: '/docs/api/wrappers/switch-group' },
      { title: 'Table', href: '/docs/api/wrappers/table' },
      { title: 'Tabs', href: '/docs/api/wrappers/tabs' },
      { title: 'Tooltip', href: '/docs/api/wrappers/tooltip' },
      { title: 'Tree View', href: '/docs/api/wrappers/tree-view' },
    ],
  },
]

const sectionIcons = {
  Layouts: LayoutTemplate,
  Elements: ComponentIcon,
  Typography: TypeIcon,
  Form: FormInput,
  Media: ImageIcon,
  Charts: FileText,
  Composites: ComponentIcon,
  Blocks: ComponentIcon,
  AutoForm: FormInput,
  Wrappers: Code,
}

function SvgIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

function FileText({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
      <path d="M9 9h1" />
    </SvgIcon>
  )
}

function Code({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </SvgIcon>
  )
}

function ComponentIcon({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <path d="M15.536 11.293a1 1 0 0 0 0 1.414l3.757 3.757a2 2 0 1 1-2.828 2.829l-3.758-3.758a1 1 0 0 0-1.414 0l-3.758 3.758a2 2 0 1 1-2.828-2.829l3.757-3.757a1 1 0 0 0 0-1.414L4.707 7.536a2 2 0 1 1 2.828-2.829l3.758 3.758a1 1 0 0 0 1.414 0l3.758-3.758a2 2 0 1 1 2.828 2.829z" />
    </SvgIcon>
  )
}

function FormInput({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h4" />
      <path d="M7 16h6" />
    </SvgIcon>
  )
}

function LayoutTemplate({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="M9 10h12" />
    </SvgIcon>
  )
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </SvgIcon>
  )
}

function TypeIcon({ className }: { className?: string }) {
  return (
    <SvgIcon className={className}>
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </SvgIcon>
  )
}

export const Route = createFileRoute('/docs')({
  component: DocsLayout,
})

function DocsLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const currentHashHref = location.hash ? `${pathname}#${location.hash}` : pathname

  const sidebarData = React.useMemo<SidebarWrapperData>(
    () =>
      sections.map(section => ({
        group: section.title,
        icon: sectionIcons[section.title as keyof typeof sectionIcons] ?? FileText,
        collapsible: true,
        defaultOpen: true,
        items: section.items.map(item => ({
          label: item.title,
          href: item.href,
          tooltip: item.title,
          isActive: pathname === item.href || currentHashHref === item.href,
        })),
      })),
    [currentHashHref, pathname],
  )
  const searchRoutes = React.useMemo<CommandSearchRouteGroup[]>(
    () =>
      sections.map(section => ({
        label: section.title,
        pages: section.items.map(item => ({
          title: item.title,
          slug: item.href,
        })),
      })),
    [],
  )

  return (
    <CommandSearchProvider
      routes={searchRoutes}
      onSelectRoute={page => {
        void navigate({ to: page.slug })
      }}
    >
      <SidebarWrapperShell
        data={sidebarData}
        renderLink={item => <Link to={item.href ?? '/'} aria-label={item.label} />}
        searchRoutes={searchRoutes}
        searchTriggerLabel="Search docs..."
        hoverHighlight
        className="bg-background"
        headerStart={
          <div className="flex items-center gap-3">
            <Avatar name="Auto form" size="md" />
            <div>
              <Heading as="h3" size="md">
                Autoform UI
              </Heading>
              <span className="text-xs text-[color:var(--gray-11)]">Docs</span>
            </div>
          </div>
        }
        showThemeToggle
        headerEnd={<ThemePanel defaultPreset="sky" />}
      >
        <AppShell.Content padding="none" className="max-w-full overflow-x-hidden">
          <SectionComponent
            width="100%"
            px={{ initial: '1', xs: '1', sm: '2', md: '2' }}
            py="0"
            className="w-full max-w-[1200px]"
          >
            <main
              key={pathname}
              data-docs-content
              className="min-h-[70vh] w-full rounded-2xl border border-border/60 p-4 sm:p-6 lg:p-8"
            >
              {pathname === '/docs' ? <IntroductionContent components={docsMdxComponents} /> : <Outlet />}
            </main>
          </SectionComponent>
        </AppShell.Content>
      </SidebarWrapperShell>
    </CommandSearchProvider>
  )
}
