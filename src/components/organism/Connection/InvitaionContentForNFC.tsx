import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { BasicProfileWidget } from '../Widgets/Profiles/BasicProfileWidget'
import { FlatButton } from '@/components/atom/Buttons/FlatButton'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { Text } from '@/components/atom/Texts/Text'
import { SocialLinkItem } from '@/components/molecure/Profile/SocialLinkItem'
import { PROOF_OF_CONNECTION_FAILED, PROOF_OF_CONNECTION_ISSUED } from '@/constants/toastMessage'
import {
  useCreateConnectionMutation,
  ConnectionInput,
  useGetUserConnectionInvitaionsLazyQuery,
  useGetIssuedConnectionsLazyQuery,
} from '@/graphql/generated'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useToast } from '@/hooks/useToast'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { isWithinSeconds } from '@/utils/date'

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
  const [getMyIssuedConnections, { data: myConnections }] = useGetIssuedConnectionsLazyQuery({
    variables: { id: myDid || '' },
    nextFetchPolicy: 'no-cache',
  })
  const { twitter, telegram } = useSocialLinks(did)

  useEffect(() => {
    try {
      if (!did) return
      getUserConnectionInvitaions()
      getIssuedConnections()
      getMyIssuedConnections()
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
    const temp2List =
      myConnections?.node?.__typename === 'CeramicAccount'
        ? myConnections?.node?.connectionList?.edges?.map((edge) => {
            return { node: edge?.node }
          })
        : []
    if (!tempList || tempList.length === 0) return false
    const partnerCheck = tempList.some((c) => {
      return c.node?.userId === myDid && isWithinSeconds(3600, c.node?.connectAt)
    }) // issued with in 60 min
    const myConnectionCheck = temp2List?.some((c) => {
      return c.node?.userId === did && isWithinSeconds(3600, c.node?.connectAt)
    })
    return partnerCheck || myConnectionCheck
  }, [connections, myDid, did])

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    background: ${currentTheme.surface3};
    padding: 32px 0;
  `

  const CardContainer = styled.div`
    max-width: 599px;
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
  const WidgetContainer = styled.div`
    display: grid;
    grid-template-rows: repeat(4, 44px);
    grid-template-columns: repeat(6, 44px);
    grid-gap: 16px;
    padding: 0px;
  `

  const ViewProfile = styled(Link)`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 8px;
    background: ${currentTheme.surface3};
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
          <Text
            type='p'
            color={currentTheme.onSurface}
            font={getBasicFont(currentTypo.headLine.large)}
            text={`No Invitaion`}
          />
        </CardContainer>
      </Wrapper>
    )
  }

  if (invitation && invitation?.connection.edges && invitation?.connection.edges?.length > 0) {
    return (
      <Wrapper>
        <CardContainer>
          <NextImageContainer src={'/connection/ntmy_1.png'} width={'280px'} />
          <Text
            type='p'
            color={currentTheme.onSurface}
            font={getBasicFont(currentTypo.headLine.large)}
            text={`Invalid Invitation`}
          />
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
          <Flex flexDirection='column' colGap='16px' rowGap='16px'>
            <WidgetContainer>
              <BasicProfileWidget
                did={did || ''}
                gridRow={'1/5'}
                gridCol={'1/7'}
                gridRowOnSp={'1/5'}
                gridColOnSp={'1/7'}
                editable={false}
              />
            </WidgetContainer>
            <Flex colGap='12px' rowGap='12px' width='100%' justifyContent='start'>
              <SocialLinkItem linkType={'telegram'} value={telegram} />
              <SocialLinkItem linkType={'twitter'} value={twitter} />
            </Flex>
            <ViewProfile href={`/did/${did}`}>
              <Text
                type='p'
                color={currentTheme.onBackground}
                font={getBasicFont(currentTypo.label.medium)}
                text={`View Profile`}
              />
              <Icon icon={ICONS.RIGHT_ARROW} mainColor={currentTheme.onBackground} size={'MM'} />
            </ViewProfile>
            {!myDid ? (
              <FlatButton
                src='/nfc/wallet.png'
                label={'Connect Wallet'}
                width='100%'
                height='96px'
                background={currentTheme.primary}
                labelColor={currentTheme.onPrimary}
                onClick={() => setShowConnectModal(true)}
              />
            ) : (
              <FlatButton
                src='/vessCard/gif2_condensed.gif'
                label={
                  isAlreadyIssued ? 'You already Issued Connection' : 'Issue Connection Credential'
                }
                width='100%'
                height='96px'
                background={currentTheme.surface5}
                labelColor={currentTheme.onBackground}
                iconSize={'48px'}
                onClick={() => issueConnection()}
                disabled={isAlreadyIssued}
              />
            )}
          </Flex>
        )}
      </CardContainer>
    </Flex>
  )
}
