import styled from '@emotion/styled'
import { set } from 'date-fns'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import type { RadioProps, RadioGroupProps } from 'react-aria-components'
import { Radio, RadioGroup } from 'react-aria-components'
import { isMobile } from 'react-device-detect'
import { PiSignOutFill } from 'react-icons/pi'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'
import { IconDic } from './IconDic'
import { useNCLayoutContext } from './NCLayout'
import { NAVIGATION_LIST, NavigationItemType, NavigationItemValue } from '@/constants/ui'
import { useConnectDID } from '@/hooks/useConnectDID'
import { Button } from '@/kai/button/Button'
import { useKai } from '@/kai/hooks/useKai'
import { Text } from '@/kai/text/Text'

export type NavigationListProps = {} & RadioGroupProps

export const NavigationList: FC<NavigationListProps> = ({ value, onChange, ...props }) => {
  const { kai } = useKai()
  const { disConnectDID } = useConnectDID()
  const router = useRouter()
  const { closeNavigation } = useNCLayoutContext()
  const { selectedNavi, setSelectedNavi, selectedNaviMeta } = useNavigationContext()

  const logout = async () => {
    try {
      await disConnectDID()
      closeNavigation()
      router.push('/login')
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    NAVIGATION_LIST.forEach((item, index) => {
      if (router.pathname.startsWith(item.path)) {
        console.log('router.pathname', router.pathname)
        setSelectedNavi && setSelectedNavi(item.id)
      }
    })
  }, [router.pathname])

  useEffect(() => {
    console.log('selectedNavi', selectedNavi)
    NAVIGATION_LIST.forEach((item, index) => {
      console.log('item.path', item.path)
      console.log('router.pathname', router.pathname)
      if (router.pathname.startsWith(item.path)) {
        console.log('selectedNaviMeta.path', selectedNaviMeta.path)
        jumpToURL(selectedNaviMeta?.path)
      }
    })
  }, [selectedNavi])

  const jumpToURL = (url: string) => {
    router.push(url)
  }

  return (
    <NavigationListFrame data-mobile={isMobile}>
      <NextImageContainer src='/logo_bard.png' width='4rem' height='4rem' objectFit='contain' />
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
            <NavigationItem key={item.id} value={item.id}>
              {({ isSelected }) => (
                <>
                  {isSelected ? (
                    <IconDic icon={item.id} variant={'filled'} color={kai.color.sys.onSurface} />
                  ) : (
                    <IconDic icon={item.id} variant={'default'} color={kai.color.sys.onSurface} />
                  )}
                  <Text as='label' typo='label-lg' color={kai.color.sys.onSurface}>
                    {item.label}
                  </Text>
                </>
              )}
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
      <Button
        endContent={<PiSignOutFill />}
        variant='tonal'
        width='100%'
        color='secondary'
        onPress={logout}
      >
        ログアウトする
      </Button>
    </NavigationListFrame>
  )
}

const NavigationListFrame = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: var(--kai-size-ref-240);
  height: 100dvh;
  gap: var(--kai-size-ref-32);
  padding: var(--kai-size-ref-16);
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
export type NavigationItemProps = {} & RadioProps

export const NavigationItem: FC<NavigationItemProps> = ({ children, ...props }) => {
  return <NavigationItemFrame {...props}>{children}</NavigationItemFrame>
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
  transition: background 0.5s cubic-bezier(0, 0.7, 0.3, 1);

  &[data-hovered] {
    background: var(--kai-color-sys-surface-container-low);
    cursor: pointer;
  }
  &[data-pressed] {
    background: var(--kai-color-sys-surface-container-highest);
  }
  &[data-selected] {
    background: var(--kai-color-sys-surface-container-high);
    cursor: default;
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
