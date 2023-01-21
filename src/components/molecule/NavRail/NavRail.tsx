import styled from '@emotion/styled'
import React, { FC, useCallback } from 'react'
import { LogoIcon } from '@/components/atom/Icons/LogoIcon'
import { QuestionIcon } from '@/components/atom/Icons/QuestionIcon'
import { NavRailItem, NavRailItemType } from '@/components/molecule/NavRail/NavRailItem'
import { NavRailItemIcon } from '@/components/molecule/NavRail/NavRailItemIcon'
import { Plate } from '@/components/molecule/NavRail/Plate'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateNavRailSelected } from '@/jotai/ui'

export const NavRail: FC = () => {
  const { currentTheme } = useVESSTheme()
  const NavContainer = styled.div`
    background: ${currentTheme.depth4};
    border-radius: 0 16px 16px 0;
    width: 80px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  `

  const ItemsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 24px;
  `

  const Divider = styled.div`
    width: 56px;
    height: 1px;
    background: ${currentTheme.secondaryContainer};
  `

  const IconContainer = styled.div`
    width: 32px;
    height: 32px;
    color: ${currentTheme.onSecondaryContainer};
  `

  const LogoIconContainer = styled.div`
    width: 32px;
    height: 32px;
    color: ${currentTheme.secondary};
    margin-bottom: 16px;
  `

  const LogoIconGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 32px;
    margin-bottom: 24px;
  `

  const PlateContainer = styled.div`
    padding-bottom: 32px;
  `

  const items: NavRailItemType[] = ['myPage', 'timeline', 'chats', 'setting']

  const [selected, setSelected] = useStateNavRailSelected()

  const handleSelectItem = useCallback((select: NavRailItemType) => {
    setSelected(select)
  }, [])

  return (
    <NavContainer>
      <div>
        <LogoIconGroup>
          <LogoIconContainer>
            <LogoIcon />
          </LogoIconContainer>
          <Divider />
        </LogoIconGroup>

        <ItemsContainer>
          {items.map((item) => (
            <NavRailItem
              key={item}
              type={item}
              selected={item == selected}
              onClick={() => handleSelectItem(item)}
            />
          ))}
          <Divider />
          <NavRailItemIcon>
            <IconContainer>
              <QuestionIcon />
            </IconContainer>
          </NavRailItemIcon>
        </ItemsContainer>
      </div>
      <PlateContainer>
        <Plate />
      </PlateContainer>
    </NavContainer>
  )
}
