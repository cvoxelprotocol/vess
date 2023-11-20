import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import type { SelfClaimedMembershipSubject, WithCeramicId } from 'vess-sdk'
import { MembershipCard } from '../MembershipCard'
import { BaseCredential } from '@/@types/credential'
import { Flex } from '@/components/atom/Common/Flex'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { Text } from '@/components/atom/Texts/Text'
import { useOrganization } from '@/hooks/useOrganization'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { formatDate } from '@/utils/date'

type Props = {
  item?: WithCeramicId<BaseCredential>
  selfClaim?: WithCeramicId<SelfClaimedMembershipSubject>
}
export const ExperienceCard: FC<Props> = ({ item, selfClaim }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { organization } = useOrganization(item?.credentialSubject.organizationId || undefined)
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
  if (item) {
    return (
      <MembershipCardWrapper key={item.ceramicId}>
        <MembershipCard
          title={item.workspace?.name || item.credentialSubject.organizationName}
          roles={item.roles}
          icon={item.workspace?.icon}
          mainColor={organization?.primaryColor}
          secondColor={organization?.secondaryColor}
          textColor={organization?.optionColor}
          spMaxWidth={'280px'}
          spPadding={'24px'}
          vc
          startDate={item.credentialSubject.startDate}
          endDate={item.credentialSubject.endDate}
        />
        <InfoContainer>
          <Text
            type='p'
            color={currentTheme.primary}
            font={getBasicFont(currentTypo.headLine.medium)}
            fontSp={getBasicFont(currentTypo.title.large)}
            text={item.roles.join(',')}
          />
          <Flex colGap='6px' rowGap='6px'>
            <ImageContainer
              src={item.workspace?.icon || 'https://workspace.vess.id/company.png'}
              width={'26px'}
            />
            <Text
              type='p'
              color={currentTheme.onSurface}
              font={getBasicFont(currentTypo.title.large)}
              fontSp={getBasicFont(currentTypo.title.small)}
              text={item.workspace?.name || item.credentialSubject.organizationName}
            />
          </Flex>
          <Text
            type='p'
            color={currentTheme.onSurfaceVariant}
            font={getBasicFont(currentTypo.label.large)}
            fontSp={getBasicFont(currentTypo.label.medium)}
            text={period}
          />
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
          <Text
            type='p'
            color={currentTheme.primary}
            font={getBasicFont(currentTypo.headLine.medium)}
            fontSp={getBasicFont(currentTypo.title.large)}
            text={selfClaim.membershipName}
          />
          <Flex colGap='6px' rowGap='6px'>
            <ImageContainer src={'https://workspace.vess.id/company.png'} width={'26px'} />
            <Text
              type='p'
              color={currentTheme.onSurface}
              font={getBasicFont(currentTypo.title.large)}
              fontSp={getBasicFont(currentTypo.title.small)}
              text={selfClaim.organizationName}
            />
          </Flex>
          <Text
            type='p'
            color={currentTheme.onSurfaceVariant}
            font={getBasicFont(currentTypo.label.large)}
            fontSp={getBasicFont(currentTypo.label.medium)}
            text={period}
          />
        </InfoContainer>
      </MembershipCardWrapper>
    )
  }

  return <></>
}
