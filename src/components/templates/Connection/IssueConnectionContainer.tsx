import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { PROOF_OF_CONNECTION_FAILED, PROOF_OF_CONNECTION_ISSUED } from '@/constants/toastMessage'
import {
  ConnectionInput,
  useCreateConnectionMutation,
  useGetConnectionInvitaionLazyQuery,
} from '@/graphql/generated'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useToast } from '@/hooks/useToast'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const IssueConnectionContainer: FC = () => {
  const router = useRouter()
  const invitaionId = (router.query.id as string) || ''
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { setShowConnectModal } = useVESSWidgetModal()
  const { did } = useDIDAccount()
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()

  const [getConnectionInvitaion, { data: invitation, loading }] =
    useGetConnectionInvitaionLazyQuery({
      variables: {
        id: invitaionId,
      },
      onError(e) {
        if (e instanceof DOMException) {
          return
        }
        console.log(e)
      },
    })
  const [createConnection] = useCreateConnectionMutation()

  const { profile } = useSocialAccount(
    invitation?.node?.__typename === 'ConnectionInvitation' ? invitation?.node?.did?.did : '',
  )
  const { eventDetail } = useEventAttendance(
    invitation?.node?.__typename === 'ConnectionInvitation' && invitation?.node?.eventId
      ? invitation?.node?.eventId
      : '',
  )

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    background: ${currentTheme.surface3};
    padding: 32px 0;
  `

  const CardContainer = styled.div`
    max-width: 352px;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: ${currentTheme.onSurface};
  `
  const Title = styled.p`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.headLine.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.headLine.large)};
    }
  `
  const PfpContainer = styled(Link)`
    width: fit-content;
    outline: none;
    text-decoration: none;
  `

  const At = styled.p`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.medium)};
  `
  const EventName = styled.p`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.headLine.small)};
  `

  const Greeting = styled.div`
    background: ${currentTheme.background};
    border-radius: 16px;
    padding: 12px 16px;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.body.medium)};
  `

  const inviterId = useMemo(() => {
    return invitation?.node?.__typename === 'ConnectionInvitation' ? invitation.node.did.did : ''
  }, [invitation])

  const issueConnection = async () => {
    if (!did) return
    try {
      showLoading()
      const userId = inviterId
      const content: ConnectionInput = {
        userId: userId,
        invitationId: invitaionId,
        connectAt: new Date().toISOString(),
      }
      const res = await createConnection({ variables: { content } })
      if (res.data?.createConnection?.document.id) {
        closeLoading()
        showToast(PROOF_OF_CONNECTION_ISSUED)
        setTimeout(() => {
          router.push(`/did/${userId}`)
        }, 2000)
      } else {
        closeLoading()
        showToast(PROOF_OF_CONNECTION_FAILED)
      }
    } catch (error) {
      console.error(error)
      closeLoading()
      showToast(PROOF_OF_CONNECTION_FAILED)
    }
  }

  useEffect(() => {
    try {
      getConnectionInvitaion()
    } catch (error) {
      console.error(error)
    }
  }, [])

  if (!invitaionId) {
    return (
      <Wrapper>
        <CardContainer>
          <NextImageContainer src={'/connection/ntmy_1.png'} width={'280px'} />
          <Title>No Invitaion</Title>
        </CardContainer>
      </Wrapper>
    )
  }

  if (
    invitation?.node?.__typename === 'ConnectionInvitation' &&
    invitation?.node?.connection.edges &&
    invitation?.node?.connection.edges?.length > 0
  ) {
    return (
      <Wrapper>
        <CardContainer>
          <NextImageContainer src={'/connection/ntmy_1.png'} width={'280px'} />
          <Title>Invalid Invitation</Title>
        </CardContainer>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <CardContainer>
        {loading ? (
          <CommonSpinner />
        ) : (
          <Flex flexDirection='column' colGap='24px' rowGap='24px'>
            <NextImageContainer src={'/connection/ntmy_1.png'} width={'280px'} height={'52px'} />
            <PfpContainer href={`/did/${inviterId}`}>
              <Avatar url={profile.avatarSrc} size={'100'} />
            </PfpContainer>
            <Title>{`I'm ${profile.displayName || ''}`}</Title>
            {eventDetail && (
              <Flex flexDirection='column' colGap='4px' rowGap='4px'>
                <At>at</At>
                <Flex colGap='4px' rowGap='4px'>
                  <Avatar url={eventDetail.icon} size={'LL'} />
                  <EventName>{eventDetail.name}</EventName>
                </Flex>
              </Flex>
            )}
            {invitation?.node?.__typename === 'ConnectionInvitation' &&
              invitation?.node?.greeting && <Greeting>{invitation?.node?.greeting}</Greeting>}
            {!did ? (
              <Button
                variant='filled'
                text='Connect Wallet'
                onClick={() => setShowConnectModal(true)}
                btnWidth={'100%'}
              />
            ) : (
              <Button
                variant='filled'
                text='Nice to meet you too!'
                onClick={() => issueConnection()}
                btnWidth={'100%'}
                mainColor={
                  'linear-gradient(91.03deg, #AC334A 0.44%, #B34A88 48.02%, #A95A2F 103.08%)'
                }
                textColor={currentTheme.onBackground}
              />
            )}
          </Flex>
        )}
      </CardContainer>
    </Wrapper>
  )
}
