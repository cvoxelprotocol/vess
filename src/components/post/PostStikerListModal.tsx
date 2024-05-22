import styled from '@emotion/styled'
import { Modal, useModal, Text } from 'kai-kit'
import type { ModalProps } from 'kai-kit'
import React, { FC } from 'react'
import { vcImage } from '../avatar/ImageCanvas'
import DraggablePostSticker from './DraggablePostSticker'

export type StickerListModalProps = {
  stickers: vcImage[]
} & ModalProps

export const PostStikerListModal: FC<StickerListModalProps> = ({ stickers, ...modalProps }) => {
  const { closeModal } = useModal()
  return (
    <Modal
      title='ステッカーを追加'
      overlayColor='#000000CC'
      isDismissable
      {...modalProps}
      height='80%'
    >
      {stickers.length === 0 ? (
        <EmptyFrame>
          <Text typo='title-md' color='var(--kai-color-sys-on-layer-minor)'>
            ステッカーがありません。
          </Text>
        </EmptyFrame>
      ) : null}
      <StickerListFrame>
        {stickers.map((sticker, index) => (
          <DraggablePostSticker
            key={`${sticker.id}-${index}`}
            id={sticker.id}
            imageUrl={sticker.url}
            credId={sticker.id}
            onAddEnd={() => closeModal(modalProps.name ?? undefined)}
          />
        ))}
      </StickerListFrame>
    </Modal>
  )
}

const StickerListFrame = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
`

const EmptyFrame = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  padding-top: var(--kai-size-sys-space-lg);
`
