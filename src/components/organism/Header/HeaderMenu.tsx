import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { Menu, PopoverContainer, PopoverTrigger } from '@/components/atom/Menu/Menu'
import { MenuItem } from '@/components/atom/Menu/MenuItem'
import { Text } from '@/components/atom/Texts/Text'
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

  const AvatarWrapper = styled.div`
    width: 40px;
    height: 40px;
  `

  const DividerContainer = styled.div`
    width: 100%;
    padding: 0px 8px;
    display: flex;
    flex-direction: column;
  `

  const DividerLine = styled.div`
    width: 100%;
    height: 8px;
    border-bottom: solid 1px;
    border-color: ${currentTheme.outline};
  `

  const Title = styled.span`
    margin-top: 4px;
    ${getBasicFont(currentTypo.label.medium)};
    color: ${currentTheme.outline};
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
          <Text
            type='p'
            color={currentTheme.onBackground}
            font={getBasicFont(currentTypo.title.medium)}
            text={profile.displayName}
            whiteSpace={'nowrap'}
          />
          <Flex flexDirection='row' rowGap='2px'>
            <Icon icon={ICONS.ETHEREUM} mainColor={currentTheme.outline} size={'SS'} />
            <Text
              type='p'
              color={currentTheme.outline}
              font={getBasicFont(currentTypo.label.small)}
              text={shortenStr(originalAddress, 7)}
            />
          </Flex>
        </AccountContainer>
      </WrappedPopoverTrigger>
      <Menu side={'bottom'} align={'center'}>
        <MenuItem title={'My Profile'} onClick={() => goToMyPage()} icon={ICONS.ACCOUNT} />
        <MenuItem title={'Sign Out'} onClick={() => logout()} icon={ICONS.LOGOUT} />
        <DividerContainer>
          <DividerLine />
          <Title>Organization</Title>
        </DividerContainer>
        <MenuItem
          title={'Create New'}
          onClick={() => jumpToURL('https://lp.vess.id/en/synapss/org/apply')}
          icon={ICONS.ADD}
        />
      </Menu>
    </PopoverContainer>
  )
}
