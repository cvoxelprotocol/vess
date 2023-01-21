import { css } from '@emotion/react'
import styled from '@emotion/styled'
import clsx from 'clsx'
import { FC, useMemo } from 'react'
import { HomeIcon } from '@/components/atom/Icons/HomeIcon'
import { MessageIcon } from '@/components/atom/Icons/MessageIcon'
import { SettingsIcon } from '@/components/atom/Icons/SettingsIcon'
import { VoxelIcon } from '@/components/atom/Icons/VoxelIcon'
import { NavRailItemIcon } from '@/components/molecule/NavRail/NavRailItemIcon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export type NavRailItemType = 'myPage' | 'timeline' | 'chats' | 'setting'

type Props = {
  type: NavRailItemType
  selected: boolean
  onClick: () => void
}

export const NavRailItem: FC<Props> = ({ type, selected, onClick }) => {
  const { currentTheme, currentTypo } = useVESSTheme()

  const Container = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    gap: 4px;

    &:hover {
      #nav-item-icon {
        transition: ease-in-out 150ms;
        background: rgba(0, 74, 120, 0.2);
      }
    }
  `

  const ItemLabel = styled.div`
    color: ${currentTheme.onSecondaryContainer};
    font-family: ${currentTypo.label.medium.fontFamily};
    font-size: ${currentTypo.label.medium.fontSize};
    line-height: ${currentTypo.label.medium.lineHeight};
    font-weight: ${currentTypo.label.medium.fontWeight};
    ${(props) =>
      props.className?.split(' ').indexOf('selected') != -1 &&
      css`
        color: #99cbff;
      `}
  `

  const IconContainer = styled.div`
    width: 32px;
    height: 32px;
    color: ${currentTheme.onSecondaryContainer};
  `

  const icon = useMemo(() => {
    switch (type) {
      case 'myPage':
        return <HomeIcon />
      case 'timeline':
        return <VoxelIcon />
      case 'chats':
        return <MessageIcon />
      case 'setting':
        return <SettingsIcon />
    }
  }, [type])

  const label = useMemo(() => {
    switch (type) {
      case 'myPage':
        return 'MyPage'
      case 'timeline':
        return 'Timeline'
      case 'chats':
        return 'Chats'
      case 'setting':
        return 'Setting'
    }
  }, [type])

  return (
    <Container onClick={onClick}>
      <NavRailItemIcon selected={selected}>
        <IconContainer>{icon}</IconContainer>
      </NavRailItemIcon>
      <ItemLabel className={clsx(selected && 'selected')}>{label}</ItemLabel>
    </Container>
  )
}
