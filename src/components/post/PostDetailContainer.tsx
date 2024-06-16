import styled from '@emotion/styled'
import { Button, Skelton, Text, FlexVertical, IconButton, Spinner } from 'kai-kit'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FC, useMemo, useRef } from 'react'
import { PiTrashBold } from 'react-icons/pi'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { CredListItem } from './CredListItem'
import { PostFrame } from './PostFrame'
import { usePost } from '@/hooks/usePost'
import { removeStickerIdSurfix } from '@/hooks/useStickers'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useSelectedIDAtom } from '@/jotai/ui'
import { formatDate } from '@/utils/date'
import { getAddressFromPkh } from '@/utils/did'
import { removeUndefinedFromArray } from '@/utils/objectUtil'

const AvatarForDisplay = dynamic(() => import('@/components/avatar/AvatarForDisplay'), {
  ssr: false,
})

type Props = {
  id?: string
}
export const PostDetailContainer: FC<Props> = ({ id }) => {
  const { post, deleteItem, isInitialLoading } = usePost(id)
  const { id: myId } = useVESSAuthUser()
  const router = useRouter()
  const stageRef = useRef<any>()
  const [selectedID, setSelectedID] = useSelectedIDAtom()

  const isEditable = useMemo(() => {
    return myId === post?.userId
  }, [myId, post?.userId])

  const incluedCredItems = useMemo(() => {
    if (!post?.canvas?.canvasCredentials || post?.canvas?.canvasCredentials?.length === 0) return
    return removeUndefinedFromArray(
      post?.canvas?.canvasCredentials?.map((cred) => cred.credential.credentialItem),
    )
  }, [post])

  const selectedCredItemId = useMemo(() => {
    if (!selectedID) return
    return post?.canvas?.canvasCredentials?.find(
      (cred) => cred.credential.id === removeStickerIdSurfix(selectedID),
    )?.credential.credentialItem?.id
  }, [incluedCredItems, selectedID])

  const deletePost = async () => {
    if (!post?.id || !post?.credentialItemId || !myId) return
    await deleteItem({ postId: post.id, userId: myId, credentialItemId: post.credentialItemId })
  }

  const onClose = () => {
    setSelectedID(undefined)
    router.back()
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
            {post?.canvas ? (
              <AvatarForDisplay profileAvatar={post?.canvas} stageRef={stageRef} />
            ) : (
              <>
                {post?.image && (
                  <ImageContainer
                    src={post?.image}
                    width='100%'
                    height='auto'
                    objectFit='contain'
                    style={{ borderRadius: 'var(--kai-size-sys-round-md)' }}
                  />
                )}
              </>
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
                  isSelected={credItem.id === selectedCredItemId}
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
