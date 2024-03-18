import { getIronSession } from 'iron-session'
import { NextApiRequest, NextApiResponse } from 'next'
import { SessionData, sessionOptions } from '@/lib/ironSession'
import { HttpStatus } from '@/utils/error'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions)
    console.log({ session })

    if (session.accessToken) {
      // remove access token from session
      session.accessToken = ''
      session.isLoggedIn = false
      await session.save()
    }
    res.status(HttpStatus.OK).end()
  } catch (error) {
    console.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end('endpoint error')
  }
}
