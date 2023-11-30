import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { NavigationDrawerItem } from './NavigationDrawerItem'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { FadeInOut } from '@/components/atom/Motions/FadeInOut'
import { SlideInOut } from '@/components/atom/Motions/SlideInOut'
import {
  getNaviItem,
  NAVIGATION_ITEM,
  NAVIGATION_LIST,
  NAVIGATION_LIST_TYPE,
} from '@/constants/uiV1'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateSelectedNavigationItem } from '@/jotai/ui'

export const NavigationDrawer: FC = () => {
  const { currentTheme } = useVESSTheme()
  const [item, setItem] = useStateSelectedNavigationItem()
  const [openMenu, setOpenMenu] = useState(false)
  const router = useRouter()
  const { did } = useDIDAccount()

  const DialogTrigger = styled.button`
    background: none;
    border: none;
  `
  const DialogOverlay = styled(DialogPrimitive.Overlay)`
    position: fixed;
    inset: 0;
    background: ${currentTheme.background};
    opacity: 0.9;
    z-index: 9998;
  `

  const DialogWrapper = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 9999;
    display: grid;
    place-items: start;
  `
  const DialogContent = styled(DialogPrimitive.Content)`
    background: ${currentTheme.surface1};
    width: 90vw;
    height: 100vh;
    max-width: 320px;
    padding: 32px 16px;
    border-radius: 0 32px 32px 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    overflow: hidden;
    z-index: 9999;
    &:focus {
      outline: none;
    }
  `

  const LogoContainer = styled.div`
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: start;
  `

  const ItemsContainer = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: start;
  `

  useEffect(() => {
    const naviItem = getNaviItem(router.asPath, did)
    if (naviItem.item === item) return
    setItem(naviItem.item)
  }, [router])

  const handleClick = (navi: NAVIGATION_LIST_TYPE) => {
    if (navi.item === NAVIGATION_ITEM.PROFILE) {
      if (did) {
        setItem(navi.item)
        router.push(`/did/${did}`)
        return
      }
    }
    if (navi.external) {
      window.open(navi.path, '_blank')
    } else {
      setItem(navi.item)
      router.push(navi.path)
    }
  }

  return (
    <DialogPrimitive.Root open={openMenu} onOpenChange={setOpenMenu}>
      <DialogTrigger onClick={() => setOpenMenu(true)}>
        <Icon icon={ICONS.BARTHREE} size={'LL'} mainColor={currentTheme.onSurface} />
      </DialogTrigger>
      <AnimatePresence>
        {openMenu && (
          <>
            <DialogPrimitive.Portal forceMount>
              <FadeInOut duration={0.2} noAnimatePresence>
                <DialogOverlay forceMount />
              </FadeInOut>
              <DialogWrapper>
                <SlideInOut duration={0.3} noAnimatePresence>
                  <DialogContent forceMount>
                    <LogoContainer>
                      <NextImageContainer
                        src={'/vess_logo_full.png'}
                        width={'12rem'}
                        height={'32px'}
                        objectFit={'contain'}
                      />
                    </LogoContainer>
                    <ItemsContainer>
                      {NAVIGATION_LIST.map((navi) => {
                        return (
                          <>
                            <NavigationDrawerItem
                              key={navi.item}
                              title={navi.item}
                              icon={navi.icon}
                              onClick={() => handleClick(navi)}
                              selected={!navi.external && item === navi.item}
                              external={!!navi.external}
                            />
                          </>
                        )
                      })}
                    </ItemsContainer>
                  </DialogContent>
                </SlideInOut>
              </DialogWrapper>
              <DialogPrimitive.Close />
            </DialogPrimitive.Portal>
          </>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
