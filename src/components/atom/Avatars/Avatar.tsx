import styled from '@emotion/styled'
import * as radixAvatar from '@radix-ui/react-avatar'
import { FC, memo } from 'react'
import { ICONSIZE, IconSize } from '../Icons/Icon'
import { AvatarPlaceholder } from './AvatarPlaceholder'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface AvatarProps {
  url?: string
  userName?: string
  size?: IconSize
}

const AvatarContent: FC<AvatarProps> = ({ url, size = 'L', userName }) => {
  const { currentTheme } = useVESSTheme()

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
  `

  return (
    <AvatarContainer>
      <AvatarContent src={url} alt={url} />
      <FallbackContent delayMs={500}>
        <AvatarPlaceholder size={size} />
      </FallbackContent>
    </AvatarContainer>
  )
}

export const Avatar = memo<AvatarProps>((props) => <AvatarContent {...props} />)
Avatar.displayName = 'Avatar'
