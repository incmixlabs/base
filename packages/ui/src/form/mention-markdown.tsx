'use client'

import * as React from 'react'
import { Avatar, type AvatarHoverCardData } from '@/elements/avatar/Avatar'
import type { Color } from '@/theme/tokens'

type InlineNode = string | React.ReactElement

export interface StructuredMentionTokenMatch {
  start: number
  end: number
  trigger: string
  label: string
  reference: string
  serializedText: string
  displayText: string
}

export interface MentionReferenceSource {
  reference: string
  label: string
  description?: string
  avatar?: string
  hoverCard?: boolean | AvatarHoverCardData
  color?: Color
}

export interface ParsedMentionReference {
  kind: string
  id: string
}

function isMentionInlineNode(node: InlineNode | undefined): boolean {
  return React.isValidElement<{ 'data-mention-token'?: boolean }>(node) && node.props['data-mention-token'] === true
}

function getLastInlineNode(nodes: InlineNode[]): InlineNode | undefined {
  return nodes.length > 0 ? nodes[nodes.length - 1] : undefined
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function escapeMentionLabel(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\]/g, '\\]')
}

export function escapeMentionReference(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\)/g, '\\)')
}

export function unescapeMentionToken(value: string): string {
  return value.replace(/\\([\\\])])/g, '$1')
}

export function serializeMentionToken(trigger: string, label: string, reference: string): string {
  return `${trigger}[${escapeMentionLabel(label)}](${escapeMentionReference(reference)})`
}

export function getStructuredMentionTokens(
  text: string,
  triggerChars: string[] = ['@'],
): StructuredMentionTokenMatch[] {
  const escaped = triggerChars.map(escapeRegExp)
  if (escaped.length === 0) return []

  const pattern = new RegExp(`((?:${escaped.join('|')})\\[((?:\\\\.|[^\\]])+)\\]\\(((?:\\\\.|[^\\)])+)\\))`, 'g')
  const matches: StructuredMentionTokenMatch[] = []
  let match = pattern.exec(text)

  while (match !== null) {
    const serializedText = match[1]
    if (serializedText === undefined) {
      match = pattern.exec(text)
      continue
    }
    const trigger = serializedText[0] ?? ''
    const label = match[2] ? unescapeMentionToken(match[2]) : serializedText
    const reference = match[3] ? unescapeMentionToken(match[3]) : ''
    matches.push({
      start: match.index,
      end: match.index + serializedText.length,
      trigger,
      label,
      reference,
      serializedText,
      displayText: `${trigger}${label}`,
    })
    match = pattern.exec(text)
  }

  return matches
}

export function collectMentionReferences(markdown: string): { userIds: string[]; tagIds: string[] } {
  const userIds: string[] = []
  const tagIds: string[] = []
  const seenUsers = new Set<string>()
  const seenTags = new Set<string>()

  for (const token of getStructuredMentionTokens(markdown, ['@', '#'])) {
    const separatorIndex = token.reference.indexOf(':')
    if (separatorIndex <= 0) continue

    const kind = token.reference.slice(0, separatorIndex)
    const id = token.reference.slice(separatorIndex + 1)
    if (!id) continue

    if (kind === 'user') {
      if (!seenUsers.has(id)) {
        seenUsers.add(id)
        userIds.push(id)
      }
      continue
    }

    if (kind === 'tag') {
      if (!seenTags.has(id)) {
        seenTags.add(id)
        tagIds.push(id)
      }
    }
  }

  return { userIds, tagIds }
}

export function parseMentionReference(reference: string): ParsedMentionReference | null {
  const separatorIndex = reference.indexOf(':')
  if (separatorIndex <= 0) return null

  const kind = reference.slice(0, separatorIndex)
  const id = reference.slice(separatorIndex + 1)
  if (!id) return null

  return { kind, id }
}

function createReferenceSourceMap(sources: MentionReferenceSource[] | undefined): Map<string, MentionReferenceSource> {
  return new Map((sources ?? []).map(source => [source.reference, source]))
}

function sanitizeHref(raw: string): string | null {
  const trimmed = raw.trim()
  if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(trimmed)) {
    return trimmed
  }

  try {
    const url = new URL(trimmed, 'https://example.local')
    return ['http:', 'https:', 'mailto:', 'blob:'].includes(url.protocol) ? trimmed : null
  } catch {
    return null
  }
}

function parseImageDimension(raw: string | undefined): number | undefined {
  if (!raw) return undefined
  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) && value > 0 ? value : undefined
}

function parseHtmlImageTag(tag: string): { src: string; alt: string; width?: number; height?: number } | null {
  const attrs = new Map<string, string>()
  const attrPattern = /(\w+)\s*=\s*("([^"]*)"|'([^']*)')/g
  let match = attrPattern.exec(tag)

  while (match !== null) {
    const name = match[1]?.toLowerCase()
    const value = match[3] ?? match[4] ?? ''
    if (name) attrs.set(name, value)
    match = attrPattern.exec(tag)
  }

  const src = attrs.get('src')
  if (!src) return null

  return {
    src,
    alt: attrs.get('alt') ?? '',
    width: parseImageDimension(attrs.get('width')),
    height: parseImageDimension(attrs.get('height')),
  }
}

