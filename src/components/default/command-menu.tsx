'use client'

import { File, Image as ImageIcon, Plus } from 'lucide-react'
import * as React from 'react'
import { Link } from 'react-router-dom'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Pesquisar{' '}
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Escreva o comando para buscar..." />
        <CommandList>
          <CommandEmpty>Sem resultados encontrados.</CommandEmpty>

          <CommandGroup heading="Atalhos">
            <Link to="/coleta-de-dados/website">
              <CommandItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>Coleta de dados em website</span>
              </CommandItem>
            </Link>

            <Link to="/coleta-de-dados/arquivos">
              <CommandItem>
                <File className="mr-2 h-4 w-4" />
                <span>Coleta de dados em arquivos</span>
              </CommandItem>
            </Link>

            <CommandItem>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Coleta de dados em imagens</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
