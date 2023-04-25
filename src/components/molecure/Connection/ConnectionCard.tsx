import styled from '@emotion/styled'
import { FC } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { Text } from '@/components/atom/Texts/Text'
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
    border-radius: 32px;
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
        <Flex width='100%' colGap='8px' rowGap='8px' flexDirection='column'>
          <Avatar url={profile.avatarSrc} size={'XXL'} withBorder />
          <Text
            type='p'
            color={currentTheme.onSurface}
            font={getBasicFont(currentTypo.title.large)}
            text={profile.displayName}
          />
          {eventDetail && (
            <Flex colGap='4px' rowGap='4px'>
              <Avatar url={eventDetail.icon} size={'MM'} />
              <Text
                type='p'
                color={currentTheme.onSurface}
                font={getBasicFont(currentTypo.label.small)}
                text={eventDetail.name}
              />
            </Flex>
          )}
          <Flex>
            <Text
              type='p'
              color={currentTheme.onSurface}
              font={getBasicFont(currentTypo.label.medium)}
              fontSp={getBasicFont(currentTypo.label.small)}
              text={`${formatDate(connectAt)}`}
            />
          </Flex>
        </Flex>
      </CardContainer>
    </Wrapper>
  )
}
