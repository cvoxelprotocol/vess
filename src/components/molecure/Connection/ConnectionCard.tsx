import styled from '@emotion/styled'
import { FC } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { formatDate } from '@/utils/date'

type InvitaionProp = {
  __typename?: 'ConnectionInvitation'
  id: string
  type?: string | null
  status?: string | null
  greeting: string
  location?: string | null
  eventId?: string | null
}

type Props = {
  count: number
  userId?: string
  invitation?: InvitaionProp | null
  connectAt?: string
}

export const ConnectionCard: FC<Props> = ({ count, userId, invitation, connectAt }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { profile } = useSocialAccount(userId)
  const { eventDetail } = useEventAttendance(invitation?.eventId || '')

  const Wrapper = styled.div`
    position: relative;
  `
  const CardContainer = styled.div`
    background: ${currentTheme.depth1};
    &:hover {
      background: ${currentTheme.surface2};
    }
    overflow: hidden;
    border-radius: 32ypx;
    border: solid ${'hsla(342, 50%, 46%, 1)'};
    border-width: 1px;
    width: 216px;
    min-height: 256px;
    height: 100%;
    padding: 16px;
    @media (max-width: 599px) {
      width: 168px;
      min-height: 212px;
      padding: 14px 8px 8px;
    }
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    gap: 4px;
    margin: 0 auto;
    position: relative;
  `

  const Container = styled.div`
    width: 100%;
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `
  const PfpContainer = styled.div`
    width: fit-content;
    border: solid ${currentTheme.onSurface};
    border-width: 3px;
    border-radius: 100%;
  `

  const Name = styled.div`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.large)};
    }
    word-break: break-all;
  `
  const InfoItem = styled.p`
    color: ${currentTheme.onSurface};
    text-align: left;
    ${getBasicFont(currentTypo.label.medium)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.label.small)};
    }
    display: flex;
    align-items: center;
    column-gap: 4px;
  `
  const EventName = styled.p`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.label.small)};
  `
  const Greeting = styled.div`
    background: ${currentTheme.surface3};
    border-radius: 8px;
    padding: 12px;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.body.small)};
  `

  const CountBadge = styled.div`
    background: linear-gradient(91.03deg, #ac334a 0.44%, #b34a88 48.02%, #a95a2f 103.08%);
    border-radius: 72px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 16px;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.label.medium)};
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 10;
  `

  return (
    <Wrapper>
      {count > 1 && <CountBadge>{`${count} times`}</CountBadge>}
      <CardContainer>
        <Container>
          <PfpContainer>
            <Avatar url={profile.avatarSrc} size={'XXL'} />
          </PfpContainer>
          <Name>{profile.displayName}</Name>
          {eventDetail && (
            <Flex colGap='4px' rowGap='4px'>
              <Avatar url={eventDetail.icon} size={'MM'} />
              <EventName>{eventDetail.name}</EventName>
            </Flex>
          )}
          {invitation?.greeting && <Greeting>{invitation?.greeting}</Greeting>}
          <Flex>
            <InfoItem>{`${formatDate(connectAt)}`}</InfoItem>
          </Flex>
        </Container>
      </CardContainer>
    </Wrapper>
  )
}
