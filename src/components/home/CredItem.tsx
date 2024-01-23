import React, { FC } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { Skelton } from '@/kai/skelton'

type Props = {
  image?: string
  name?: string
  size?: string
}

export const CredItem: FC<Props> = ({ image, name, size = '100%' }) => {
  return (
    <>
      <Skelton
        variant='filled'
        isLoading={!image}
        width='100%'
        height='auto'
        aspectRatio='1'
        maskColor='var(--kai-color-sys-background)'
        radius='var(--kai-size-sys-round-full)'
        borderWidth='var(--kai-size-ref-2)'
      >
        <ImageContainer
          src={image || '/sample/event_sample.jpg'}
          alt={name || 'イベント参加証明画像'}
          objectFit='cover'
          width={size}
        />
      </Skelton>
    </>
  )
}
