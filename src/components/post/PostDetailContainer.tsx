import styled from '@emotion/styled'
import { Button, FlexHorizontal, Skelton, Text, FlexVertical } from 'kai-kit'
import router, { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import { usePost } from '@/hooks/usePost'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { formatDateWithMinutes } from '@/utils/date'
import { shortenStr } from '@/utils/objectUtil'

type Props = {
  id?: string
}
export const PostDetailContainer: FC<Props> = ({ id }) => {
  const { post, deleteItem, isInitialLoading } = usePost(id)
  const { id: myId } = useVESSAuthUser()
  const { vsUserById } = useVESSUserProfile(undefined, post?.userId)
  const { credItem } = useCredentialItem(post?.credentialItemId || undefined)
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
            onClick={() => {
              if (vsUserById.vessId) {
                router.push(`/${vsUserById.vessId}`)
              } else {
                router.push(`/did/${vsUserById.did}`)
              }
            }}
          >
            <ImageContainer
              src={vsUserById.avatar || '/default_profile.jpg'}
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
              {`${
                vsUserById.vessId
                  ? `@${vsUserById.vessId}`
                  : vsUserById?.name ?? shortenStr(vsUserById.did || '', 14)
              }`}
            </Text>
          </FlexHorizontal>
        )}
        {post?.createdAt && (
          <Text typo='label-md' color='var(--kai-color-sys-neutral)' isLoading={isInitialLoading}>
            {formatDateWithMinutes(post.createdAt.toLocaleString())}
          </Text>
        )}
        {credItem && (
          <FlexVertical
            padding='24px 0 0 0'
            gap='var(--kai-size-sys-space-sm)'
            width='100%'
            justifyContent='center'
            alignItems='center'
            onClick={() => {
              router.push(`/creds/receive/${credItem.id}`)
            }}
          >
            <Text as='h2' typo='title-sm' align='center' color='var(--kai-color-sys-on-background)'>
              利用しているクレデンシャル
            </Text>
            {credItem?.image && (
              <ImageContainer
                src={credItem?.image}
                width='var(--kai-size-ref-192)'
                height='auto'
                objectFit='contain'
              />
            )}
          </FlexVertical>
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
