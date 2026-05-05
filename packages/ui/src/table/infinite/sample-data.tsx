import type { FilterField } from '@/elements/filter/filter.props'
import type { CellBadgeMapping } from './CellBadge'
import type { InfiniteTableColumnDef } from './infinite-table.props'

// ─── Cell Badge Mappings ─────────────────────────────────────────────────────

export const statusColorMappings: CellBadgeMapping[] = [
  { value: 200, color: 'success' },
  { value: 201, color: 'success' },
  { value: 204, color: 'success' },
  { value: 400, color: 'error' },
  { value: 401, color: 'warning' },
  { value: 403, color: 'warning' },
  { value: 404, color: 'error' },
  { value: 500, color: 'error' },
  { value: 502, color: 'error' },
  { value: 503, color: 'error' },
]

export const levelColorMappings: CellBadgeMapping[] = [
  { value: 'error', label: 'Error', color: 'error' },
  { value: 'warn', label: 'Warn', color: 'warning' },
  { value: 'info', label: 'Info', color: 'info' },
  { value: 'debug', label: 'Debug', color: 'slate' },
]

// ─── Types ──────────────────────────────────────────────────────────────────

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
export type LogLevel = 'error' | 'warn' | 'info' | 'debug'
export type Region = 'us-east-1' | 'us-west-2' | 'eu-west-1' | 'eu-central-1' | 'ap-southeast-1' | 'ap-northeast-1'

export type RequestLog = {
  uuid: string
  method: RequestMethod
  host: string
  pathname: string
  level: LogLevel
  latency: number
  status: number
  regions: Region[]
  date: Date
}

// ─── Date Helpers ────────────────────────────────────────────────────────────

const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'

function fmtLocal(d: Date): string {
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function fmtUTC(d: Date): string {
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
}

function fmtRelative(d: Date): string {
  const diff = Date.now() - d.getTime()
  const abs = Math.abs(diff)
  const sfx = diff >= 0 ? 'ago' : 'from now'
  if (abs < 60_000) return `${Math.floor(abs / 1000)}s ${sfx}`
  if (abs < 3_600_000) return `${Math.floor(abs / 60_000)}m ${sfx}`
  if (abs < 86_400_000) return `${Math.floor(abs / 3_600_000)}h ${sfx}`
  return `${Math.floor(abs / 86_400_000)}d ${sfx}`
}

function DateHoverContent({ date }: { date: Date }) {
  return (
    <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {[
        ['Timestamp', String(date.getTime())],
        ['UTC', fmtUTC(date)],
        [tz, fmtLocal(date)],
        ['Relative', fmtRelative(date)],
      ].map(([label, value]) => (
        <div
          key={label}
          style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.8125rem' }}
        >
          <dt style={{ color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)', flexShrink: 0 }}>
            {label}
          </dt>
          <dd
            style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// ─── Columns ────────────────────────────────────────────────────────────────

export const requestLogColumns: InfiniteTableColumnDef<RequestLog>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    size: 200,
    meta: {
      hoverCard: (value: unknown) => <DateHoverContent date={value as Date} />,
    },
    cell: ({ getValue }) => {
      const d = getValue<Date>()
      return <span className="font-mono whitespace-nowrap">{fmtLocal(d)}</span>
    },
  },
  {
    accessorKey: 'method',
    header: 'Method',
    size: 90,
    filterFn: 'arrIncludesSome',
    cell: ({ getValue }) => {
      const method = getValue<RequestMethod>()
      return method
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 80,
    meta: {
      renderer: {
        type: 'label',
        values: statusColorMappings.map(item => ({
          value: String(item.value),
          color: item.color,
          label: item.label,
        })),
        variant: 'soft',
      },
      fullCell: true,
    },
  },
  {
    accessorKey: 'host',
    header: 'Host',
    size: 200,
  },
  {
    accessorKey: 'pathname',
    header: 'Path',
    size: 240,
  },
  {
    accessorKey: 'latency',
    header: 'Latency',
    size: 100,
    cell: ({ getValue }) => {
      const latency = getValue<number>()
      return `${latency}ms`
    },
  },
  {
    accessorKey: 'level',
    header: 'Level',
    size: 80,
    filterFn: 'arrIncludesSome',
    meta: {
      renderer: {
        type: 'label',
        values: levelColorMappings.map(item => ({
          value: String(item.value),
          color: item.color,
          label: item.label,
        })),
        variant: 'soft',
      },
      fullCell: true,
    },
  },
  {
    accessorKey: 'regions',
    header: 'Regions',
    size: 160,
    cell: ({ getValue }) => {
      const regions = getValue<Region[]>()
      return regions.join(', ')
    },
  },
]

// ─── Filter Fields ──────────────────────────────────────────────────────────

export const requestLogFilterFields: FilterField<RequestLog>[] = [
  {
    id: 'method',
    label: 'Method',
    type: 'checkbox',
    defaultOpen: true,
    options: (['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const).map(m => ({ label: m, value: m })),
  },
  {
    id: 'level',
    label: 'Level',
    type: 'checkbox',
    defaultOpen: true,
    options: (['error', 'warn', 'info', 'debug'] as const).map(l => ({
      label: l.charAt(0).toUpperCase() + l.slice(1),
      value: l,
    })),
  },
  {
    id: 'host',
    label: 'Host',
    type: 'input',
    defaultOpen: false,
  },
  {
    id: 'latency',
    label: 'Latency (ms)',
    type: 'slider',
    min: 0,
    max: 5000,
    step: 50,
    defaultOpen: false,
  },
]

// ─── Data Generator ─────────────────────────────────────────────────────────

const methods: RequestMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
const regions: Region[] = ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1']
const hosts = ['api.example.com', 'app.example.com', 'cdn.example.com', 'auth.example.com', 'ws.example.com']
const paths = [
  '/api/v1/users',
  '/api/v1/posts',
  '/api/v1/comments',
  '/api/v1/auth/login',
  '/api/v1/auth/refresh',
  '/api/v1/health',
  '/api/v1/metrics',
  '/api/v2/search',
  '/api/v2/upload',
  '/webhooks/stripe',
  '/webhooks/github',
  '/graphql',
]

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff
    return (state >>> 0) / 0xffffffff
  }
}

export function generateRequestLogs(count: number, seed = 42): RequestLog[] {
  const random = seededRandom(seed)
  const now = Date.now()

  return Array.from({ length: count }, (_, index) => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(random() * arr.length)]
    const regionCount = 1 + Math.floor(random() * 3)
    const rowRegions = Array.from(new Set(Array.from({ length: regionCount }, () => pick(regions))))

    const r = random()
    const level = r < 0.45 ? 'info' : r < 0.65 ? 'debug' : r < 0.85 ? 'warn' : 'error'
    const status = level === 'error' ? pick([400, 401, 403, 404, 500, 502, 503]) : pick([200, 200, 200, 201, 204])

    return {
      uuid: `${seed}-${index}-${Math.floor(random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')}`,
      method: pick(methods),
      host: pick(hosts),
      pathname: pick(paths),
      level,
      latency: Math.round(random() * 4500 + 10),
      status,
      regions: rowRegions,
      // Spread rows over ~3 weeks (one row every ~3600s + jitter)
      date: new Date(now - index * 3600000 - Math.floor(random() * 1800000)),
    }
  })
}
