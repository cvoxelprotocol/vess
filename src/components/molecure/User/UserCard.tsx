import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, MouseEvent } from 'react'
import { SocialLinkItem } from '../Profile/SocialLinkItem'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { AvatarPlaceholder } from '@/components/atom/Avatars/AvatarPlaceholder'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { DefaultCardColor } from '@/constants/ui'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  userId: string
}

export const UserCard: FC<Props> = ({ userId }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { profile } = useSocialAccount(userId)
  const { twitter, telegram, github } = useSocialLinks(userId)
  const { highlightedMembership, highlightedSelfClaimedMembership } =
    useHeldMembershipSubject(userId)
  const router = useRouter()

  const CardContainer = styled.div`
    background: ${currentTheme.surface2};
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    width: 100%;
    min-width: 280px;
    max-width: 320px;
    height: 245px;
  `
  const HeaderImage = styled.div`
    width: 100%;
    height: 74px;
  `
  const UserContainer = styled.div`
    padding: 26px 12px 12px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
  `
  const PfpContainer = styled.div`
    position: absolute;
    left: calc(50% - 28.5px);
    top: 40px;
    width: fit-content;
  `
  const PfpBackground = styled.div`
    width: 64px;
    height: 64px;
    background: ${currentTheme.outline};
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  const Name = styled.div`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.large)};
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

  const jumpToResume = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    router.push(`/did/${userId}`)
  }

  return (
    <CardContainer>
      <HeaderImage>
        <NextImageContainer src={'/base_item_header.png'} width={'100%'} objectFit={'cover'} />
      </HeaderImage>
      <UserContainer onClick={jumpToResume}>
        <PfpContainer>
          <PfpBackground>
            {profile.avatarSrc ? (
              <Avatar url={profile.avatarSrc} size={'XXL'} />
            ) : (
              <AvatarPlaceholder size={'XXL'} />
            )}
          </PfpBackground>
        </PfpContainer>
        <Name>{profile.displayName}</Name>
        <Flex justifyContent='center' alignItems='center' width='100%'>
          {highlightedMembership && !highlightedSelfClaimedMembership && (
            <InfoItem>
              <Avatar url={highlightedMembership.workspace?.icon} size={'MM'} />
              <Chip
                text={highlightedMembership.roles[0]}
                variant={'filled'}
                mainColor={
                  highlightedMembership.workspace?.primaryColor || DefaultCardColor.secondColor
                }
                textColor={
                  highlightedMembership.workspace?.optionColor || DefaultCardColor.textColor
                }
                size={'S'}
              />
            </InfoItem>
          )}
          {!highlightedMembership && highlightedSelfClaimedMembership && (
            <InfoItem>
              <Avatar url={'https://workspace.vess.id/company.png'} size={'MM'} />
              <Chip
                text={highlightedSelfClaimedMembership.membershipName}
                variant={'filled'}
                mainColor={DefaultCardColor.secondColor}
                textColor={DefaultCardColor.textColor}
                size={'S'}
              />
            </InfoItem>
          )}
        </Flex>
        <Flex justifyContent='center' alignItems='center' width='100%'>
          <SocialLinkItem linkType={'twitter'} value={twitter} />
          <SocialLinkItem linkType={'telegram'} value={telegram} />
          <SocialLinkItem linkType={'github'} value={github} />
        </Flex>
      </UserContainer>
    </CardContainer>
  )
}
