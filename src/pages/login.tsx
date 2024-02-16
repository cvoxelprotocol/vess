import styled from '@emotion/styled'
import { ADAPTER_STATUS } from '@web3auth/base'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { LoginPage } from '@/components/login/LoginPage'
import { useWeb3AuthContext } from '@/context/web3AuthContext'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { Web3AuthService } from '@/lib/web3auth'

const Login: NextPage = () => {
  const { did } = useDIDAccount()
  const router = useRouter()
  const { web3AuthService } = useWeb3AuthContext()
  const { connectDIDWithWeb3Auth } = useConnectDID()

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--kai-color-sys-background);
    padding: 8px;
  `

  useEffect(() => {
    if (did) {
      router.push(`/did/${did}`)
    }
  }, [did, router])

  useEffect(() => {
    async function init(web3AuthService: Web3AuthService) {
      try {
        console.log('login web3AuthService: ', web3AuthService)
        if (web3AuthService) {
          console.log('web3AuthService.isInitialized', web3AuthService.isInitialized)
          if (!web3AuthService.isInitialized) {
            await web3AuthService.initWeb3Auth()
          }
          console.log(
            'web3AuthService.isInitialized after initialized:',
            web3AuthService.isInitialized,
          )
          web3AuthService.subscribe(async (status: string, data?: any) => {
            console.log('Status: ', status)
            if (status === ADAPTER_STATUS.CONNECTED) {
              const res = await connectDIDWithWeb3Auth(web3AuthService.provider)
              if (res) {
                console.log('connected DID with Web3Auth provider')
              } else {
                console.log('failed to connect DID with Web3Auth provider')
              }
            } else if (status === ADAPTER_STATUS.ERRORED) {
              console.log('failed to connect Web3Auth provider')
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    init(web3AuthService)

    return () => {
      if (web3AuthService) {
        console.log('login unsubscribeAll')
        web3AuthService.unsubscribeAll()
      }
    }
  }, [web3AuthService, connectDIDWithWeb3Auth])

  return (
    <Wrapper>
      <Meta pagePath={`https://app.vess.id/login`} />
      <LoginPage />
    </Wrapper>
  )
}

export default Login
