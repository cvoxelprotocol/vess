import styled from '@emotion/styled'
import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { OldLoginPage } from '@/components/login/OldLoginPage'

const OldLogin: NextPage = () => {
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
      <Meta pagePath={`https://app.vess.id/old/login`} />
      <OldLoginPage />
    </Wrapper>
  )
}

export default OldLogin
