import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { NavigationItem } from './NavigationItem'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { getNaviItem, NAVIGATION_ITEM, NAVIGATION_LIST, NAVIGATION_LIST_TYPE } from '@/constants/ui'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateSelectedNavigationItem } from '@/jotai/ui'

export const NavigationList: FC = () => {
  const { currentTheme } = useVESSTheme()
  const [item, setItem] = useStateSelectedNavigationItem()
  const router = useRouter()
  const { did } = useDIDAccount()

  const NavigationListContainer = styled.div`
    background: ${currentTheme.depth3};
    padding: 32px 8px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    justify-content: flex-start;
    width: 80px;
    height: 100vh;
    @media (max-width: 599px) {
      height: 64px;
      width: 100%;
      flex-direction: row;
      padding: 12px;
      justify-content: center;
      align-items: center;
      background: ${currentTheme.surface1};
      border-radius: 32px 32px 0 0;
      border-top: 1px solid ${currentTheme.outline};
    }
  `

  const LogoImage = styled.div`
    width: 100%;
    height: 48px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${currentTheme.secondary};
    @media (max-width: 599px) {
      display: none;
    }
  `

  useEffect(() => {
    const naviItem = getNaviItem(router.asPath)
    if (naviItem.item === item) return
    setItem(naviItem.item)
  }, [router])

  const handleClick = (navi: NAVIGATION_LIST_TYPE) => {
    if (navi.item === NAVIGATION_ITEM.PROFILE) {
      if (did) {
        setItem(navi.item)
        router.push(`/${did}`)
      } else {
        router.push('/')
      }
      return
    }
    setItem(navi.item)
    router.push(navi.path)
  }

  return (
    <NavigationListContainer>
      <LogoImage>
        <NextImageContainer src={'/logo_bard.png'} width={'100%'} objectFit={'contain'} />
      </LogoImage>
      {NAVIGATION_LIST.map((navi) => {
        return (
          <NavigationItem
            key={navi.item}
            title={navi.item}
            icon={navi.icon}
            onClick={() => handleClick(navi)}
            selected={item === navi.item}
          />
        )
      })}
    </NavigationListContainer>
  )
}
