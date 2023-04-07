import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { SocialLinkItem } from '@/components/molecure/Profile/SocialLinkItem'
import { PROOF_OF_CONNECTION_FAILED, PROOF_OF_CONNECTION_ISSUED } from '@/constants/toastMessage'
import {
  useCreateConnectionMutation,
  ConnectionInput,
  useGetUserConnectionInvitaionsLazyQuery,
  useGetIssuedConnectionsLazyQuery,
} from '@/graphql/generated'
import { useDIDAccount } from '@/hooks/useDIDAccount'
// import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useToast } from '@/hooks/useToast'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { isWithinSeconds } from '@/utils/date'

export const ETH_DENVER_EVENT_ID =
  'ceramic://kjzl6cwe1jw14ar8wuy2i31rkjaf1k8vrhae7qzucqjd9z8fmvsgceca7jb5c7b'

type Props = {
  did?: string
}
export const InvitaionContentForNFC: FC<Props> = ({ did }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { did: myDid } = useDIDAccount()
  const { showToast } = useToast()
  const { profile } = useSocialAccount(did)
  const { showLoading, closeLoading } = useVESSLoading()
  const router = useRouter()
  const { setShowConnectModal } = useVESSWidgetModal()

  // === Invitation ===
  const [getUserConnectionInvitaions, { data: userInvitations, loading }] =
    useGetUserConnectionInvitaionsLazyQuery({
      ssr: false,
      variables: {
        id: did || '',
      },
      nextFetchPolicy: 'no-cache',
      onError(e) {
        if (e instanceof DOMException) {
          return
        }
        console.log(e)
      },
    })
  const [createConnection] = useCreateConnectionMutation()
  const [getIssuedConnections, { data: connections }] = useGetIssuedConnectionsLazyQuery({
    variables: { id: did || '' },
    nextFetchPolicy: 'no-cache',
  })
  const { twitter, telegram } = useSocialLinks(did)

  useEffect(() => {
    try {
      if (!did) return
      getUserConnectionInvitaions()
      getIssuedConnections()
    } catch (error) {
      console.error(error)
    }
  }, [])

  const unusedInvitations = useMemo(() => {
    if (userInvitations?.node?.__typename !== 'CeramicAccount') return []
    const invitations = userInvitations?.node?.connectionInvitationList?.edges
      ?.filter((edge) => edge?.node?.connection.edges?.length === 0)
      ?.map((e) => e?.node)
    if (!invitations || invitations.length === 0) return []
    return invitations
  }, [userInvitations])

  const invitation = useMemo(() => {
    if (!unusedInvitations || unusedInvitations.length === 0) return
    return unusedInvitations[0]
  }, [unusedInvitations])

  const isAlreadyIssued = useMemo(() => {
    if (!connections || !myDid || !did) return false
    const tempList =
      connections.node?.__typename === 'CeramicAccount'
        ? connections.node?.connectionList?.edges?.map((edge) => {
            return { node: edge?.node }
          })
        : []
    if (!tempList || tempList.length === 0) return false
    return tempList.some((c) => {
      return c.node?.userId === myDid && isWithinSeconds(3600, c.node?.connectAt)
    }) // issued with in 60 min
  }, [connections, myDid, did])

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

  const Greeting = styled.div`
    background: ${currentTheme.background};
    border-radius: 16px;
    padding: 12px 16px;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.body.medium)};
  `

  const issueConnection = async () => {
    if (!myDid || !did || !invitation?.id) return
    try {
      showLoading()
      const userId = did
      const content: ConnectionInput = {
        userId: userId,
        invitationId: invitation.id,
        connectAt: new Date().toISOString(),
      }
      const res = await createConnection({ variables: { content } })
      console.log({ res })
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

  if (!invitation && !loading) {
    return (
      <Wrapper>
        <CardContainer>
          <NextImageContainer src={'/connection/ntmy_1.png'} width={'280px'} />
          <Title>No Invitaion</Title>
        </CardContainer>
      </Wrapper>
    )
  }

  if (invitation && invitation?.connection.edges && invitation?.connection.edges?.length > 0) {
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
    <Flex flexDirection='column' colGap='12px' rowGap='12px'>
      <CardContainer>
        {loading ? (
          <CommonSpinner />
        ) : (
          <Flex flexDirection='column' colGap='24px' rowGap='24px'>
            <NextImageContainer src={'/connection/ntmy_1.png'} width={'280px'} height={'52px'} />
            <PfpContainer href={`/did/${did}`}>
              <Avatar url={profile.avatarSrc} size={'100'} />
            </PfpContainer>
            <Title>{`I'm ${profile.displayName || ''}`}</Title>
            <Flex colGap='4px' rowGap='4px'>
              <SocialLinkItem linkType={'telegram'} value={telegram} />
              <SocialLinkItem linkType={'twitter'} value={twitter} />
            </Flex>
            {invitation?.greeting && <Greeting>{invitation?.greeting}</Greeting>}
            {!myDid ? (
              <Button
                variant='filled'
                text='Connect Wallet'
                onClick={() => setShowConnectModal(true)}
                btnWidth={'100%'}
              />
            ) : (
              <Button
                variant='filled'
                text={isAlreadyIssued ? 'You already Issued Connection' : 'Nice to meet you too!'}
                onClick={() => issueConnection()}
                btnWidth={'100%'}
                mainColor={
                  'linear-gradient(91.03deg, #AC334A 0.44%, #B34A88 48.02%, #A95A2F 103.08%)'
                }
                textColor={currentTheme.onBackground}
                disabled={isAlreadyIssued}
              />
            )}
          </Flex>
        )}
      </CardContainer>
    </Flex>
  )
}