function renderPreviewImage(
  key: string,
  src: string,
  alt: string,
  options?: { width?: number; height?: number },
): React.ReactElement {
  const image = (
    <img
      src={src}
      alt={alt}
      width={options?.width}
      height={options?.height}
      className="rounded cursor-zoom-in"
      style={{ maxWidth: '100%', height: 'auto', maxHeight: 400 }}
    />
  )

  return (
    <a key={key} href={src} target="_blank" rel="noreferrer" className="inline-block align-top">
      {image}
    </a>
  )
}

function buildInlinePattern(triggerChars: string[]): RegExp {
  // Capture groups:
  // 1: inline code (`...`)
  // 2: HTML image tag <img ...>
  // 3: image ![alt](src), 4: alt text, 5: src
  // 6: markdown link [text](href), 7: link text, 8: href
  // 9: bold+italic (***...***), 10: bold (**...**), 11: italic (*...*)
  // 12: strikethrough (~~...~~)
  // 13: mention token @[label](ref), 14: label, 15: reference
  // 16: fallback mention (`@word`, `#word`, etc.)
  const escaped = triggerChars.map(escapeRegExp)
  const mentionTokenPart =
    escaped.length > 0
      ? `|((?:${escaped.join('|')})\\[((?:\\\\.|[^\\]])+)\\]\\(((?:\\\\.|[^\\)])+)\\))|((?:${escaped.join('|')})[^\\s]+)`
      : ''
  return new RegExp(
    `(\`[^\`]+\`)|(<img\\b[^>]*\\/?>)|(!\\[([^\\]]*)\\]\\(([^)]+)\\))|(\\[([^\\]]+)\\]\\(([^)]+)\\))|(\\*{3}.+?\\*{3})|(\\*{2}.+?\\*{2})|(\\*.+?\\*)|(~~.+?~~)${mentionTokenPart}`,
    'g',
  )
}

function renderResolvedMentionToken(
  key: string,
  token: { trigger: string; label: string; reference: string },
  sourceMap: Map<string, MentionReferenceSource>,
): React.ReactElement {
  const source = sourceMap.get(token.reference)
  const parsedReference = parseMentionReference(token.reference)
  const label = source?.label ?? token.label
  const displayText = `${token.trigger}${label}`

  if (parsedReference?.kind === 'user') {
    return (
      <span
        key={key}
        className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-1.5 py-0.5 align-baseline text-primary font-medium"
        data-mention-token
      >
        <Avatar
          id={parsedReference.id}
          src={source?.avatar}
          name={label}
          description={source?.description}
          size="xs"
          hoverCard={source?.hoverCard ?? Boolean(source?.description)}
        />
        <span>{displayText}</span>
      </span>
    )
  }

  if (parsedReference?.kind === 'tag') {
    return (
      <span
        key={key}
        className="inline-flex items-center rounded-full bg-secondary/70 px-2 py-0.5 align-baseline text-secondary-foreground font-medium"
        data-mention-token
      >
        {displayText}
      </span>
    )
  }

  return (
    <span key={key} className="text-primary font-medium" data-mention-token>
      {displayText}
    </span>
  )
}

