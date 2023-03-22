import styled from '@emotion/styled'
import { FC } from 'react'

type Props = {
  type: 'p' | 'h1' | 'h2' | 'h3' | 'span'
  font: string
  color: string
  text: string
}
export const Text: FC<Props> = ({ font, color, type, text }) => {
  const P = styled.p`
    white-space: pre-wrap;
    color: ${color};
    ${font}
  `
  const H1 = styled.h1`
    white-space: pre-wrap;
    color: ${color};
    ${font}
  `
  const H2 = styled.h2`
    white-space: pre-wrap;
    color: ${color};
    ${font}
  `
  const H3 = styled.h3`
    white-space: pre-wrap;
    color: ${color};
    ${font}
  `
  const Span = styled.span`
    white-space: pre-wrap;
    color: ${color};
    ${font}
  `
  switch (type) {
    case 'p':
      return <P>{text}</P>
    case 'h1':
      return <H1>{text}</H1>
    case 'h2':
      return <H2>{text}</H2>
    case 'h3':
      return <H3>{text}</H3>
    case 'span':
      return <Span>{text}</Span>

    default:
      return <P>{text}</P>
  }
}
