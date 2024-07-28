import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { LoginPage } from '@/components/login/LoginPage'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'

const Home: NextPage = () => {
  const { user, connectionStatus } = useVESSAuthUser()
  const router = useRouter()

  useEffect(() => {
    if (user?.vessId) {
      router.push(`/${user?.vessId}`)
    } else if (user?.did) {
      router.push(`/did/${user?.did}`)
    }
  }, [user?.did, user?.vessId])

  if (connectionStatus === 'connecting') {
    return <></>
  }

  return (
    <Wrapper>
      <Meta pagePath={`https://app.vess.id/login`} />
      <LoginPage />
    </Wrapper>
  )
}

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--kai-color-sys-background);
  padding: 8px;
`
export default Home
