import styled from '@emotion/styled'
import {
  FlexVertical,
  ModalOverlay,
  useModal,
  Text,
  useBreakpoint,
  IconButton,
  Spinner,
} from 'kai-kit'
import type { ModalOverlayProps } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { Button as RACButton } from 'react-aria-components'
import { PiTrashBold } from 'react-icons/pi'
import { getAddressFromPkh } from 'vess-kit-web'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { CredListItem } from './CredListItem'
import { PostFrame } from './PostFrame'
import { PostWithUser } from '@/@types/user'
import { usePost } from '@/hooks/usePost'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useSelectedPostAtom } from '@/jotai/ui'
import { formatDate } from '@/utils/date'
import { removeUndefinedFromArray } from '@/utils/objectUtil'

type Props = {
  post?: PostWithUser
} & ModalOverlayProps

export const PostDetailModal: FC<Props> = ({ post, ...props }) => {
  const { closeModal } = useModal()
  const { breakpointProps } = useBreakpoint()
  const [_, setPost] = useSelectedPostAtom()
  const { id: myId } = useVESSAuthUser()

  const { deleteItem, post: detailedPost, isInitialLoading } = usePost(post?.id)
  const router = useRouter()

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

  const deletePost = async () => {
    if (!post?.id || !post?.credentialItemId || !myId) return
    await deleteItem({ postId: post.id, userId: myId, credentialItemId: post.credentialItemId })
  }

  const isEditable = useMemo(() => {
    return myId === post?.userId
  }, [myId, post?.userId])

  const onClose = () => {
    setPost(undefined)
    closeModal('PostDetailModal')
  }

  return (
    <ModalOverlay
      isCloseButton
      className={'dark'}
      overlayColor={'#000000F0'}
      onClose={onClose}
      {...props}
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
          <Text as='p' typo='label-lg' color={'var(--kai-color-sys-on-layer-minor)'}>
            含まれている証明
          </Text>
          {isInitialLoading && <Spinner />}
          {incluedCredItems &&
            incluedCredItems.map((credItem) => {
              return (
                <CredListItem
                  key={credItem.id}
                  title={credItem.title}
                  icon={credItem.image || ''}
                  onClick={() => {
                    console.log(' credItem.id', credItem.id)
                    onClose()
                  }}
                ></CredListItem>
              )
            })}
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
  justify-content: space-between;
  width: 100vw;
  height: 100svh;
  overflow-y: scroll;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-sys-space-md);
  z-index: 10;

  &[data-media-md] {
    padding: var(--kai-size-sys-space-2xl) var(--kai-size-sys-space-md);
  }
`
const InnerFrame = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding: 8px;
  gap: 16px;
  border-radius: var(--kai-size-sys-round-lg);
  opacity: 0px;
  background: var(--kai-color-sys-layer-default);
  align-items: center;
  display: flex;
  flex-direction: column;
`

const CredButton = styled(RACButton)`
  outline: none;
  border: none;
  display: flex;
  gap: var(--kai-size-sys-space-sm);
  align-items: center;
  justify-content: center;
  width: 100%;
  background: var(--kai-color-sys-layer-farthest);
  border-radius: var(--kai-size-sys-round-md);
  padding: var(--kai-size-sys-space-sm) var(--kai-size-sys-space-md);

  &[data-focused] {
    outline: none;
  }

  &[data-focus-visible] {
    outline: 2px solid var(--kai-color-sys-dominant);
    outline-offset: 2px;
  }
`
