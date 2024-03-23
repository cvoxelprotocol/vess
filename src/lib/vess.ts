import { type AuthResponse } from 'vess-kit-core'
import { getAddressFromPkh, getVESSKit } from 'vess-kit-web'
import { getAddress } from 'viem'
import { initializeApolloForCompose } from './apolloForCompose'
import { userAuth } from './vessApi'
import { VSUser } from '@/@types/credential'
import { isProd } from '@/constants/common'
import { getVESSAuth, setVESSAuth } from '@/context/DidAuthContext'

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
    setVESSAuth({
      user: undefined,
      connectionStatus: 'connecting',
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
      const address = getAddress(getAddressFromPkh(session.did.parent))

      const res = await userAuth({ did: session.did.parent })
      const resJson = (await res.json()) as VSUser
      const { name, avatar, description } = resJson
      setVESSAuth({
        user: {
          did: session.did.parent,
          account: address,
          originalAddress: address,
          chainId: 1,
          stateLoginType: vessAuth?.user?.stateLoginType,
          name,
          avatar,
          description,
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
