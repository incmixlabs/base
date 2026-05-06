import type { Meta, StoryObj } from '@storybook/react-vite'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Box } from '../box/Box'
import { Grid } from './Grid'
import { gridPropDefs } from './grid.props'

const gridColumns = getPropDefValues(gridPropDefs.columns)
const gridGaps = getPropDefValues(gridPropDefs.gap)
const gridAlignValues = getPropDefValues(gridPropDefs.align)
const gridJustifyValues = getPropDefValues(gridPropDefs.justify)
const showcasedColumns = gridColumns.filter(columns => ['1', '2', '3', '4', '6', '12'].includes(columns))

const meta: Meta<typeof Grid> = {
  title: 'Layouts/Grid',
  component: Grid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'text',
    },
    rows: {
      control: 'text',
    },
    gap: {
      control: 'select',
      options: gridGaps,
    },
    align: {
      control: 'select',
      options: gridAlignValues,
    },
    justify: {
      control: 'select',
      options: gridJustifyValues,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const DemoBox = ({ children }: { children: React.ReactNode }) => (
  <Box p="4" className="bg-primary text-primary-foreground rounded-md text-center">
    {children}
  </Box>
)

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <Grid columns="3" gap="4" className="w-[400px]">
      <DemoBox>1</DemoBox>
      <DemoBox>2</DemoBox>
      <DemoBox>3</DemoBox>
      <DemoBox>4</DemoBox>
      <DemoBox>5</DemoBox>
      <DemoBox>6</DemoBox>
    </Grid>
  ),
}

// ============================================================================
// Column Examples
// ============================================================================

export const ColumnVariants: Story = {
  render: () => (
    <div className="space-y-6 w-[500px]">
      {showcasedColumns.map(cols => (
        <div key={cols}>
          <p className="text-sm text-muted-foreground mb-2">columns="{cols}"</p>
          <Grid columns={cols} gap="2">
            {Array.from({ length: Math.min(parseInt(cols, 10) * 2, 12) }, (_, i) => (
              <DemoBox key={i}>{i + 1}</DemoBox>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
}

export const NormalizedRuntimeValues: Story = {
  render: () => (
    <Grid columns={' 12 ' as any} gap={' 2rem ' as any} className="w-[520px]">
      {Array.from({ length: 12 }, (_, index) => (
        <DemoBox key={index}>{index + 1}</DemoBox>
      ))}
    </Grid>
  ),
}

export const CustomColumns: Story = {
  render: () => (
    <div className="space-y-6 w-[500px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">columns="1fr 2fr 1fr"</p>
        <Grid columns="1fr 2fr 1fr" gap="4">
          <DemoBox>1fr</DemoBox>
          <DemoBox>2fr</DemoBox>
          <DemoBox>1fr</DemoBox>
        </Grid>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">columns="200px 1fr"</p>
        <Grid columns="200px 1fr" gap="4">
          <DemoBox>200px</DemoBox>
          <DemoBox>1fr</DemoBox>
        </Grid>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">columns="repeat(auto-fit, minmax(100px, 1fr))"</p>
        <Grid columns="repeat(auto-fit, minmax(100px, 1fr))" gap="4">
          <DemoBox>Auto</DemoBox>
          <DemoBox>Fit</DemoBox>
          <DemoBox>Grid</DemoBox>
          <DemoBox>Items</DemoBox>
        </Grid>
      </div>
    </div>
  ),
}

// ============================================================================
// Row Examples
// ============================================================================

export const RowsAndColumns: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">columns="2" rows="3"</p>
        <Grid columns="2" rows="3" gap="4">
          <DemoBox>1</DemoBox>
          <DemoBox>2</DemoBox>
          <DemoBox>3</DemoBox>
          <DemoBox>4</DemoBox>
          <DemoBox>5</DemoBox>
          <DemoBox>6</DemoBox>
        </Grid>
      </div>
    </div>
  ),
}

// ============================================================================
// Gap Examples
// ============================================================================

export const GapVariants: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      {gridGaps
        .filter((_, index) => index % 2 === 1)
        .map(gap => (
          <div key={gap}>
            <p className="text-sm text-muted-foreground mb-2">gap="{gap}"</p>
            <Grid columns="3" gap={gap} className="bg-muted/30 rounded p-2">
              <DemoBox>1</DemoBox>
              <DemoBox>2</DemoBox>
              <DemoBox>3</DemoBox>
            </Grid>
          </div>
        ))}
    </div>
  ),
}

export const DirectionalGap: Story = {
  render: () => (
    <Grid columns="3" gapX="6" gapY="2" className="w-[400px]">
      <DemoBox>1</DemoBox>
      <DemoBox>2</DemoBox>
      <DemoBox>3</DemoBox>
      <DemoBox>4</DemoBox>
      <DemoBox>5</DemoBox>
      <DemoBox>6</DemoBox>
    </Grid>
  ),
}

// ============================================================================
// Alignment Examples
// ============================================================================

export const AlignItems: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      {gridAlignValues
        .filter(align => align !== 'baseline')
        .map(align => (
          <div key={align}>
            <p className="text-sm text-muted-foreground mb-2">align="{align}"</p>
            <Grid columns="3" gap="4" align={align} className="bg-muted/30 rounded p-2 h-32">
              <Box p="2" className="bg-primary text-primary-foreground rounded">
                Short
              </Box>
              <Box p="4" className="bg-primary text-primary-foreground rounded">
                Tall
                <br />
                Item
              </Box>
              <Box p="3" className="bg-primary text-primary-foreground rounded">
                Med
              </Box>
            </Grid>
          </div>
        ))}
    </div>
  ),
}

// ============================================================================
// Flow Examples
// ============================================================================

export const GridFlow: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">flow="row" (default)</p>
        <Grid columns="3" rows="2" gap="2" flow="row" className="bg-muted/30 rounded p-2">
          <DemoBox>1</DemoBox>
          <DemoBox>2</DemoBox>
          <DemoBox>3</DemoBox>
          <DemoBox>4</DemoBox>
        </Grid>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">flow="column"</p>
        <Grid columns="3" rows="2" gap="2" flow="column" className="bg-muted/30 rounded p-2">
          <DemoBox>1</DemoBox>
          <DemoBox>2</DemoBox>
          <DemoBox>3</DemoBox>
          <DemoBox>4</DemoBox>
        </Grid>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">flow="dense"</p>
        <Grid columns="3" gap="2" flow="dense" className="bg-muted/30 rounded p-2">
          <DemoBox>1</DemoBox>
          <Box
            p="4"
            className="bg-primary text-primary-foreground rounded-md text-center"
            style={{ gridColumn: 'span 2' }}
          >
            Span 2
          </Box>
          <DemoBox>3</DemoBox>
          <DemoBox>4</DemoBox>
          <DemoBox>5</DemoBox>
        </Grid>
      </div>
    </div>
  ),
}

