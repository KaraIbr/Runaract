import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { type ReactNode } from 'react'

import appCss from '../styles.css?url'

const COPY = {
  notFound: {
    code: '404',
    title: 'Page not found',
    description:
      "The page you're looking for doesn't exist or has been moved.",
    action: 'Go home',
  },
  error: {
    title: "This page didn't load",
    description:
      'Something went wrong on our end. You can try refreshing or head back home.',
    retry: 'Try again',
    home: 'Go home',
  },
}

const buttonPrimary =
  'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'

const buttonSecondary =
  'inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent'

type StateLayoutProps = {
  title: string
  description: string
  children?: ReactNode
  code?: string
}

function StateLayout({
  code,
  title,
  description,
  children,
}: StateLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        {code && (
          <h1 className="text-7xl font-bold text-foreground">{code}</h1>
        )}

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {title}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>

        {children}
      </div>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <StateLayout
      code={COPY.notFound.code}
      title={COPY.notFound.title}
      description={COPY.notFound.description}
    >
      <div className="mt-6">
        <Link to="/" className={buttonPrimary}>
          {COPY.notFound.action}
        </Link>
      </div>
    </StateLayout>
  )
}

function ErrorComponent({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  console.error(error)

  const router = useRouter()

  const handleRetry = () => {
    router.invalidate()
    reset()
  }

  return (
    <StateLayout
      title={COPY.error.title}
      description={COPY.error.description}
    >
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button onClick={handleRetry} className={buttonPrimary}>
          {COPY.error.retry}
        </button>

        <Link to="/" className={buttonSecondary}>
          {COPY.error.home}
        </Link>
      </div>
    </StateLayout>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Runnaract 2.0 — Runnaract 2.0.' },
      {
        name: 'description',
        content:
          'Runnaract 2.0 powered by Zitara Golf Club· 06.09.2026 en Zitara Golf Club. 3K · 5K · 10K.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
})

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}