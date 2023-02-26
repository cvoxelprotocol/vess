import styled from '@emotion/styled'
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
  const Container = styled.div`
    width: ${width};
    height: ${height};
    border-radius: ${borderRadius};
    position: relative;
    overflow: hidden;
    border: none;
    outline: none;
  `
  const ImageContent = styled.img`
    object-fit: fill;
    width: 100%;
    height: auto;
  `

  return (
    <Container>
      <ImageContent src={src} alt={alt} />
    </Container>
  )
}
