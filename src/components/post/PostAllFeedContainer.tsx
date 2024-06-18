import styled from '@emotion/styled'
import { FlexVertical, IconButton, Text, useBreakpoint, useModal } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { Button as RACButton } from 'react-aria-components'
import { PiCameraPlus } from 'react-icons/pi'
import { HCLayout } from '../app/HCLayout'
import { DefaultHeader } from '../app/Header'
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
  const router = useRouter()

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

  return (
    <>
      <HCLayout header={<DefaultHeader />}>
        <PostFeedFrame {...breakpointProps}>
          <HeaderFrame>
            <CredIconFrame
              data-selected={!selectedPostFeed || undefined}
              onPress={() => setPostFeed(undefined)}
            >
              <CredIcon data-selected={!selectedPostFeed || undefined}>
                <Text as='h1' typo='label-md' color='var(--kai-color-sys-on-layer)'>
                  すべて
                </Text>
              </CredIcon>
            </CredIconFrame>
            {uniqueCredItems &&
              uniqueCredItems.length > 0 &&
              uniqueCredItems.map((credItem) => {
                return (
                  <CredIconFrame
                    data-selected={selectedPostFeed?.id === credItem.id || undefined}
                    key={credItem?.id}
                    onPress={() => setPostFeed(credItem)}
                  >
                    <CredIcon data-selected={selectedPostFeed?.id === credItem.id || undefined}>
                      <ImageContainer
                        src={credItem?.image || credItem?.icon || '/default_profile.jpg'}
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
          <IconButton
            icon={<PiCameraPlus size={32} />}
            color='dominant'
            variant='outlined'
            onPress={() => router.push('/post/add')}
            size='md'
            style={{
              position: 'fixed',
              bottom: 'var(--kai-size-sys-space-md)',
              right: 'var(--kai-size-sys-space-md)',
              zIndex: 'var(--kai-z-index-sys-layer-default)',
              background:
                'linear-gradient(135deg, rgba(253, 149, 255, 0.3) 0%, rgba(174, 0, 157, 0.3) 100%)',
            }}
          />
        </PostFeedFrame>
      </HCLayout>
      <PostDetailModal name='PostDetailModal' post={selectedPost} />
    </>
  )
}

const PostFeedFrame = styled.main`
  position: relative;
  width: 100%;
  height: 100svh;
  overflow-y: scroll;
`

const HeaderFrame = styled.div`
  width: 100%;
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

const CredIconFrame = styled(RACButton)`
  appearance: none;
  border: none;
  outline: nene;
  display: flex;
  width: 64px;
  height: 64px;
  padding: 4px 0px;
  align-items: flex-start;
  gap: 8px;
  transition: border var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  border-top: 2px solid var(--kai-color-sys-dominant-outline);
  border-bottom: 2px solid var(--kai-color-sys-dominant-outline);

  &[data-selected] {
    border-top: 2px solid var(--kai-color-sys-subdominant);
    border-bottom: 2px solid var(--kai-color-sys-subdominant);
  }

  &[data-hoverd] {
  }

  &[data-focused] {
    outline: none;
  }

  &[data-focus-visible] {
    outline: 2px solid var(--kai-color-sys-dominant);
    outline-offset: 2px;
  }
`

const CredIcon = styled.div`
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
  background: var(--kai-color-sys-layer-default);
  transition: background var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);

  &:hover {
    background: var(--kai-color-sys-layer-nearer);
    cursor: pointer;
  }
  &[data-selected] {
    background: var(--kai-color-sys-subdominant-backing);
  }
`
