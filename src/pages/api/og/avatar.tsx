import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import OgAvatarComponent from '@/components/og/Avatar'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'My default title'
    const avatar = searchParams.has('avatar')
      ? searchParams.get('avatar') || undefined
      : 'https://usericonupload.s3.ap-northeast-1.amazonaws.com/19489bbf-68e0-4538-951c-5eeb9cd00ec6.png'

    return new ImageResponse(<OgAvatarComponent title={title} avatar={avatar} />, {
      width: 1200,
      height: 630,
    })
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
