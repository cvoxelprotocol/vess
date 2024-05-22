import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, IconButton, Skelton, useBreakpoint, useModal } from 'kai-kit'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { PiListLight, PiPlusBold } from 'react-icons/pi'
import { useNCLayoutContext } from '../app/NCLayout'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { PostDetailModal } from './PostDetailModal'
import { PostImage } from './PostImage'
import { Post } from '@/@types/user'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import { selectedPost, usePostsAtom, useSelectedPostAtom } from '@/jotai/ui'

type Props = {
  id?: string
  feedOnly?: boolean
}
export const PostFeedContainer: FC<Props> = ({ id, feedOnly = false }) => {
  const { credItem, isInitialLoading } = useCredentialItem(id)
  const [posts, setPosts] = usePostsAtom()
  const { setIsDefaultOpenOnDesktop, setIsFullContent, openNavigation } = useNCLayoutContext()
  const { matches, breakpointProps } = useBreakpoint()
  const tileGridRef = useRef<HTMLDivElement>(null)
  const tileGridOuterRef = useRef<HTMLDivElement>(null)
  const [tileGridHeight, setTileGridHeight] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0)
  const { openModal, closeModal } = useModal()
  const [selectedPost, setPost] = useSelectedPostAtom()
  const router = useRouter()

  useEffect(() => {
    // subscribe to new posts
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_VESS_BACKEND}/v2/subscribe/post`)
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

  const openPostDetail = (post: Post) => {
    setPost(post)
    openModal('PostDetailModal')
    // window.open(`${process.env.NEXT_PUBLIC_VESS_URL}/post/detail/${id}`)
  }

  useEffect(() => {
    if (matches.lg) {
      setIsFullContent(true)
      setIsDefaultOpenOnDesktop(false)
    } else {
      setIsFullContent(false)
      setIsDefaultOpenOnDesktop(false)
    }
    return () => {
      setIsFullContent(false)
      setIsDefaultOpenOnDesktop(true)
    }
  }, [matches])

  useEffect(() => {
    if (tileGridRef.current && tileGridOuterRef.current) {
      console.log(
        'scrollHeight: ',
        tileGridRef.current.scrollHeight,
        tileGridOuterRef.current.offsetHeight,
      )
      setTileGridHeight(tileGridOuterRef.current.offsetHeight)
      setScrollHeight(tileGridRef.current.scrollHeight)
    }
  }, [tileGridRef.current?.scrollHeight, tileGridOuterRef.current?.offsetHeight])

  return (
    <>
      <PostFeedFrame className='dark' {...breakpointProps}>
        <HeaderFrame>
          <IconButton
            icon={<PiListLight size={32} />}
            variant='outlined'
            color='neutral'
            onPress={() => {
              if (feedOnly) return
              if (matches.lg) {
                router.push('/')
              } else {
                openNavigation()
              }
            }}
          />
          {!matches.lg && (
            <Image
              src='/brand/pizzaDAO_logo_white.png'
              width={160}
              height={28}
              alt='pizzaDAO logo'
              objectFit='contain'
            />
          )}
        </HeaderFrame>

        <TileGridOuterFrame
          scrollHeight={scrollHeight + 16}
          // scrollTime={5}
          scrollTime={(20 * scrollHeight) / 400}
          ref={tileGridOuterRef}
          data-enough-image={scrollHeight > tileGridHeight || undefined}
          {...breakpointProps}
        >
          <TileGridFrame ref={tileGridRef} {...breakpointProps}>
            {items.map((post) => {
              return (
                <>
                  <PostImage
                    key={post.id}
                    src={post.image || ''}
                    onClick={() => openPostDetail(post)}
                  />
                </>
              )
            })}
          </TileGridFrame>
          {matches.lg && scrollHeight > tileGridHeight && (
            <>
              <TileGridFrame {...breakpointProps}>
                {items.map((post) => {
                  return (
                    <>
                      <PostImage
                        key={post.id}
                        src={post.image || ''}
                        onClick={() => openPostDetail(post)}
                      />
                    </>
                  )
                })}
              </TileGridFrame>
              <TileGridFrame {...breakpointProps}>
                {items.map((post) => {
                  return (
                    <PostImage
                      key={post.id}
                      src={post.image || ''}
                      onClick={() => openPostDetail(post)}
                    />
                  )
                })}
              </TileGridFrame>
            </>
          )}
        </TileGridOuterFrame>
        <RichLogoImg src='/brand/pizzaDAO_logo_rich.png' />
        <FooterFrame>
          {!matches.lg && (
            <Button
              variant='filled'
              color='dominant'
              startContent={<PiPlusBold />}
              onPress={() => router.push(`/creds/items/post/${id}`)}
            >
              投稿する
            </Button>
          )}
        </FooterFrame>
      </PostFeedFrame>
      <PostDetailModal name='PostDetailModal' post={selectedPost} />
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

const TileGridOuterFrame = styled.div<{ scrollHeight: number; scrollTime: number }>`
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-sys-space-md);
  width: 100%;
  height: 100svh;
  overflow: scroll;
  padding: var(--kai-size-sys-space-2xl) var(--kai-size-sys-space-md);

  &[data-media-lg] {
    overflow: visible;
    padding: var(--kai-size-sys-space-2xl) var(--kai-size-sys-space-md);
    &[data-enough-image] {
      animation: ${({ scrollHeight }) => ScrollAnimation(scrollHeight)}
        ${({ scrollTime }) => scrollTime}s linear infinite;
      padding: 0 var(--kai-size-sys-space-md);
    }
  }
`

const TileGridFrame = styled.div`
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 80px;
  grid-auto-flow: dense;
  gap: var(--kai-size-sys-space-md);
  width: 100%;
  overflow: scroll;

  &[data-media-lg] {
    grid-auto-rows: 108px;
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
  display: flex;
  justify-content: end;
  background: linear-gradient(
    to bottom,
    rgb(from var(--kai-color-sys-black) r g b / 0),
    rgb(from var(--kai-color-sys-black) r g b / 0.6)
  );
  height: var(--kai-size-ref-64);
  padding: 0 var(--kai-size-sys-space-md) var(--kai-size-sys-space-md);
  z-index: var(--kai-z-index-sys-fixed-default);
`
