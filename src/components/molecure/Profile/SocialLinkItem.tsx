import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { Icon } from '@/components/atom/Icons/Icon'
import { getLinkIcon } from '@/constants/link'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  linkType?: string
  value?: string
}

export const SocialLinkItem: FC<Props> = ({ linkType, value }) => {
  const { currentTheme } = useVESSTheme()
  const { openSocialLinkModal } = useVESSWidgetModal()

  const icon = useMemo(() => {
    return getLinkIcon(linkType)
  }, [linkType])

  const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: ${currentTheme.surface2};
    border-radius: 12px;
    width: 56px;
    height: 56px;
    @media (max-width: 599px) {
      width: 44px;
      height: 44px;
    }
    opacity: ${value || linkType === 'more' ? 1 : 0.4};
  `

  const handleClick = () => {
    if (!value) return
    if (linkType === 'twitter' || linkType === 'github' || linkType === 'url') {
      window.open(value, '_blank')
      return
    } else if (linkType === 'telegram') {
      if (isMobile) {
        window.open(`tg://resolve?domain=${value}`, '_blank')
      } else {
        window.open(`tg://resolve?domain=${value}`)
      }
      return
    } else if (linkType === 'more') {
      openSocialLinkModal()
    }
  }

  return (
    <IconContainer onClick={() => handleClick()}>
      <Icon icon={icon} size={'L'} mainColor={currentTheme.onSurface} />
    </IconContainer>
  )
}
