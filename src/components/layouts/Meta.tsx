import Head from 'next/head'
import { FC } from 'react'

const OGP_IMAGE = 'https://app.vess.id/ogp.jpg'
const DEFAULT_PAGEPATH = 'https://app.vess.id/'

interface MetaData {
  pageTitle?: string
  pageDescription?: string
  pagePath?: string
  pageImg?: string
  pageImgWidth?: number
  pageImgHeight?: number
  robots?: string
}

export const Meta: FC<MetaData> = ({
  pageTitle,
  pageDescription,
  pagePath,
  pageImg,
  pageImgWidth,
  pageImgHeight,
  robots = 'index, follow',
}) => {
  const defaultTitle = 'VESS'
  const defaultDescription =
    'VESSはあなたが持っているデジタル証明書を提示したり検証したりすることのできるプロフィールアプリです。'

  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle
  const description = pageDescription || defaultDescription
  const url = pagePath || DEFAULT_PAGEPATH
  const imgUrl = pageImg || OGP_IMAGE
  const imgWidth = pageImgWidth || 1200
  const imgHeight = pageImgHeight || 630

  return (
    <Head>
      <title key='title'>{title}</title>
      <meta
        name='viewport'
        content='width=device-width,initial-scale=1.0,viewport-fit=cover'
        key='viewport'
      />
      <meta name='description' content={description} key='description' />
      <meta property='og:url' content={url} key='ogurl' />
      <meta property='og:title' content={title} key='ogtitle' />
      <meta property='og:site_name' content={title} key='ogsite_name' />
      <meta property='og:description' content={description} key='ogdescription' />
      <meta property='og:type' content='website' key='ogtype' />
      <meta property='og:image' content={imgUrl} key='ogimage' />
      <meta property='og:image:width' content={String(imgWidth)} key='ogimagewidth' />
      <meta property='og:image:height' content={String(imgHeight)} key='ogimageheight' />
      <link rel='icon' href='https://app.vess.id/favicon.ico' />
      <meta name='twitter:card' content='summary_large_image' key='twittercard' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='robots' content={robots} />
    </Head>
  )
}
