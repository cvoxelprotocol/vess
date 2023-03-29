import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { HeaderItem } from './HeaderItem'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { Divider } from '@/components/atom/Menu/Divider'
import { Menu, PopoverContainer, PopoverTrigger } from '@/components/atom/Menu/Menu'
import { MenuItem } from '@/components/atom/Menu/MenuItem'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateShowHeaderMenu } from '@/jotai/ui'
import { shortenStr } from '@/utils/objectUtil'

export const HeaderMenu: FC = () => {
  const { did, originalAddress } = useDIDAccount()
  const { disConnectDID } = useConnectDID()
  const router = useRouter()
  const [showHeaderMenu, setShowHeaderMenu] = useStateShowHeaderMenu()
  const { profile } = useSocialAccount(did)
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const WrappedPopoverTrigger = styled(PopoverTrigger)`
    height: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0px 16px;
    border-radius: 16px;

    &:hover {
      background: ${currentTheme.surface1};
    }
  `

  const AccountContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 0px;

    @media (max-width: 599px) {
      display: none;
    }
  `

  const Name = styled.div`
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.medium)};
    white-space: nowrap;
  `
  const WalletAddress = styled.div`
    color: ${currentTheme.outline};
    ${getBasicFont(currentTypo.label.small)};
  `

  const AvatarWrapper = styled.div`
    width: 40px;
    height: 40px;
  `

  const goToMyPage = () => {
    router.push(`/did/${did}`)
    setShowHeaderMenu(false)
  }

  const jumpToURL = (url: string) => {
    window.open(url, '_blank')
  }

  const logout = async () => {
    await disConnectDID()
    setShowHeaderMenu(false)
  }

  return (
    <PopoverContainer onOpenChange={setShowHeaderMenu} open={showHeaderMenu}>
      <WrappedPopoverTrigger>
        <AvatarWrapper>
          <Avatar url={profile.avatarSrc} fill />
        </AvatarWrapper>
        <AccountContainer>
          <Name>{profile.displayName}</Name>
          <Flex flexDirection='row' rowGap='2px'>
            <Icon icon={ICONS.ETHEREUM} mainColor={currentTheme.outline} size={'SS'} />
            <WalletAddress>{shortenStr(originalAddress, 10)}</WalletAddress>
          </Flex>
        </AccountContainer>
      </WrappedPopoverTrigger>
      <Menu side={'bottom'} align={'center'}>
        <MenuItem title={'My Profile'} onClick={() => goToMyPage()} icon={ICONS.ACCOUNT} />
        <MenuItem title={'Sign Out'} onClick={() => logout()} icon={ICONS.LOGOUT} />
        <Divider title='Organization' />
        <MenuItem
          title={'Create New'}
          onClick={() => jumpToURL('https://lp.vess.id/en/synapss/org/apply')}
          icon={ICONS.ADD}
        />
      </Menu>
    </PopoverContainer>
  )
}
