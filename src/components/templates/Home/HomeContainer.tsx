import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { Button } from '@/components/atom/Buttons/Button'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const HomeContainer: FC = () => {
  const { connectDID } = useConnectDID()
  const { did } = useDIDAccount()
  const { currentTheme, currentTypo, getFont } = useVESSTheme()
  const router = useRouter()

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${currentTheme.background};
  `
  const LoginCard = styled.div`
    background: ${currentTheme.surface1};
    border-radius: 32px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 460px;
    width: 100%;
    height: 200px;
    margin: 0 auto;
  `
  const CardHeader = styled.div`
    background: ${currentTheme.surface3};
    padding: 16px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `
  const HeaderTitle = styled.h1`
    background: ${currentTheme.surface3};
    color: ${currentTheme.onPrimaryContainer};
    font: ${getFont(currentTypo.title.large)};
  `
  const ActionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    padding: 16px;
    margin: 0 auto;
  `
  const LogoContainer = styled.div`
    width: 200px;
    min-height: 64px;
  `

  const handleLogin = async () => {
    await connectDID()
  }

  useEffect(() => {
    if (did) {
      router.push(`/${did}`)
    }
  }, [did])

  return (
    <Wrapper>
      <LoginCard>
        <CardHeader>
          <HeaderTitle>Welcome to VESS</HeaderTitle>
        </CardHeader>
        <ActionContainer>
          <LogoContainer>
            <NextImageContainer src={'/logo_bard.png'} width={'200px'} objectFit={'contain'} />
          </LogoContainer>
          <Button
            variant='filled'
            text='Connect Wallet'
            onClick={() => handleLogin()}
            btnWidth={'240px'}
          />
          {/* <Regulation>
            <Button variant='text' text='Privacy policy' onClick={() => console.log('Privacy')} />
            <Button variant='text' text='Terms' onClick={() => console.log('Terms')} />
          </Regulation> */}
        </ActionContainer>
      </LoginCard>
    </Wrapper>
  )
}