export function parseMentionMarkdownInline(
  text: string,
  triggerChars: string[] = ['@'],
  sources?: MentionReferenceSource[],
): InlineNode[] {
  const nodes: InlineNode[] = []
  const pattern = buildInlinePattern(triggerChars)
  const sourceMap = createReferenceSourceMap(sources)
  let lastIndex = 0
  let match = pattern.exec(text)

  while (match !== null) {
    const interstitial = match.index > lastIndex ? text.slice(lastIndex, match.index) : ''
    const m = match[0]
    const key = `i${match.index}`
    if (match[1]) {
      if (interstitial) nodes.push(interstitial)
      nodes.push(
        <code key={key} className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
          {m.slice(1, -1)}
        </code>,
      )
    } else if (match[2]) {
      if (interstitial) nodes.push(interstitial)
      const parsed = parseHtmlImageTag(m)
      const safeSrc = parsed ? sanitizeHref(parsed.src) : null
      nodes.push(
        safeSrc ? (
          renderPreviewImage(key, safeSrc, parsed?.alt ?? '', {
            width: parsed?.width,
            height: parsed?.height,
          })
        ) : (
          <span key={key} className="text-muted-foreground">
            [image]
          </span>
        ),
      )
    } else if (match[3]) {
      // Image: ![alt](src)
      if (interstitial) nodes.push(interstitial)
      const safeSrc = match[5] ? sanitizeHref(match[5]) : null
      const alt = match[4] ?? ''
      nodes.push(
        safeSrc ? (
          renderPreviewImage(key, safeSrc, alt)
        ) : (
          <span key={key} className="text-muted-foreground">{`[image: ${alt}]`}</span>
        ),
      )
    } else if (match[6]) {
      // Link: [text](href)
      if (interstitial) nodes.push(interstitial)
      const safeHref = match[8] ? sanitizeHref(match[8]) : null
      nodes.push(
        safeHref ? (
          <a key={key} href={safeHref} className="text-primary underline">
            {match[7]}
          </a>
        ) : (
          <span key={key} className="text-primary underline">
            {match[7]}
          </span>
        ),
      )
    } else if (match[9]) {
      if (interstitial) nodes.push(interstitial)
      const content = m.slice(3, -3)
      nodes.push(
        <strong key={key}>
          <em>{parseMentionMarkdownInline(content, triggerChars, sources)}</em>
        </strong>,
      )
    } else if (match[10]) {
      if (interstitial) nodes.push(interstitial)
      const content = m.slice(2, -2)
      nodes.push(
        <strong key={key} className="font-bold">
          {parseMentionMarkdownInline(content, triggerChars, sources)}
        </strong>,
      )
    } else if (match[11]) {
      if (interstitial) nodes.push(interstitial)
      nodes.push(<em key={key}>{parseMentionMarkdownInline(m.slice(1, -1), triggerChars, sources)}</em>)
    } else if (match[12]) {
      if (interstitial) nodes.push(interstitial)
      const content = m.slice(2, -2)
      nodes.push(
        <s key={key} className="text-muted-foreground">
          {parseMentionMarkdownInline(content, triggerChars, sources)}
        </s>,
      )
    } else if (match[13]) {
      if (interstitial) {
        nodes.push(/^\s+$/.test(interstitial) && isMentionInlineNode(getLastInlineNode(nodes)) ? ', ' : interstitial)
      }
      const mentionTrigger = m[0] ?? ''
      const mentionLabel = match[14] ? unescapeMentionToken(match[14]) : m
      const mentionReference = match[15] ? unescapeMentionToken(match[15]) : ''
      nodes.push(
        renderResolvedMentionToken(
          key,
          { trigger: mentionTrigger, label: mentionLabel, reference: mentionReference },
          sourceMap,
        ),
      )
    } else if (match[16]) {
      const charBefore = match.index > 0 ? (text[match.index - 1] ?? '') : ''
      const isStandaloneTrigger = match.index === 0 || /\s/.test(charBefore)
      if (interstitial) {
        nodes.push(
          /^\s+$/.test(interstitial) && isMentionInlineNode(getLastInlineNode(nodes)) && isStandaloneTrigger
            ? ', '
            : interstitial,
        )
      }
      nodes.push(
        isStandaloneTrigger ? (
          <span key={key} className="text-primary font-medium" data-mention-token>
            {m}
          </span>
        ) : (
          m
        ),
      )
    }
    lastIndex = match.index + m.length
    match = pattern.exec(text)
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes.length > 0 ? nodes : [text]
}

export function MentionMarkdownPreview({
  markdown,
  triggerChars = ['@'],
  sources,
}: {
  markdown: string
  triggerChars?: string[]
  sources?: MentionReferenceSource[]
}) {
  const blocks = markdown.split('\n\n').filter(b => b.trim())
  return (
    <>
      {blocks.map((block, bi) => {
        const trimmed = block.trim()
        if (trimmed.startsWith('## '))
          return (
            <h2 key={bi} className="text-xl font-semibold mb-2">
              {parseMentionMarkdownInline(trimmed.slice(3), triggerChars, sources)}
            </h2>
          )
        if (trimmed.startsWith('# '))
          return (
            <h1 key={bi} className="text-2xl font-bold mb-3">
              {parseMentionMarkdownInline(trimmed.slice(2), triggerChars, sources)}
            </h1>
          )
        if (trimmed.startsWith('> ')) {
          const content = trimmed
            .split('\n')
            .map(l => l.replace(/^>\s?/, ''))
            .join(' ')
          return (
            <blockquote
              key={bi}
              className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground mb-3"
            >
              {parseMentionMarkdownInline(content, triggerChars, sources)}
            </blockquote>
          )
        }
        if (/^[-*]\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter(l => /^[-*]\s/.test(l))
          return (
            <ul key={bi} className="list-disc pl-6 mb-3">
              {items.map((l, li) => (
                <li key={li} className="mb-1">
                  {parseMentionMarkdownInline(l.replace(/^[-*]\s/, ''), triggerChars, sources)}
                </li>
              ))}
            </ul>
          )
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter(l => /^\d+\.\s/.test(l))
          return (
            <ol key={bi} className="list-decimal pl-6 mb-3">
              {items.map((l, li) => (
                <li key={li} className="mb-1">
                  {parseMentionMarkdownInline(l.replace(/^\d+\.\s/, ''), triggerChars, sources)}
                </li>
              ))}
            </ol>
          )
        }
        return (
          <p key={bi} className="mb-3 leading-relaxed">
            {parseMentionMarkdownInline(trimmed, triggerChars, sources)}
          </p>
        )
      })}
    </>
  )
}
