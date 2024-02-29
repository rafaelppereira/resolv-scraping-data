import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/_layouts/app.layout'
import { Home } from '@/pages'
import { ScrapingFiles } from '@/pages/coleta-de-dados/arquivos'
import { ScrapingImages } from '@/pages/coleta-de-dados/imagens'
import { ScrapingWebsite } from '@/pages/coleta-de-dados/website'
import { Editor } from '@/pages/editor'
import { EditorFile } from '@/pages/editor/arquivos'
import { EditorImage } from '@/pages/editor/imagens'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/coleta-de-dados/website',
        element: <ScrapingWebsite />,
      },
      {
        path: '/coleta-de-dados/imagens',
        element: <ScrapingImages />,
      },
      {
        path: '/coleta-de-dados/arquivos',
        element: <ScrapingFiles />,
      },
      {
        path: '/editor',
        element: <Editor />,
      },
      {
        path: '/editor/arquivos',
        element: <EditorFile />,
      },
      {
        path: '/editor/imagens',
        element: <EditorImage />,
      },
    ],
  },
])
