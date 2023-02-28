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
import { useStateShowHeaderMenu } from '@/jotai/ui'

export const HeaderMenu: FC = () => {
  const { did } = useDIDAccount()
  const { disConnectDID } = useConnectDID()
  const router = useRouter()
  const [showHeaderMenu, setShowHeaderMenu] = useStateShowHeaderMenu()
  const { profile } = useSocialAccount(did)

  const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 120px;
  `

  const goToMyPage = () => {
    router.push(`/did/${did}`)
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
        </Content>
      </BasePopover>
    </PopoverContainer>
  )
}
