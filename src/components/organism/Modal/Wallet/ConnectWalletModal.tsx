import styled from '@emotion/styled'
import { Connector } from '@wagmi/core'
import { FC } from 'react'
import { useConnect } from 'wagmi'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const ConnectWalletModal: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { showConnectModal, setShowConnectModal } = useVESSWidgetModal()
  const { connectAsync, connectors, error, isLoading, pendingConnector } = useConnect()
  const { connectDID } = useConnectDID()

  const Container = styled.div`
    padding: 32px;
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
    await connectAsync({ connector })
    const isSuccess = await connectDID()
    if (isSuccess) {
      setShowConnectModal(false)
    }
  }

  return (
    <VESSModalContainer open={showConnectModal} onOpenChange={setShowConnectModal}>
      <VESSModal>
        <Container>
          <Title>Connect DID</Title>
          <Flex flexDirection='column' rowGap='8px'>
            {connectors.map((connector) => (
              <Button
                text={
                  isLoading && connector.id === pendingConnector?.id
                    ? ' (connecting)'
                    : connector.name
                }
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => handleLogin(connector)}
                btnWidth={'100%'}
              />
            ))}
            {error && <ErrorText>{error.message}</ErrorText>}
          </Flex>
        </Container>
      </VESSModal>
    </VESSModalContainer>
  )
}
