/* eslint-disable import/namespace */
import { getIronSession } from 'iron-session'
import { NextApiRequest, NextApiResponse } from 'next'
import { SessionData, sessionOptions } from '@/lib/ironSession'
import { isAuthApi, isAuthProtectedApi } from '@/lib/vessApi'
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

    const session = await getIronSession<SessionData>(req, res, sessionOptions)
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    //add access token if the endpoint is protected
    if (isAuthProtectedApi(endpoint)) {
      if (!session.accessToken) {
        res.status(HttpStatus.UNAUTHORIZED).end('Unauthorized')
        return
      }
      headers['Authorization'] = `Bearer ${session.accessToken}`
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

      // add access token to session if endpoint is auth api
      if (isAuthApi(endpoint)) {
        console.log({ resJson })
        const { access_token } = resJson
        if (access_token) {
          session.accessToken = access_token
          session.isLoggedIn = true
        }
        await session.save()
      }
      res.status(response.status).json(resJson)
    } else {
      console.log('error', response)
      res.status(response.status).end()
    }
  } catch (error) {
    console.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end('endpoint error')
  }
}
