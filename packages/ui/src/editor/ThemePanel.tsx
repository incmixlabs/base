'use client'

import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { IconButton } from '@/elements/button/IconButton'
import { IconSwapButton } from '@/elements/button/IconSwapButton'
import { DataList } from '@/elements/data-list/DataList'
import { ColorSwatchPicker } from '@/elements/menu/ColorSwatchPicker'
import { ScrollArea } from '@/elements/scroll-area/ScrollArea'
import { Sheet } from '@/elements/sheet/Sheet'
import { Tabs } from '@/elements/tabs/Tabs'
import { Label, NumberInput, TextField } from '@/form'
import { useClipboard } from '@/hooks'
import { Box, Flex } from '@/layouts'
import { Grid } from '@/layouts/grid/Grid'
import type { SidebarVariant } from '@/layouts/sidebar/sidebar.props'
import {
  THEME_FONT_FILE_FORMATS,
  type ThemeFileUrlFontSource,
  type ThemeFontFileFormat,
  type ThemeFontSource,
  type ThemeTypographySlot,
} from '@/theme/font-sources'
import { buildThemeResponsiveProfileVars } from '@/theme/profile-vars'
import { buildRuntimePaletteVars } from '@/theme/runtime-palette-vars'
import { buildSemanticLaneVars } from '@/theme/semantic-lane-vars'
import type { ThemeProviderContextValue } from '@/theme/ThemeProvider'
import { useOptionalThemeVarsContext } from '@/theme/ThemeVarsProvider'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import { TYPOGRAPHY_RESPONSIVE_PROFILES } from '@/theme/token-constants'
import {
  type Color,
  SEMANTIC_COLOR_DEFAULTS,
  SEMANTIC_HUE_OPTIONS,
  type SemanticHue,
  type SemanticLane,
  THEME_COLOR_VARIANT_DEFAULTS,
  type ThemeColorVariantSteps,
  typographyBreakpoints,
} from '@/theme/tokens'
import { Text } from '@/typography'
import { capitalize, extractPrimaryFontFamily } from '@/utils/strings'
import { THEME_FONT_GENERIC_FALLBACKS, THEME_FONT_PRESETS } from './theme-panel-fonts'

export interface ThemePanelProps {
  defaultPreset?: string
  sidebarColor?: Color
  onSidebarColorChange?: (color: Color) => void
  sidebarVariant?: SidebarVariant
  onSidebarVariantChange?: (variant: SidebarVariant) => void
  contentBodyColor?: Color
  onContentBodyColorChange?: (color: Color) => void
  contentBodyVariant?: SidebarVariant
  onContentBodyVariantChange?: (variant: SidebarVariant) => void
}

const semanticLanes = Object.keys(SEMANTIC_COLOR_DEFAULTS) as SemanticLane[]
const colorVariantStepKeys = [
  'soft',
  'softHover',
  'surface',
  'surfaceHover',
  'solid',
  'solidHover',
  'border',
  'borderSubtle',
  'text',
  'lightText',
  'darkText',
] as const satisfies ReadonlyArray<keyof ThemeColorVariantSteps>

const SIDEBAR_SEMANTIC_OPTIONS = semanticLanes.map(value => ({
  value: value as Color,
  label: value.charAt(0).toUpperCase() + value.slice(1),
  swatchColor: `var(--color-${value}-primary)`,
}))

const TYPOGRAPHY_SLOT_FIELDS = {
  sans: 'fontSans',
  serif: 'fontSerif',
  mono: 'fontMono',
} as const

const TYPOGRAPHY_SLOT_LABELS: Record<ThemeTypographySlot, string> = {
  sans: 'Sans',
  serif: 'Serif',
  mono: 'Mono',
}

const FONT_SOURCE_MODE_OPTIONS = [
  { value: 'preset', label: 'Preset' },
  { value: 'css-url', label: 'Stylesheet URL' },
  { value: 'file-url', label: 'Font File' },
] as const

type FontSourceMode = (typeof FONT_SOURCE_MODE_OPTIONS)[number]['value']

function getTypographySlotValue(typography: ThemeProviderContextValue['typography'], slot: ThemeTypographySlot) {
  return typography[TYPOGRAPHY_SLOT_FIELDS[slot]]
}

