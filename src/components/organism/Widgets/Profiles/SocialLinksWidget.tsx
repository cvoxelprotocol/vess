import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { SocialLinkItem } from '@/components/molecure/Profile/SocialLinkItem'
import { isLinkTypeCandidate } from '@/constants/link'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  gridRowOnSp: string
  gridColOnSp: string
  editable?: boolean
  onClick?: () => void
  EditButtonPosition?: string
}

export const SocialLinksWidget: FC<Props> = (props) => {
  const { socialLinks, twitter, discord, telegram, github } = useSocialLinks(props.did)
  const { openSocialLinkModal } = useVESSWidgetModal()

  const otherLink = useMemo(() => {
    return socialLinks?.links?.find((link) => !isLinkTypeCandidate(link.linkType))
  }, [socialLinks?.links])

  const handleEdit = () => {
    openSocialLinkModal()
  }

  const LinkContainer = styled.div`
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 24px;
    @media (max-width: 1079px) {
      grid-gap: 24px;
    }
    @media (max-width: 599px) {
      grid-gap: 16px;
    }
  `

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props} background={'none'} overflow={'visible'}>
        <LinkContainer>
          <SocialLinkItem linkType={'twitter'} value={twitter} />
          <SocialLinkItem linkType={'discord'} value={discord} />
          <SocialLinkItem linkType={'telegram'} value={telegram} />
          <SocialLinkItem linkType={'github'} value={github} />
          <SocialLinkItem linkType={otherLink?.linkType} value={otherLink?.value} />
          <SocialLinkItem linkType={'more'} />
        </LinkContainer>
      </BaseWidget>
    </>
  )
}
