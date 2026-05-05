import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Label, Textarea } from '@/form'
import { SemanticColor } from '@/theme/props/color.prop'
import type { AvatarItem } from './AvatarPicker'
import { type MentionItem, MentionTextarea } from './MentionTextarea'
import { MentionMarkdownPreview } from './mention-markdown'
import { AvatarMentionPicker, MultiSelectMentionPicker } from './mention-pickers'
import { SelectionToolbar } from './SelectionToolbar'

const meta: Meta<typeof MentionTextarea> = {
  title: 'Form/MentionTextarea',
  component: MentionTextarea,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof MentionTextarea>

// Sample data
const users: MentionItem[] = [
  { id: '1', label: 'John Doe', value: 'user:1' },
  { id: '2', label: 'Jane Smith', value: 'user:2' },
  { id: '3', label: 'Bob Johnson', value: 'user:3' },
  { id: '4', label: 'Alice Williams', value: 'user:4' },
  { id: '5', label: 'Charlie Brown', value: 'user:5' },
  { id: '6', label: 'Diana Ross', value: 'user:6' },
  { id: '7', label: 'Eve Anderson', value: 'user:7' },
  { id: '8', label: 'Frank Miller', value: 'user:8' },
]

const channels: MentionItem[] = [
  { id: 'general', label: 'general', value: 'tag:general' },
  { id: 'random', label: 'random', value: 'tag:random' },
  { id: 'announcements', label: 'announcements', value: 'tag:announcements' },
  { id: 'help', label: 'help', value: 'tag:help' },
  { id: 'feedback', label: 'feedback', value: 'tag:feedback' },
]

const avatarUsers: AvatarItem[] = [
  { id: '1', name: 'John Doe', description: 'john@example.com' },
  { id: '2', name: 'Jane Smith', description: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', description: 'bob@example.com' },
  { id: '4', name: 'Alice Williams', description: 'alice@example.com' },
  { id: '5', name: 'Charlie Brown', description: 'charlie@example.com' },
]

const avatarToMentionItem = (a: AvatarItem): MentionItem => ({
  id: a.id,
  label: a.name,
  value: `user:${a.id}`,
  avatar: a.avatar,
  description: a.description,
  hoverCard: true,
})

const mentionBaseVariants = ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] as const
const mentionFloatingVariants = ['floating-filled', 'floating-standard', 'floating-outlined'] as const

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-96 space-y-2">
        <Label>Message</Label>
        <MentionTextarea
          mentions={users}
          value={value}
          onValueChange={setValue}
          placeholder="Type @ to mention someone..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">Try typing @jo to mention John</p>
      </div>
    )
  },
}

export const WithCallback: Story = {
  render: () => {
    const [value, setValue] = React.useState('')
    const [lastMention, setLastMention] = React.useState<string | null>(null)

    return (
      <div className="w-96 space-y-2">
        <Label>Message</Label>
        <MentionTextarea
          mentions={users}
          value={value}
          onValueChange={setValue}
          onMentionSelect={item => setLastMention(item.label)}
          placeholder="Type @ to mention someone..."
          rows={4}
        />
        {lastMention && <p className="text-sm text-green-600">Last mentioned: {lastMention}</p>}
      </div>
    )
  },
}

export const CustomTrigger: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-96 space-y-2">
        <Label>Channel reference</Label>
        <MentionTextarea
          mentions={channels}
          trigger="#"
          value={value}
          onValueChange={setValue}
          placeholder="Type # to reference a channel..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">Use # instead of @ to reference channels</p>
      </div>
    )
  },
}

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    const usersWithAvatars: MentionItem[] = users.map(user => ({
      ...user,
      icon: (
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
          {user.label.charAt(0)}
        </div>
      ),
    }))

    return (
      <div className="w-96 space-y-2">
        <Label>Team message</Label>
        <MentionTextarea
          mentions={usersWithAvatars}
          value={value}
          onValueChange={setValue}
          placeholder="Type @ to mention a team member..."
          rows={4}
        />
      </div>
    )
  },
}

