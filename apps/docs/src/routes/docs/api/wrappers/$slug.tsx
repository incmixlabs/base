import { LiveCodeBlock, ThemesPropsTable } from '@incmix/ui/editor/docs'
import {
  AccordionSchemaWrapper,
  Badge,
  Button,
  CalloutWrapper,
  CardWrapper,
  DialogWrapper,
  MenuWrapper,
  PopoverWrapper,
  TabsWrapper,
  TooltipWrapper,
} from '@incmix/ui/elements'
import { CheckboxGroupWrapper, RadioGroupWrapper, SwitchGroupWrapper } from '@incmix/ui/form'
import { CommandWrapper, SidebarWrapper } from '@incmix/ui/layouts'
import { TableWrapper } from '@incmix/ui/table'
import { LinkWrapper } from '@incmix/ui/typography'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { createFileRoute } from '@tanstack/react-router'
import { FileText, Home, Inbox } from 'lucide-react'
import { wrapperDocsBySlug } from './-docs'

export const Route = createFileRoute('/docs/api/wrappers/$slug')({
  component: WrapperDocsPage,
})

const wrapperScope = {
  AccordionSchemaWrapper,
  Badge,
  Button,
  CalloutWrapper,
  CardWrapper,
  CheckboxGroupWrapper,
  CommandWrapper,
  DialogWrapper,
  FileText,
  Home,
  Inbox,
  LinkWrapper,
  MenuWrapper,
  PopoverWrapper,
  RadioGroupWrapper,
  SidebarWrapper,
  SwitchGroupWrapper,
  TableWrapper,
  TabsWrapper,
  TooltipWrapper,
}

function isWrapperSlug(value: string): value is keyof typeof wrapperDocsBySlug {
  return value in wrapperDocsBySlug
}

function WrapperDocsPage() {
  const { slug } = Route.useParams()
  const entry = isWrapperSlug(slug) ? wrapperDocsBySlug[slug] : undefined

  if (!entry) {
    return (
      <div className="space-y-3">
        <Heading as="h1" size="2x">
          Wrapper Not Found
        </Heading>
        <Text size="md" className="text-muted-foreground">
          No wrapper docs entry exists for <code>{slug}</code>.
        </Text>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="2x">
          {entry.title}
        </Heading>
        <Text size="sm" className="mt-2 text-muted-foreground">
          {entry.description}
        </Text>
      </div>

      <section>
        <Heading as="h2" size="lg" id="overview" data-heading>
          Overview
        </Heading>
        <div className="mt-2 space-y-2">
          {entry.overview.map((paragraph, index) => (
            <Text key={index} size="sm" className="text-muted-foreground">
              {paragraph}
            </Text>
          ))}
        </div>
      </section>

      <section>
        <Heading as="h2" size="lg" id="basic-usage" data-heading>
          Basic Usage
        </Heading>
        <LiveCodeBlock initialCode={entry.basicUsageCode} scope={wrapperScope} />
      </section>

      <section>
        <Heading as="h2" size="lg" id="props" data-heading>
          Props
        </Heading>
        <ThemesPropsTable defs={entry.propDefs} />
      </section>
    </div>
  )
}
