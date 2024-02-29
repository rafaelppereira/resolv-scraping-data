import { Github } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { useTheme } from '../theme/theme-provider'
import { ThemeToggle } from '../theme/theme-toggle'
import { Separator } from '../ui/separator'
import { CommandMenu } from './command-menu'

export function Header() {
  const { theme } = useTheme()
  const { pathname } = useLocation()

  return (
    <header className="fixed left-0 top-0 z-10 w-full border-b bg-primary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <div className="flex items-center space-x-6">
          <img
            src="/logo.png"
            alt="Logo Resolv"
            className={`h-7 object-contain ${theme === 'dark' && 'grayscale invert'}`}
          />

          <Separator orientation="vertical" className="h-6" />

          <nav className="hidden items-center space-x-4 lg:flex lg:space-x-6">
            <Link
              to="/"
              data-current={pathname === '/'}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground"
            >
              Início
            </Link>
            <Link
              data-current={['/coleta-de-dados/website', '/editor'].includes(
                pathname,
              )}
              to="/coleta-de-dados/website"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground"
            >
              Website
            </Link>
            <Link
              data-current={[
                '/coleta-de-dados/arquivos',
                '/editor/arquivos',
              ].includes(pathname)}
              to="/coleta-de-dados/arquivos"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground"
            >
              Arquivos
            </Link>
            <Link
              to="/coleta-de-dados/imagens"
              data-current={[
                '/coleta-de-dados/imagens',
                '/editor/imagens',
              ].includes(pathname)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground"
            >
              Imagens
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <CommandMenu />
          <ThemeToggle />

          <Link
            to="https://github.com/rafaelppereira/scraping-data-resolv"
            target="_blank"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
