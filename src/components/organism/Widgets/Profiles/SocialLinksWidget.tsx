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
  editable?: boolean
  onClick?: () => void
}

export const SocialLinksWidget: FC<Props> = (props) => {
  const { socialLinks, isFetchingSocialLinks } = useSocialLinks(props.did)
  const { openSocialLinkModal } = useVESSWidgetModal()

  const twitter = useMemo(() => {
    return socialLinks?.links?.find((link) => link.linkType === 'twitter')?.value
  }, [socialLinks?.links])

  const discord = useMemo(() => {
    return socialLinks?.links?.find((link) => link.linkType === 'discord')?.value
  }, [socialLinks?.links])

  const telegram = useMemo(() => {
    return socialLinks?.links?.find((link) => link.linkType === 'telegram')?.value
  }, [socialLinks?.links])

  const github = useMemo(() => {
    return socialLinks?.links?.find((link) => link.linkType === 'github')?.value
  }, [socialLinks?.links])

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
  `

  return (
    <>
      <BaseWidget
        onClickEdit={handleEdit}
        {...props}
        background={'none'}
        EditButtonPosition={'0px'}
      >
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
