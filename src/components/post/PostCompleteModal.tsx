import styled from '@emotion/styled'
import { FlexVertical, ModalOverlay, useModal, useBreakpoint, Text, Button } from 'kai-kit'
import type { ModalOverlayProps } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { IdPlate } from '../profile/IdPlate'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { PostFrame } from './PostFrame'
import { Post } from '@/@types/user'
import { useSelectedPostAtom } from '@/jotai/ui'
import { formatDateWithMinutes } from '@/utils/date'
import { shareOnX } from '@/utils/share'

type Props = {
  post?: Post
  credId?: string
  userIcon?: string
  userName?: string
} & ModalOverlayProps

export const PostCompleteModal: FC<Props> = ({ post, credId, ...props }) => {
  const { closeModal } = useModal()
  const { breakpointProps } = useBreakpoint()
  const [_, setPost] = useSelectedPostAtom()
  const router = useRouter()

  const onClose = () => {
    setPost(undefined)
    if (credId) {
      router.push(`/creds/items/feed/${credId}`)
    }
    closeModal('PostCompleteModal')
  }

  const shareUrl = useMemo(() => {
    if (!post) return ''
    return `${process.env.NEXT_PUBLIC_VESS_URL}/post/detail/${post?.id}`
  }, [post])

  const Tweet = () => {
    const text = 'Check my new post on @vess_id ! \n #vess #myidentity #vc \n\n'
    const intent = shareOnX(text, shareUrl)
    window.open(intent, '_blank')
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
            <FlexVertical width='100%' gap='var(--kai-size-sys-space-sm)'>
              <PostFrame
                userIcon={props.userIcon || '/default_profile.jpg'}
                userId={props.userName || ''}
                date={formatDateWithMinutes(post?.createdAt.toLocaleString())}
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
              <FlexVertical width='100%' gap='var(--kai-size-sys-space-sm)' alignItems='center'>
                <Text as='p' typo='title-lg' color={'var(--kai-color-sys-on-layer)'}>
                  投稿が完了しました！
                </Text>
              </FlexVertical>
              <FlexVertical
                padding={'var(--kai-size-sys-space-sm)'}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 'var(--kai-size-sys-round-sm)',
                }}
                background={'var(--kai-color-sys-layer-farther)'}
                alignItems='center'
              >
                <Text as='p' typo='label-md' color={'var(--kai-color-sys-on-layer-minor)'}>
                  画像を長押しで保存できます。
                </Text>
              </FlexVertical>
            </FlexVertical>
            <IdPlate iconURL={'/brand/x_filled.png'} id={'Xでシェアする'} onPress={() => Tweet()} />
            <Button
              color='neutral'
              variant='tonal'
              width='100%'
              onPress={() => {
                onClose()
              }}
            >
              閉じる
            </Button>
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
  z-index: -1;

  &[data-media-md] {
    padding: var(--kai-size-sys-space-2xl) var(--kai-size-sys-space-md);
  }
`

const InnerFrame = styled.div`
  width: 100%;
  height: auto;
  margin-top: 16px;
  padding: 8px;
  gap: 16px;
  border-radius: var(--kai-size-sys-round-lg);
  opacity: 0px;
  align-items: center;
  display: flex;
  flex-direction: column;
`
