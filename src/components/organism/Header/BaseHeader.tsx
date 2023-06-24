import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { ConnectWalletModal } from '../Modal/Wallet/ConnectWalletModal'
import { HeaderMenu } from './HeaderMenu'
import { Button } from '@/components/atom/Buttons/Button'
import { IconButton } from '@/components/atom/Buttons/IconButton'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { NavigationDrawer } from '@/components/molecure/Navigation/NavigationDrawer'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const BaseHeader: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { connection, originalAddress, did } = useDIDAccount()
  const { isAuthorized } = useConnectDID()
  const router = useRouter()
  const { setShowConnectModal } = useVESSWidgetModal()

  const HeaderContainer = styled.div`
    grid-row: 1 /2;
    width: 100%;
    height: 80px;
    position: fixed;
    padding: 4px 12px;
    background: ${currentTheme.background};
    z-index: 998;
    display: grid;
    grid-template-columns: 100px 1fr 180px;
    @media (max-width: 599px) {
      height: 64px;
      grid-template-columns: 64px 1fr 64px;
    }
  `

  const HeaderTitle = styled.div`
    grid-column: 2 /3;
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100%;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.headLine.small)};
    @media (max-width: 599px) {
      justify-content: center;
      ${getBasicFont(currentTypo.title.large)};
    }
  `

  const LogoContainer = styled.div`
    display: none;
    @media (max-width: 599px) {
      display: block;
      height: 38px;
    }
  `

  const WrappedButton = styled(Button)`
    display: block;
    @media (max-width: 599px) {
      display: none;
    }
  `

  const WrappedIconButton = styled(IconButton)`
    display: none;
    @media (max-width: 599px) {
      display: block;
    }
  `

  const getTitle = useMemo(() => {
    if (router.asPath === '/connection/list') return 'Connections 👋'
    else if (router.asPath.startsWith('/did')) return 'Profile'
    else if (router.asPath.startsWith('/nfc')) return 'VESS Card'
    return ''
  }, [router])

  return (
    <HeaderContainer>
      <Flex alignItems='center' justifyContent={'flex-start'} height={'100%'} width={'100%'}>
        <NavigationDrawer />
      </Flex>

      <HeaderTitle>
        {getTitle ? (
          <>{getTitle}</>
        ) : (
          <LogoContainer>
            <NextImageContainer src={'/logo_bard.png'} width={'38px'} objectFit={'contain'} />
          </LogoContainer>
        )}
      </HeaderTitle>
      <Flex alignItems='center' justifyContent={'flex-end'} height={'100%'} width={'100%'}>
        {connection === 'connecting' ? (
          <CommonSpinner />
        ) : (
          <>
            {isAuthorized ? (
              <HeaderMenu />
            ) : (
              <>
                <WrappedIconButton
                  icon={ICONS.WALLET}
                  size={'LL'}
                  variant='text'
                  mainColor={currentTheme.onSurface}
                  onClick={() => setShowConnectModal(true)}
                />
                <WrappedButton
                  text={'Connect Wallet'}
                  icon={ICONS.WALLET}
                  onClick={() => setShowConnectModal(true)}
                />
              </>
            )}
          </>
        )}
      </Flex>
      <ConnectWalletModal />
    </HeaderContainer>
  )
}
