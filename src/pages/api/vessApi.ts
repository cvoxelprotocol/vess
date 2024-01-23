/* eslint-disable import/namespace */
import { NextApiRequest, NextApiResponse } from 'next'
import { HttpStatus } from '@/utils/error'
import { isGoodResponse } from '@/utils/http'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const endpoint = req.query.endpoint as string
    const method = req.method
    const slug = req.query.slug as string
    const url = slug
      ? `${process.env.NEXT_PUBLIC_VESS_BACKEND}${endpoint}/${slug}`
      : `${process.env.NEXT_PUBLIC_VESS_BACKEND}${endpoint}`
    console.log({ endpoint })
    console.log({ method })
    console.log({ url })
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    let response
    if (method === 'GET') {
      response = await fetch(url)
    } else if (method === 'PUT') {
      response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ...req.body }),
      })
    } else {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...req.body }),
      })
    }
    if (isGoodResponse(response.status)) {
      const resJson = await response.json()
      res.status(response.status).json(resJson)
    } else {
      console.log('error', response)
      res.status(response.status).end()
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end('endpoint error')
  }
}
