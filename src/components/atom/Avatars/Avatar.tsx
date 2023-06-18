import styled from '@emotion/styled'
import * as radixAvatar from '@radix-ui/react-avatar'
import { FC, memo } from 'react'
import { ICONSIZE, IconSize } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

interface AvatarProps {
  url?: string
  userName?: string
  size?: IconSize
  fill?: boolean
  withBorder?: boolean
}

const AvatarContent: FC<AvatarProps> = ({
  url,
  size = 'L',
  userName,
  fill = false,
  withBorder = false,
}) => {
  const { currentTheme } = useVESSTheme()

  const AvatarContainer = styled(radixAvatar.Root)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    user-select: none;
    width: ${fill ? '100%' : ICONSIZE[size]};
    height: ${fill ? '100%' : ICONSIZE[size]};
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

  const AvatarPlaceholder = styled.div`
    width: ${fill ? '100%' : ICONSIZE[size]};
    height: ${fill ? '100%' : ICONSIZE[size]};
    background-image: linear-gradient(
      to top right,
      ${currentTheme.primary},
      ${currentTheme.secondary}
    );
  `

  const WithBorder = styled.div`
    width: fit-content;
    border: solid ${currentTheme.onSurface};
    border-width: 3px;
    border-radius: 100%;
  `

  if (withBorder) {
    return (
      <WithBorder>
        <AvatarContainer>
          <AvatarContent src={url} alt={url} />
          <FallbackContent delayMs={500}>
            <AvatarPlaceholder />
          </FallbackContent>
        </AvatarContainer>
      </WithBorder>
    )
  }

  return (
    <AvatarContainer>
      <AvatarContent src={url} alt={url} />
      <FallbackContent delayMs={500}>
        <AvatarPlaceholder />
      </FallbackContent>
    </AvatarContainer>
  )
}

export const Avatar = memo<AvatarProps>((props) => <AvatarContent {...props} />)
Avatar.displayName = 'Avatar'
