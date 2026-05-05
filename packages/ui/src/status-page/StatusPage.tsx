'use client'

import type * as React from 'react'
import { Button } from '@/elements/button/Button'
import { Box } from '@/layouts/box/Box'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Heading } from '@/typography/heading/Heading'
import { Text } from '@/typography/text/Text'

export interface StatusPageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export function StatusPage({ title, description, action, className, children, ...props }: StatusPageProps) {
  return (
    <Box className={cn('min-h-screen bg-background text-foreground', className)} {...props}>
      <Flex direction="column" align="center" justify="center" gap="4" className="min-h-screen px-6 text-center">
        <Heading as="h1" size="lg">
          {title}
        </Heading>
        {description ? (
          <Text size="sm" color="slate">
            {description}
          </Text>
        ) : null}
        {action}
        {children}
      </Flex>
    </Box>
  )
}

export function StatusPageAction(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} />
}
