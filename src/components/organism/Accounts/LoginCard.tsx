import styled from '@emotion/styled'
import { FC } from 'react'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { Text } from '@/components/atom/Texts/Text'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const LoginCard: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { setShowConnectModal } = useVESSWidgetModal()

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
    height: 280px;
    margin: 0 auto;
  `
  const LogoContainer = styled.div`
    width: 120px;
    min-height: 64px;
    margin: 0 auto;
  `

  const RegulationLink = styled.a`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.small)};
  `

  return (
    <LoginCard>
      <Flex width='100%' padding='16px' background={currentTheme.surface3}>
        <Text
          type='h1'
          color={currentTheme.onPrimaryContainer}
          font={getBasicFont(currentTypo.title.large)}
          text={'Welcome to VESS'}
        />
      </Flex>
      <Flex width='100%' colGap='16px' rowGap='16px' flexDirection='column' padding='16px'>
        <LogoContainer>
          <NextImageContainer src={'/logo_bard.png'} width={'120px'} objectFit={'contain'} />
        </LogoContainer>
        <Button
          variant='filled'
          text='Connect Wallet'
          onClick={() => setShowConnectModal(true)}
          btnWidth={'240px'}
        />
        <Flex width='100%' colGap='8px' rowGap='8px'>
          <RegulationLink
            href='https://vesslabs.notion.site/VESS-Privacy-Policy-b22d5bcda02e43189c202ec952467a0d'
            target='_blank'
          >
            Privacy policy
          </RegulationLink>
          <RegulationLink
            href='https://vesslabs.notion.site/VESS-Terms-of-Use-1ae74e0b9ae74b86a5e2e7b377b79722'
            target='_blank'
          >
            Terms of Use
          </RegulationLink>
        </Flex>
      </Flex>
    </LoginCard>
  )
}
