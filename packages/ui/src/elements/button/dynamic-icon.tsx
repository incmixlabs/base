'use client'

import {
  AlertTriangle,
  Bell,
  Bookmark,
  Bug,
  ChartColumnBig,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheckBig,
  CircleMinus,
  CircleSlash,
  CircleX,
  Copy,
  CopyCheck,
  Download,
  Ellipsis,
  EllipsisVertical,
  Eye,
  Feather,
  File,
  FileAudio,
  FileText,
  FileVideo,
  Flag,
  FlagTriangleRight,
  Folder,
  FolderOpen,
  FolderPlus,
  Image,
  IndentDecrease,
  IndentIncrease,
  Info,
  LayoutGrid,
  List,
  ListChecks,
  type LucideIcon,
  type LucideProps,
  Mail,
  Menu,
  Monitor,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pause,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Shapes,
  Smartphone,
  Sparkles,
  Square,
  SquarePen,
  Sun,
  Tablet,
  Trash2,
  TriangleAlert,
  Upload,
  Users,
  X,
} from 'lucide-react'
import * as React from 'react'

type LucideIconComponent = LucideIcon

const iconAliasMap: Record<string, string[]> = {
  'alert-triangle': ['AlertTriangle', 'TriangleAlert'],
  bell: ['Bell'],
  bookmark: ['Bookmark'],
  bug: ['Bug'],
  'chart-column-big': ['ChartColumnBig'],
  'check-circle': ['CircleCheckBig'],
  circle: ['Circle'],
  'chevron-down': ['ChevronDown'],
  'chevron-right': ['ChevronRight'],
  'chevron-up': ['ChevronUp'],
  'chevrons-up-down': ['ChevronsUpDown'],
  close: ['X'],
  copy: ['Copy'],
  'copy-check': ['CopyCheck'],
  'circle-alert': ['CircleAlert'],
  'circle-check-big': ['CircleCheckBig'],
  'circle-minus': ['CircleMinus'],
  'circle-x': ['CircleX'],
  'circle-slash': ['CircleSlash'],
  delete: ['Trash2'],
  download: ['Download'],
  edit: ['Pencil', 'SquarePen'],
  ellipsis: ['Ellipsis'],
  'ellipsis-vertical': ['EllipsisVertical'],
  eye: ['Eye'],
  feather: ['Feather'],
  file: ['File'],
  'file-audio': ['FileAudio'],
  'file-text': ['FileText'],
  'file-video': ['FileVideo'],
  flag: ['Flag'],
  'flag-triangle-right': ['FlagTriangleRight'],
  folder: ['Folder'],
  'folder-open': ['FolderOpen'],
  'folder-plus': ['FolderPlus'],
  image: ['Image'],
  'indent-decrease': ['IndentDecrease'],
  'indent-increase': ['IndentIncrease'],
  info: ['Info'],
  'layout-grid': ['LayoutGrid'],
  list: ['List'],
  checklist: ['ListChecks'],
  'list-checks': ['ListChecks'],
  mail: ['Mail'],
  menu: ['Menu'],
  monitor: ['Monitor'],
  moon: ['Moon'],
  palette: ['Palette'],
  'panel-left-close': ['PanelLeftClose'],
  'panel-left-open': ['PanelLeftOpen'],
  'panel-right-close': ['PanelRightClose'],
  'panel-right-open': ['PanelRightOpen'],
  pause: ['Pause'],
  phone: ['Phone'],
  plus: ['Plus'],
  'refresh-cw': ['RefreshCw'],
  rocket: ['Rocket'],
  search: ['Search'],
  settings: ['Settings'],
  shapes: ['Shapes'],
  smartphone: ['Smartphone'],
  sparkle: ['Sparkles'],
  square: ['Square'],
  sun: ['Sun'],
  tablet: ['Tablet'],
  trash: ['Trash2'],
  upload: ['Upload'],
  users: ['Users'],
  warning: ['TriangleAlert'],
}

const SafeListIcons: Record<string, LucideIconComponent> = {
  AlertTriangle,
  Bell,
  Bookmark,
  Bug,
  ChartColumnBig,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleCheckBig,
  CircleMinus,
  CircleX,
  CircleSlash,
  Copy,
  CopyCheck,
  Download,
  EllipsisVertical,
  Ellipsis,
  Eye,
  Feather,
  File,
  FileAudio,
  Flag,
  FlagTriangleRight,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
  FolderPlus,
  Image,
  IndentDecrease,
  IndentIncrease,
  Info,
  LayoutGrid,
  List,
  ListChecks,
  Mail,
  Menu,
  Monitor,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pause,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Shapes,
  Smartphone,
  Sparkles,
  Square,
  SquarePen,
  Sun,
  Tablet,
  Trash2,
  TriangleAlert,
  Upload,
  Users,
  X,
}

