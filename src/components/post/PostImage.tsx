import styled from '@emotion/styled'
import React, { FC, useMemo } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useImage } from '@/hooks/useImage'

type PostImageProps = {
  src: string
  onClick: () => void
}

export const PostImage: FC<PostImageProps> = ({ src, onClick }) => {
  const { imageWithSize: image } = useImage(src)

  const imageShape = useMemo(() => {
    if (image?.aspectRatio) {
      if (image?.aspectRatio > 1.5) {
        return 'horizontal'
      } else if (image?.aspectRatio < 0.9) {
        return 'vertical'
      }
      return 'square'
    }
    return 'square'
  }, [image])

  return <ImageFrame data-shape={imageShape} imgUrl={src} onClick={onClick} />
}

const ImageFrame = styled.div<{ imgUrl: string }>`
  position: relative;
  border-radius: var(--kai-size-sys-round-md);
  grid-column: span 2;
  grid-row: span 2;
  background-image: url(${(props) => props.imgUrl});
  background-size: cover;
  background-position: center;
  overflow: hidden;
  cursor: pointer;

  &[data-shape='horizontal'] {
    grid-column: span 4;
    grid-row: span 2;
  }

  &[data-shape='vertical'] {
    grid-column: span 2;
    grid-row: span 3;
  }
`

const Image = styled.img`
  position: absolute;
  inset: 0;
  object-fit: cover;
`
