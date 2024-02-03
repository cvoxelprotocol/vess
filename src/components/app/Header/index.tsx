import styled from '@emotion/styled'
import { Modal, useModal } from 'kai-kit'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { LuAlignJustify, LuScanLine } from 'react-icons/lu'
import { useNCLayoutContext } from '../NCLayout'
import { IconDic } from '@/components/app/IconDic'
import { MenuButton } from '@/components/app/MenuButton'
import { useNavigationContext } from '@/components/app/NavigationList'
import { IconButton } from '@/kai/icon-button'

type DefaultHeaderProps = {
  children?: React.ReactNode
}

export const DefaultHeader: FC<DefaultHeaderProps> = ({ children }) => {
  const { toggleNavigation } = useNCLayoutContext()
  const { selectedNaviMeta } = useNavigationContext()
  const router = useRouter()

  return (
    <HeaderFrame>
      <MenuButton
        startContent={<IconDic icon={selectedNaviMeta.id} variant={'default'} size='80%' />}
        onPress={() => {
          toggleNavigation()
        }}
      >
        {selectedNaviMeta.label}
      </MenuButton>
      {/* <IconButton
        icon={<LuScanLine size={'100%'} />}
        variant='text'
        color='primary'
        onPress={() => router.push('/receive')}
        size='lg'
      /> */}
    </HeaderFrame>
  )
}

const HeaderFrame = styled.header`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: var(--kai-size-ref-80);
  padding: 0 var(--kai-size-ref-16);
`
