import { zodResolver } from '@hookform/resolvers/zod'
import { Info, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { CodeBlock, dracula } from 'react-code-blocks'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/axios'
import { ScrapingWebsiteProps } from '@/utils/interfaces/scraping-website.interface'

const scrapingWebsiteFormData = z.object({
  url: z.string().url('Informe uma URL válida https://exemplo.com'),
})

type ScrapingWebsiteFormData = z.infer<typeof scrapingWebsiteFormData>

interface ScrapingSelect {
  data: {
    text?: string
    baseUrl?: string
    src?: string
    alt?: string
  }[]
  page: string
  context: string
}

export function ScrapingWebsite() {
  const { toast } = useToast()
  const [resultScraping, setResultScraping] =
    useState<ScrapingWebsiteProps | null>(null)

  const [scrapingSelect, setScrapingSelect] = useState<ScrapingSelect | null>(
    null,
  )

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ScrapingWebsiteFormData>({
    resolver: zodResolver(scrapingWebsiteFormData),
  })

  async function handleExecuteScrapingWebsite(
    formData: ScrapingWebsiteFormData,
  ) {
    try {
      const { data } = await api.get('/scraping/website', {
        params: {
          website: formData.url,
        },
      })

      localStorage.setItem('orderedTexts', JSON.stringify(data.orderedTexts))
      localStorage.setItem('links', JSON.stringify(data.links))

      setResultScraping(data)

      reset({
        url: '',
      })

      toast({
        title: 'Coleta de dados realizada com sucesso!',
        description: 'Visualize o resultado abaixo',
      })
    } catch (err) {
      console.log(err)
      toast({
        variant: 'destructive',
        title: 'OOPS! parece que ocorreu um error',
        description:
          'A URL informada pode não ser válida para a coleta de dados.',
      })
    }
  }

  return (
    <>
      <Helmet title="Coleta de dados em website" />

      <Dialog>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Coleta de dados em website
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            Nesse caso você pode fornecer apenas uma URL principal do website
            que deseja capturar os dados.
          </p>
        </div>

        <div className="mt-5">
          <form onSubmit={handleSubmit(handleExecuteScrapingWebsite)}>
            <div className="space-y-2">
              <Label htmlFor="website_url">URL do website</Label>
              <Input
                {...register('url')}
                disabled={isSubmitting}
                placeholder="Digite a url do website https://exemplo.com"
              />

              {errors.url && (
                <span className="mt-2 block text-sm text-red-600 dark:text-red-500">
                  {errors.url.message}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                <Checkbox checked={true} disabled className="mt-1" />
                <span className="max-w-md text-sm text-muted-foreground">
                  Ao clicar em `Coletar dados` você concorda em utilizar os
                  dados coletados com responsabilidade
                </span>
              </div>

              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Coletar dados
              </Button>
            </div>

            <div className="my-4 flex items-center justify-center rounded-md bg-amber-300 px-4 py-2">
              <Info className="mr-2 h-4 w-4 text-zinc-700" />
              <p className="text-sm text-zinc-700 dark:font-medium">
                Alguns sites podem demonstrar uma demora maior para ser
                realizado o scraping, aguarde o necessário para finalizar o
                processo.
              </p>
            </div>
          </form>

          <div className="mt-5 block min-h-12 rounded-md bg-muted-foreground p-2">
            <CodeBlock
              showLineNumbers
              language="json"
              theme={dracula}
              text={`curl --request GET \n --url 'http://localhost:3001/v1/scraping/website?website=https%3A%2F%2Fexample.com' \n --header 'User-Agent: insomnia/8.6.1'`}
            />
          </div>

          <Separator orientation="horizontal" className="my-5" />

          {resultScraping ? (
            <div className="mt-6">
              <div className="flex flex-col items-start justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Resultado da coleta ({Math.ceil(resultScraping.duration)}{' '}
                    segundos)
                  </h1>

                  <p className="mt-2 max-w-md text-muted-foreground">
                    Sua coleta de dados foi finalizada com sucesso, clique nos
                    tópicos abaixo para visualizar as informações.
                  </p>
                </div>

                <div className="flex w-full items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex-1"
                    onClick={() => {
                      setResultScraping(null)
                      setScrapingSelect(null)
                      localStorage.removeItem('orderedTexts')
                      localStorage.removeItem('links')
                    }}
                  >
                    Limpar consulta
                  </Button>

                  <Link
                    to="/editor"
                    className="inline-flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Ir para o editor de texto
                  </Link>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {resultScraping.result.map((item, i) => {
                  return (
                    <div key={i}>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            <span className="max-w-[50%] truncate">
                              {item.page}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <span>
                              Página: <strong>{item.page}</strong>
                            </span>
                            <h2 className="text-md">Informações coletadas:</h2>

                            <div className="mt-5 flex flex-wrap gap-4">
                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    setScrapingSelect({
                                      data: item.result.titles.data,
                                      context: 'Títulos',
                                      page: item.page,
                                    })
                                  }
                                >
                                  {item.result.titles.count} Títulos
                                </Button>
                              </DialogTrigger>

                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    setScrapingSelect({
                                      data: item.result.paragraphs.data,
                                      context: 'Parágrafos',
                                      page: item.page,
                                    })
                                  }
                                >
                                  {item.result.paragraphs.count} Parágrafos
                                </Button>
                              </DialogTrigger>

                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    setScrapingSelect({
                                      data: item.result.buttons.data,
                                      context: 'Botões',
                                      page: item.page,
                                    })
                                  }
                                >
                                  {item.result.buttons.count} Botões
                                </Button>
                              </DialogTrigger>

                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    setScrapingSelect({
                                      data: item.result.images.data,
                                      context: 'Imagens',
                                      page: item.page,
                                    })
                                  }
                                >
                                  {item.result.images.count} Imagens
                                </Button>
                              </DialogTrigger>

                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    setScrapingSelect({
                                      data: item.result.lists.data,
                                      context: 'Listagens',
                                      page: item.page,
                                    })
                                  }
                                >
                                  {item.result.lists.count} Listas
                                </Button>
                              </DialogTrigger>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mt-8 flex justify-center">
              <img
                className="w-72"
                src="/website.svg"
                alt="Imagem do scraping de website"
              />
            </div>
          )}
        </div>

        {scrapingSelect && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Informações dos {scrapingSelect.context}
              </DialogTitle>
              <DialogDescription>
                {scrapingSelect.context} capturados por meio do motor de
                scraping na URL:
                {scrapingSelect.page}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-96 w-full">
              {scrapingSelect.data.map((item, i) => {
                if (item.text) {
                  return (
                    <div key={i}>
                      <span className="my-2 flex w-full rounded-md bg-muted px-2 py-1">
                        {item.text}
                      </span>
                    </div>
                  )
                } else {
                  return (
                    <div key={i}>
                      <span className="my-2 flex w-full rounded-md bg-muted px-2 py-1">
                        {item.baseUrl}
                        {item.src}
                      </span>
                    </div>
                  )
                }
              })}
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
