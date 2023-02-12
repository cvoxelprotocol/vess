import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { HeaderItem } from './HeaderItem'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import {
  BasePopover,
  PopoverContainer,
  PopoverTrigger,
} from '@/components/atom/Dialogs/BasePopover'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useStateDevModal, useStateShowHeaderMenu } from '@/jotai/ui'

export const HeaderMenu: FC = () => {
  const { did } = useDIDAccount()
  const { disConnectDID } = useConnectDID()
  const router = useRouter()
  const [showHeaderMenu, setShowHeaderMenu] = useStateShowHeaderMenu()
  const { profile } = useSocialAccount(did)
  const [_, setshow] = useStateDevModal()

  const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 120px;
  `

  const goToMyPage = () => {
    router.push(`/${did}`)
    setShowHeaderMenu(false)
  }

  const logout = async () => {
    await disConnectDID()
    setShowHeaderMenu(false)
  }

  return (
    <PopoverContainer onOpenChange={setShowHeaderMenu} open={showHeaderMenu}>
      <PopoverTrigger>
        <Avatar url={profile.avatarSrc} size={'XL'} />
      </PopoverTrigger>
      <BasePopover>
        <Content>
          <HeaderItem title={'my page'} onClick={() => goToMyPage()} />
          <HeaderItem title={'logout'} onClick={() => logout()} />
          {did === 'did:pkh:eip155:1:0xde695cbb6ec0cf3f4c9564070baeb032552c5111' && (
            <HeaderItem title={'dev only'} onClick={() => setshow(true)} />
          )}
        </Content>
      </BasePopover>
    </PopoverContainer>
  )
}
