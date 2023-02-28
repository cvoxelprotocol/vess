import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import type { SelfClaimedMembershipSubject, WithCeramicId } from 'vess-sdk'
import { MembershipCard } from '../MembershipCard'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { DisplayMembership } from '@/interfaces/ui'
import { formatDate } from '@/utils/date'

type Props = {
  item?: DisplayMembership
  selfClaim?: WithCeramicId<SelfClaimedMembershipSubject>
}
export const ExperienceCard: FC<Props> = ({ item, selfClaim }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const period = useMemo(() => {
    if (item) {
      return `${
        item.credentialSubject.startDate ? formatDate(item.credentialSubject.startDate) : '?'
      } - ${
        item.credentialSubject.endDate ? formatDate(item.credentialSubject.endDate) : 'Present'
      }`
    }
    if (selfClaim) {
      return `${selfClaim.startDate ? formatDate(selfClaim.startDate) : '?'} - ${
        selfClaim.endDate ? formatDate(selfClaim.endDate) : 'Present'
      }`
    }
    return ''
  }, [item, selfClaim])

  const MembershipCardWrapper = styled.div`
    background: ${currentTheme.depth2};
    width: 100%;
    display: flex;
    padding: 12px 16px;
    gap: 24px;
    position: relative;
    border-radius: 24px;
    @media (max-width: 599px) {
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      gap: 8px;
      width: 292px;
    }
  `
  const InfoContainer = styled.div`
    flex-grow: 1;
    gap: 8px;
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    @media (max-width: 599px) {
      width: 100%;
      padding-top: 0px;
      gap: 4px;
    }
  `

  const Title = styled.div`
    color: ${currentTheme.primary};
    ${getBasicFont(currentTypo.headLine.medium)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.exLarge || currentTypo.title.large)};
    }
  `
  const Project = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
  `
  const ProjectName = styled.p`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.small)};
    }
  `
  const Label = styled.p`
    padding-top: 8px;
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.label.medium)};
      padding-top: 4px;
    }
  `
  if (item) {
    return (
      <MembershipCardWrapper key={item.ceramicId}>
        <MembershipCard
          title={item.workspace?.name || item.credentialSubject.organizationName}
          roles={item.roles}
          icon={item.workspace?.icon}
          mainColor={item.workspace?.primaryColor}
          secondColor={item.workspace?.secondaryColor}
          textColor={item.workspace?.optionColor}
          spMaxWidth={'280px'}
          spPadding={'24px'}
          vc
          startDate={item.credentialSubject.startDate}
          endDate={item.credentialSubject.endDate}
        />
        <InfoContainer>
          <Title>{item.roles.join(',')}</Title>
          <Project>
            <ImageContainer
              src={item.workspace?.icon || 'https://workspace.vess.id/company.png'}
              width={'26px'}
            />
            <ProjectName>
              {item.workspace?.name || item.credentialSubject.organizationName}
            </ProjectName>
          </Project>
          <Label>{period}</Label>
        </InfoContainer>
      </MembershipCardWrapper>
    )
  }
  if (selfClaim) {
    return (
      <MembershipCardWrapper key={selfClaim.ceramicId}>
        <MembershipCard
          title={selfClaim.organizationName}
          roles={[selfClaim.membershipName]}
          spMaxWidth={'280px'}
          spPadding={'24px'}
          startDate={selfClaim.startDate}
          endDate={selfClaim.endDate}
        />
        <InfoContainer>
          <Title>{selfClaim.membershipName}</Title>
          <Project>
            <ImageContainer src={'https://workspace.vess.id/company.png'} width={'26px'} />
            <ProjectName>{selfClaim.organizationName}</ProjectName>
          </Project>
          <Label>{period}</Label>
        </InfoContainer>
      </MembershipCardWrapper>
    )
  }

  return <></>
}