// ============================================================================
// Responsive Examples
// ============================================================================

export const ResponsiveColumns: Story = {
  render: () => (
    <Grid columns={{ initial: '1', sm: '2', md: '3', lg: '4' }} gap="4" className="w-full max-w-[600px]">
      <DemoBox>1</DemoBox>
      <DemoBox>2</DemoBox>
      <DemoBox>3</DemoBox>
      <DemoBox>4</DemoBox>
      <DemoBox>5</DemoBox>
      <DemoBox>6</DemoBox>
      <DemoBox>7</DemoBox>
      <DemoBox>8</DemoBox>
    </Grid>
  ),
}

// ============================================================================
// Common Patterns
// ============================================================================

export const CardGrid: Story = {
  render: () => (
    <Grid columns="repeat(auto-fill, minmax(200px, 1fr))" gap="4" className="w-[600px]">
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} p="4" className="bg-card border rounded-lg shadow-sm">
          <div className="h-24 bg-muted rounded mb-3" />
          <h3 className="font-medium">Card {i + 1}</h3>
          <p className="text-sm text-muted-foreground">Description text</p>
        </Box>
      ))}
    </Grid>
  ),
}

export const DashboardLayout: Story = {
  render: () => (
    <Grid columns="250px 1fr" rows="60px 1fr" gap="4" className="w-[800px] h-[400px]">
      <Box
        className="bg-primary text-primary-foreground rounded-lg flex items-center justify-center"
        style={{ gridColumn: 'span 2' }}
      >
        Header
      </Box>
      <Box className="bg-muted rounded-lg flex items-center justify-center">Sidebar</Box>
      <Box className="bg-card border rounded-lg flex items-center justify-center">Main Content</Box>
    </Grid>
  ),
}
