/* eslint-disable import/namespace */
import { getIronSession } from 'iron-session'
import { NextApiRequest, NextApiResponse } from 'next'
import { SessionData, sessionOptions } from '@/lib/ironSession'
import { HttpStatus } from '@/utils/error'
import { isGoodResponse } from '@/utils/http'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const endpoint = req.query.endpoint as string
    const url = `${process.env.NEXT_PUBLIC_VESS_BACKEND}${endpoint}`

    const session = await getIronSession<SessionData>(req, res, sessionOptions)
    console.log({ session })

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    let response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...req.body }),
    })

    if (isGoodResponse(response.status)) {
      const resJson = await response.json()
      console.log({ resJson })
      const { access_token } = resJson
      session.accessToken = access_token
      session.isLoggedIn = true
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
