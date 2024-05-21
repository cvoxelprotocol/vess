import styled from '@emotion/styled'
import {
  FlexVertical,
  ModalOverlay,
  useModal,
  Text,
  Button,
  FlexHorizontal,
  useBreakpoint,
} from 'kai-kit'
import type { ModalOverlayProps } from 'kai-kit'
import { FC, useMemo } from 'react'
import { PiTrashBold } from 'react-icons/pi'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { Post } from '@/@types/user'
import { usePost } from '@/hooks/usePost'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useSelectedPostAtom } from '@/jotai/ui'
import { formatDateWithMinutes } from '@/utils/date'

type Props = {
  post?: Post
} & ModalOverlayProps

export const PostDetailModal: FC<Props> = ({ post, ...props }) => {
  const { closeModal } = useModal()
  const { breakpointProps } = useBreakpoint()
  const [_, setPost] = useSelectedPostAtom()
  const { id: myId } = useVESSAuthUser()
  const { vsUserById } = useVESSUserProfile(undefined, post?.userId)
  const { deleteItem } = usePost()

  console.log({ post })

  const deletePost = async () => {
    if (!post?.id || !post?.credentialItemId || !myId) return
    await deleteItem({ postId: post.id, userId: myId, credentialItemId: post.credentialItemId })
  }

  const isEditable = useMemo(() => {
    return myId === post?.userId
  }, [myId, post?.userId])

  const onClose = () => {
    setPost(undefined)
    closeModal()
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
          <InnerFrame>
            {post?.image && (
              <ImageContainer
                src={post?.image}
                width='100%'
                height='auto'
                objectFit='contain'
                style={{ borderRadius: 'var(--kai-size-sys-round-md)' }}
              />
            )}
            <FlexVertical
              gap='var(--kai-size-sys-space-xs)'
              width='100%'
              justifyContent='center'
              alignItems='center'
            >
              {vsUserById && (
                <FlexHorizontal
                  width='100%'
                  alignItems='center'
                  justifyContent='center'
                  gap='var(--kai-size-ref-6)'
                >
                  <ImageContainer
                    src={vsUserById.avatar || 'default_profile.jpg'}
                    width='var(--kai-size-ref-28)'
                    height='var(--kai-size-ref-28)'
                    objectFit='contain'
                    borderRadius='var(--kai-size-sys-round-full)'
                  />
                  <Text typo='title-md' color='var(--kai-color-sys-on-layer)'>
                    {`${`@${vsUserById.vessId}` || vsUserById?.name || 'Unknown'}`}
                  </Text>
                </FlexHorizontal>
              )}
              {post?.createdAt && (
                <Text typo='label-lg' color='var(--kai-color-sys-neutral)' align='center'>
                  {formatDateWithMinutes(post.createdAt.toLocaleString())}
                </Text>
              )}
            </FlexVertical>
            {isEditable && (
              <FlexVertical width='100%' alignItems='end' gap='var(--kai-size-ref-24)'>
                <Button
                  color='error'
                  variant='outlined'
                  size='sm'
                  style={{ flexGrow: 0 }}
                  onPress={() => deletePost()}
                  startContent={<PiTrashBold />}
                >
                  削除する
                </Button>
              </FlexVertical>
            )}
          </InnerFrame>
        </FlexVertical>
      </ContentFrame>
    </ModalOverlay>
  )
}

const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 100svh;
  max-width: var(--kai-size-breakpoint-xs-max-width);
  gap: var(--kai-size-sys-space-md);
  padding: var(--kai-size-sys-space-md);

  &[data-media-md] {
    padding: var(--kai-size-sys-space-2xl) var(--kai-size-sys-space-md);
  }
`
const InnerFrame = styled.div`
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