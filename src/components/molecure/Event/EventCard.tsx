import styled from '@emotion/styled'
import { FC } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { VerifiedMark } from '@/components/atom/Badges/VerifiedMark'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { Text } from '@/components/atom/Texts/Text'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useOrganization } from '@/hooks/useOrganization'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { formatDate } from '@/utils/date'

type Props = {
  ceramicId: string
}

export const EventCard: FC<Props> = ({ ceramicId }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { eventDetail } = useEventAttendance(ceramicId)
  const { organization } = useOrganization(eventDetail?.organizationId)

  const CardContainer = styled.div`
    background: ${currentTheme.surface};
    &:hover {
      background: ${currentTheme.surface1};
    }
    overflow: hidden;
    border-radius: 16px;
    border: solid ${currentTheme.outline};
    border-width: 1px;
    width: 216px;
    min-height: 280px;
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
    gap: 10px;
    margin: 0 auto;
  `

  return (
    <CardContainer>
      <Flex colGap='16px' rowGap='16px' width='100%' flexDirection='column'>
        <VerifiedMark size='L' />
        <Avatar url={eventDetail?.icon} size={'100'} withBorder />
        <Text
          type='p'
          color={currentTheme.onSurface}
          font={getBasicFont(currentTypo.title.medium)}
          fontSp={getBasicFont(currentTypo.title.small)}
          text={eventDetail?.name}
        />
        <Flex colGap='4px' rowGap='4px'>
          <Icon icon={ICONS.CALENDAR} size={'MM'} />
          <Text
            type='p'
            color={currentTheme.onSurface}
            font={getBasicFont(currentTypo.label.medium)}
            fontSp={getBasicFont(currentTypo.label.small)}
            text={`${formatDate(eventDetail?.startDate)}`}
          />
        </Flex>
        <Flex colGap='4px' rowGap='4px'>
          <Avatar url={organization?.icon} size={'S'} />
          <Text
            type='p'
            color={currentTheme.onSurfaceVariant}
            font={getBasicFont(currentTypo.label.medium)}
            fontSp={getBasicFont(currentTypo.label.small)}
            text={organization?.name}
          />
        </Flex>
      </Flex>
    </CardContainer>
  )
}
