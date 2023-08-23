import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { CyberButton } from '@/components/atom/Buttons/CyberButton'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
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
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useNfc } from '@/hooks/useNfc'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { NfcProps } from '@/pages/nfc/[id]'

export const NfcWriteContainer: FC<NfcProps> = ({ id, nfc }) => {
  const router = useRouter()
  const { currentTheme } = useVESSTheme()
  const { did } = useDIDAccount()
  const { showLoading, closeLoading } = useVESSLoading()
  const { data, isLoading, register } = useNfc(id)
  const [createConnectionInvitation] = useCreateConnectionInvitaionMutation()
  const { connectDID } = useConnectDID()
  const handleLogin = async () => {
    try {
      await connectDID()
    } catch (error) {
      console.error(error)
    }
  }

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
    if (!id) return
    if (!did) {
      await handleLogin()
      return
    }
    if (did) {
      try {
        await register({ id: id, did: did })
        await issueInitialInvitaions()
        router.push('/connection/success')
      } catch (error) {
        console.error(error)
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
