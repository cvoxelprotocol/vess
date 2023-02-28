import styled from '@emotion/styled'
import { FC } from 'react'
import { IconSize, ICONSIZE } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  size: IconSize
  fill?: boolean
}

export const AvatarPlaceholder: FC<Props> = ({ size, fill = false }) => {
  const { currentTheme } = useVESSTheme()
  const AvatarContainer = styled.div`
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
  const Avatar = styled.div`
    width: ${fill ? '100%' : ICONSIZE[size]};
    height: ${fill ? '100%' : ICONSIZE[size]};
    background-image: linear-gradient(
      to top right,
      ${currentTheme.primary},
      ${currentTheme.secondary}
    ); ;
  `
  return (
    <AvatarContainer>
      <Avatar />
    </AvatarContainer>
  )
}
