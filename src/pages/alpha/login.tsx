import styled from '@emotion/styled'
import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { AlphaLoginPage } from '@/components/login/AlphaLoginPage'

const Login: NextPage = () => {
  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--kai-color-sys-background);
    padding: 8px;
  `

  return (
    <Wrapper>
      <Meta pagePath={`https://app.vess.id/login`} />
      <AlphaLoginPage />
    </Wrapper>
  )
}

export default Login
