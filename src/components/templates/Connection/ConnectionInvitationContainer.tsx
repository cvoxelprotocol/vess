import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Button } from '@/components/atom/Buttons/Button'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { QRCode } from '@/components/organism/Modal/QR/QRCode'
import {
  ConnectionInvitationInput,
  useCreateConnectionInvitaionMutation,
  useCreateConnectionMutation,
  useGetConnectionInvitaionLazyQuery,
  useGetMyConnectionInvitaionsLazyQuery,
  ConnectionInput,
} from '@/graphql/generated'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useToast } from '@/hooks/useToast'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateUnUsedInvitaion } from '@/jotai/connection'
import { shortenStr } from '@/utils/objectUtil'
import { getCurrentDomain } from '@/utils/url'

export const ETH_DENVER_EVENT_ID =
  'ceramic://kjzl6cwe1jw14ag4w2mn6e3266u5f4k5lgfymdrl2j86zip6a7f0seuujrzuihq'
const DEFAULT_GREETING = 'Nice to meet you!'

export const ConnectionInvitationContainer: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { did } = useDIDAccount()
  const { showToast } = useToast()
  const [unused, setUnused] = useStateUnUsedInvitaion()
  const { eventDetail } = useEventAttendance(ETH_DENVER_EVENT_ID)
  const { profile } = useSocialAccount(did)
  const router = useRouter()

  // === Invitation ===
  const [getMyConnectionInvitaions, { data: myInvitations }] =
    useGetMyConnectionInvitaionsLazyQuery()
  const [createConnectionInvitation] = useCreateConnectionInvitaionMutation()
  const [getConnectionInvitaion, { refetch }] = useGetConnectionInvitaionLazyQuery({
    ssr: false,
    variables: {
      id: unused || '',
    },
    nextFetchPolicy: 'network-only',
  })
  // === Invitation ===
  const [createConnection] = useCreateConnectionMutation()

  const Container = styled.div`
    padding: 12px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    align-items: center;
    background: ${currentTheme.surface3};
    height: 100%;
  `
  const QRContent = styled.div`
    display: flex;
    column-gap: 8px;
    justify-content: center;
    align-items: center;
  `
  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.headLine.small)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.large)};
    }
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
  const PfpContainer = styled.div`
    width: fit-content;
  `

  const myLink = useMemo(() => {
    if (!unused) return `${getCurrentDomain()}/connection/issue/`
    return `${getCurrentDomain()}/connection/issue/${unused}`
  }, [unused])

  const qrcodeRef = useRef<HTMLDivElement>(null)

  const QRCodeContent = forwardRef<HTMLDivElement, { url: string }>((props, ref) => {
    return (
      <div ref={ref}>
        <QRCode url={props.url} />
      </div>
    )
  })
  QRCodeContent.displayName = 'QRCodeContent'

  const handleOnCopy = async () => {
    showToast('Copied!')
  }

  const init = async () => {
    try {
      await getMyConnectionInvitaions()
    } catch (error) {
      console.error({ error })
    }
  }
  const getUnusedInvitation = async () => {
    try {
      console.log({ myInvitations })
      const target = myInvitations?.viewer?.connectionInvitationList?.edges?.find(
        (edge) => edge?.node?.connection.edges?.length === 0,
      )?.node

      if (target) {
        console.log({ target })
        setUnused(target.id)
      } else {
        const content: ConnectionInvitationInput = {
          greeting: DEFAULT_GREETING,
          type: 'IRL',
          eventId: ETH_DENVER_EVENT_ID,
        }
        const res = await createConnectionInvitation({ variables: { content } })
        setUnused(res.data?.createConnectionInvitation?.document.id || '')
      }
      await getConnectionInvitaion()
    } catch (error) {
      console.error({ error })
    }
  }

  const checkIssueConnection = useCallback(async () => {
    console.log({ unused })
    if (!unused) return
    const res = await refetch({ id: unused })
    console.log({ res })
    if (
      res.data.node &&
      res.data.node.__typename === 'ConnectionInvitation' &&
      res.data.node?.connection.edges?.length === 1
    ) {
      const connection = res.data?.node?.connection?.edges[0]
      console.log({ connection })
      const userId = connection?.node?.did.id
      if (!userId) return
      const content: ConnectionInput = {
        userId: userId,
        invitationId: unused,
        connectAt: new Date().toISOString(),
      }
      console.log({ content })
      const result = await createConnection({ variables: { content } })
      console.log({ result })
      if (result.data?.createConnection?.document.id) {
        setUnused(undefined)
        router.push(`/connection/issued/${result.data?.createConnection?.document.id}`)
        return
      }
    }
  }, [unused])

  const backToMyProfile = () => {
    router.push(`/${did}`)
  }

  useEffect(() => {
    if (did && !unused) {
      init()
    }
  }, [did, unused])

  useEffect(() => {
    if (!unused && myInvitations) {
      getUnusedInvitation()
    }
  }, [myInvitations, unused])

  useEffect(() => {
    const refetchQueryInterval = setInterval(() => {
      console.log('refetch!')
      checkIssueConnection()
    }, 10000)
    return () => clearInterval(refetchQueryInterval)
  }, [unused])

  return (
    <Container>
      <Flex flexDirection='column' colGap='24px' rowGap='24px'>
        <NextImageContainer src={'/connection/ntmy_1.png'} width={'280px'} height={'52px'} />
        <QRContent>
          <QRCodeContent url={myLink} ref={qrcodeRef} />
        </QRContent>
        <CopyToClipboard text={myLink} onCopy={handleOnCopy}>
          <Chip
            text={shortenStr(myLink, 30)}
            solo
            size='S'
            mainColor={currentTheme.outline}
            textColor={currentTheme.outline}
            tailIcon={ICONS.COPY}
          />
        </CopyToClipboard>
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
        <Greeting>{DEFAULT_GREETING}</Greeting>
      </Flex>
      <Button
        variant='outlined'
        text='Close'
        mainColor={currentTheme.primary}
        textColor={currentTheme.primary}
        type='button'
        onClick={() => backToMyProfile()}
      />
    </Container>
  )
}
