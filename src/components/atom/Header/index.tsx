import styled from '@emotion/styled'
import React, { FC } from 'react'
import { LuAlignJustify, LuScanLine } from 'react-icons/lu'
import { useNCLayoutContext } from '../NCLayout'
import { IconDic } from '@/components/app/IconDic'
import { MenuButton } from '@/components/app/MenuButton'
import { useNavigationContext } from '@/components/app/NavigationList'
import { useKai } from '@/kai/hooks/useKai'

type DefaultHeaderProps = {
  children?: React.ReactNode
}

export const DefaultHeader: FC<DefaultHeaderProps> = ({ children }) => {
  const { toggleNavigation } = useNCLayoutContext()
  const { selectedNaviMeta } = useNavigationContext()
  return (
    <HeaderFrame>
      <MenuButton
        startContent={<IconDic icon={selectedNaviMeta.id} variant={'default'} size='80%' />}
        onPress={toggleNavigation}
      >
        {selectedNaviMeta.label}
      </MenuButton>
      <LuScanLine size={'24px'} color={'var(--kai-color-sys-primary)'} />
    </HeaderFrame>
  )
}

const HeaderFrame = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: var(--kai-size-ref-80);
  padding: 0 var(--kai-size-ref-16);
`