export const WithAutoSize: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-96 space-y-2">
        <Label>Auto-sizing message</Label>
        <MentionTextarea
          mentions={users}
          value={value}
          onValueChange={setValue}
          placeholder="Type @ to mention someone..."
          autoSize
          minRows={2}
          maxRows={6}
        />
        <p className="text-xs text-muted-foreground">Textarea grows as you type</p>
      </div>
    )
  },
}

export const WithFloatingLabel: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-96 space-y-4">
        <MentionTextarea
          mentions={users}
          value={value}
          onValueChange={setValue}
          variant="floating-outlined"
          label="Your message"
        />
      </div>
    )
  },
}

export const AllVariants: Story = {
  render: () => {
    const [values, setValues] = React.useState<Record<string, string>>({})

    return (
      <div className="w-[520px] space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Base Variants</h3>
          {mentionBaseVariants.map(variant => (
            <div key={variant} className="space-y-1">
              <Label className="capitalize">{variant}</Label>
              <MentionTextarea
                mentions={users}
                variant={variant}
                value={values[variant] || ''}
                onValueChange={v => setValues(prev => ({ ...prev, [variant]: v }))}
                placeholder={`Type @ (${variant})...`}
                rows={2}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Floating Variants</h3>
          {mentionFloatingVariants.map(variant => (
            <div key={variant} className="space-y-1">
              <Label className="capitalize">{variant}</Label>
              <MentionTextarea
                mentions={users}
                variant={variant}
                label={`Mention (${variant})`}
                value={values[variant] || ''}
                onValueChange={v => setValues(prev => ({ ...prev, [variant]: v }))}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const DisabledItems: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    const usersWithDisabled: MentionItem[] = users.map((user, i) => ({
      ...user,
      disabled: i % 3 === 0, // Every 3rd item disabled
    }))

    return (
      <div className="w-96 space-y-2">
        <Label>Message (some users unavailable)</Label>
        <MentionTextarea
          mentions={usersWithDisabled}
          value={value}
          onValueChange={setValue}
          placeholder="Type @ to mention someone..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">Some users are disabled and cannot be selected</p>
      </div>
    )
  },
}

export const CustomRenderer: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    const usersWithStatus: (MentionItem & { status: 'online' | 'offline' | 'away' })[] = [
      { id: '1', label: 'John Doe', value: 'john', status: 'online' },
      { id: '2', label: 'Jane Smith', value: 'jane', status: 'away' },
      { id: '3', label: 'Bob Johnson', value: 'bob', status: 'offline' },
      { id: '4', label: 'Alice Williams', value: 'alice', status: 'online' },
    ]

    const statusColors = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-400',
    }

    return (
      <div className="w-96 space-y-2">
        <Label>Message with status</Label>
        <MentionTextarea
          mentions={usersWithStatus}
          value={value}
          onValueChange={setValue}
          placeholder="Type @ to mention someone..."
          rows={4}
          renderItem={(item, isHighlighted) => {
            const user = item as (typeof usersWithStatus)[0]
            return (
              <div className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${isHighlighted ? 'bg-accent' : ''}`}>
                <span className={`w-2 h-2 rounded-full ${statusColors[user.status]}`} />
                <span>{user.label}</span>
                <span className="ml-auto text-xs text-muted-foreground capitalize">{user.status}</span>
              </div>
            )
          }}
        />
      </div>
    )
  },
}

export const ChatExample: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<string[]>(['Hey everyone!', '@john mentioned you in a comment'])
    const [value, setValue] = React.useState('')

    const handleSend = () => {
      if (value.trim()) {
        setMessages(prev => [...prev, value])
        setValue('')
      }
    }

    return (
      <div className="w-[400px] border rounded-lg overflow-hidden">
        {/* Chat header */}
        <div className="px-4 py-3 border-b bg-muted/50">
          <h3 className="font-semibold">#general</h3>
        </div>

        {/* Messages */}
        <div className="h-48 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm">
              {msg}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2 items-end">
            <MentionTextarea
              mentions={users}
              value={value}
              onValueChange={setValue}
              placeholder="Type a message..."
              autoSize
              minRows={1}
              maxRows={4}
              className="flex-1"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )
  },
}

export const MultiTrigger: Story = {
  render: () => {
    const [userValue, setUserValue] = React.useState('')
    const [channelValue, setChannelValue] = React.useState('')

    return (
      <div className="w-96 space-y-6">
        <div className="space-y-2">
          <Label>Mention users (@)</Label>
          <MentionTextarea
            mentions={users}
            trigger="@"
            value={userValue}
            onValueChange={setUserValue}
            placeholder="Type @ to mention users..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Reference channels (#)</Label>
          <MentionTextarea
            mentions={channels}
            trigger="#"
            value={channelValue}
            onValueChange={setChannelValue}
            placeholder="Type # to reference channels..."
            rows={3}
          />
        </div>
      </div>
    )
  },
}

export const HighlightColors: Story = {
  render: () => {
    const [values, setValues] = React.useState<Record<string, string>>({})
    const colors = [
      SemanticColor.slate,
      SemanticColor.primary,
      SemanticColor.info,
      SemanticColor.success,
      SemanticColor.warning,
      SemanticColor.error,
    ] as const

    return (
      <div className="w-96 space-y-4">
        {colors.map(color => (
          <div key={color} className="space-y-1">
            <Label className="capitalize">{color}</Label>
            <MentionTextarea
              mentions={users}
              highlightColor={color}
              value={values[color] || ''}
              onValueChange={v => setValues(prev => ({ ...prev, [color]: v }))}
              placeholder={`Type @ (${color} highlight)...`}
              rows={2}
            />
          </div>
        ))}
      </div>
    )
  },
}

const channelOptions = channels.map(c => ({ value: c.value ?? c.label, label: c.label }))
const channelToMention = (val: string, option?: { label: string }) => {
  const ch = channels.find(c => (c.value ?? c.label) === val)
  return { id: ch?.id ?? val, label: ch?.label ?? option?.label ?? val, value: val }
}

export const MultipleTriggersSameTextarea: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-96 space-y-2">
        <Label>Message with @users and #channels</Label>
        <MentionTextarea
          triggers={[
            {
              trigger: '@',
              items: users,
              highlightColor: SemanticColor.primary,
              renderPicker: props => (
                <AvatarMentionPicker
                  items={avatarUsers}
                  toMention={avatarToMentionItem}
                  size="xs"
                  highlightColor={SemanticColor.primary}
                  {...props}
                />
              ),
            },
            {
              trigger: '#',
              items: channels,
              highlightColor: SemanticColor.info,
              renderPicker: props => (
                <MultiSelectMentionPicker
                  options={channelOptions}
                  toMention={channelToMention}
                  size="xs"
                  color={SemanticColor.info}
                  {...props}
                />
              ),
            },
          ]}
          value={value}
          onValueChange={setValue}
          onMentionSelect={(item, trigger) => console.log(`Selected ${trigger}${item.label}`)}
          placeholder="Type @ to mention users or # to reference channels..."
          rows={4}
          toolbar
        />
        <p className="text-xs text-muted-foreground">
          Try typing @jo for users (primary highlight) or #gen for channels (info highlight)
        </p>
      </div>
    )
  },
}

export const WithToolbar: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-[500px] space-y-2">
        <Label>Markdown editor</Label>
        <MentionTextarea
          mentions={users}
          value={value}
          onValueChange={setValue}
          placeholder="Type here, select text to format with markdown..."
          rows={6}
          toolbar
        />
        <p className="text-xs text-muted-foreground">
          Select text to see the formatting toolbar. Use @ to mention people.
        </p>
        {value && (
          <div className="mt-4 p-3 rounded-md border bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">Raw markdown:</p>
            <pre className="text-xs whitespace-pre-wrap font-mono">{value}</pre>
          </div>
        )}
      </div>
    )
  },
}

export const ToolbarWithAutoSize: Story = {
  render: () => {
    const [value, setValue] = React.useState(
      'Select some of this text and try the formatting toolbar.\n\nYou can make text **bold**, *italic*, or ~~strikethrough~~.',
    )

    return (
      <div className="w-[500px] space-y-2">
        <Label>Auto-sizing markdown editor</Label>
        <MentionTextarea
          mentions={users}
          value={value}
          onValueChange={setValue}
          autoSize
          minRows={3}
          maxRows={10}
          toolbar
        />
      </div>
    )
  },
}

// ── Lightweight markdown → React for preview ──

export const MediumStyleEditor: Story = {
  render: () => {
    const [value, setValue] = React.useState(
      '## Welcome to the editor\n\nClick anywhere on this text to start editing. **Bold** and *italic* formatting will render live.\n\n> Try adding a blockquote\n\n- Or a bullet list\n- With multiple items',
    )
    const [editing, setEditing] = React.useState(false)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const toolbarId = React.useId()
    const toolbarClass = `medium-editor-toolbar-${toolbarId.replace(/:/g, '')}`
    const handleBlur = React.useCallback(
      (e: React.FocusEvent) => {
        // Don't exit edit mode if focus went to this editor's toolbar (portaled to body)
        const related = e.relatedTarget
        if (related instanceof Element && related.closest(`.${toolbarClass}`)) return
        setEditing(false)
      },
      [toolbarClass],
    )

    const enterEdit = React.useCallback(() => {
      setEditing(true)
      requestAnimationFrame(() => textareaRef.current?.focus())
    }, [])

    return (
      <div className="w-[680px] mx-auto space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Write your story</h2>
          <p className="text-sm text-muted-foreground">
            Click the preview to edit. Select text for the formatting toolbar.
          </p>
        </div>

        {editing ? (
          /* Edit mode: textarea + toolbar */
          <div className="relative">
            <Textarea
              ref={textareaRef}
              aria-label="Story content"
              value={value}
              onChange={e => setValue(e.target.value)}
              onBlur={handleBlur}
              rows={12}
              size="lg"
              variant="ghost"
              placeholder="Tell your story..."
            />
            <SelectionToolbar
              textareaRef={textareaRef}
              value={value}
              onValueChange={setValue}
              className={toolbarClass}
            />
          </div>
        ) : (
          /* Preview mode: rendered markdown, click to edit */
          <div
            onClickCapture={e => {
              const anchor = e.target instanceof Element ? e.target.closest('a') : null
              if (anchor) {
                e.preventDefault()
              }
            }}
            onClick={enterEdit}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                enterEdit()
              }
            }}
            role="button"
            tabIndex={0}
            className="min-h-[200px] rounded-md border border-transparent hover:border-input px-4 py-3 cursor-text transition-colors"
          >
            {value ? (
              <MentionMarkdownPreview markdown={value} />
            ) : (
              <p className="text-muted-foreground">Click to start writing...</p>
            )}
          </div>
        )}

        {/* Raw markdown */}
        {value && (
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground font-medium">View raw .md</summary>
            <pre className="mt-2 p-3 rounded-md border bg-muted/30 whitespace-pre-wrap font-mono text-xs">{value}</pre>
          </details>
        )}
      </div>
    )
  },
}

export const SlackStyleInput: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    const emojis: typeof users = [
      { id: 'smile', label: 'smile 😊', value: '😊' },
      { id: 'laugh', label: 'laugh 😂', value: '😂' },
      { id: 'heart', label: 'heart ❤️', value: '❤️' },
      { id: 'thumbsup', label: 'thumbsup 👍', value: '👍' },
      { id: 'fire', label: 'fire 🔥', value: '🔥' },
      { id: 'rocket', label: 'rocket 🚀', value: '🚀' },
    ]

    return (
      <div className="w-[450px] border rounded-lg">
        <div className="px-4 py-3 border-b bg-muted/50">
          <h3 className="font-semibold">#general</h3>
        </div>
        <div className="p-4">
          <MentionTextarea
            triggers={[
              { trigger: '@', items: users, highlightColor: SemanticColor.primary },
              { trigger: '#', items: channels, highlightColor: SemanticColor.info },
              { trigger: ':', items: emojis, highlightColor: SemanticColor.warning },
            ]}
            value={value}
            onValueChange={setValue}
            placeholder="Message #general - use @ # or :"
            autoSize
            minRows={1}
            maxRows={6}
          />
        </div>
        <div className="px-4 py-2 border-t text-xs text-muted-foreground">
          <span className="font-medium">@</span> mention user •<span className="font-medium ml-2">#</span> link channel
          •<span className="font-medium ml-2">:</span> add emoji
        </div>
      </div>
    )
  },
}

// ── Multi-select stories using self-contained pickers ──

export const MultiSelectMentions: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-[500px] space-y-2">
        <Label>Message with multi-select @mentions</Label>
        <MentionTextarea
          triggers={[
            {
              trigger: '@',
              items: users,
              highlightColor: SemanticColor.primary,
              renderPicker: props => (
                <AvatarMentionPicker
                  items={avatarUsers}
                  toMention={avatarToMentionItem}
                  size="xs"
                  highlightColor={SemanticColor.primary}
                  {...props}
                />
              ),
            },
            { trigger: '#', items: channels, highlightColor: SemanticColor.info },
          ]}
          value={value}
          onValueChange={setValue}
          placeholder="Type @ to multi-select users, # for channels..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Type @ to open AvatarPicker — check multiple users, then click Add.
        </p>
      </div>
    )
  },
}

const tagItems = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'docs', label: 'Documentation' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'help', label: 'Help Wanted' },
]

const tagToMention = (val: string, opt?: { label: string }) => ({
  id: val,
  label: opt?.label ?? val,
  value: `tag:${val}`,
})

export const ResolvedIdentityPreview: Story = {
  render: () => (
    <div className="w-[560px] space-y-3">
      <Label>Resolved mention preview</Label>
      <div className="rounded-xl border border-border bg-background p-4">
        <MentionMarkdownPreview
          markdown={
            '@[John Doe](user:1) @[Jane Smith](user:2)\n\nCoordinate with #[Documentation](tag:docs) #[Urgent](tag:urgent).'
          }
          triggerChars={['@', '#']}
          sources={[
            ...users.map(user => ({
              reference: user.value ?? user.id,
              label: user.label,
              hoverCard: true,
            })),
            ...avatarUsers.map(user => ({
              reference: `user:${user.id}`,
              label: user.name,
              description: user.description,
              avatar: user.avatar,
              hoverCard: true,
            })),
            ...tagItems.map(tag => ({
              reference: `tag:${tag.value}`,
              label: tag.label,
            })),
          ]}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Preview resolves stable <code>user:</code> and <code>tag:</code> refs into inline display labels and avatar
        hover cards without showing the stored token format.
      </p>
    </div>
  ),
}

export const MultiSelectTags: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-[500px] space-y-2">
        <Label>Message with multi-select #tags</Label>
        <MentionTextarea
          triggers={[
            { trigger: '@', items: users, highlightColor: SemanticColor.primary },
            {
              trigger: '#',
              items: channels,
              highlightColor: SemanticColor.info,
              renderPicker: props => (
                <MultiSelectMentionPicker
                  options={tagItems}
                  toMention={tagToMention}
                  size="xs"
                  color={SemanticColor.info}
                  placeholder="Select tags..."
                  {...props}
                />
              ),
            },
          ]}
          value={value}
          onValueChange={setValue}
          placeholder="Type @ for users, # for multi-select tags..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">Type # to open tag picker — select multiple tags.</p>
      </div>
    )
  },
}

export const ToolbarWithActiveStates: Story = {
  render: () => {
    const [value, setValue] = React.useState(
      '**Bold text** and *italic text* and ~~strikethrough~~\n\n## A heading\n\n> A blockquote\n\n- List item 1\n- List item 2',
    )

    return (
      <div className="w-[600px] space-y-2">
        <Label>Toolbar with active state detection</Label>
        <MentionTextarea mentions={users} value={value} onValueChange={setValue} rows={8} toolbar />
        <p className="text-xs text-muted-foreground">
          Select formatted text — the toolbar buttons will reflect active formatting. E.g., select the bold text to see
          the Bold toggle pressed.
        </p>
      </div>
    )
  },
}

export const FullFeatured: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-[600px] space-y-2">
        <Label>Full-featured editor</Label>
        <MentionTextarea
          triggers={[
            {
              trigger: '@',
              items: users,
              highlightColor: SemanticColor.primary,
              renderPicker: props => (
                <AvatarMentionPicker
                  items={avatarUsers}
                  toMention={avatarToMentionItem}
                  size="sm"
                  highlightColor={SemanticColor.primary}
                  {...props}
                />
              ),
            },
            { trigger: '#', items: channels, highlightColor: SemanticColor.info },
          ]}
          value={value}
          onValueChange={setValue}
          placeholder="Write your message... @ to mention, # for channels, select text for formatting"
          autoSize
          minRows={4}
          maxRows={12}
          toolbar
        />
        {value && (
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground">View raw markdown</summary>
            <pre className="mt-2 p-3 rounded-md border bg-muted/30 whitespace-pre-wrap font-mono">{value}</pre>
          </details>
        )}
      </div>
    )
  },
}

/** Bare textarea + SelectionToolbar — simplest working toolbar demo */
export const ToolbarDiagnostic: Story = {
  render: () => {
    const [value, setValue] = React.useState(
      'Select this text and click Bold in the toolbar.\n\nThen select other text and try Italic. Both should toggle.',
    )
    const textareaId = React.useId()
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    return (
      <div className="w-[600px] space-y-3">
        <Label htmlFor={textareaId}>Plain textarea + SelectionToolbar</Label>
        <div className="relative">
          <Textarea id={textareaId} ref={textareaRef} value={value} onChange={e => setValue(e.target.value)} rows={6} />
          <SelectionToolbar textareaRef={textareaRef} value={value} onValueChange={setValue} />
        </div>
        <div className="rounded-md border p-3 min-h-[60px]">
          <p className="text-xs font-medium text-muted-foreground mb-2">Preview:</p>
          {value ? <MentionMarkdownPreview markdown={value} /> : <p className="text-sm text-muted-foreground">Empty</p>}
        </div>
        <pre className="text-xs p-2 rounded bg-muted/30 border whitespace-pre-wrap font-mono">{value}</pre>
      </div>
    )
  },
}

// ─── Image Drag & Drop ────────────────────────────────────────────────────────

/** Simulates a 1-second upload by creating a local blob URL from the dropped file. */
function fakeUpload(file: File): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file))
    }, 1000)
  })
}

export const ImageDragAndDrop: Story = {
  render: () => {
    const [value, setValue] = React.useState('')

    return (
      <div className="w-[600px] space-y-2">
        <Label>Drag &amp; drop images (GitHub-style)</Label>
        <MentionTextarea
          mentions={users}
          value={value}
          onValueChange={setValue}
          onFileUpload={fakeUpload}
          placeholder="Type a message… drag & drop or paste an image"
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Drop an image onto the textarea, or paste one from your clipboard. A placeholder is inserted while uploading.
        </p>
        <pre className="text-xs p-2 rounded bg-muted/30 border whitespace-pre-wrap font-mono">{value || '(empty)'}</pre>
      </div>
    )
  },
}
