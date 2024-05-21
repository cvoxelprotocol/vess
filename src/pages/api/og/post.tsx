import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import OgPostComponent from '@/components/og/Post'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const image = searchParams.has('image')
      ? searchParams.get('image') || undefined
      : `${process.env.NEXT_PUBLIC_VESS_URL}/sample/pizzaDAO.png`

    return new ImageResponse(<OgPostComponent image={image} />, {
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
