import styled from '@emotion/styled'
import Image from 'next/image'
import { FC } from 'react'

type Props = {
  src: string
  width: string
  height?: string
  objectFit?: string
  alt?: string
  borderRadius?: string
}
export const NextImageContainer: FC<Props> = ({
  src,
  width,
  objectFit = 'contain',
  alt = 'image',
  borderRadius,
  height = '100%',
}) => {
  return (
    <Container width={width} height={height} borderRadius={borderRadius}>
      <Content src={src} fill alt={alt} sizes={width} objectFit={objectFit} />
    </Container>
  )
}

const Container = styled.div<{ width: string; height: string; borderRadius?: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: ${(props) => props.borderRadius || '0px'};
  position: relative;
  overflow: hidden;
  border: none;
  outline: none;
`
const Content = styled(Image)<{ objectFit: string }>`
  object-fit: ${(props) => props.objectFit};
  border: none;
  outline: none;
`
