import styled from '@emotion/styled'
import Image from 'next/image'
import { FC } from 'react'

type Props = {
  src: string
  width: string
  objectFit?: string
  alt?: string
  borderRadius?: string
}
export const ImageContainer: FC<Props> = ({
  src,
  width,
  objectFit = 'contain',
  alt = 'image',
  borderRadius = '0px',
}) => {
  const Container = styled.div`
    width: ${width};
    height: 100%;
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
