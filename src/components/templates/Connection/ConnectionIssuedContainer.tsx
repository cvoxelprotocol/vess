import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { useGetConnectionLazyQuery } from '@/graphql/generated'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const ETH_DENVER_EVENT_ID =
  'ceramic://kjzl6cwe1jw14ag4w2mn6e3266u5f4k5lgfymdrl2j86zip6a7f0seuujrzuihq'

export const ConnectionIssuedContainer: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { did } = useDIDAccount()
  const { eventDetail } = useEventAttendance(ETH_DENVER_EVENT_ID)
  const router = useRouter()
  const connectionId = router.query.connectionId as string

  // === Invitation ===
  const [getConnection, { data: connection, loading, refetch, called }] = useGetConnectionLazyQuery(
    {
      ssr: false,
      variables: {
        id: connectionId || '',
      },
      nextFetchPolicy: 'network-only',
    },
  )
  // === Invitation ===

  const { profile } = useSocialAccount(
    connection?.node?.__typename === 'Connection' ? connection.node.userId : '',
  )

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
  const PfpContainer = styled.div`
    width: fit-content;
  `

  const init = async () => {
    try {
      await getConnection()
    } catch (error) {
      console.error({ error })
    }
  }

  useEffect(() => {
    init()
  }, [])

  const gotoProfile = () => {
    const userId =
      connection?.node?.__typename === 'Connection' ? connection.node.userId : undefined
    if (!userId) return
    router.push(`/${userId}`)
  }

  const backToMyProfile = () => {
    router.push(`/${did}`)
  }

  return (
    <Container>
      <Flex flexDirection='column' colGap='24px' rowGap='24px'>
        <NextImageContainer src={'/connection/ntmy_2.png'} width={'280px'} height={'52px'} />
        <PfpContainer>
          <Avatar url={profile.avatarSrc} size={'100'} />
        </PfpContainer>
        <Title>{`${profile.displayName || ''} issued the connection!`}</Title>
        {eventDetail && (
          <Flex flexDirection='column' colGap='4px' rowGap='4px'>
            <At>at</At>
            <Flex colGap='4px' rowGap='4px'>
              <Avatar url={eventDetail.icon} size={'LL'} />
              <EventName>{eventDetail.name}</EventName>
            </Flex>
          </Flex>
        )}
        <Button
          variant='filled'
          text='Go To Profile'
          onClick={() => gotoProfile()}
          btnWidth={'100%'}
          mainColor={'linear-gradient(91.03deg, #AC334A 0.44%, #B34A88 48.02%, #A95A2F 103.08%)'}
          textColor={currentTheme.onBackground}
        />
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
