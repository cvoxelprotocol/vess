import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, MouseEvent } from 'react'
import { SocialLinkItem } from '../Profile/SocialLinkItem'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { AvatarPlaceholder } from '@/components/atom/Avatars/AvatarPlaceholder'
import { IconButton } from '@/components/atom/Buttons/IconButton'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { DefaultCardColor } from '@/constants/ui'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { shortenStr } from '@/utils/objectUtil'

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
    background: ${currentTheme.surface1};
    position: relative;
    overflow: hidden;
    padding: 24px 0px 16px 0px;
    border-radius: 32px;
    width: 100%;
    min-width: 216px;
    height: 248px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: all 0.15s ease-in-out;
  `

  const NameContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `
  const Identifier = styled.span`
    color: ${currentTheme.outline};
    ${getBasicFont(currentTypo.label.medium)};
  `

  const UserContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
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

  const jumpToLink = (url: string | undefined, e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    window.open(url, '_blank')
  }

  return (
    <CardContainer>
      <UserContainer onClick={jumpToResume}>
        <PfpBackground>
          {profile.avatarSrc ? (
            <Avatar url={profile.avatarSrc} size={'XXL'} />
          ) : (
            <AvatarPlaceholder size={'XXL'} />
          )}
        </PfpBackground>
        <NameContainer>
          <Name>{profile.displayName}</Name>
          <Identifier>{shortenStr(userId, 10)}</Identifier>
        </NameContainer>
      </UserContainer>
      <Flex justifyContent='center' alignItems='center' width='100%' colGap='8px'>
        {highlightedMembership && !highlightedSelfClaimedMembership && (
          <InfoItem>
            <Avatar url={highlightedMembership.workspace?.icon} size={'L'} />
            <Chip
              text={highlightedMembership.roles[0]}
              variant={'filled'}
              mainColor={
                highlightedMembership.workspace?.secondaryColor || DefaultCardColor.secondColor
              }
              textColor={highlightedMembership.workspace?.optionColor || DefaultCardColor.textColor}
              size={'S'}
            />
          </InfoItem>
        )}
        {!highlightedMembership && highlightedSelfClaimedMembership && (
          <InfoItem>
            <Avatar url={'https://workspace.vess.id/company.png'} size={'L'} />
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
      <Flex justifyContent='center' alignItems='center' width='100%' colGap='8px'>
        <IconButton
          icon={ICONS.TWITTER}
          variant='text'
          mainColor={currentTheme.onSurface}
          size='MM'
          disabled={!twitter}
          onClick={(e) => jumpToLink(twitter, e)}
        />
        <IconButton
          icon={ICONS.TELEGRAM}
          mainColor={currentTheme.onSurface}
          variant='text'
          size='MM'
          disabled={!telegram}
          onClick={(e) => jumpToLink(telegram, e)}
        />
        <IconButton
          icon={ICONS.GITHUB}
          mainColor={currentTheme.onSurface}
          variant='text'
          size='MM'
          disabled={!github}
          onClick={(e) => jumpToLink(github, e)}
        />
      </Flex>
    </CardContainer>
  )
}
