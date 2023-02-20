import styled from '@emotion/styled'
import { FC } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { VerifiedMark } from '@/components/atom/Badges/VerifiedMark'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useOrganization } from '@/hooks/useOrganization'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { formatDate } from '@/utils/date'
import { shortenStr } from '@/utils/objectUtil'

type Props = {
  streamId?: string
}
export const EventDetailContent: FC<Props> = ({ streamId }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { eventDetail } = useEventAttendance(streamId)
  const { organization } = useOrganization(eventDetail?.organizationId)

  const Container = styled.div`
    padding: 32px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 65vh;
    gap: 16px;
    background: ${currentTheme.surface3};
    margin-bottom: 60px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    @media (max-width: 599px) {
      height: 70vh;
      margin: 0 12px;
    }
  `
  const InfoContainer = styled.div`
    display: flex;
    gap: 32px;
    @media (max-width: 599px) {
      width: 100%;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
  `

  const Title = styled.div`
    color: ${currentTheme.primary};
    ${getBasicFont(currentTypo.headLine.medium)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.large)};
    }
  `
  const Project = styled.div`
    display: flex;
    align-items: center;
  `
  const ProjectName = styled.p`
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.small)};
    }
  `
  const PfpContainer = styled.div`
    width: 200px;
    height: 200px;
  `
  const InfoContent = styled.div`
    display: flex;
    gap: 8px;
    flex-direction: column;
    flex-grow: 1;
    @media (max-width: 599px) {
      width: 100%;
    }
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
  const LinkText = styled.a`
    color: ${currentTheme.secondary};
    text-decoration: none;
  `

  const Section = styled.div`
    width: 100%;
    display: flex;
    gap: 8px;
    flex-direction: column;
  `

  const SectionHeader = styled.p`
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.large)};
  `

  const SectionContent = styled.div`
    width: 100%;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.body.large)};
    word-wrap: break-word;
  `

  return (
    <Container>
      <InfoContainer>
        <PfpContainer>
          <Avatar url={eventDetail?.icon} size={'200'} />
        </PfpContainer>
        <InfoContent>
          <Title>{eventDetail?.name}</Title>
          <Project>
            <ImageContainer
              src={organization?.icon || 'https://workspace.vess.id/company.png'}
              width={'26px'}
            />
            <ProjectName>{organization?.name}</ProjectName>
          </Project>
          <InfoItem>
            <Icon icon={ICONS.CALENDAR} size={'MM'} />
            {`${formatDate(eventDetail?.startDate)}`}
          </InfoItem>
          <InfoItem>
            <Icon icon={ICONS.CHAIN} size={'MM'} />
            <LinkText href={eventDetail?.url} target='_blank' rel='noreferrer'>{`${shortenStr(
              eventDetail?.url,
              30,
            )}`}</LinkText>
          </InfoItem>
          <VerifiedMark withText={'Verified'} tailIcon={ICONS.EXTERNAL} />
        </InfoContent>
      </InfoContainer>
      <Section>
        <SectionHeader>About</SectionHeader>
        <SectionContent>{eventDetail?.desc}</SectionContent>
      </Section>
      <Section>
        <SectionHeader>Other Holders</SectionHeader>
        <SectionContent>Coming soon...</SectionContent>
      </Section>
    </Container>
  )
}
