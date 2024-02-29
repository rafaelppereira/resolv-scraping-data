import { Github } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function Home() {
  return (
    <>
      <Helmet title="Home" />

      <div>
        <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center ">
          <div className="w-full">
            <h1 className="text-3xl font-semibold tracking-tight">
              Scraping de dados
            </h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              Este projeto foi concebido com o propósito de proporcionar uma
              maneira de obter dados de websites, arquivos e imagens.
            </p>
          </div>

          <div className="flex w-full flex-col items-start gap-1 lg:items-end">
            <Link
              to="https://github.com/rafaelppereira/scraping-data-resolv"
              target="_blank"
              className="mt-2  flex h-10 items-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <Github className="mr-2 h-4 w-4" />
              Repositório do projeto
            </Link>

            <span className="mt-1 block text-sm text-muted-foreground">
              By{' '}
              <Link
                to="https://github.com/rafaelppereira"
                target="_blank"
                className="underline underline-offset-2 transition-all hover:brightness-90"
              >
                Rafael Pereira
              </Link>
            </span>
          </div>
        </div>

        <Separator orientation="horizontal" className="mt-6" />

        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Scraping em website</CardTitle>
              <CardDescription>
                Realize a coleta de dados em um website fornecendo apenas a URL
                base, e nosso mecanismo irá mapear todas as páginas.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Link
                to="/coleta-de-dados/website"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Acessar
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scraping em arquivos</CardTitle>
              <CardDescription>
                Forneça um arquivo CSV, PDF ou XLSX que nosso motor irá analisar
                e extrair os resultados mais relevantes para você.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Link
                to="/coleta-de-dados/arquivos"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Acessar
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scraping em imagens</CardTitle>
              <CardDescription>
                Alimente nossa inteligência com uma imagem e retornaremos as
                informações mais relevantes para você.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Link
                to="/coleta-de-dados/imagens"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Acessar
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
