import styled from '@emotion/styled'
import { FC } from 'react'
import { DeleteRoleModal } from '../DevUseOnly/DeleteRoleModal'
import { HeaderMenu } from './HeaderMenu'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const BaseHeader: FC = () => {
  const { currentTheme } = useVESSTheme()
  const { connection, did } = useDIDAccount()
  const { connectDID, isAuthorized } = useConnectDID()

  const HeaderContainer = styled.div`
    grid-row: 1 /2;
    width: 100%;
    height: 80px;
    position: fixed;
    padding: 12px;
    background: ${currentTheme.depth4};
    z-index: 998;
    @media (max-width: 599px) {
      height: 64px;
    }
  `

  return (
    <HeaderContainer>
      <Flex alignItems='center' justifyContent={'flex-end'} height={'100%'}>
        {connection === 'connecting' ? (
          <CommonSpinner />
        ) : (
          <>
            {isAuthorized ? (
              <HeaderMenu />
            ) : (
              <Button text={'Connect'} onClick={() => connectDID()}></Button>
            )}
          </>
        )}
      </Flex>
      {did && <DeleteRoleModal did={did} />}
    </HeaderContainer>
  )
}
