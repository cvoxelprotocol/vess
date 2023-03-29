import styled from '@emotion/styled'
import { Connector } from '@wagmi/core'
import { FC } from 'react'
import { useConnect } from 'wagmi'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { Button } from '@/components/atom/Buttons/Button'
import { PanelButton } from '@/components/atom/Buttons/PanelButton'
import { Flex } from '@/components/atom/Common/Flex'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const ConnectWalletModal: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { showConnectModal, setShowConnectModal } = useVESSWidgetModal()
  const { connectors, error, isLoading, pendingConnector } = useConnect()
  const { connectDID } = useConnectDID()

  const Container = styled.div`
    padding: 8px 24px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    align-items: center;
    background: ${currentTheme.surface3};
  `
  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.headLine.small)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.large)};
    }
  `
  const ErrorText = styled.p`
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.body.small)};
  `

  const handleLogin = async (connector?: Connector<any, any, any>) => {
    try {
      const isSuccess = await connectDID(connector)
      if (isSuccess) {
        setShowConnectModal(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <VESSModalContainer open={showConnectModal} onOpenChange={setShowConnectModal}>
      <VESSModal modalTitle='Connect Wallet'>
        <Container>
          <Flex
            flexDirection='row'
            flexDirectionSP='column'
            rowGap='16px'
            colGap='16px'
            width='100%'
            height='100%'
          >
            {connectors.map((connector) => (
              <PanelButton
                label={
                  isLoading && connector.id === pendingConnector?.id
                    ? ' (connecting)'
                    : connector.name
                }
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => handleLogin(connector)}
                width={'100%'}
                src={`/icons/${connector.id}.png`}
                borderColor={currentTheme.outline}
              />
            ))}
            {error && <ErrorText>{error.message}</ErrorText>}
          </Flex>
        </Container>
      </VESSModal>
    </VESSModalContainer>
  )
}
