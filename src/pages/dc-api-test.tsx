import styled from '@emotion/styled'
import { NextPage } from 'next'
import { DCApiTestPage } from '@/components/dcapi/DCApiTestPage'
import { Meta } from '@/components/layouts/Meta'

const DCApiTest: NextPage = () => {
  return (
    <Wrapper>
      <Meta
        pageTitle='DC API Test'
        pageDescription='Digital Credentials API 動作確認ページ'
        pagePath='https://app.vess.id/dc-api-test'
      />
      <DCApiTestPage />
    </Wrapper>
  )
}

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--kai-color-sys-background);
  padding: 16px;
`

export default DCApiTest