function buildFontFamilyWithFallback(slot: ThemeTypographySlot, family: string) {
  const trimmed = family.trim().replace(/^['"]+|['"]+$/g, '')
  if (!trimmed) return THEME_FONT_GENERIC_FALLBACKS[slot]
  return `"${trimmed.replace(/"/g, '\\"')}", ${THEME_FONT_GENERIC_FALLBACKS[slot]}`
}

function inferFontSourceMode(source: ThemeFontSource | undefined): FontSourceMode {
  if (!source) return 'preset'
  return source.kind
}

function inferFontFormat(file: File): ThemeFontFileFormat | undefined {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension === 'woff2') return 'woff2'
  if (extension === 'woff') return 'woff'
  if (extension === 'ttf') return 'truetype'
  if (extension === 'otf') return 'opentype'
  if (file.type === 'font/woff2') return 'woff2'
  if (file.type === 'font/woff') return 'woff'
  if (file.type === 'font/ttf' || file.type === 'application/x-font-ttf') return 'truetype'
  if (file.type === 'font/otf' || file.type === 'application/x-font-otf') return 'opentype'
  return undefined
}

function toFontFamilyName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toFieldLabel(value: string) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase())
}

export function ThemePanel({
  defaultPreset: _defaultPreset = 'sky',
  sidebarColor: sidebarColorProp,
  onSidebarColorChange,
  sidebarVariant: sidebarVariantProp,
  onSidebarVariantChange,
  contentBodyColor: contentBodyColorProp,
  onContentBodyColorChange,
  contentBodyVariant: contentBodyVariantProp,
  onContentBodyVariantChange,
}: ThemePanelProps) {
  const theme = useOptionalThemeProviderContext()
  const themeVars = useOptionalThemeVarsContext()
  const [activeTab, setActiveTab] = React.useState<string>('appearance')
  const clipboard = useClipboard()
  const sidebarColor = sidebarColorProp ?? theme?.sidebarColor ?? 'slate'
  const sidebarVariant = sidebarVariantProp ?? theme?.sidebarVariant ?? 'soft'
  const contentBodyColor = contentBodyColorProp ?? theme?.contentBodyColor ?? 'info'
  const contentBodyVariant = contentBodyVariantProp ?? theme?.contentBodyVariant ?? 'surface'
  const appearance = theme?.appearance === 'dark' ? 'dark' : 'light'
  const sansFontSource = theme?.typography.fontSources.sans
  const serifFontSource = theme?.typography.fontSources.serif
  const monoFontSource = theme?.typography.fontSources.mono
  const [fontSourceModes, setFontSourceModes] = React.useState<Record<ThemeTypographySlot, FontSourceMode>>({
    sans: inferFontSourceMode(sansFontSource),
    serif: inferFontSourceMode(serifFontSource),
    mono: inferFontSourceMode(monoFontSource),
  })

  React.useEffect(() => {
    setFontSourceModes({
      sans: inferFontSourceMode(sansFontSource),
      serif: inferFontSourceMode(serifFontSource),
      mono: inferFontSourceMode(monoFontSource),
    })
  }, [monoFontSource, sansFontSource, serifFontSource])

  const setSidebarColor = React.useCallback(
    (color: Color) => {
      if (!theme) return
      if (onSidebarColorChange) onSidebarColorChange(color)
      else theme.onSidebarColorChange(color)
    },
    [onSidebarColorChange, theme],
  )

  const setSidebarVariant = React.useCallback(
    (variant: SidebarVariant) => {
      if (!theme) return
      if (onSidebarVariantChange) onSidebarVariantChange(variant)
      else theme.onSidebarVariantChange(variant)
    },
    [onSidebarVariantChange, theme],
  )

  const setContentBodyColor = React.useCallback(
    (color: Color) => {
      if (!theme) return
      if (onContentBodyColorChange) onContentBodyColorChange(color)
      else theme.onContentBodyColorChange(color)
    },
    [onContentBodyColorChange, theme],
  )

  const setContentBodyVariant = React.useCallback(
    (variant: SidebarVariant) => {
      if (!theme) return
      if (onContentBodyVariantChange) onContentBodyVariantChange(variant)
      else theme.onContentBodyVariantChange(variant)
    },
    [onContentBodyVariantChange, theme],
  )

  const panelSemanticColors = themeVars?.tokens.colors.semantic ?? theme?.semanticColors ?? SEMANTIC_COLOR_DEFAULTS
  const panelVariantSteps = themeVars?.tokens.colors.variants ?? THEME_COLOR_VARIANT_DEFAULTS
  const panelAppearance = theme?.appearance === 'dark' ? 'dark' : 'light'
  const panelThemeStyles = React.useMemo<React.CSSProperties>(
    () => ({
      ...buildRuntimePaletteVars(panelAppearance),
      ...(theme ? buildThemeResponsiveProfileVars(theme.typography.responsiveProfile, typographyBreakpoints) : {}),
      ...buildSemanticLaneVars(panelSemanticColors, panelVariantSteps),
    }),
    [panelAppearance, panelSemanticColors, panelVariantSteps, theme],
  )

  const exportSnapshot = React.useMemo(
    () =>
      JSON.stringify(
        {
          appearance: theme?.appearance,
          accentColor: theme?.accentColor,
          grayColor: theme?.grayColor,
          radius: theme?.radius,
          scaling: theme?.scaling,
          panelBackground: theme?.panelBackground,
          avatarVariant: theme?.avatarVariant,
          avatarRadius: theme?.avatarRadius,
          sidebarColor,
          sidebarVariant,
          contentBodyColor,
          contentBodyVariant,
          themeVars: themeVars?.tokens,
          semanticColors: themeVars?.tokens.colors.semantic ?? theme?.semanticColors,
          locale: theme?.locale,
          calendar: theme?.calendar,
          typography: theme?.typography,
        },
        null,
        2,
      ),
    [
      theme?.appearance,
      theme?.accentColor,
      theme?.grayColor,
      theme?.radius,
      theme?.scaling,
      theme?.panelBackground,
      theme?.avatarVariant,
      theme?.avatarRadius,
      sidebarColor,
      sidebarVariant,
      contentBodyColor,
      contentBodyVariant,
      themeVars?.tokens,
      theme?.semanticColors,
      theme?.locale,
      theme?.calendar,
      theme?.typography,
    ],
  )

  if (!theme) {
    return null
  }

  const applyTypographyPatch = (value: Partial<ThemeProviderContextValue['typography']>) => {
    theme.onTypographyChange({
      ...value,
      fontSources: value.fontSources ? { ...theme.typography.fontSources, ...value.fontSources } : undefined,
    })
  }

  const applyFontPreset = (slot: ThemeTypographySlot, presetId: string) => {
    const preset = THEME_FONT_PRESETS[slot].find(option => option.id === presetId)
    if (!preset) return

    setFontSourceModes(current => ({ ...current, [slot]: 'preset' }))
    applyTypographyPatch({
      [TYPOGRAPHY_SLOT_FIELDS[slot]]: preset.fontFamily,
      fontSources: { [slot]: undefined },
    } as Partial<ThemeProviderContextValue['typography']>)
  }

  const updateFontSource = (slot: ThemeTypographySlot, source: ThemeFontSource | undefined) => {
    applyTypographyPatch({
      fontSources: { [slot]: source },
    })
  }

  const updateFontFamily = (slot: ThemeTypographySlot, value: string) => {
    applyTypographyPatch({
      [TYPOGRAPHY_SLOT_FIELDS[slot]]: value,
    } as Partial<ThemeProviderContextValue['typography']>)
  }

  const updateFontFamilyName = (slot: ThemeTypographySlot, value: string) => {
    updateFontFamily(slot, buildFontFamilyWithFallback(slot, value))
  }

  const patchFileUrlSource = (slot: ThemeTypographySlot, patch: Partial<Omit<ThemeFileUrlFontSource, 'kind'>>) => {
    const current = theme.typography.fontSources[slot]
    const base =
      current?.kind === 'file-url'
        ? current
        : ({
            url: '',
            format: 'woff2',
            display: 'swap',
            style: 'normal',
          } satisfies Omit<ThemeFileUrlFontSource, 'kind'>)

    updateFontSource(slot, { kind: 'file-url', ...base, ...patch })
  }

  const handleFontSourceModeChange = (slot: ThemeTypographySlot, mode: FontSourceMode) => {
    setFontSourceModes(current => ({ ...current, [slot]: mode }))

    if (mode === 'preset') {
      updateFontSource(slot, undefined)
      return
    }

    if (mode === 'css-url') {
      updateFontFamilyName(
        slot,
        extractPrimaryFontFamily(getTypographySlotValue(theme.typography, slot)) ||
          `${TYPOGRAPHY_SLOT_LABELS[slot]} Custom`,
      )
      updateFontSource(slot, { kind: 'css-url', url: '' })
      return
    }

    updateFontFamilyName(
      slot,
      extractPrimaryFontFamily(getTypographySlotValue(theme.typography, slot)) ||
        `${TYPOGRAPHY_SLOT_LABELS[slot]} Custom`,
    )
    patchFileUrlSource(slot, {})
  }

  const handleFontUpload = async (slot: ThemeTypographySlot, file: File | undefined) => {
    if (!file) return

    const familyName = toFontFamilyName(file.name) || `${TYPOGRAPHY_SLOT_LABELS[slot]} Custom`
    let url: string
    try {
      url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(reader.error ?? new Error('Unable to read font file'))
        reader.onload = () => resolve(String(reader.result ?? ''))
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Failed to read font file:', error)
      return
    }

    setFontSourceModes(current => ({ ...current, [slot]: 'file-url' }))
    updateFontFamily(slot, buildFontFamilyWithFallback(slot, familyName))
    patchFileUrlSource(slot, {
      url,
      format: inferFontFormat(file),
      display: 'swap',
    })
  }

  return (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <IconButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="palette"
          aria-label="Customize theme"
          title="Customize theme"
        />
      </Sheet.Trigger>
      <Sheet.Content side="right" style={{ maxWidth: 480, ...panelThemeStyles }}>
        <Sheet.Header>
          <div>
            <Sheet.Title>Theme</Sheet.Title>
            <Sheet.Description>Customize appearance</Sheet.Description>
          </div>
          <Sheet.Close />
        </Sheet.Header>

        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          variant="surface"
          size="xs"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <Box className="shrink-0 px-6 pt-4">
            <Tabs.List className="grid w-full grid-cols-4">
              <Tabs.Trigger value="appearance" className="min-w-0 justify-center px-2">
                Appearance
              </Tabs.Trigger>
              <Tabs.Trigger value="colors" className="min-w-0 justify-center px-2">
                Colors
              </Tabs.Trigger>
              <Tabs.Trigger value="typography" className="min-w-0 justify-center px-2">
                Typography
              </Tabs.Trigger>
              <Tabs.Trigger value="export" className="min-w-0 justify-center px-2">
                Export
              </Tabs.Trigger>
            </Tabs.List>
          </Box>

          <Sheet.Body className="overflow-y-auto">
            <Tabs.Content value="appearance" className="px-6 py-5">
              <Flex direction="column" gap="4">
                <Text size="md" weight="medium">
                  Appearance
                </Text>
                <Flex align="center" gap="3">
                  <IconSwapButton
                    icons={['sun', 'moon'] as const}
                    value={appearance === 'dark' ? 'moon' : 'sun'}
                    onToggle={next => theme.onAppearanceChange(next === 'moon' ? 'dark' : 'light')}
                    variant="outline"
                    size="xs"
                    title={appearance === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    aria-label={appearance === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  />
                  <Text size="xs" className="text-muted-foreground">
                    {appearance === 'dark' ? 'Dark' : 'Light'}
                  </Text>
                </Flex>
                <Box>
                  <Label size="xs" htmlFor="theme-radius" className="mb-2 block">
                    Radius
                  </Label>
                  <select
                    id="theme-radius"
                    value={theme.radius}
                    onChange={event => theme.onRadiusChange(event.target.value as typeof theme.radius)}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="full">Full</option>
                  </select>
                </Box>
                <Box>
                  <Label htmlFor="theme-scaling" className="mb-2 block">
                    Scaling
                  </Label>
                  <select
                    id="theme-scaling"
                    value={theme.scaling}
                    onChange={event => theme.onScalingChange(event.target.value as typeof theme.scaling)}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="90%">90%</option>
                    <option value="95%">95%</option>
                    <option value="100%">100%</option>
                    <option value="105%">105%</option>
                    <option value="110%">110%</option>
                  </select>
                </Box>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="colors" className="px-6 py-5">
              <Flex direction="column" gap="5">
                <Box>
                  <Text size="xs" weight="medium" className="mb-1 block">
                    Sidebar
                  </Text>
                  <Text size="xs" className="mb-3 block text-muted-foreground">
                    Updates sidebar color and variant only.
                  </Text>

                  <Grid columns="3" gap="2" className="mb-3">
                    <Button
                      size="xs"
                      variant={sidebarVariant === 'surface' ? 'solid' : 'outline'}
                      onClick={() => setSidebarVariant('surface')}
                    >
                      Surface
                    </Button>
                    <Button
                      size="xs"
                      variant={sidebarVariant === 'soft' ? 'solid' : 'outline'}
                      onClick={() => setSidebarVariant('soft')}
                    >
                      Soft
                    </Button>
                    <Button
                      size="xs"
                      variant={sidebarVariant === 'solid' ? 'solid' : 'outline'}
                      onClick={() => setSidebarVariant('solid')}
                    >
                      Solid
                    </Button>
                  </Grid>

                  <ColorSwatchPicker
                    label="Sidebar color"
                    value={sidebarColor}
                    options={SIDEBAR_SEMANTIC_OPTIONS}
                    size="sm"
                    onChange={value => setSidebarColor(value as Color)}
                  />
                </Box>

                <Box>
                  <Text size="xs" weight="medium" className="mb-1 block">
                    Content Body
                  </Text>
                  <Text size="xs" className="mb-3 block text-muted-foreground">
                    Updates app shell content body variables.
                  </Text>

                  <Grid columns="3" gap="2" className="mb-3">
                    <Button
                      size="xs"
                      variant={contentBodyVariant === 'surface' ? 'solid' : 'outline'}
                      onClick={() => setContentBodyVariant('surface')}
                    >
                      Surface
                    </Button>
                    <Button
                      size="xs"
                      variant={contentBodyVariant === 'soft' ? 'solid' : 'outline'}
                      onClick={() => setContentBodyVariant('soft')}
                    >
                      Soft
                    </Button>
                    <Button
                      size="xs"
                      variant={contentBodyVariant === 'solid' ? 'solid' : 'outline'}
                      onClick={() => setContentBodyVariant('solid')}
                    >
                      Solid
                    </Button>
                  </Grid>

                  <ColorSwatchPicker
                    label="Content body color"
                    value={contentBodyColor}
                    options={SIDEBAR_SEMANTIC_OPTIONS}
                    size="sm"
                    onChange={value => setContentBodyColor(value as Color)}
                  />
                </Box>

                <Box>
                  <Flex direction="column" gap="3">
                    <Box>
                      <Text size="md" weight="medium" className="mb-2 block">
                        Variant Steps
                      </Text>
                      <Text size="xs" className="mb-3 block text-muted-foreground">
                        Shared hue-step rules for soft, surface, solid, borders, and readable text.
                      </Text>
                      <DataList.Root size="sm">
                        {colorVariantStepKeys.map(key => (
                          <DataList.Item key={key} align="between">
                            <DataList.Label minWidth="112px">{toFieldLabel(key)}</DataList.Label>
                            <DataList.Value>
                              <NumberInput
                                aria-label={`${toFieldLabel(key)} step`}
                                size="xs"
                                inputVariant="ghost"
                                min={1}
                                max={12}
                                step={1}
                                allowDecimal={false}
                                disabled={!themeVars}
                                value={panelVariantSteps[key]}
                                onValueChange={value => {
                                  if (!themeVars || value === '') return
                                  themeVars.onColorVariantStepChange(key, value as ThemeColorVariantSteps[typeof key])
                                }}
                                className="w-20"
                              />
                            </DataList.Value>
                          </DataList.Item>
                        ))}
                      </DataList.Root>
                    </Box>
                    <Box>
                      <Text size="md" weight="medium" className="mb-2 block">
                        Semantic Hues
                      </Text>
                      <Text size="xs" className="mb-3 block text-muted-foreground">
                        Map semantic lanes like primary, info, and success to specific hues.
                      </Text>
                      <Flex direction="column" gap="2">
                        {semanticLanes.map(lane => (
                          <Box key={lane}>
                            <ColorSwatchPicker
                              label={`${capitalize(lane)}`}
                              size="sm"
                              value={
                                themeVars?.tokens.colors.semantic[lane] ??
                                theme.semanticColors[lane] ??
                                SEMANTIC_COLOR_DEFAULTS[lane] ??
                                'gray'
                              }
                              options={SEMANTIC_HUE_OPTIONS}
                              onChange={value =>
                                themeVars
                                  ? themeVars.onSemanticColorChange(lane, value as SemanticHue)
                                  : theme.onSemanticColorChange(lane, value as SemanticHue)
                              }
                            />
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="typography" className="px-6 py-5">
              <Flex direction="column" gap="4">
                <Box>
                  <Label size="sm" htmlFor="theme-typography-responsive-profile" className="mb-2 block">
                    Responsive Profile
                  </Label>
                  <select
                    id="theme-typography-responsive-profile"
                    value={theme.typography.responsiveProfile}
                    onChange={event =>
                      theme.onTypographyChange({
                        responsiveProfile: event.target.value as (typeof TYPOGRAPHY_RESPONSIVE_PROFILES)[number],
                      })
                    }
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    {TYPOGRAPHY_RESPONSIVE_PROFILES.map(profile => (
                      <option key={profile} value={profile}>
                        {profile.charAt(0).toUpperCase() + profile.slice(1)}
                      </option>
                    ))}
                  </select>
                  <Text size="xs" className="mt-2 block text-muted-foreground">
                    Profile selection is theme state and export metadata. Query thresholds remain compile-time token
                    CSS.
                  </Text>
                </Box>
                {(['sans', 'serif', 'mono'] as const).map(slot => {
                  const source = theme.typography.fontSources[slot]
                  const sourceMode = fontSourceModes[slot]
                  const familyValue = getTypographySlotValue(theme.typography, slot)

                  return (
                    <Box key={slot} className="rounded-xl border border-border/60 p-4">
                      <Flex direction="column" gap="3">
                        <div>
                          <Text size="xs" weight="medium">
                            {TYPOGRAPHY_SLOT_LABELS[slot]}
                          </Text>
                          <Text size="xs" className="mt-1 block text-muted-foreground">
                            {slot === 'serif'
                              ? 'Keep serif use selective for display emphasis and editorial moments.'
                              : slot === 'mono'
                                ? 'Use mono for code, diagnostics, and dense technical surfaces.'
                                : 'Use sans for core UI, navigation, and general documentation body copy.'}
                          </Text>
                        </div>

                        <div>
                          <Label htmlFor={`theme-font-${slot}-preset`} className="mb-2 block">
                            Preset
                          </Label>
                          <select
                            id={`theme-font-${slot}-preset`}
                            value=""
                            onChange={event => {
                              if (event.target.value) {
                                applyFontPreset(slot, event.target.value)
                                event.currentTarget.value = ''
                              }
                            }}
                            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                          >
                            <option value="">Keep current stack</option>
                            {THEME_FONT_PRESETS[slot].map(option => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor={`theme-font-${slot}-mode`} className="mb-2 block">
                            Source Mode
                          </Label>
                          <select
                            id={`theme-font-${slot}-mode`}
                            value={sourceMode}
                            onChange={event => handleFontSourceModeChange(slot, event.target.value as FontSourceMode)}
                            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                          >
                            {FONT_SOURCE_MODE_OPTIONS.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor={`theme-font-${slot}-family`} className="mb-2 block">
                            Font Stack
                          </Label>
                          <TextField
                            id={`theme-font-${slot}-family`}
                            size="md"
                            value={familyValue}
                            onChange={event => updateFontFamily(slot, event.target.value)}
                          />
                        </div>

                        {sourceMode === 'css-url' ? (
                          <>
                            <div>
                              <Label htmlFor={`theme-font-${slot}-css-family`} className="mb-2 block">
                                Loaded Family Name
                              </Label>
                              <TextField
                                id={`theme-font-${slot}-css-family`}
                                size="md"
                                value={extractPrimaryFontFamily(familyValue)}
                                onChange={event => updateFontFamilyName(slot, event.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`theme-font-${slot}-css-url`} className="mb-2 block">
                                Stylesheet URL
                              </Label>
                              <TextField
                                id={`theme-font-${slot}-css-url`}
                                size="md"
                                value={source?.kind === 'css-url' ? source.url : ''}
                                onChange={event => updateFontSource(slot, { kind: 'css-url', url: event.target.value })}
                              />
                            </div>
                          </>
                        ) : null}

                        {sourceMode === 'file-url' ? (
                          <>
                            <div>
                              <Label htmlFor={`theme-font-${slot}-file-family`} className="mb-2 block">
                                Loaded Family Name
                              </Label>
                              <TextField
                                id={`theme-font-${slot}-file-family`}
                                size="md"
                                value={extractPrimaryFontFamily(familyValue)}
                                onChange={event => updateFontFamilyName(slot, event.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`theme-font-${slot}-file-url`} className="mb-2 block">
                                Font File URL
                              </Label>
                              <TextField
                                id={`theme-font-${slot}-file-url`}
                                size="md"
                                value={source?.kind === 'file-url' ? source.url : ''}
                                onChange={event => patchFileUrlSource(slot, { url: event.target.value })}
                              />
                            </div>
                            <Grid columns="2" gap="3">
                              <Box>
                                <Label htmlFor={`theme-font-${slot}-file-format`} className="mb-2 block">
                                  Format
                                </Label>
                                <select
                                  id={`theme-font-${slot}-file-format`}
                                  value={source?.kind === 'file-url' ? (source.format ?? '') : ''}
                                  onChange={event =>
                                    patchFileUrlSource(slot, {
                                      format: (event.target.value || undefined) as ThemeFontFileFormat | undefined,
                                    })
                                  }
                                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                                >
                                  <option value="">Auto</option>
                                  {THEME_FONT_FILE_FORMATS.map(format => (
                                    <option key={format} value={format}>
                                      {format}
                                    </option>
                                  ))}
                                </select>
                              </Box>
                              <Box>
                                <Label htmlFor={`theme-font-${slot}-file-style`} className="mb-2 block">
                                  Style
                                </Label>
                                <select
                                  id={`theme-font-${slot}-file-style`}
                                  value={source?.kind === 'file-url' ? (source.style ?? 'normal') : 'normal'}
                                  onChange={event =>
                                    patchFileUrlSource(slot, { style: event.target.value as 'normal' | 'italic' })
                                  }
                                  className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                                >
                                  <option value="normal">Normal</option>
                                  <option value="italic">Italic</option>
                                </select>
                              </Box>
                            </Grid>
                            <div>
                              <Label htmlFor={`theme-font-${slot}-file-weight`} className="mb-2 block">
                                Weight
                              </Label>
                              <TextField
                                id={`theme-font-${slot}-file-weight`}
                                size="md"
                                value={source?.kind === 'file-url' ? (source.weight ?? '') : ''}
                                onChange={event => patchFileUrlSource(slot, { weight: event.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`theme-font-${slot}-upload`} className="mb-2 block">
                                Upload Font
                              </Label>
                              <input
                                id={`theme-font-${slot}-upload`}
                                type="file"
                                accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf"
                                onChange={event => {
                                  const [file] = Array.from(event.target.files ?? [])
                                  void handleFontUpload(slot, file)
                                  event.currentTarget.value = ''
                                }}
                                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-2"
                              />
                            </div>
                          </>
                        ) : null}

                        <Text size="xs" className="text-muted-foreground">
                          {sourceMode === 'preset'
                            ? 'Preset mode keeps runtime CSS-variable changes local to the font-family stack.'
                            : sourceMode === 'css-url'
                              ? 'Set the loaded family name to the @font-face family exported by the stylesheet, then point to a stable hosted CSS URL.'
                              : 'File URLs and uploads can preview self-hosted fonts. Keep the loaded family name aligned with the @font-face family you want applied.'}
                        </Text>
                      </Flex>
                    </Box>
                  )
                })}
                <Box>
                  <Label htmlFor="theme-letter-spacing" className="mb-2 block">
                    Letter Spacing
                  </Label>
                  <TextField
                    id="theme-letter-spacing"
                    size="md"
                    value={theme.typography.letterSpacing}
                    onChange={event => applyTypographyPatch({ letterSpacing: event.target.value })}
                  />
                </Box>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="export" className="px-6 py-5">
              <Flex direction="column" gap="4">
                <Flex gap="2">
                  <Button size="md" className="flex-1" onClick={() => clipboard.copy(exportSnapshot)}>
                    {clipboard.copied ? 'Copied!' : 'Copy JSON'}
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => {
                      setSidebarColor('slate')
                      setSidebarVariant('surface')
                      theme.onAppearanceChange('light')
                    }}
                  >
                    Reset
                  </Button>
                </Flex>
                <Box>
                  <Text size="md" weight="medium" className="mb-2 block">
                    Provider Snapshot
                  </Text>
                  <ScrollArea size="xs" thickness="thin" surfaceColor="neutral" className="max-h-96 rounded-md border">
                    <pre className="p-4 text-xs font-mono whitespace-pre-wrap">{exportSnapshot}</pre>
                  </ScrollArea>
                </Box>
              </Flex>
            </Tabs.Content>
          </Sheet.Body>
        </Tabs.Root>
      </Sheet.Content>
    </Sheet.Root>
  )
}

ThemePanel.displayName = 'ThemePanel'
