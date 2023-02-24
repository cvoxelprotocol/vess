import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { formatDate } from '@/utils/date'

type Props = {
  userId?: string
  partnerUserId?: string
  connectAt?: string
}

export const ConnectionListItem: FC<Props> = ({ userId, partnerUserId, connectAt }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { profile } = useSocialAccount(userId)
  const { profile: partnerProfile } = useSocialAccount(partnerUserId)

  const CardContainer = styled.div`
    background: ${currentTheme.background};
    &:hover {
      background: ${currentTheme.surface1};
    }
    overflow: hidden;
    border: solid ${currentTheme.surfaceVariant};
    border-width: 1px;
    width: 100%;
    min-height: 138px;
    height: 138px;
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 44px 1fr;
    grid-template-rows: 20px 1fr;
  `

  const PfpContainer = styled.div`
    width: fit-content;
    border: solid ${currentTheme.onSurface};
    border-width: 3px;
    border-radius: 100%;
  `

  const Name = styled.div`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.small)};
    }
    word-break: break-all;
  `
  const InfoItem = styled.p`
    grid-column: 1/4;
    grid-row: 1/2;
    width: 100%;
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.label.medium)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.label.small)};
    }
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 4px;
  `

  const LinkContainer = styled(Link)`
    text-decoration: none;
  `

  return (
    <CardContainer>
      <InfoItem>{`${formatDate(connectAt)}`}</InfoItem>
      <LinkContainer href={`/did/${userId}`}>
        <Flex
          flexDirection='row'
          colGap='8px'
          rowGap='4px'
          justifyContent='start'
          width='100%'
          flexDirectionSP='column'
          justifyContentSP='center'
          padding={'8px 24px'}
          paddingSP={'0px'}
        >
          <PfpContainer>
            <Avatar url={profile.avatarSrc} size={'XXL'} />
          </PfpContainer>
          <Name>{profile.displayName}</Name>
        </Flex>
      </LinkContainer>
      <NextImageContainer src={'/connection/meets.png'} width={'44px'} />
      <LinkContainer href={`/did/${partnerUserId}`}>
        <Flex
          flexDirection='row'
          colGap='8px'
          rowGap='4px'
          justifyContent='start'
          width='100%'
          flexDirectionSP='column'
          justifyContentSP='center'
          padding={'8px 24px'}
          paddingSP={'0px'}
        >
          <PfpContainer>
            <Avatar url={partnerProfile.avatarSrc} size={'XXL'} />
          </PfpContainer>
          <Name>{partnerProfile.displayName}</Name>
        </Flex>
      </LinkContainer>
    </CardContainer>
  )
}
