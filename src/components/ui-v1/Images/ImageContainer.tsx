import styled from '@emotion/styled'
import { ComponentPropsWithoutRef, FC } from 'react'

type Props = {
  src: string
  width: string
  height?: string
  objectFit?: string
  alt?: string
  borderRadius?: string
} & ComponentPropsWithoutRef<'div'>
export const ImageContainer: FC<Props> = ({
  src,
  width,
  height = '100%',
  objectFit = 'contain',
  alt = 'image',
  borderRadius = '0px',
  ...props
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
    <Container {...props}>
      <Content src={src} alt={alt} />
    </Container>
  )
}
