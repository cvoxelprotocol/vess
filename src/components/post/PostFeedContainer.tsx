import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { FlexHorizontal, IconButton, Skelton, useBreakpoint } from 'kai-kit'
import Image from 'next/image'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { PiListLight } from 'react-icons/pi'
import { useNCLayoutContext } from '../app/NCLayout'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { Post } from '@/@types/user'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import { usePostsAtom } from '@/jotai/ui'
type Props = {
  id?: string
}
export const PostFeedContainer: FC<Props> = ({ id }) => {
  const { credItem, isInitialLoading } = useCredentialItem(id)
  console.log({ credItem })
  const [posts, setPosts] = usePostsAtom()
  const { setIsDefaultOpenOnDesktop, setIsFullContent, openNavigation } = useNCLayoutContext()
  const { matches, breakpointProps } = useBreakpoint()
  const tileGridRef = useRef<HTMLDivElement>(null)
  const [scrollHeight, setScrollHeight] = useState(0)

  useEffect(() => {
    // subscribe to new posts
    const eventSource = new EventSource('http://localhost:3000/v2/subscribe/post')
    eventSource.onmessage = function (event) {
      console.log({ event })
      const newData = JSON.parse(event.data)
      console.log('New data received:', newData)
      setPosts((prev) => [...prev, newData.payload as Post])
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const items = useMemo(() => {
    return [...posts, ...(credItem?.post || [])].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }, [credItem?.post, posts])

  const jumpToDetailPost = (id: string) => {
    window.open(`${process.env.NEXT_PUBLIC_VESS_URL}/post/detail/${id}`)
  }

  useEffect(() => {
    if (matches.lg) {
      setIsFullContent(true)
      setIsDefaultOpenOnDesktop(false)
    } else {
      setIsFullContent(false)
      setIsDefaultOpenOnDesktop(false)
    }
  }, [matches])

  useEffect(() => {
    if (tileGridRef.current) {
      setScrollHeight(tileGridRef.current.scrollHeight)
    }
  }, [tileGridRef.current?.scrollHeight])

  return (
    <>
      <PostFeedFrame className='dark' {...breakpointProps}>
        <HeaderFrame>
          <IconButton
            icon={<PiListLight size={32} />}
            variant='outlined'
            color='neutral'
            onPress={() => openNavigation()}
          />
          <Image
            src='/brand/pizzaDAO_logo_white.png'
            width={160}
            height={28}
            alt='pizzaDAO logo'
            objectFit='contain'
          />
        </HeaderFrame>
        <FooterFrame></FooterFrame>
        <TileGridFrame scrollHeight={scrollHeight / 2} ref={tileGridRef} {...breakpointProps}>
          <TileFat />
          <TileFat />
          <TileTall />
          <TileFat />
          <TileFat />
          <TileSquare />
          <TileTall />
          <TileTall />
          <TileTall />
          {matches.lg && (
            <>
              <TileFat />
              <TileFat />
              <TileTall />
              <TileFat />
              <TileFat />
              <TileSquare />
              <TileTall />
              <TileTall />
              <TileTall />
            </>
          )}
        </TileGridFrame>
        {/* <FlexVertical width='100%' alignItems='center' gap='var(--kai-size-ref-24)'>
          <Skelton
            width='var(--kai-size-ref-192)'
            height='var(--kai-size-ref-192)'
            radius='var(--kai-size-sys-round-full)'
            className='dark'
            isLoading={isInitialLoading}
          ></Skelton>
          {!isInitialLoading && credItem?.image && (
            <ImageContainer
              src={credItem?.image}
              width='var(--kai-size-ref-192)'
              // height='var(--kai-size-ref-192)'
              objectFit='cover'
            />
          )}
          <FlexHorizontal gap='var(--kai-size-ref-8)'>
            {items.map((post) => {
              return (
                <ImageContainer
                  key={post.id}
                  src={post.image || ''}
                  width='var(--kai-size-ref-112)'
                  height='var(--kai-size-ref-112)'
                  objectFit='contain'
                  onClick={() => jumpToDetailPost(post.id)}
                />
              )
            })}
          </FlexHorizontal>
        </FlexVertical> */}
        <RichLogoImg src='/brand/pizzaDAO_logo_rich.png' />
      </PostFeedFrame>
    </>
  )
}

const PostFeedFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100svh;
  background-image: url('/bg/pizzaDAO_feed.jpg');
  background-size: cover;
  background-position: center;
  overflow: hidden;

  &[data-media-lg] {
    display: grid;
    grid-template-columns: 1fr var(--kai-size-ref-512) 1fr;
    place-items: center;
    gap: var(--kai-size-space-md);
  }
`

const RichLogoImg = styled.img`
  grid-column: 3 / 4;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: var(--kai-size-sys-space-xl);
`

const ScrollAnimation = (scrollHeight: number) => keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-${scrollHeight}px); }
`

const TileGridFrame = styled.div<{ scrollHeight: number }>`
  grid-column: 2 / 3;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 108px;
  /* grid-auto-flow: dense; */
  gap: var(--kai-size-sys-space-md);
  width: 100%;
  height: 100svh;
  overflow: scroll;
  padding: var(--kai-size-sys-space-2xl) var(--kai-size-sys-space-md);

  &[data-media-lg] {
    overflow: visible;
    animation: ${({ scrollHeight }) => ScrollAnimation(scrollHeight)} 60s linear infinite;
    padding: 0 var(--kai-size-sys-space-md);
  }
`

const HeaderFrame = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: var(--kai-size-sys-space-2xl) 1fr var(--kai-size-sys-space-2xl);
  place-items: center;
  background: linear-gradient(
    to bottom,
    var(--kai-color-sys-black),
    rgb(from var(--kai-color-sys-black) r g b / 0)
  );
  height: var(--kai-size-ref-96);
  z-index: var(--kai-z-index-sys-fixed-default);
`

const FooterFrame = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: var(--kai-size-sys-space-2xl) 1fr var(--kai-size-sys-space-2xl);
  place-items: center;
  background: linear-gradient(
    to bottom,
    rgb(from var(--kai-color-sys-black) r g b / 0),
    var(--kai-color-sys-black)
  );
  height: var(--kai-size-ref-96);
  z-index: var(--kai-z-index-sys-fixed-default);
`

const TileFat = styled.div`
  grid-column: span 4;
  grid-row: span 2;
  border-radius: var(--kai-size-sys-round-md);
  background-color: var(--kai-color-sys-neutral);
`

const TileTall = styled.div`
  grid-column: span 2;
  grid-row: span 3;
  border-radius: var(--kai-size-sys-round-md);
  background-color: var(--kai-color-sys-dominant);
`

const TileSquare = styled.div`
  grid-column: span 2;
  grid-row: span 2;
  border-radius: var(--kai-size-sys-round-md);
  background-color: var(--kai-color-sys-neutral);
`
