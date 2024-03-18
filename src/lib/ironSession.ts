import { SessionOptions } from 'iron-session'

export interface SessionData {
  accessToken: string
  isLoggedIn: boolean
}

export const defaultSession: SessionData = {
  accessToken: '',
  isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
  cookieName: 'vess_session',
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
