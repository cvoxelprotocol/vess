/* eslint-disable import/namespace */
import { getIronSession } from 'iron-session'
import { NextApiRequest, NextApiResponse } from 'next'
import { SessionData, sessionOptions } from '@/lib/ironSession'
import { HttpStatus } from '@/utils/error'
import { isGoodResponse } from '@/utils/http'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const endpoint = req.query.endpoint as string
    const method = req.method
    const q = req.query.q as string
    let url = `${process.env.NEXT_PUBLIC_VESS_DIW_BACKEND}${endpoint}`
    if (q) {
      url = `${url}?${q}`
    }

    const session = await getIronSession<SessionData>(req, res, sessionOptions)
    if (!session.accessToken) {
      res.status(HttpStatus.UNAUTHORIZED).end('Unauthorized')
      return
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    // if (session.accessToken) {
    //   headers['Authorization'] = `Bearer ${session.accessToken}`
    // }

    let response
    if (method === 'GET') {
      response = await fetch(url, {
        headers,
      })
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

      const { access_token } = resJson
      if (access_token) {
        session.accessToken = access_token
        session.isLoggedIn = true
      }
      await session.save()
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
