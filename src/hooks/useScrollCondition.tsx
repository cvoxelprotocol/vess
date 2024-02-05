import { useState, useEffect } from 'react'

interface ScrollInfo {
  positionY: number // スクロールの縦位置
  direction: 'up' | 'down' | null // スクロール方向
}

function useScrollCondition(elementRef: React.RefObject<HTMLElement>) {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    positionY: 0,
    direction: null,
  })

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let lastScrollTop = 0
    const onScroll = () => {
      const newScrollTop = element.scrollTop
      const scrollDirection =
        newScrollTop > lastScrollTop ? 'down' : newScrollTop < lastScrollTop ? 'up' : null

      setScrollInfo({
        positionY: newScrollTop,
        direction: scrollDirection,
      })

      lastScrollTop = newScrollTop // 最後のスクロール位置を更新
    }

    element.addEventListener('scroll', onScroll)
    return () => element.removeEventListener('scroll', onScroll)
  }, [elementRef, scrollInfo]) // 依存配列にelementRefのみを指定

  return { scrollInfo: scrollInfo }
}

export default useScrollCondition
