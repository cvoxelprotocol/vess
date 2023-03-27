import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Button } from '@/components/atom/Buttons/Button'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { Text } from '@/components/atom/Texts/Text'
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
// import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useToast } from '@/hooks/useToast'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateUnUsedInvitaion } from '@/jotai/connection'
import { shortenStr } from '@/utils/objectUtil'
import { getCurrentDomain } from '@/utils/url'

export const ETH_DENVER_EVENT_ID =
  'ceramic://kjzl6cwe1jw14ar8wuy2i31rkjaf1k8vrhae7qzucqjd9z8fmvsgceca7jb5c7b'
const DEFAULT_GREETING = 'Nice to meet you!'

export const InvitaionManagementForNFC: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { did } = useDIDAccount()
  const { showToast } = useToast()
  const [unused, setUnused] = useStateUnUsedInvitaion()
  // const { eventDetail } = useEventAttendance(ETH_DENVER_EVENT_ID)
  const { profile } = useSocialAccount(did)
  const router = useRouter()
  const { showLoading, closeLoading } = useVESSLoading()

  // === Invitation ===
  const [
    getMyConnectionInvitaions,
    { data: myInvitations, loading, refetch: refetchMyInvitation },
  ] = useGetMyConnectionInvitaionsLazyQuery()
  const [createConnectionInvitation] = useCreateConnectionInvitaionMutation()
  const [getConnectionInvitaion, { refetch }] = useGetConnectionInvitaionLazyQuery({
    ssr: false,
    variables: {
      id: unused || '',
    },
    nextFetchPolicy: 'network-only',
    onError(e) {
      if (e instanceof DOMException) {
        return
      }
      console.log(e)
    },
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
  const unusedInvitations = useMemo(() => {
    const invitations = myInvitations?.viewer?.connectionInvitationList?.edges
      ?.filter((edge) => edge?.node?.connection.edges?.length === 0)
      ?.map((e) => e?.node)
    if (!invitations || invitations.length === 0) return []
    setUnused(invitations[0]?.id)
    return invitations
  }, [myInvitations])

  const issueUnusedInvitation = async () => {
    if (unusedInvitations && unusedInvitations?.length >= 15) return
    showLoading()
    try {
      const content: ConnectionInvitationInput = {
        greeting: DEFAULT_GREETING,
        type: 'IRL',
      }
      let promises: Promise<any>[] = []
      Array.from({ length: 15 }).forEach(() => {
        const res = createConnectionInvitation({ variables: { content } })
        promises.push(res)
      })
      const result = await Promise.all(promises)
      console.log({ result })
      await refetchMyInvitation()
      closeLoading()
      showToast('Issued new nvitaions Successfully!')
    } catch (error) {
      console.error({ error })
      closeLoading()
      showToast('Failed to issue Invitaions...')
    }
  }
  const checkIssueConnection = useCallback(async () => {
    if (!unused) return
    try {
      const res = await refetch({ id: unused })
      if (
        res.data.node &&
        res.data.node.__typename === 'ConnectionInvitation' &&
        res.data.node?.connection.edges?.length === 1
      ) {
        const connection = res.data?.node?.connection?.edges[0]
        const userId = connection?.node?.did.id
        if (!userId) return
        const content: ConnectionInput = {
          userId: userId,
          invitationId: unused,
          connectAt: new Date().toISOString(),
        }
        const result = await createConnection({ variables: { content } })
        console.log({ result })
        if (result.data?.createConnection?.document.id) {
          setUnused(undefined)
          router.push(`/connection/issued/${result.data?.createConnection?.document.id}`)
          return
        }
      }
    } catch (error) {
      console.log({ error })
    }
  }, [unused])

  useEffect(() => {
    if (did && !unused) {
      init()
    }
  }, [did, unused])

  useEffect(() => {
    const refetchQueryInterval = setInterval(() => {
      checkIssueConnection()
    }, 15000)
    return () => clearInterval(refetchQueryInterval)
  }, [unused])

  return (
    <Flex flexDirection='column' colGap='12px' rowGap='12px'>
      <NextImageContainer src={'/connection/ntmy_1.png'} width={'280px'} height={'52px'} />
      {!unused ? (
        <CommonSpinner />
      ) : (
        <>
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
        </>
      )}
      <Text
        type='p'
        color={currentTheme.onSurface}
        font={getBasicFont(currentTypo.title.medium)}
        text={`I'm ${profile.displayName || ''}`}
      />
      {/* {eventDetail && (
        <Flex flexDirection='column' colGap='4px' rowGap='4px'>
          <At>at</At>
          <Flex colGap='4px' rowGap='4px'>
            <Avatar url={eventDetail.icon} size={'LL'} />
            <EventName>{eventDetail.name}</EventName>
          </Flex>
        </Flex>
      )} */}
      <Greeting>{DEFAULT_GREETING}</Greeting>
      {loading ? (
        <CommonSpinner />
      ) : (
        <Text
          type='p'
          color={currentTheme.onSurfaceVariant}
          font={getBasicFont(currentTypo.headLine.small)}
          text={`You have ${unusedInvitations?.length || 0} invitations`}
        />
      )}
      <Button
        variant='filled'
        text={'Issue Invitations x 15'}
        onClick={() => issueUnusedInvitation()}
        btnWidth={'240px'}
        disabled={(unusedInvitations && unusedInvitations?.length >= 15) || loading}
      />
    </Flex>
  )
}