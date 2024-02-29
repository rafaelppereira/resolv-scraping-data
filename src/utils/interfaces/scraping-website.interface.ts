interface MetaProps {
  name?: string
  content?: string
}

interface DataProps {
  text: string
}

interface ImageProps {
  baseUrl: string
  src: string
  alt: string
}

interface ResultProps {
  page: string
  result: {
    titles: {
      data: DataProps[]
      count: number
    }
    paragraphs: {
      data: DataProps[]
      count: number
    }
    buttons: {
      data: DataProps[]
      count: number
    }
    images: {
      data: ImageProps[]
      count: number
    }
    lists: {
      data: DataProps[]
      count: number
    }
  }
}

export interface ScrapingWebsiteProps {
  metadata: {
    title: string
    website_url: string
    metas: {
      data: MetaProps[]
      count: number
    }
  }
  result: ResultProps[]
  duration: number
  orderedTexts: string
}
