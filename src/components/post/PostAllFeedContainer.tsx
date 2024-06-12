import styled from '@emotion/styled'
import { FlexVertical, Text, useBreakpoint, useModal } from 'kai-kit'
import { FC, useEffect, useMemo } from 'react'
import { useNCLayoutContext } from '../app/NCLayout'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { PostDetailModal } from './PostDetailModal'
import { PostFrame } from './PostFrame'
import { Post } from '@/@types/user'
import { usePostFeed } from '@/hooks/usePostFeed'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useSelectedPostAtom } from '@/jotai/ui'
import { formatDate } from '@/utils/date'
import { getAddressFromPkh } from '@/utils/did'

export const PostAllFeedContainer: FC = () => {
  const { did, connectionStatus } = useVESSAuthUser()
  const { postFeed } = usePostFeed(did)
  const { setIsDefaultOpenOnDesktop, setIsFullContent, openNavigation } = useNCLayoutContext()
  const { matches, breakpointProps } = useBreakpoint()
  const { openModal, closeModal } = useModal()
  const [selectedPost, setPost] = useSelectedPostAtom()

  const openPostDetail = (post: Post) => {
    setPost(post)
    openModal('PostDetailModal')
    // window.open(`${process.env.NEXT_PUBLIC_VESS_URL}/post/detail/${id}`)
  }

  const allItems = useMemo(() => {
    return postFeed?.flatMap((feed) => feed.post) || []
  }, [postFeed])

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

  return (
    <>
      <PostFeedFrame className='dark' {...breakpointProps}>
        <HeaderFrame>
          {/* <IconButton
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
          /> */}
        </HeaderFrame>
        <FlexVertical
          width='100%'
          gap='var(--kai-size-sys-space-sm)'
          padding='var(--kai-size-sys-space-md)'
        >
          {allItems.length > 0 &&
            allItems.map((post) => {
              return (
                <PostFrame
                  key={post.id}
                  userIcon={post.user?.avatar || '/default_profile.jpg'}
                  userId={
                    post.user?.vessId
                      ? `@${post.user?.vessId}`
                      : post.user?.name || getAddressFromPkh(post.user?.did || '')
                  }
                  date={formatDate(post?.createdAt.toLocaleString())}
                  onClick={() => openPostDetail(post)}
                >
                  {post?.image && (
                    <ImageContainer
                      src={post?.image}
                      width='100%'
                      height='auto'
                      objectFit='contain'
                      style={{ borderRadius: 'var(--kai-size-sys-round-md)' }}
                    />
                  )}
                  <Text as='p' typo='body-md' color={'var(--kai-color-sys-neutral-minor)'}>
                    {post?.text}
                  </Text>
                </PostFrame>
              )
            })}
        </FlexVertical>
      </PostFeedFrame>
      <PostDetailModal name='PostDetailModal' post={selectedPost} />
    </>
  )
}

const PostFeedFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100svh;
  overflow-y: scroll;

  &[data-media-lg] {
    display: grid;
    grid-template-columns: 1fr var(--kai-size-ref-512) 1fr;
    place-items: center;
    gap: var(--kai-size-space-md);
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
