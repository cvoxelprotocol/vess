import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { Button } from 'react-aria-components'
import { PiCheckCircleFill } from 'react-icons/pi'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { Skelton } from '@/kai/skelton'

type Props = {
  image?: string
  name?: string
  size?: string
  credId?: string
}

export const CredItem: FC<Props> = ({ image, name, size = '100%', credId }) => {
  const router = useRouter()

  const handleClick = () => {
    if (credId) {
      router.push(`/creds/detail/${credId}`)
    }
  }

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
        <CredItemFrame onPress={() => handleClick()}>
          <ImageContainer
            src={image || '/sample/event_sample.jpg'}
            alt={name || 'イベント参加証明画像'}
            objectFit='cover'
            width={size}
            style={{ zIndex: 0 }}
          />
          <IconFrame>
            <PiCheckCircleFill size={32} color={'var(--kai-color-sys-success)'} />
          </IconFrame>
        </CredItemFrame>
      </Skelton>
    </>
  )
}

const CredItemFrame = styled(Button)`
  border: none;
  position: relative;
  transition: background var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  transition-property: background, transform, opacity;
  border-radius: var(--kai-size-sys-round-xs);
  background: transparent;
  padding: 0;
  overflow: visible;

  &[data-hovered] {
    transform: scale(1.02);
    cursor: pointer;
  }
  &[data-focused] {
    outline: none;
  }
  &[data-focus-visible] {
    outline: var(--kai-size-ref-1) solid var(--kai-color-sys-dominant);
    outline-offset: var(--kai-size-ref-2);
  }
  &[data-pressed] {
    transform: scale(0.98);
    opacity: var(--kai-opacity-sys-state-pressed);
  }
`

const IconFrame = styled.div`
  position: absolute;
  top: calc(1 * var(--kai-size-ref-12));
  right: calc(1 * var(--kai-size-ref-16));
  width: var(--kai-size-ref-32);
  height: var(--kai-size-ref-32);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--kai-z-index-sys-component-nearer);
`
