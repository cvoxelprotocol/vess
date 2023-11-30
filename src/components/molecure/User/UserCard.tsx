import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, MouseEvent } from 'react'
import { getAddressFromPkh } from 'vess-sdk'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { IconButton } from '@/components/atom/Buttons/IconButton'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { Text } from '@/components/atom/Texts/Text'
import { DefaultCardColor } from '@/constants/uiV1'
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
  const profileWalletAddress = getAddressFromPkh(userId)

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

  const jumpToResume = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    router.push(`/did/${userId}`)
  }

  const jumpToLink = (
    url: string | undefined,
    e: MouseEvent<HTMLDivElement>,
    linkType: 'twitter' | 'telegram' | 'github',
  ) => {
    e.preventDefault()
    if (linkType === 'twitter' || linkType === 'github') {
      window.open(url, '_blank')
      return
    } else {
      window.open(`https://t.me/${url}`, '_blank')
      return
    }
  }

  return (
    <CardContainer>
      <Flex flexDirection='column' width='100%' colGap='8px' rowGap='8px' onClick={jumpToResume}>
        <Avatar url={profile.avatarSrc} size={'XXL'} withBorder />
        <Flex flexDirection='column' width='100%'>
          <Text
            type='p'
            color={currentTheme.onSurface}
            font={getBasicFont(currentTypo.title.large)}
            text={profile.displayName}
          />
          <Text
            type='span'
            color={currentTheme.outline}
            font={getBasicFont(currentTypo.label.medium)}
            text={shortenStr(profileWalletAddress, 10)}
          />
        </Flex>
      </Flex>
      <Flex justifyContent='center' alignItems='center' width='100%' colGap='8px'>
        {highlightedMembership && !highlightedSelfClaimedMembership && (
          <>
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
          </>
        )}
        {!highlightedMembership && highlightedSelfClaimedMembership && (
          <>
            <Avatar url={'https://workspace.vess.id/company.png'} size={'L'} />
            <Chip
              text={highlightedSelfClaimedMembership.membershipName}
              variant={'filled'}
              mainColor={DefaultCardColor.secondColor}
              textColor={DefaultCardColor.textColor}
              size={'S'}
            />
          </>
        )}
      </Flex>
      <Flex justifyContent='center' alignItems='center' width='100%' colGap='8px'>
        {twitter && (
          <IconButton
            icon={ICONS.TWITTER}
            variant='text'
            mainColor={currentTheme.onSurface}
            size='MM'
            disabled={!twitter}
            onClick={(e) => jumpToLink(twitter, e, 'twitter')}
          />
        )}
        {telegram && (
          <IconButton
            icon={ICONS.TELEGRAM}
            mainColor={currentTheme.onSurface}
            variant='text'
            size='MM'
            disabled={!telegram}
            onClick={(e) => jumpToLink(telegram, e, 'telegram')}
          />
        )}
        {github && (
          <IconButton
            icon={ICONS.GITHUB}
            mainColor={currentTheme.onSurface}
            variant='text'
            size='MM'
            disabled={!github}
            onClick={(e) => jumpToLink(github, e, 'github')}
          />
        )}
      </Flex>
    </CardContainer>
  )
}
