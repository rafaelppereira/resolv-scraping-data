/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, Upload } from 'lucide-react'
import { useCallback, useState } from 'react'
import { CodeBlock, dracula } from 'react-code-blocks'
import { useDropzone } from 'react-dropzone'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/axios'
import { ScrapingFilesProps } from '@/utils/interfaces/scraping-files.interface'

export function ScrapingFiles() {
  const { toast } = useToast()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resultScraping, setResultScraping] =
    useState<ScrapingFilesProps | null>(null)

  const onDrop = useCallback((acceptedFiles: any[]) => {
    const file = acceptedFiles[0]
    setUploadedFile(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const files: any = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  async function handleScrapingFile() {
    try {
      if (!uploadedFile) return

      setIsLoading(true)
      const formData = new FormData()
      formData.append('pdfFile', uploadedFile)

      const { data } = await api.post('/scraping/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      localStorage.setItem('scrapingFile', JSON.stringify(data))
      setResultScraping(data)

      toast({
        title: 'Coleta de dados realizada com sucesso!',
        description: 'Visualize o resultado abaixo',
      })

      setIsLoading(false)
    } catch (err) {
      console.log(err)
      toast({
        variant: 'destructive',
        title: 'OOPS! parece que ocorreu um error',
      })
    }
  }

  return (
    <>
      <Helmet title="Coleta de dados em arquivos" />

      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Coleta de dados em arquivos
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Nesse caso você pode fornecer arquivos para que o motor colete as
          informações necessárias.
        </p>
      </div>

      <div className="mt-5">
        <div>
          <div className="space-x-2">
            <Badge>CSV</Badge>
            <Badge>XLSX</Badge>
            <Badge>PDF</Badge>
          </div>

          <div>
            <div
              {...getRootProps({ className: 'dropzone' })}
              className={`${
                isDragActive ? 'border-primary' : 'border'
              } mt-3 flex cursor-pointer flex-col items-center rounded-md border-2 border-dashed px-3 py-5 text-muted-foreground`}
            >
              <input {...getInputProps()} disabled={isLoading} />
              <Upload size={25} />

              {isDragActive ? (
                <p className="mt-2 text-center">
                  Solte o arquivo para salvar <br /> e importar os contatos
                </p>
              ) : (
                <p className="mt-2 text-center">
                  Arraste e solte algum arquivo <br /> aqui ou clique para
                  selecionar o arquivo
                </p>
              )}
            </div>
            <aside>
              <ul className="mt-2 text-sm text-muted-foreground">{files}</ul>
            </aside>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-2">
            <Checkbox checked={true} disabled className="mt-1" />
            <span className="max-w-md text-sm text-muted-foreground">
              Ao clicar em `Coletar dados` você concorda em utilizar os dados
              coletados com responsabilidade
            </span>
          </div>

          <Button
            type="button"
            onClick={handleScrapingFile}
            variant="secondary"
            disabled={isLoading || !uploadedFile}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Coletar dados
          </Button>
        </div>

        <div className="mt-5 block min-h-12 rounded-md bg-muted-foreground p-2">
          <CodeBlock
            showLineNumbers
            language="json"
            theme={dracula}
            text={`curl --request POST \n --url http://localhost:3001/v1/scraping/file \n --header 'Content-Type: multipart/form-data' \n --header 'User-Agent: insomnia/8.6.1' \n --form pdfFile=@/Users/rafaelpereira/Downloads/Jul.IA.pdf`}
          />
        </div>

        <Separator orientation="horizontal" className="my-5" />

        {resultScraping ? (
          <>
            <div className="flex justify-end">
              <Link
                to="/editor/arquivos"
                className="mb-5 inline-flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Ir para o editor de texto
              </Link>
            </div>

            <CodeBlock
              showLineNumbers
              language="txt"
              theme={dracula}
              text={String(resultScraping.data)}
            />
          </>
        ) : (
          <div className="mt-8 flex justify-center">
            <img
              className="w-72"
              src="/website.svg"
              alt="Imagem do scraping de arquivo"
            />
          </div>
        )}
      </div>
    </>
  )
}
