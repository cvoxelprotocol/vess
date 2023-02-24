import styled from '@emotion/styled'
import { FC, MouseEvent } from 'react'
import { SocialLinkItem } from '../Profile/SocialLinkItem'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { AvatarPlaceholder } from '@/components/atom/Avatars/AvatarPlaceholder'
import { IconButton } from '@/components/atom/Buttons/IconButton'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { DefaultCardColor } from '@/constants/ui'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useHighlightedCredentials } from '@/hooks/useHighlightedCredentials'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  userId: string
}

export const UserCard: FC<Props> = ({ userId }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { profile } = useSocialAccount(userId)
  const { socialLinks } = useSocialLinks(userId)
  const { highlightedMembership, highlightedSelfClaimedMembership } =
    useHeldMembershipSubject(userId)

  const CardContainer = styled.div`
    background: ${currentTheme.surface2};
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    max-width: 300px;
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
    // router.push(`${process.env.NEXT_PUBLIC_VESS_FRONTEND}/${userId}`)
    window.open(`https://vess.vercel.app/${userId}`, '_blank')
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
        {socialLinks?.links && (
          <Flex justifyContent='center' alignItems='center' width='100%'>
            {socialLinks.links?.length > 0 &&
              socialLinks.links
                .filter((l) => l.linkType !== 'discord')
                .slice(0, 3)
                .map((link) => {
                  return (
                    <SocialLinkItem key={link.value} linkType={link.linkType} value={link.value} />
                  )
                })}
          </Flex>
        )}
      </UserContainer>
    </CardContainer>
  )
}
