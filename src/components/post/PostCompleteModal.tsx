import styled from '@emotion/styled'
import { FlexVertical, ModalOverlay, useModal, useBreakpoint, useKai, Text } from 'kai-kit'
import type { ModalOverlayProps } from 'kai-kit'
import { FC, useMemo } from 'react'
import { IdPlate } from '../profile/IdPlate'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { Post } from '@/@types/user'
import { useSelectedPostAtom } from '@/jotai/ui'
import { shareOnX } from '@/utils/share'

type Props = {
  post?: Post
} & ModalOverlayProps

export const PostCompleteModal: FC<Props> = ({ post, ...props }) => {
  const { closeModal } = useModal()
  const { breakpointProps } = useBreakpoint()
  const { kai } = useKai()
  const [_, setPost] = useSelectedPostAtom()

  const onClose = () => {
    setPost(undefined)
    closeModal()
  }

  const shareUrl = useMemo(() => {
    if (!post) return ''
    return `https://app.vess.id/post/detial/${post?.id}`
  }, [post])

  const Tweet = () => {
    const textForPizza =
      'Check my new #GlobalPizzaParty post on @vess_id ! \n #PizzaDao @BTCPizzaDayTYO @Pizza_DAO \n\n'
    const intent = shareOnX(textForPizza, shareUrl)
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
            {post?.image && (
              <ImageContainer src={post?.image} width='100%' height='auto' objectFit='contain' />
            )}
            <FlexVertical
              padding={'var(--kai-size-sys-space-sm)'}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 'var(--kai-size-sys-round-sm)',
              }}
              background={kai.color.sys.layerFarther}
              alignItems='center'
            >
              <Text as='p' typo='label-md' color={kai.color.sys.onLayerMinor}>
                画像を長押しで保存できます。
              </Text>
            </FlexVertical>
            <Text as='p' typo='title-lg' color={kai.color.sys.onLayer}>
              投稿が完了しました！
            </Text>
            <IdPlate iconURL={'/brand/x_filled.png'} id={'Xでシェアする'} onPress={() => Tweet()} />
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
