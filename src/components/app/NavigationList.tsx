import styled from '@emotion/styled'
import { Text, Switch, useKai, FlexVertical } from 'kai-kit'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React, { FC, useEffect, useState } from 'react'
import type { RadioProps, RadioGroupProps, PressEvent } from 'react-aria-components'
import { Radio, RadioGroup, Button as RACButton } from 'react-aria-components'
import { isMobile } from 'react-device-detect'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'
import { IconDic } from './IconDic'
import { useNCLayoutContext } from './NCLayout'
import { NAVIGATION_LIST, NavigationItemType, NavigationItemValue } from '@/constants/ui'
import { useAvatar } from '@/hooks/useAvatar'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'

export type NavigationListProps = {} & RadioGroupProps

const LogoutButton = dynamic(() => import('@/components/app/LogoutButton'), { ssr: false })

export const NavigationList: FC<NavigationListProps> = ({ value, onChange, ...props }) => {
  const router = useRouter()
  const { closeNavigation } = useNCLayoutContext()
  const { selectedNavi, setSelectedNavi, selectedNaviMeta } = useNavigationContext()
  const { did, connection } = useVESSAuthUser()
  const { vsUser, isInitialLoading: isLoadingUser } = useVESSUserProfile(did)
  const { profileAvatar, isInitialLoading: isLoadingAvatars } = useAvatar(did)
  const { setMode, currentMode } = useKai()

  // Avoid hydration error
  const [isMobileClient, setIsMobileClient] = useState(false)
  useEffect(() => {
    setIsMobileClient(isMobile)
  }, [])

  useEffect(() => {
    NAVIGATION_LIST.forEach((item) => {
      if (router.pathname.startsWith(item.path)) {
        setSelectedNavi && setSelectedNavi(item.id)
      }
    })
  }, [router.pathname])

  return (
    <NavigationListFrame data-mobile={isMobileClient}>
      <FlexVertical gap='var(--kai-size-sys-space-md)' width='100%'>
        <NextImageContainer
          src='/VESS_app_icon.png'
          width='2.5rem'
          height='2.5rem'
          objectFit='contain'
        />
        <NavigationItemGroup
          name='navigation'
          value={selectedNavi}
          onChange={(value) => {
            setSelectedNavi && setSelectedNavi(value as NavigationItemValue)
            closeNavigation()
            router.push(NAVIGATION_LIST.find((item) => item.id === value)?.path || '/')
          }}
          {...props}
        >
          {connection === 'connected' && (
            <>
              <NavigationItem
                value='PROFILE'
                onPress={() => {
                  closeNavigation()
                  router.push(`/did/${did}`)
                }}
              >
                <NavigationIcon
                  src={profileAvatar?.avatarUrl || vsUser?.avatar || '/default_profile.jpg'}
                ></NavigationIcon>
                <Text typo='label-lg' color='var(--kai-color-sys-on-surface)' lineClamp={1}>
                  {vsUser?.name || 'プロフィール'}
                </Text>
              </NavigationItem>
              {NAVIGATION_LIST.filter((item) => item.id !== 'PROFILE').map((item) => {
                return (
                  <NavigationItem
                    key={item.id}
                    value={item.id}
                    onPress={() => {
                      closeNavigation()
                      router.push(item.path)
                    }}
                  >
                    {({ isSelected }) => {
                      return (
                        <>
                          {isSelected ? (
                            <IconDic
                              icon={item.id}
                              variant={'filled'}
                              size='20'
                              color='var(--kai-color-sys-on-surface)'
                            />
                          ) : (
                            <IconDic
                              icon={item.id}
                              variant={'default'}
                              size='20'
                              color='var(--kai-color-sys-on-surface)'
                            />
                          )}
                          <Text typo='label-lg' color='var(--kai-color-sys-on-surface)'>
                            {item.label}
                          </Text>
                        </>
                      )
                    }}
                  </NavigationItem>
                )
              })}
            </>
          )}
        </NavigationItemGroup>
      </FlexVertical>
      <FlexVertical gap='var(--kai-size-sys-space-md)' width='100%'>
        <div
          style={{
            width: '100%',
            height: '0px',
            border: `0.5px solid var(--kai-color-sys-outline-variant)`,
          }}
        />
        <Switch
          variant='fullWidth'
          width='100%'
          isSelected={currentMode === 'dark'}
          onChange={(value) => setMode(value ? 'dark' : 'light')}
          style={{ padding: '0 var(--kai-size-sys-space-sm)' }}
        >
          <Text typo='label-lg' color='var(--kai-color-sys-on-layer)'>
            ダークモード
          </Text>
        </Switch>
        {connection === 'connected' && <LogoutButton />}
      </FlexVertical>
    </NavigationListFrame>
  )
}

const NavigationListFrame = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: var(--kai-size-ref-240);
  height: 100svh;
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-sys-space-lg) var(--kai-size-ref-16) var(--kai-size-sys-space-lg)
    var(--kai-size-ref-16);
`
const NavigationItemGroup = styled(RadioGroup)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  gap: var(--kai-size-ref-4);
`

/* --------  NavigationItem Component --------*/
export type NavigationItemProps = {
  onPress?: (e: PressEvent) => void
} & RadioProps

export const NavigationItem: FC<NavigationItemProps> = ({ children, onPress, ...props }) => {
  return (
    <ButtonFrame onPress={onPress}>
      <NavigationItemFrame {...props}>{children}</NavigationItemFrame>
    </ButtonFrame>
  )
}

export const NavigationItemFrame = styled(Radio)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--kai-size-ref-8);
  width: 100%;
  height: fit-content;
  padding: var(--kai-size-ref-16);
  border-radius: var(--kai-size-sys-round-md);
  transition: background var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  transition-property: background, transform;

  &[data-hovered] {
    background: var(--kai-color-sys-layer-default);
    cursor: pointer;
  }
  &[data-pressed] {
    transform: scale(0.98);
  }
  &[data-selected] {
    background: var(--kai-color-sys-layer-nearer);
    pointer-events: none;
  }
`

const NavigationIcon = styled.img`
  width: var(--kai-size-ref-20);
  height: var(--kai-size-ref-20);
  border-radius: var(--kai-size-sys-round-md);
  object-fit: cover;
`

const ButtonFrame = styled(RACButton)`
  appearance: none;
  -webkit-appearance: none;
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding: 0;
  outline: none;
  border: none;
  border-radius: var(--kai-size-sys-round-md);
  background: none;
  transition: background var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  transition-property: background, transform;
  &[data-hovered] {
    cursor: pointer;
  }
  &[data-pressed] {
    transform: scale(0.98);
  }
`

/* -------- Navigation Context -------- */

export const NavigationContext = React.createContext<{
  selectedNavi?: NavigationItemValue
  setSelectedNavi?: React.Dispatch<React.SetStateAction<NavigationItemValue>>
}>({})

export const NavigationContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedNavi, setSelectedNavi] = React.useState<NavigationItemValue>(NAVIGATION_LIST[0].id)
  return (
    <NavigationContext.Provider
      value={{ selectedNavi: selectedNavi, setSelectedNavi: setSelectedNavi }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigationContext = () => {
  const context = React.useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationContextProvider')
  }

  const selectedNaviMeta = NAVIGATION_LIST.find((item) => item.id === context.selectedNavi)

  return {
    selectedNavi: context.selectedNavi,
    setSelectedNavi: context.setSelectedNavi,
    selectedNaviMeta: selectedNaviMeta as NavigationItemType,
  }
}
