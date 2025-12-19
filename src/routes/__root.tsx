import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import { authMiddleware } from '@/server/functions/auth'
import { LanguageProvider } from '@/contexts/language-context'
import TeamProvider from '@/contexts/team-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

const scripts: React.DetailedHTMLProps<
  React.ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
>[] = []

if (import.meta.env.VITE_INSTRUMENTATION_SCRIPT_SRC) {
  scripts.push({
    src: import.meta.env.VITE_INSTRUMENTATION_SCRIPT_SRC,
    type: 'module',
  })
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async () => {
    const { currentUser } = await authMiddleware()

    return {
      currentUser,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
      },
      {
        title: 'DentaStock - نظام إدارة مخزون معامل الأسنان',
      },
      {
        name: 'description',
        content:
          'نظام إدارة مخزون معامل الأسنان - Dental Lab Inventory Management System',
      },
      // Theme and colors
      {
        name: 'theme-color',
        content: '#0d9488',
      },
      {
        name: 'msapplication-TileColor',
        content: '#0d9488',
      },
      {
        name: 'msapplication-navbutton-color',
        content: '#0d9488',
      },
      // Apple PWA meta tags
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'DentaStock',
      },
      // Android/Chrome PWA meta tags
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
      // Disable automatic detection
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
      // App info
      {
        name: 'application-name',
        content: 'DentaStock',
      },
      // Robots
      {
        name: 'robots',
        content: 'index, follow',
      },
      // Language
      {
        httpEquiv: 'content-language',
        content: 'ar',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      // Apple touch icons
      {
        rel: 'apple-touch-icon',
        href: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: '/favicon/web-app-manifest-192x192.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '512x512',
        href: '/favicon/web-app-manifest-512x512.png',
      },
      // Favicon
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/favicon/favicon-96x96.png',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon/favicon.ico',
      },
      // Fonts
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
      },
    ],
    scripts: [...scripts],
  }),

  component: RootComponent,
  shellComponent: RootDocument,
})

import AppSplash from '@/components/layout/app-splash'

function RootComponent() {
  return (
    <LanguageProvider>
      <TeamProvider>
        <AppSplash />
        <Outlet />
      </TeamProvider>
    </LanguageProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
