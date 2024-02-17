import styled from '@emotion/styled'
import { NextPage } from 'next'
import { HomeContainer } from '@/components/home/HomeContainer'
import { Meta } from '@/components/layouts/Meta'
import { LoginPage } from '@/components/login/LoginPage'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'

const Home: NextPage = () => {
  const { did, connection } = useVESSAuthUser()

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--kai-color-sys-background);
    padding: 8px;
  `

  if (connection === 'connecting') {
    return <></>
  }

  if (did) {
    return (
      <>
        <Meta />
        <HomeContainer did={did} />
      </>
    )
  } else {
    return (
      <Wrapper>
        <Meta pagePath={`https://app.vess.id/login`} />
        <LoginPage />
      </Wrapper>
    )
  }
}

export default Home
