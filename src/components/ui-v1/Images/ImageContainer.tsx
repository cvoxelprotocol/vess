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
export const ImageContainer: FC<Props> = ({
  src,
  width,
  height = '100%',
  objectFit = 'contain',
  alt = 'image',
  borderRadius = '0px',
}) => {
  const Container = styled.div`
    width: ${width};
    height: ${height};
    position: relative;
    overflow: hidden;
    border-radius: ${borderRadius};
  `
  const Content = styled.img`
    width: 100%;
    object-fit: ${objectFit};
  `

  return (
    <Container>
      <Content src={src} alt={alt} />
    </Container>
  )
}