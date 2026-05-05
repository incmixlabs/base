import type { JsonSchemaNode } from '@incmix/core'
import { compositeGlyphs } from '../glyphs'
import { swotCompositeSampleData } from './sample-data'

const swotBulletOptions = Object.keys(compositeGlyphs)

export const swotCompositeJsx = `
export default function SwotTemplate({ data, props }) {
  const bulletGlyph = resolveCompositeGlyph(props?.bullet)

  return (
    <Card.Root
      size="xs"
      color="light"
      maxWidth="760px"
    >
      <Container
        aria-hidden="true"
        inset="0"
        className="opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,var(--slate-5)_1px,transparent_0)] [background-size:28px_28px]"
      />
      <Container position="relative" px="6" pt="4" pb="5">
        <Flex direction="column" gap="4">
          <Flex align="end" justify="between" gap="4">
            <Flex direction="column" gap="1">
              <Flex align="center" gap="2">
                <Icon icon={data.icon} size="lg" color="neutral" aria-hidden="true" />
                <Text size="lg" weight="bold" className="tracking-[0.16em]">
                  {data.title}
                </Text>
              </Flex>
              <Text as="p" size="xs" color="neutral" variant="muted">
                {data.subtitle}
              </Text>
            </Flex>
            <Box px="3" py="1" color="info" variant="soft">
              <Text size="xs" weight="bold" className="text-inherit">
                {data.label}
              </Text>
            </Box>
          </Flex>

          <Grid
            columns={String(Math.min(data.groups.length, 12))}
          >
            {data.groups.map((group, groupIndex) => (
              <Flex
                key={[group.letter, group.title, groupIndex].join('-')}
                direction="column"
                height="100%"
                width="100%"
                className={groupIndex < data.groups.length - 1 ? 'min-w-0 -mr-px' : 'min-w-0'}
              >
                <Box
                  px="4"
                  py="2"
                  height="6rem"
                  flexShrink="0"
                  radius="none"
                  color={group.color}
                  variant="solid"
                  text="contrast"
                >
                  <Flex align="center" justify="center" direction="column" gap="1">
                    <Text as="div" align="center" size="4x" weight="bold" trim="both" className="text-inherit">
                      {group.letter}
                    </Text>
                    <Icon icon={group.icon} size="sm" color="inherit" aria-hidden="true" />
                  </Flex>
                  <Text
                    as="div"
                    align="center"
                    mt="1"
                    size="xs"
                    weight="bold"
                    className="text-inherit uppercase tracking-[0.18em] opacity-90"
                  >
                    {group.title}
                  </Text>
                </Box>
                <Box
                  minHeight="8.75rem"
                  flexGrow="1"
                  radius="none"
                  color={group.color}
                  variant="soft"
                  className="px-3 py-1"
                >
                  <Flex direction="column" gap="3">
                    {group.items.map((item, itemIndex) => (
                      <Flex key={itemIndex} align="baseline" gap="3">
                        <Text as="span" size="xl" className="leading-5 text-inherit" aria-hidden="true">
                          {bulletGlyph}
                        </Text>
                        <Text size="xs" className="leading-5 text-inherit">
                          {item}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Grid>
        </Flex>
      </Container>
    </Card.Root>
  )
}
`

export const swotCompositeSampleProps = {
  bullet: 'dot',
}

export const swotCompositePropsSchema = {
  title: 'swot composite props',
  type: 'object',
  properties: {
    bullet: {
      type: 'string',
      enum: swotBulletOptions,
      default: 'dot',
      description: 'Named glyph used before each SWOT item.',
    },
  },
  additionalProperties: false,
} satisfies JsonSchemaNode

export const swotCompositeDefinition = {
  name: 'swot',
  sampleData: swotCompositeSampleData,
  sampleProps: swotCompositeSampleProps,
  propsSchema: swotCompositePropsSchema,
  jsx: swotCompositeJsx,
}
