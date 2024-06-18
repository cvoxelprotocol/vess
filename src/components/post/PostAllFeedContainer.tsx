import styled from '@emotion/styled'
import { FlexVertical, Text, useBreakpoint, useModal } from 'kai-kit'
import { FC, useEffect, useMemo } from 'react'
import { useNCLayoutContext } from '../app/NCLayout'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { CredListItem } from './CredListItem'
import { PostDetailModal } from './PostDetailModal'
import { PostFrame } from './PostFrame'
import { Post } from '@/@types/user'
import { usePostFeed } from '@/hooks/usePostFeed'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useSelectedPostAtom, useSelectedPostFeedAtom } from '@/jotai/ui'
import { formatDate } from '@/utils/date'
import { getAddressFromPkh } from '@/utils/did'

export const PostAllFeedContainer: FC = () => {
  const { did, connectionStatus } = useVESSAuthUser()
  const { postFeed } = usePostFeed(did)
  const { setIsDefaultOpenOnDesktop, setIsFullContent, openNavigation } = useNCLayoutContext()
  const { matches, breakpointProps } = useBreakpoint()
  const { openModal, closeModal } = useModal()
  const [selectedPost, setPost] = useSelectedPostAtom()
  const [selectedPostFeed, setPostFeed] = useSelectedPostFeedAtom()

  const openPostDetail = (post: Post) => {
    setPost(post)
    openModal('PostDetailModal')
    // window.open(`${process.env.NEXT_PUBLIC_VESS_URL}/post/detail/${id}`)
  }

  const allItems = useMemo(() => {
    if (!selectedPostFeed) {
      return postFeed?.flatMap((feed) => feed.post) || []
    }
    return postFeed?.find((p) => p.id === selectedPostFeed.id)?.post || []
  }, [postFeed, selectedPostFeed])

  const uniqueCredItems = useMemo(() => {
    return postFeed?.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
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
          <CredIconFrame isSelected={!selectedPostFeed} onClick={() => setPostFeed(undefined)}>
            <CredIcon isSelected={!selectedPostFeed}>
              <Text as='h1' typo='body-md' color='var(--kai-color-sys-neutral-major)'>
                全て
              </Text>
            </CredIcon>
          </CredIconFrame>
          {uniqueCredItems &&
            uniqueCredItems.length > 0 &&
            uniqueCredItems.map((credItem) => {
              return (
                <CredIconFrame
                  isSelected={selectedPostFeed?.id === credItem.id}
                  key={credItem?.id}
                  onClick={() => setPostFeed(credItem)}
                >
                  <CredIcon isSelected={selectedPostFeed?.id === credItem.id}>
                    <ImageContainer
                      src={credItem?.icon || credItem?.image || '/default_profile.jpg'}
                      width='100%'
                      height='100%'
                      objectFit='contain'
                    />
                  </CredIcon>
                </CredIconFrame>
              )
            })}
        </HeaderFrame>
        {selectedPostFeed && (
          <FlexVertical
            width='100%'
            gap='var(--kai-size-sys-space-sm)'
            padding='var(--kai-size-sys-space-md)'
          >
            <CredListItem
              key={selectedPostFeed.id}
              title={selectedPostFeed.title}
              icon={selectedPostFeed.image || selectedPostFeed.icon || ''}
            ></CredListItem>
          </FlexVertical>
        )}

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
  display: flex;
  padding: 16px;
  gap: 4px;
  place-items: center;
  align-items: flex-start;
  height: var(--kai-size-ref-96);
  z-index: var(--kai-z-index-sys-fixed-default);
  align-self: stretch;
  overflow-x: scroll;
`

const CredIconFrame = styled.div<{ isSelected: boolean }>`
  display: flex;
  width: 64px;
  height: 64px;
  padding: 4px 0px;
  align-items: flex-start;
  gap: 8px;
  border-top: ${(props) =>
    !props.isSelected
      ? '2px solid var(--dominant-dominant-outline, #cd8df2)'
      : '2px solid var(--subdominant-subdominant, #993E79)'};

  border-bottom: ${(props) =>
    !props.isSelected
      ? '2px solid var(--dominant-dominant-outline, #cd8df2)'
      : '2px solid var(--subdominant-subdominant, #993E79)'};
`

const CredIcon = styled.div<{ isSelected: boolean }>`
  display: flex;
  padding: 4px;
  width: 60px;
  height: 52px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 4px;
  background: ${(props) =>
    props.isSelected
      ? 'var(--subdominant-subdominant-backing, #F6D4E7)'
      : 'var(--layer-layer-default, #F2E9F7)'};
`
