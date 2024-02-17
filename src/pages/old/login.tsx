import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { OldLoginPage } from '@/components/login/OldLoginPage'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

const OldLogin: NextPage = () => {
  const { did } = useDIDAccount()
  const { currentTheme } = useVESSTheme()
  const router = useRouter()

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

  return (
    <Wrapper>
      <Meta pagePath={`https://app.vess.id/login`} />
      <OldLoginPage />
    </Wrapper>
  )
}

export default OldLogin
