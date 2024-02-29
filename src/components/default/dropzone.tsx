import { Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export function Dropzone() {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const files: any = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  return (
    <div>
      <div
        {...getRootProps({ className: 'dropzone' })}
        className={`${
          isDragActive ? 'border-primary' : 'border'
        } mt-3 flex cursor-pointer flex-col items-center rounded-md border-2 border-dashed px-3 py-5 text-muted-foreground`}
      >
        <input {...getInputProps()} />
        <Upload size={25} />

        {isDragActive ? (
          <p className="mt-2 text-center">
            Solte o arquivo para salvar <br /> e importar os contatos
          </p>
        ) : (
          <p className="mt-2 text-center">
            Arraste e solte algum arquivo <br /> aqui ou clique para selecionar
            o arquivo
          </p>
        )}
      </div>
      <aside>
        <ul className="mt-2 text-sm text-muted-foreground">{files}</ul>
      </aside>
    </div>
  )
}
