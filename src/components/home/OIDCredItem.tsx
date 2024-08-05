import styled from '@emotion/styled'
import { ICredentialBranding } from '@sphereon/ssi-sdk.data-store'
import { Skelton } from 'kai-kit'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo, useRef } from 'react'
import { Button } from 'react-aria-components'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'

type Props = {
  brandings?: ICredentialBranding[]
  credId?: string
  width?: string
  height?: string
}

export const OIDCredItem: FC<Props> = ({ brandings, credId, width, height }) => {
  const router = useRouter()
  const imgRef = useRef<HTMLImageElement>(null)
  const [isSquare, setIsSquare] = React.useState(false)

  const localeBranding = useMemo(() => {
    if (!brandings || brandings.length === 0 || brandings[0].localeBranding.length === 0) return
    return brandings[0].localeBranding[0]
  }, [brandings])

  const name = useMemo(() => {
    return localeBranding ? localeBranding.alias : 'verifiable credential'
  }, [localeBranding])

  const image = useMemo(() => {
    return localeBranding ? localeBranding.background?.image?.uri || localeBranding.logo?.uri : ''
  }, [localeBranding])

  useEffect(() => {
    if (imgRef.current) {
      const img = imgRef.current
      img.onload = () => {
        if (img.naturalWidth / img.naturalHeight < 1.4) {
          setIsSquare(true)
        } else {
          setIsSquare(false)
        }
      }
    }
  }, [image, imgRef])

  const handleClick = () => {
    if (credId) {
      router.push(`/oid/detail/${credId}`)
    }
  }

  return (
    <Skelton
      variant='filled'
      isLoading={!image}
      width={width}
      height='auto'
      aspectRatio='1.618 / 1'
      maskColor='var(--kai-color-sys-background)'
      radius='var(--kai-size-sys-round-md)'
      borderWidth='var(--kai-size-ref-2)'
    >
      <CredItemFrame
        onPress={() => handleClick()}
        data-square={isSquare || undefined}
        width={width}
        height={height}
      >
        {isSquare ? (
          <CredImageFrame>
            <CredImageBackground src={image} ref={imgRef} />
            <CredImageOverlay />
            <CredImage src={image || ''} />
          </CredImageFrame>
        ) : (
          <ImageContainer
            src={image || '/sample/event_sample.png'}
            alt={name || '-'}
            objectFit='contain'
            width={'100%'}
            style={{ zIndex: 0 }}
            ref={imgRef}
          />
        )}
        <IconFrame>
          <NextImageContainer src='/icon/verified_rich.png' width='32px' />
        </IconFrame>
      </CredItemFrame>
    </Skelton>
  )
}
const CredItemFrame = styled(Button)<{ width?: string; height?: string }>`
  flex-shrink: 0;
  border: none;
  width: ${(props) => props.width ?? 'auto'};
  height: ${(props) => props.height ?? 'auto'};
  aspect-ratio: 1.618 / 1;
  position: relative;
  transition: background var(--kai-motion-sys-duration-medium) var(--kai-motion-sys-easing-standard);
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

const CredImageFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1.618 / 1;
  overflow: hidden;
  border-radius: var(--kai-size-sys-round-md);
  border: var(--kai-size-ref-1) solid var(--kai-color-sys-neutral-outline-minor);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--kai-size-sys-space-lg);
`

const CredImageBackground = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  aspect-ratio: 1.618 / 1;
  opacity: 0.4;
  object-fit: cover;
  object-position: center;
  filter: blur(12px);
`

const CredImageOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: var(--kai-color-sys-neutral);
  opacity: 0.1;
`

const CredImage = styled.div<{ src: string }>`
  position: absolute;
  top: var(--kai-size-sys-space-md);
  right: var(--kai-size-sys-space-md);
  left: var(--kai-size-sys-space-md);
  bottom: var(--kai-size-sys-space-md);
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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
