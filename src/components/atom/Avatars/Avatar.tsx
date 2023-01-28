import styled from '@emotion/styled'
import * as radixAvatar from '@radix-ui/react-avatar'
import { FC } from 'react'
import { ICONSIZE, IconSize } from '../Icons/Icon'
import { AvatarPlaceholder } from './AvatarPlaceholder'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface AvatarProps {
  url?: string
  userName?: string
  size?: IconSize
}

export const Avatar: FC<AvatarProps> = ({ url, size = 'L', userName }) => {
  const { currentTheme, currentTypo } = useVESSTheme()

  const AvatarContainer = styled(radixAvatar.Root)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    user-select: none;
    width: ${ICONSIZE[size]};
    height: ${ICONSIZE[size]};
    border-radius: 100%;
    background-color: var(--blackA3);
  `
  const AvatarContent = styled(radixAvatar.Image)`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  `
  const FallbackContent = styled(radixAvatar.Fallback)`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${currentTheme.bodyBackground};
    color: ${currentTheme.primary};
    font-size: ${currentTypo.body.small.fontSize};
    line-height: ${currentTypo.body.small.lineHeight};
    font-weight: ${currentTypo.body.small.fontWeight};
  `

  return (
    <AvatarContainer>
      <AvatarContent src={url} alt={url} />
      <FallbackContent delayMs={5000}>
        <AvatarPlaceholder size={'XXL'} />
      </FallbackContent>
    </AvatarContainer>
  )
}
