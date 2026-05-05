import '../styles/globals.css'
import { AdminThemeProvider } from '@incmix/ui/theme'
import { Heading } from '@incmix/ui/typography/heading/Heading'
import { Text } from '@incmix/ui/typography/text/Text'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import {
  docsAppearanceBootstrapScript,
  docsAppearanceCookie,
  docsThemeConfigStorage,
  docsThemePreferencesStorage,
  docsThemeVarsTokensStorage,
} from './-theme'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: RootNotFound,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Autoform UI Docs' },
    ],
  }),
})

function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md space-y-3 text-center">
        <Heading as="h1" size="2x">
          Page Not Found
        </Heading>
        <Text size="md" className="text-muted-foreground">
          This docs route does not exist. Check the URL or go back to{' '}
          <a href="/docs" className="underline underline-offset-2">
            /docs
          </a>
          .
        </Text>
      </div>
    </div>
  )
}

function RootLayout() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: docsAppearanceBootstrapScript }} />
        <HeadContent />
      </head>
      <body>
        <AdminThemeProvider
          appearanceCookie={docsAppearanceCookie}
          configStorage={docsThemeConfigStorage}
          preferencesStorage={docsThemePreferencesStorage}
          varsTokensStorage={docsThemeVarsTokensStorage}
        >
          <Outlet />
        </AdminThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
