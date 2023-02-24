import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { HeaderMenu } from './HeaderMenu'
import { Button } from '@/components/atom/Buttons/Button'
import { IconButton } from '@/components/atom/Buttons/IconButton'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const BaseHeader: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { connection } = useDIDAccount()
  const { connectDID, isAuthorized } = useConnectDID()
  const router = useRouter()

  const HeaderContainer = styled.div`
    grid-row: 1 /2;
    width: 100%;
    height: 80px;
    position: fixed;
    padding: 4px 12px;
    background: ${currentTheme.depth4};
    z-index: 998;
    display: grid;
    grid-template-columns: 64px 1fr 64px;
    @media (max-width: 599px) {
      height: 64px;
    }
  `
  const HeaderTitle = styled.div`
    grid-column: 2 /3;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.large)};
  `

  const getTitle = useMemo(() => {
    if (router.asPath === '/connection/list') return 'Timeline'
    if (router.asPath === '/') return 'Home'
    return ''
  }, [router])

  return (
    <HeaderContainer>
      <HeaderTitle>{getTitle}</HeaderTitle>
      <Flex alignItems='center' justifyContent={'flex-end'} height={'100%'} width={'100%'}>
        {connection === 'connecting' ? (
          <CommonSpinner />
        ) : (
          <>
            {isAuthorized ? (
              <HeaderMenu />
            ) : (
              <IconButton
                icon={ICONS.WALLET}
                size={'LL'}
                variant='text'
                mainColor={currentTheme.onSurface}
                onClick={() => connectDID()}
              />
            )}
          </>
        )}
      </Flex>
    </HeaderContainer>
  )
}
