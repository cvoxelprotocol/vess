import styled from '@emotion/styled'
import { FC } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { VerifiedMark } from '@/components/atom/Badges/VerifiedMark'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
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

  const Container = styled.div`
    width: 100%;
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `
  const PfpContainer = styled.div`
    width: fit-content;
  `

  const Name = styled.div`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.medium)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.small)};
    }
    word-break: break-all;
  `
  const Flex = styled.div`
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
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
  const Organizer = styled.div`
    color: ${currentTheme.onSurfaceVariant};
    text-align: left;
    ${getBasicFont(currentTypo.label.medium)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.label.small)};
    }
    display: flex;
    align-items: center;
    column-gap: 4px;
  `

  return (
    <CardContainer>
      <Container>
        <VerifiedMark size='L' />
        <PfpContainer>
          <Avatar url={eventDetail?.icon} size={'100'} />
        </PfpContainer>
        <Name>{eventDetail?.name}</Name>
        <Flex>
          <InfoItem>
            <Icon icon={ICONS.CALENDAR} size={'MM'} />
            {`${formatDate(eventDetail?.startDate)}`}
          </InfoItem>
        </Flex>
        <Organizer>
          <Avatar url={organization?.icon} size={'S'} />
          {`${organization?.name}`}
        </Organizer>
      </Container>
    </CardContainer>
  )
}
