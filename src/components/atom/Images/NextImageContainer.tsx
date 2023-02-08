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
export const NextImageContainer: FC<Props> = ({
  src,
  width,
  objectFit = 'contain',
  alt = 'image',
  borderRadius,
}) => {
  const Container = styled.div`
    width: ${width};
    height: 100%;
    border-radius: ${borderRadius};
    position: relative;
    overflow: hidden;
  `
  const Content = styled(Image)`
    object-fit: ${objectFit};
  `

  return (
    <Container>
      <Content src={src} fill alt={alt} />
    </Container>
  )
}
