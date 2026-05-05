import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarProvider, stringToHue } from '@/elements'
import { HUE_NAMES } from '@/theme/tokens'

const meta: Meta = {
  title: 'Elements/Avatar Colors',
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleNames = [
  'Alice Walker',
  'Bob Chen',
  'Charlie Davis',
  'Diana Evans',
  'Edward Fox',
  'Fiona Grant',
  'George Harris',
  'Hannah Irving',
  'Ivan Jones',
  'Julia Kim',
  'Kevin Lee',
  'Laura Martin',
  'Michael Nash',
  'Nina Ortiz',
  'Oscar Patel',
  'Paula Quinn',
]

export const HuePaletteSoft: Story = {
  name: 'Hue Palette (Soft)',
  render: () => (
    <div className="grid grid-cols-8 gap-3">
      {HUE_NAMES.map(hue => (
        <div key={hue} className="flex flex-col items-center gap-1">
          <div
            className="h-12 w-12 rounded-full border"
            style={{ backgroundColor: `var(--${hue}-6)`, color: `var(--${hue}-11)` }}
            title={`--${hue}-6 / --${hue}-11`}
          />
          <span className="text-xs text-muted-foreground">{hue}</span>
        </div>
      ))}
    </div>
  ),
}

export const HuePaletteSolid: Story = {
  name: 'Hue Palette (Solid)',
  render: () => (
    <div className="grid grid-cols-8 gap-3">
      {HUE_NAMES.map(hue => (
        <div key={hue} className="flex flex-col items-center gap-1">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full border text-xs font-medium"
            style={{ backgroundColor: `var(--${hue}-9)`, color: `var(--${hue}-contrast)` }}
            title={`--${hue}-9 / --${hue}-contrast`}
          >
            Aa
          </div>
          <span className="text-xs text-muted-foreground">{hue}</span>
        </div>
      ))}
    </div>
  ),
}

export const AutoColorFromName: Story = {
  name: 'Auto Color (from name)',
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {sampleNames.map(name => {
        const hue = stringToHue(name)
        return (
          <div key={name} className="flex items-center gap-2">
            <Avatar size="md" name={name} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{name}</span>
              <span className="text-xs text-muted-foreground">{hue}</span>
            </div>
          </div>
        )
      })}
    </div>
  ),
}

export const AutoColorSolid: Story = {
  name: 'Auto Color (Solid)',
  render: () => (
    <AvatarProvider colorMode="solid">
      <div className="grid grid-cols-4 gap-4">
        {sampleNames.map(name => (
          <div key={name} className="flex items-center gap-2">
            <Avatar size="md" name={name} />
            <span className="text-sm">{name}</span>
          </div>
        ))}
      </div>
    </AvatarProvider>
  ),
}

export const ProviderSoftMode: Story = {
  name: 'AvatarProvider (soft)',
  render: () => (
    <AvatarProvider colorMode="soft" radius="lg">
      <div className="flex gap-2">
        {sampleNames.slice(0, 8).map(name => (
          <Avatar key={name} size="lg" name={name} />
        ))}
      </div>
    </AvatarProvider>
  ),
}

export const ProviderSolidMode: Story = {
  name: 'AvatarProvider (solid)',
  render: () => (
    <AvatarProvider colorMode="solid" radius="lg">
      <div className="flex gap-2">
        {sampleNames.slice(0, 8).map(name => (
          <Avatar key={name} size="lg" name={name} />
        ))}
      </div>
    </AvatarProvider>
  ),
}

export const ProviderWithRadius: Story = {
  name: 'AvatarProvider (radius variants)',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['none', 'sm', 'md', 'lg', 'full'] as const).map(radius => (
        <div key={radius} className="flex items-center gap-4">
          <span className="text-sm w-12 text-muted-foreground">{radius}</span>
          <AvatarProvider radius={radius}>
            <div className="flex gap-2">
              {sampleNames.slice(0, 6).map(name => (
                <Avatar key={name} size="md" name={name} />
              ))}
            </div>
          </AvatarProvider>
        </div>
      ))}
    </div>
  ),
}

export const DeterministicHueFromName: Story = {
  name: 'Deterministic Hue from Name',
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Auto-colored (from name hash):</p>
        <div className="flex gap-2">
          <Avatar size="md" name="Alice Walker" />
          <Avatar size="md" name="Bob Chen" />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Same name, same hue every time:</p>
        <div className="flex gap-2">
          <Avatar size="md" name="Alice Walker" />
          <Avatar size="md" name="Alice Walker" />
        </div>
      </div>
    </div>
  ),
}

export const AllShades: Story = {
  name: 'All Shades per Hue',
  render: () => (
    <div className="space-y-3">
      {HUE_NAMES.map(hue => (
        <div key={hue} className="flex items-center gap-3">
          <span className="text-xs w-14 text-muted-foreground">{hue}</span>
          <div className="flex gap-1">
            {(['3', '4', '9', '10', '11'] as const).map(shade => (
              <div
                key={shade}
                className="w-8 h-8 rounded"
                style={{ backgroundColor: `var(--${hue}-${shade})` }}
                title={`--${hue}-${shade}`}
              />
            ))}
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-[10px] font-medium"
              style={{ backgroundColor: `var(--${hue}-9)`, color: `var(--${hue}-contrast)` }}
              title={`--${hue}-contrast`}
            >
              Aa
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
}
