import styled from '@emotion/styled'
import { Text, useKai } from 'kai-kit'
import { NextPage } from 'next'
import router from 'next/router'
import { useEffect } from 'react'
import { CommonSpinner } from '@/components/ui-v1/Loading/CommonSpinner'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useStateRPath } from '@/jotai/ui'
import { DidAuthService } from '@/lib/didAuth'

const Callback: NextPage = () => {
  const { kai } = useKai()
  const didAuthService = DidAuthService.getInstance()
  const { user } = useVESSAuthUser()
  const [rPath, setRpath] = useStateRPath()

  useEffect(() => {
    async function init() {
      //init web3 auth and subscribe to login events
      await didAuthService.initWeb3Auth()
    }
    init()
  }, [])

  useEffect(() => {
    if (user?.did) {
      if (rPath) {
        const returnUrl = rPath.startsWith('/') ? rPath : `/${rPath}`
        setRpath(null)
        router.push(returnUrl)
        return
      } else {
        if (user?.vessId) {
          router.push(`/${user?.vessId}`)
        } else {
          router.push(`/did/${user?.did}`)
        }
        return
      }
    }
  }, [user?.did])

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: var(--kai-color-sys-background);
    padding: 8px;
    gap: 8px;
  `

  return (
    <Wrapper>
      <CommonSpinner size='lg' />
      <Text as='h1' typo='label-md' color={kai.color.sys.onSurfaceVariant}>
        Loading your profile...
      </Text>
    </Wrapper>
  )
}

export default Callback
