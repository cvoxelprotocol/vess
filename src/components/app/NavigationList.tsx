import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import type { RadioProps, RadioGroupProps, PressEvent } from 'react-aria-components'
import { Radio, RadioGroup, Button as RACButton } from 'react-aria-components'
import { isMobile } from 'react-device-detect'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'
import { IconDic } from './IconDic'
import { useNCLayoutContext } from './NCLayout'
import { NAVIGATION_LIST, NavigationItemType, NavigationItemValue } from '@/constants/ui'
import { Text } from '@/kai/text/Text'

export type NavigationListProps = {} & RadioGroupProps

const LogoutButton = dynamic(() => import('@/components/app/LogoutButton'), { ssr: false })

export const NavigationList: FC<NavigationListProps> = ({ value, onChange, ...props }) => {
  const router = useRouter()
  const { closeNavigation } = useNCLayoutContext()
  const { selectedNavi, setSelectedNavi, selectedNaviMeta } = useNavigationContext()

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
      <NextImageContainer src='/VESS_app_icon.png' width='3rem' height='3rem' objectFit='contain' />
      <NavigationItemGroup
        name='navigation'
        value={selectedNavi}
        onChange={(value) => {
          setSelectedNavi && setSelectedNavi(value as NavigationItemValue)
        }}
        {...props}
      >
        {NAVIGATION_LIST.map((item) => {
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
                        color='var(--kai-color-sys-on-surface)'
                      />
                    ) : (
                      <IconDic
                        icon={item.id}
                        variant={'default'}
                        color='var(--kai-color-sys-on-surface)'
                      />
                    )}
                    <Text as='label' typo='label-lg' color='var(--kai-color-sys-on-surface)'>
                      {item.label}
                    </Text>
                  </>
                )
              }}
            </NavigationItem>
          )
        })}
      </NavigationItemGroup>
      <div
        style={{
          width: '100%',
          height: '0px',
          border: `0.5px solid var(--kai-color-sys-outline-variant)`,
        }}
      />
      <LogoutButton />
    </NavigationListFrame>
  )
}

const NavigationListFrame = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: var(--kai-size-ref-240);
  height: 100svh;
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-ref-16);
  padding-top: var(--kai-size-sys-space-lg);
  &[data-mobile='true'] {
    justify-content: flex-end;
  }
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
    background: var(--kai-color-sys-surface-container-low);
    cursor: pointer;
  }
  &[data-pressed] {
    background: var(--kai-color-sys-surface-container-highest);
    transform: scale(0.98);
  }
  &[data-selected] {
    background: var(--kai-color-sys-surface-container-high);
    /* cursor: default; */
    pointer-events: none;
  }
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
