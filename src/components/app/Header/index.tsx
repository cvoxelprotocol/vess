import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import React, { ComponentProps, FC } from 'react'
import { useNCLayoutContext } from '../NCLayout'
import { IconDic } from '@/components/app/IconDic'
import { MenuButton } from '@/components/app/MenuButton'
import { useNavigationContext } from '@/components/app/NavigationList'

type DefaultHeaderProps = {
  children?: React.ReactNode
} & ComponentProps<'header'>

export const DefaultHeader: FC<DefaultHeaderProps> = ({ children, ...props }) => {
  const { toggleNavigation } = useNCLayoutContext()
  const { selectedNaviMeta } = useNavigationContext()
  const router = useRouter()

  return (
    <HeaderFrame {...props}>
      <MenuButton
        startContent={
          <IconDic icon={selectedNaviMeta?.id || 'HOME'} variant={'default'} size='80%' />
        }
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
