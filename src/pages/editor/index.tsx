import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { FileDown, Loader2, Undo2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/axios'

const editorFormData = z.object({
  url: z
    .string({ required_error: 'Por favor selecione uma opção' })
    .nonempty({ message: 'Por favor selecione uma opção' }),
})

type EditorFormData = z.infer<typeof editorFormData>

export function Editor() {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EditorFormData>({
    resolver: zodResolver(editorFormData),
  })

  const navigate = useNavigate()
  const { toast } = useToast()

  const orderedTexts =
    JSON.parse(String(localStorage.getItem('orderedTexts'))) ?? ''
  const links: string[] = localStorage.getItem('links')
    ? JSON.parse(String(localStorage.getItem('links')))
    : []

  const [editorText, setEditorText] = useState<string | null>(null)
  const [isLoadingGenerateUniqueDocument, setIsLoadingGenerateUniqueDocument] =
    useState(false)

  const [isLoadingGenerateAllDocument, setIsLoadingGenerateAllDocument] =
    useState(false)

  async function handleFilterOrderedTextsWithPage(data: EditorFormData) {
    const findUniquePage = orderedTexts.find(
      (item: { page: string }) => item.page === data.url,
    )

    setEditorText(findUniquePage.result)
  }

  function handleChangeEditor(value: string) {
    const currentPage = getValues('url')

    const findUniquePage = orderedTexts.find(
      (item: { page: string }) => item.page === currentPage,
    )

    const findUniquePageIndex = orderedTexts.findIndex(
      (item: { page: string }) => item.page === currentPage,
    )

    findUniquePage.result = value
    orderedTexts.splice(findUniquePageIndex, 1, findUniquePage)

    localStorage.setItem('orderedTexts', JSON.stringify(orderedTexts))
    setEditorText(findUniquePage.result)
  }

  async function handleGenerateDocumentWithUniqueContent() {
    try {
      setIsLoadingGenerateUniqueDocument(true)
      const currentPage = getValues('url')
      const orderedTextsUpdated = JSON.parse(
        String(localStorage.getItem('orderedTexts')),
      )
      const findUniquePage = orderedTextsUpdated.find(
        (item: { page: string }) => item.page === currentPage,
      )

      const response = await api.post(
        '/scraping/website/generate-document',
        {
          page: currentPage,
          content: findUniquePage.result,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const currentDate = new Date()
      const formatDate = format(currentDate, 'dd-MM-yyyy-HH-mm-ss')
      const link = document.createElement('a')
      link.href = `data:application/pdf;base64,${response.data}`
      link.download = `${formatDate}-website.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsLoadingGenerateUniqueDocument(false)
      toast({
        title: 'Documento gerado com sucesso!',
      })
    } catch (err) {
      setIsLoadingGenerateUniqueDocument(false)
      toast({
        variant: 'destructive',
        title: 'OOPS! parece que ocorreu um error',
        description: 'Tente novamente mais tarde...',
      })
    }
  }

  async function handleGenerateDocumentWithAllDocumentsAndContent() {
    try {
      setIsLoadingGenerateAllDocument(true)
      const orderedTextsUpdated = JSON.parse(
        String(localStorage.getItem('orderedTexts')),
      )

      const response = await api.post(
        '/scraping/website/generate-all-document',
        {
          content: orderedTextsUpdated,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const currentDate = new Date()
      const formatDate = format(currentDate, 'dd-MM-yyyy-HH-mm-ss')
      const link = document.createElement('a')
      link.href = `data:application/pdf;base64,${response.data}`
      link.download = `${formatDate}-website.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsLoadingGenerateAllDocument(false)

      toast({
        title: 'Documento gerado com sucesso!',
      })
    } catch (err) {
      setIsLoadingGenerateAllDocument(false)
      toast({
        variant: 'destructive',
        title: 'OOPS! parece que ocorreu um error',
        description: 'Tente novamente mais tarde...',
      })
    }
  }

  useEffect(() => {
    if (orderedTexts === '') {
      navigate('/coleta-de-dados/website')
    }

    if (links.length <= 0) {
      navigate('/coleta-de-dados/website')
    }
  }, [])

  return (
    <>
      <Helmet title="Editor de conteúdo" />

      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Editor de conteúdo
          </h1>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Sentiu a necessidade de editar algum conteúdo capturado pelo
            scraping? Basta modificar as informações e gerar seu PDF.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            localStorage.removeItem('orderedTexts')
            localStorage.removeItem('links')
            navigate('/coleta-de-dados/website')
          }}
          disabled={
            isLoadingGenerateUniqueDocument || isLoadingGenerateAllDocument
          }
        >
          <Undo2 className="mr-2 h-4 w-full lg:w-4" />
          Voltar uma etapa
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(handleFilterOrderedTextsWithPage)}
        className="mt-5 flex items-start gap-3"
      >
        <div className="w-full">
          <Controller
            control={control}
            name="url"
            render={({ field }) => (
              <Select
                disabled={
                  isLoadingGenerateUniqueDocument ||
                  isLoadingGenerateAllDocument
                }
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma rota do site" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {links &&
                      links.map((link) => {
                        return (
                          <SelectItem key={link} value={link}>
                            {link}
                          </SelectItem>
                        )
                      })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {errors.url && (
            <span className="mt-2 block text-sm text-red-600 dark:text-red-500">
              {errors.url.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            isLoadingGenerateUniqueDocument || isLoadingGenerateAllDocument
          }
        >
          Selecionar
        </Button>
      </form>

      <div className="mt-3 flex items-center justify-end gap-3">
        {links.length > 1 && (
          <Button
            size="sm"
            type="button"
            variant="outline"
            disabled={
              isLoadingGenerateUniqueDocument || isLoadingGenerateAllDocument
            }
            onClick={handleGenerateDocumentWithAllDocumentsAndContent}
          >
            {isLoadingGenerateAllDocument ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Baixar documento de todas as páginas
          </Button>
        )}

        {editorText && (
          <Button
            size="sm"
            type="button"
            variant="secondary"
            disabled={
              isLoadingGenerateUniqueDocument || isLoadingGenerateAllDocument
            }
            onClick={handleGenerateDocumentWithUniqueContent}
          >
            {isLoadingGenerateUniqueDocument ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Baixar documento desta página
          </Button>
        )}
      </div>

      {editorText ? (
        <div className="mt-5 space-y-3">
          <div>
            <Textarea
              value={editorText}
              className="min-h-[500px]"
              disabled={
                isLoadingGenerateUniqueDocument || isLoadingGenerateAllDocument
              }
              onChange={(e) => handleChangeEditor(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mt-10 flex justify-center">
          <img
            className="w-72"
            src="/website.svg"
            alt="Imagem do scraping de website"
          />
        </div>
      )}
    </>
  )
}