function toPascalCase(value: string): string {
  return value
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

export function resolveIconExport(name: string): LucideIconComponent | null {
  const normalized = name.trim()
  if (!normalized) return null

  const candidates = [
    ...(iconAliasMap[normalized.toLowerCase()] ?? []),
    toPascalCase(normalized),
    `${toPascalCase(normalized)}Icon`,
  ]

  for (const candidate of candidates) {
    const icon = SafeListIcons[candidate]
    if (icon) {
      return icon
    }
  }

  return null
}

export interface DynamicLucideIconProps extends Omit<LucideProps, 'ref'> {
  name: string
  endpoint?: string
}

const dynamicIconSvgCache = new Map<string, string | null>()
const allowedRemoteIconTags = new Set(['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'])
const allowedRemoteIconAttrs = new Set([
  'aria-hidden',
  'cx',
  'cy',
  'd',
  'data-lucide',
  'fill',
  'height',
  'points',
  'r',
  'rx',
  'ry',
  'stroke',
  'strokeLinecap',
  'strokeLinejoin',
  'strokeWidth',
  'viewBox',
  'width',
  'x',
  'x1',
  'x2',
  'y',
  'y1',
  'y2',
])

function toReactSvgAttrName(name: string) {
  if (name.startsWith('aria-') || name.startsWith('data-')) {
    return name
  }

  return name.replace(/-([a-z])/g, (_, segment: string) => segment.toUpperCase())
}

function getDynamicIconUrl(endpoint: string, name: string) {
  return `${endpoint.replace(/\/$/, '')}/${encodeURIComponent(name)}`
}

function getDynamicIconCacheKey(endpoint: string, name: string) {
  return `${endpoint}:${name}`
}

async function fetchDynamicIconSvg(
  endpoint: string,
  name: string,
): Promise<{ cacheable: boolean; svg: string | null }> {
  const response = await fetch(getDynamicIconUrl(endpoint, name), {
    headers: {
      accept: 'image/svg+xml',
    },
  })

  if (response.ok) {
    return {
      cacheable: true,
      svg: await response.text(),
    }
  }

  if (response.status === 404) {
    return {
      cacheable: true,
      svg: null,
    }
  }

  return {
    cacheable: false,
    svg: null,
  }
}

function getSvgElementAttrs(element: Element) {
  const attrs: Record<string, string> = {}
  for (const attr of Array.from(element.attributes)) {
    const name = toReactSvgAttrName(attr.name)
    if (allowedRemoteIconAttrs.has(name)) {
      attrs[name] = attr.value
    }
  }
  return attrs
}

function RemoteLucideIcon({
  className,
  source,
  svgProps,
}: {
  className?: string
  source: string
  svgProps: Omit<LucideProps, 'ref' | 'className'>
}) {
  const icon = React.useMemo(() => {
    if (typeof DOMParser === 'undefined') return null

    const document = new DOMParser().parseFromString(source, 'image/svg+xml')
    const svg = document.documentElement
    if (svg.tagName.toLowerCase() !== 'svg' || svg.querySelector('parsererror')) return null

    const children = Array.from(svg.children)
      .filter(child => allowedRemoteIconTags.has(child.tagName.toLowerCase()))
      .map((child, index) =>
        React.createElement(child.tagName.toLowerCase(), {
          ...getSvgElementAttrs(child),
          key: index,
        }),
      )

    return React.createElement(
      'svg',
      {
        ...getSvgElementAttrs(svg),
        ...svgProps,
        className,
        'aria-hidden': true,
        focusable: false,
      },
      children,
    )
  }, [className, source, svgProps])

  return icon
}

export function DynamicLucideIcon({
  name,
  endpoint = '/api/icons/lucide',
  className,
  ...props
}: DynamicLucideIconProps) {
  const IconComponent = resolveIconExport(name)
  const cacheKey = getDynamicIconCacheKey(endpoint, name)
  const [remoteSvgState, setRemoteSvgState] = React.useState<{ cacheKey: string; svg: string | null }>(() => ({
    cacheKey,
    svg: dynamicIconSvgCache.get(cacheKey) ?? null,
  }))

  React.useEffect(() => {
    if (IconComponent || !name.trim()) return

    const cached = dynamicIconSvgCache.get(cacheKey)
    if (cached !== undefined) {
      setRemoteSvgState({ cacheKey, svg: cached })
      return
    }

    setRemoteSvgState({ cacheKey, svg: null })
    let cancelled = false

    fetchDynamicIconSvg(endpoint, name)
      .then(({ cacheable, svg }) => {
        if (cacheable) {
          dynamicIconSvgCache.set(cacheKey, svg)
        }
        if (!cancelled) {
          setRemoteSvgState({ cacheKey, svg })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRemoteSvgState({ cacheKey, svg: null })
        }
      })

    return () => {
      cancelled = true
    }
  }, [IconComponent, cacheKey, endpoint, name])

  if (!IconComponent) {
    const remoteSvg = remoteSvgState.cacheKey === cacheKey ? remoteSvgState.svg : null
    if (!remoteSvg) return null

    return <RemoteLucideIcon source={remoteSvg} className={className} svgProps={props} />
  }

  return <IconComponent {...props} className={className} aria-hidden focusable={false} />
}
