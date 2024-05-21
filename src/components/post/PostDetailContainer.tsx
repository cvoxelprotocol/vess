import styled from '@emotion/styled'
import { Button, FlexHorizontal, Skelton, Text } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { IdPlate } from '../profile/IdPlate'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { usePost } from '@/hooks/usePost'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { formatDateWithMinutes } from '@/utils/date'
import { getAddressFromPkh } from '@/utils/did'

type Props = {
  id?: string
}
export const PostDetailContainer: FC<Props> = ({ id }) => {
  const { post, deleteItem, isInitialLoading } = usePost(id)
  const { id: myId } = useVESSAuthUser()
  const { vsUserById } = useVESSUserProfile(undefined, post?.userId)
  const router = useRouter()

  const isEditable = useMemo(() => {
    return myId === post?.userId
  }, [myId, post?.userId])

  const deletePost = async () => {
    if (!post?.id || !post?.credentialItemId || !myId) return
    await deleteItem({ postId: post.id, userId: myId, credentialItemId: post.credentialItemId })
  }

  if (!post && !isInitialLoading) {
    return (
      <PostDetailContainerFrame>
        <FlexVertical width='100%' alignItems='start' gap='var(--kai-size-ref-24)'>
          <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
            No Item Found
          </Text>
          {isEditable && (
            <Button
              color='error'
              variant='tonal'
              style={{ flexGrow: 0 }}
              onPress={() => router.back()}
            >
              Back
            </Button>
          )}
        </FlexVertical>
      </PostDetailContainerFrame>
    )
  }

  return (
    <PostDetailContainerFrame className={'dark'}>
      <InnerFrame>
        <Skelton
          width='var(--kai-size-ref-192)'
          height='var(--kai-size-ref-192)'
          radius='var(--kai-size-sys-round-sm)'
          isLoading={isInitialLoading}
        ></Skelton>
        {!isInitialLoading && post?.image && (
          <ImageContainer src={post?.image} width='100%' height='auto' objectFit='contain' />
        )}
        {vsUserById && (
          <FlexHorizontal
            width='100%'
            alignItems='center'
            justifyContent='center'
            gap='var(--kai-size-ref-6)'
          >
            <ImageContainer
              src={vsUserById.avatar || 'default_profile.jpg'}
              width='var(--kai-size-ref-32)'
              height='var(--kai-size-ref-32)'
              objectFit='contain'
              borderRadius='var(--kai-size-sys-round-full)'
            />
            <Text
              typo='title-md'
              color='var(--kai-color-sys-on-layer)'
              isLoading={isInitialLoading}
            >
              {`@${vsUserById?.name || 'Unknown'}`}
            </Text>
          </FlexHorizontal>
        )}
        {post?.createdAt && (
          <Text typo='label-md' color='var(--kai-color-sys-neutral)' isLoading={isInitialLoading}>
            {formatDateWithMinutes(post.createdAt.toLocaleString())}
          </Text>
        )}
        {isEditable && (
          <FlexVertical width='100%' alignItems='end' gap='var(--kai-size-ref-24)'>
            <Button
              color='error'
              variant='tonal'
              style={{ flexGrow: 0 }}
              onPress={() => deletePost()}
            >
              Delete
            </Button>
          </FlexVertical>
        )}
      </InnerFrame>
    </PostDetailContainerFrame>
  )
}

const PostDetailContainerFrame = styled.div`
  display: flex;
  inset: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kai-size-ref-96);
  padding: var(--kai-size-ref-12);
  min-height: 100vh;
  background: var(--kai-color-sys-on-subdominant);
`
const InnerFrame = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  gap: 16px;
  border-radius: var(--kai-size-sys-round-lg);
  opacity: 0px;
  background: var(--kai-color-sys-layer-default);
  align-items: center;
  display: flex;
  flex-direction: column;
`
