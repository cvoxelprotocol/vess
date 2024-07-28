import styled from '@emotion/styled'
import {
  FlexVertical,
  ModalOverlay,
  useModal,
  Text,
  useBreakpoint,
  IconButton,
  Spinner,
  Skelton,
} from 'kai-kit'
import type { ModalOverlayProps } from 'kai-kit'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FC, useMemo, useRef } from 'react'
import { PiTrashBold } from 'react-icons/pi'
import { getAddressFromPkh } from 'vess-kit-web'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { CredListItem } from './CredListItem'
import { PostFrame } from './PostFrame'
import { PostWithUser } from '@/@types/user'
import { usePost } from '@/hooks/usePost'
import { removeStickerIdSurfix } from '@/hooks/useStickers'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useSelectedIDAtom, useSelectedPostAtom, useStickersAtom } from '@/jotai/ui'
import { formatDate } from '@/utils/date'
import { removeUndefinedFromArray } from '@/utils/objectUtil'

const AvatarForDisplay = dynamic(() => import('@/components/avatar/AvatarForDisplay'), {
  ssr: false,
})

type Props = {
  post?: PostWithUser
} & ModalOverlayProps

export const PostDetailModal: FC<Props> = ({ post, ...props }) => {
  const { closeModal } = useModal()
  const { breakpointProps } = useBreakpoint()
  const [_post, setPost] = useSelectedPostAtom()
  const { user } = useVESSAuthUser()
  const [selectedID, setSelectedID] = useSelectedIDAtom()
  const { deleteItem, post: detailedPost, isInitialLoading } = usePost(post?.id)
  const router = useRouter()
  const stageRef = useRef<any>()
  const [_, setStickers] = useStickersAtom()

  const incluedCredItems = useMemo(() => {
    if (
      !detailedPost?.canvas?.canvasCredentials ||
      detailedPost?.canvas?.canvasCredentials?.length === 0
    )
      return
    return removeUndefinedFromArray(
      detailedPost?.canvas?.canvasCredentials?.map((cred) => cred.credential.credentialItem),
    )
  }, [detailedPost])

  const selectedCredItemId = useMemo(() => {
    if (!selectedID) return
    return detailedPost?.canvas?.canvasCredentials?.find(
      (cred) => cred.credential.id === removeStickerIdSurfix(selectedID),
    )?.credential.credentialItem?.id
  }, [incluedCredItems, selectedID])

  const deletePost = async () => {
    if (!post?.id || !post?.credentialItemId || !user?.id) return
    await deleteItem({ postId: post.id, userId: user?.id, credentialItemId: post.credentialItemId })
  }

  const isEditable = useMemo(() => {
    return user?.id === post?.userId
  }, [user?.id, post?.userId])

  const onClose = () => {
    setPost(undefined)
    setSelectedID(undefined)
    setStickers([])
    closeModal('PostDetailModal')
  }

  return (
    <ModalOverlay
      isCloseButton
      className={'dark'}
      overlayColor={'#000000F0'}
      onClose={onClose}
      {...props}
      style={{ alignItems: 'flex-start', overflowY: 'scroll' }}
    >
      <ContentFrame {...breakpointProps}>
        <FlexVertical
          gap={'var(--kai-size-sys-space-md)'}
          style={{ width: '100%', height: '100%' }}
          justifyContent='center'
        >
          <PostFrame
            userIcon={post?.user?.avatar || '/default_profile.jpg'}
            userId={
              post?.user?.vessId
                ? `@${post?.user?.vessId}`
                : post?.user?.name || getAddressFromPkh(post?.user?.did || '')
            }
            date={formatDate(post?.createdAt.toLocaleString())}
          >
            <FlexVertical gap='var(--kai-size-sys-space-sm)' background='transparent' width='100%'>
              {detailedPost?.canvas ? (
                <AvatarForDisplay profileAvatar={detailedPost?.canvas} stageRef={stageRef} />
              ) : (
                <>
                  {post?.image && (
                    <ImageContainer
                      src={post?.image}
                      width='100%'
                      height='auto'
                      objectFit='contain'
                      style={{ borderRadius: 'var(--kai-size-sys-round-none)' }}
                    />
                  )}
                </>
              )}
              <Text as='p' typo='body-md' color={'var(--kai-color-sys-on-layer)'}>
                {post?.text}
              </Text>
            </FlexVertical>
          </PostFrame>
          <FlexVertical gap='var(--kai-size-sys-space-sm)' background='transparent' width='100%'>
            <Text
              as='p'
              typo='label-lg'
              color={'var(--kai-color-sys-on-layer-minor)'}
              style={{ marginLeft: '4px' }}
            >
              含まれている証明
            </Text>
            {isInitialLoading && <Spinner />}
            {incluedCredItems &&
              incluedCredItems.map((credItem) => {
                return (
                  <CredListItem
                    className='dark'
                    key={credItem.id}
                    title={credItem.title}
                    icon={credItem.image || ''}
                    onClick={() => {
                      console.log(' credItem.id', credItem.id)
                    }}
                    isSelected={credItem.id === selectedCredItemId}
                  ></CredListItem>
                )
              })}
          </FlexVertical>
          {isEditable && (
            <IconButton
              color='error'
              variant='tonal'
              size='sm'
              style={{
                flexGrow: 0,
                position: 'absolute',
                top: 16,
                right: 16,
                borderRadius: 'var(--kai-size-sys-round-sm)',
              }}
              onPress={() => deletePost()}
              icon={<PiTrashBold />}
            />
          )}
        </FlexVertical>
      </ContentFrame>
    </ModalOverlay>
  )
}

const ContentFrame = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  width: 100vw;
  overflow-y: scroll;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-sys-space-md);
  padding-top: var(--kai-size-sys-space-2xl);
  z-index: 10;

  &[data-media-md] {
    padding: var(--kai-size-sys-space-2xl) var(--kai-size-sys-space-md);
  }
`
