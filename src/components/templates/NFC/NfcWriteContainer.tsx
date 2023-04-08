import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { CyberButton } from '@/components/atom/Buttons/CyberButton'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { CyberLoading } from '@/components/atom/Loading/CyberLoading'
import { InvitaionContentForNFC } from '@/components/organism/Connection/InvitaionContentForNFC'
import {
  DEFAULT_GREETING,
  InvitaionManagementForNFC,
} from '@/components/organism/Connection/InvitaionManagementForNFC'
import {
  ConnectionInvitationInput,
  useCreateConnectionInvitaionMutation,
} from '@/graphql/generated'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useNfc } from '@/hooks/useNfc'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const NfcWriteContainer: FC = () => {
  const router = useRouter()
  const docId = (router.query.id as string) || ''
  const { currentTheme } = useVESSTheme()
  const { setShowConnectModal } = useVESSWidgetModal()
  const { did } = useDIDAccount()
  const { showLoading, closeLoading } = useVESSLoading()
  const { data, isLoading, register } = useNfc(docId)
  const [createConnectionInvitation] = useCreateConnectionInvitaionMutation()

  const Wrapper = styled.main`
    width: 100%;
    background: ${currentTheme.background};
  `

  const CardContainer = styled.div`
    max-width: 599px;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 160px);
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: ${currentTheme.onSurface};
    padding: 0px 16px 32px 16px;
  `

  const handleClick = async () => {
    if (!docId) return
    if (!did) {
      setShowConnectModal(true)
      return
    }
    if (did) {
      const res = await register({ id: docId, did: did })
      if (res) {
        await issueInitialInvitaions()
        router.push('/connection/success')
      }
    }
  }

  const issueInitialInvitaions = async () => {
    try {
      showLoading()
      const content: ConnectionInvitationInput = {
        greeting: DEFAULT_GREETING,
        type: 'IRL',
      }
      let promises: Promise<any>[] = []
      Array.from({ length: 15 }).forEach(() => {
        const res = createConnectionInvitation({ variables: { content } })
        promises.push(res)
      })
      await Promise.all(promises)
      closeLoading()
    } catch (error) {
      console.error(error)
      closeLoading()
    }
  }

  if (isLoading) {
    return (
      <Wrapper>
        <CardContainer>
          <NextImageContainer src='/vessCard/gif2_condensed.gif' width='296px' height='296px' />
          <CyberLoading label='Setting up...' width='100%' />
        </CardContainer>
      </Wrapper>
    )
  }

  if (!data?.did) {
    return (
      <Wrapper>
        <CardContainer>
          <Flex flexDirection='column' colGap='24px' rowGap='24px' width='100%'>
            <NextImageContainer src='/vessCard/gif3_condensed.gif' width='296px' height='296px' />
            <CyberButton
              label={did ? 'Setup' : 'Connect Wallet'}
              onClick={() => handleClick()}
              width={'100%'}
            />
          </Flex>
        </CardContainer>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <CardContainer>
        <Flex flexDirection='column' colGap='24px' rowGap='24px'>
          {data?.did === did ? (
            <InvitaionManagementForNFC />
          ) : (
            <InvitaionContentForNFC did={data.did} />
          )}
        </Flex>
      </CardContainer>
    </Wrapper>
  )
}
