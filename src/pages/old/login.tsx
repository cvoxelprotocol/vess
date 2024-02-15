import styled from '@emotion/styled'
import { ADAPTER_STATUS } from '@web3auth/base'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { OldLoginPage } from '@/components/login/OldLoginPage'
import { useWeb3AuthContext } from '@/context/web3AuthContext'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'

const OldLogin: NextPage = () => {
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
    async function init() {
      try {
        if (web3AuthService) {
          if (!web3AuthService.isInitialized) {
            await web3AuthService.initWeb3Auth()
          }
          console.log({ web3AuthService })
          web3AuthService.subscribe(async (status: string, data?: any) => {
            console.log('Status: ', status)
            if (status === ADAPTER_STATUS.CONNECTED) {
              const res = await connectDIDWithWeb3Auth(web3AuthService.provider)
              if (res) {
                console.log('connected DID with Web3Auth provider')

                router.push('/')
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
    init()

    return () => {
      if (web3AuthService) {
        web3AuthService.unsubscribeAll()
      }
    }
  }, [web3AuthService])

  useEffect(() => {
    if (did) {
      router.push(`/did/${did}`)
    }
  }, [did, router])

  return (
    <Wrapper>
      <Meta pagePath={`https://app.vess.id/login`} />
      <OldLoginPage />
    </Wrapper>
  )
}

export default OldLogin
