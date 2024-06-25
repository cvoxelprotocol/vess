import styled from '@emotion/styled'
import { FlexVertical, IconButton, Skelton, Text, useBreakpoint, useModal } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { Button as RACButton } from 'react-aria-components'
import { PiCameraPlus, PiFilmStrip } from 'react-icons/pi'
import EmptyView from '../app/EmptyView'
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
  const { postFeed, isInitialLoading } = usePostFeed(did)
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
      //FIXME: should improve performance
      return (
        postFeed
          ?.flatMap((feed) => feed.post)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .filter((v, i, a) => a.findIndex((t) => t.image === v.image) === i) ||
        [] ||
        []
      )
    }
    return (
      postFeed
        ?.find((p) => p.id === selectedPostFeed.id)
        ?.post.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) ||
      []
    )
  }, [postFeed, selectedPostFeed])

  console.log({ allItems })

  const uniqueCredItems = useMemo(() => {
    return postFeed?.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
  }, [postFeed])

  return (
    <>
      <HCLayout header={<DefaultHeader />}>
        <PostFeedFrame {...breakpointProps}>
          <HeaderFrame {...breakpointProps}>
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

          <FlexVertical
            width='100%'
            gap='var(--kai-size-sys-space-sm)'
            padding='0 var(--kai-size-sys-space-md) var(--kai-size-sys-space-md) var(--kai-size-sys-space-md)'
            style={{
              flexGrow: 1,
              overflowY: 'scroll',
              flexWrap: 'nowrap',
            }}
          >
            {selectedPostFeed && (
              <CredListItem
                key={selectedPostFeed.id}
                title={selectedPostFeed.title}
                icon={selectedPostFeed.image || selectedPostFeed.icon || ''}
              ></CredListItem>
            )}
            <Skelton isLoading={isInitialLoading} width='100%' height='600px'>
              {allItems.length > 0 ? (
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
                      <FlexVertical gap='var(--kai-size-sys-space-sm)' background='transparent'>
                        {post?.image && (
                          <ImageContainer
                            src={post?.image}
                            width='100%'
                            height='auto'
                            objectFit='contain'
                            style={{ borderRadius: 'var(--kai-size-sys-round-none)' }}
                          />
                        )}
                        <Text as='p' typo='body-md' color={'var(--kai-color-sys-neutral-minor)'}>
                          {post?.text}
                        </Text>
                      </FlexVertical>
                    </PostFrame>
                  )
                })
              ) : (
                <EmptyView
                  icon={<PiFilmStrip />}
                  title='投稿がまだありません'
                  description='最初の投稿を作成して思い出を残しましょう！'
                  isButton
                  buttonOptions={{
                    onPress: () => router.push('/post/add'),
                    children: '投稿する',
                  }}
                />
              )}
            </Skelton>
          </FlexVertical>
          <IconButton
            icon={<PiCameraPlus size={32} />}
            color='dominant'
            variant='filled'
            onPress={() => router.push('/post/add')}
            size='md'
            style={{
              position: 'fixed',
              bottom: 'var(--kai-size-sys-space-md)',
              right: 'var(--kai-size-sys-space-md)',
              zIndex: 'var(--kai-z-index-sys-layer-default)',
              borderRadius: '8px',
              background: 'var(--kai-color-sys-subdominant)',
              border: '1px solid var(--kai-color-sys-subdominant-outline-minor)',
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
  height: calc(100svh - 80px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const HeaderFrame = styled.div`
  flex-shrink: 0;
  width: 100vw;
  display: flex;
  padding: var(--kai-size-sys-space-md);
  gap: 4px;
  place-items: center;
  align-items: flex-start;
  height: var(--kai-size-ref-96);
  z-index: var(--kai-z-index-sys-fixed-default);
  align-self: stretch;
  overflow-x: scroll;

  &[data-media-md] {
    width: var(--kai-size-breakpoint-xs-max-width);
  }
`

const CredIconFrame = styled(RACButton)`
  appearance: none;
  border: none;
  outline: nene;
  background: transparent;
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
