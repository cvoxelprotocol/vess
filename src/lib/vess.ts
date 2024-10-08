import { type AuthResponse } from 'vess-kit-core'
import { getAuthorizedSession, getVESSKit } from 'vess-kit-web'
import { getAddress } from 'viem'
import { userAuth } from './vessApi'
import { VSUser } from '@/@types/credential'
import { isProd } from '@/constants/common'
import { getVESSAuth, setVESSAuth } from '@/context/DidAuthContext'
import { getAddressFromPkh } from '@/utils/did'

const getVESSService = () => {
  return getVESSKit(!isProd())
}

export const connectVESSAuth = async (address: string, provider: any): Promise<AuthResponse> => {
  const env = isProd() ? 'mainnet' : 'testnet-clay'
  const vess = getVESSService()
  return await vess.connect(address, provider, env)
}

export const disconnectVESSAuth = () => {
  const vess = getVESSService()
  vess.disconnect()
}

export const autoVESSConnect = async () => {
  try {
    // check if session is already authorized
    const session = await getAuthorizedSession()
    if (!session) {
      return
    }

    setVESSAuth({
      user: undefined,
      connectionStatus: 'connecting',
    })
    const env = isProd() ? 'mainnet' : 'testnet-clay'
    const vess = getVESSService()
    const auth = await vess.autoConnect(env)
    if (auth) {
      const { session } = auth
      const vessAuth = getVESSAuth()
      const address = getAddress(getAddressFromPkh(session.did.parent))

      const res = await userAuth({ did: session.did.parent })
      const resJson = (await res.json()) as VSUser
      const { name, avatar, description, id, vessId } = resJson
      setVESSAuth({
        user: {
          id,
          did: session.did.parent,
          account: address,
          originalAddress: address,
          chainId: 1,
          stateLoginType: vessAuth?.user?.stateLoginType,
          name,
          avatar,
          description,
          vessId,
        },
        connectionStatus: 'connected',
      })
      console.log('Connection restored!')
    } else {
      setVESSAuth({
        user: undefined,
        connectionStatus: 'connecting',
      })
    }
  } catch (error) {
    setVESSAuth({
      user: undefined,
      connectionStatus: 'disconnected',
    })
  }
}
