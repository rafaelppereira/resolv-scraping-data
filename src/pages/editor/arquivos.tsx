import { FileDown, Loader2, Undo2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/axios'

export function EditorFile() {
  const navigate = useNavigate()
  const [editorText, setEditorText] = useState<string | null>(null)
  const { toast } = useToast()

  const scrapingFile = JSON.parse(String(localStorage.getItem('scrapingFile')))

  const [isLoadingGenerateUniqueDocument, setIsLoadingGenerateUniqueDocument] =
    useState(false)

  function handleChangeEditor(value: string) {
    localStorage.setItem(
      'scrapingFile',
      JSON.stringify({
        data: value,
        extension: scrapingFile.extension,
      }),
    )

    setEditorText(value)
  }

  async function handleGenerateDocumentWithUniqueContent() {
    try {
      setIsLoadingGenerateUniqueDocument(true)

      await api.post('/scraping/file/generate-document', {
        content: scrapingFile.data,
      })

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

  useEffect(() => {
    const scrapingFile = JSON.parse(
      String(localStorage.getItem('scrapingFile')),
    )

    if (!scrapingFile) {
      navigate('/coleta-de-dados/arquivos')
      return
    }

    setEditorText(scrapingFile.data)
  }, [])

  return (
    <>
      <Helmet title="Editor de conteúdo para arquivo" />

      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Editor de conteúdo para arquivo
          </h1>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Sentiu a necessidade de editar algum conteúdo capturado pelo
            scraping? Basta modificar as informações e gerar o seu PDF.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isLoadingGenerateUniqueDocument}
          onClick={() => {
            localStorage.removeItem('scrapingFile')
            navigate('/coleta-de-dados/arquivos')
          }}
        >
          <Undo2 className="mr-2 h-4 w-full lg:w-4" />
          Voltar uma etapa
        </Button>
      </div>

      {editorText ? (
        <>
          <div className="mt-5 space-y-3">
            <div>
              <Textarea
                value={editorText}
                className="min-h-[500px]"
                disabled={isLoadingGenerateUniqueDocument}
                onChange={(e) => handleChangeEditor(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button
              size="sm"
              type="button"
              variant="secondary"
              disabled={isLoadingGenerateUniqueDocument}
              onClick={handleGenerateDocumentWithUniqueContent}
            >
              {isLoadingGenerateUniqueDocument ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              Baixar documento
            </Button>
          </div>
        </>
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
