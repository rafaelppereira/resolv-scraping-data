import '@/styles/globals.css'

import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

import { ThemeProvider } from './components/theme/theme-provider'
import { Toaster } from './components/ui/toaster'
import { router } from './router'

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="scraping-resolv" defaultTheme="light">
        <Helmet titleTemplate="%s | Scraping Resolv" />
        <RouterProvider router={router} />

        <Toaster />
      </ThemeProvider>
    </HelmetProvider>
  )
}
