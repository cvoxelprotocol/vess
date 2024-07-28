import { type AuthResponse } from 'vess-kit-core'
import { getAuthorizedSession, getVESSKit } from 'vess-kit-web'
import { getAddress } from 'viem'
import { initializeApolloForCompose } from './apolloForCompose'
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
      connectionStatus: 'connecting',
      user: undefined,
      address: undefined,
      chainId: undefined,
      stateLoginType: undefined,
    })
    const env = isProd() ? 'mainnet' : 'testnet-clay'
    const vess = getVESSService()
    const auth = await vess.autoConnect(env)
    if (auth) {
      const { session } = auth
      const { composeClient } = initializeApolloForCompose()
      // @ts-ignore TODO:fixed
      composeClient.setDID(session.did)
      const vessAuth = getVESSAuth()
      const res = await userAuth({ did: session.did.parent })
      const resJson = (await res.json()) as VSUser
      const { createdAt, updatedAt, profiles, socialLink, post, ...rest } = resJson
      setVESSAuth({
        user: rest,
        connectionStatus: 'connected',
        stateLoginType: vessAuth?.stateLoginType,
        address: getAddress(getAddressFromPkh(session.did.parent)),
        chainId: 1,
      })
      console.log('Connection restored!')
    } else {
      setVESSAuth({
        connectionStatus: 'disconnected',
        user: undefined,
        address: undefined,
        chainId: undefined,
        stateLoginType: undefined,
      })
    }
  } catch (error) {
    setVESSAuth({
      connectionStatus: 'disconnected',
      user: undefined,
      address: undefined,
      chainId: undefined,
      stateLoginType: undefined,
    })
  }
}
