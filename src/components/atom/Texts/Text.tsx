import styled from '@emotion/styled'
import { FC } from 'react'
import { IconsType, ICONS, Icon } from '@/components/atom/Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  type: 'p' | 'h1' | 'h2' | 'h3' | 'span'
  font: string
  color: string
  text?: string
  whiteSpace?: 'pre-wrap' | 'nowrap'
  wordWrap?: 'break-word' | 'normal'
  fontSp?: string
  afterIcon?: IconsType
  afterIconSize?: string
  afterIconColor?: string
}

export const Text: FC<Props> = ({
  font,
  color,
  type,
  text,
  whiteSpace = 'pre-wrap',
  wordWrap = 'break-word',
  fontSp,
  afterIcon,
  afterIconSize = '24px',
  afterIconColor,
}) => {
  const { currentTheme } = useVESSTheme()

  const TextContainer = styled.div`
    display: flex;
    column-gap: 0.125rem;
    align-items: center;
  `

  const P = styled.p`
    white-space: ${whiteSpace};
    word-wrap: ${wordWrap};
    color: ${color};
    ${font}
    @media (max-width: 599px) {
      ${fontSp || font};
    }
  `

  const H1 = styled.h1`
    white-space: ${whiteSpace};
    word-wrap: ${wordWrap};
    color: ${color};
    ${font}
    @media (max-width: 599px) {
      ${fontSp || font};
    }
  `
  const H2 = styled.h2`
    white-space: ${whiteSpace};
    word-wrap: ${wordWrap};
    color: ${color};
    ${font}
    @media (max-width: 599px) {
      ${fontSp || font};
    }
  `
  const H3 = styled.h3`
    white-space: ${whiteSpace};
    word-wrap: ${wordWrap};
    color: ${color};
    ${font}
    @media (max-width: 599px) {
      ${fontSp || font};
    }
  `
  const Span = styled.span`
    white-space: ${whiteSpace};
    word-wrap: ${wordWrap};
    color: ${color};
    ${font}
    @media (max-width: 599px) {
      ${fontSp || font};
    }
  `
  switch (type) {
    case 'p':
      return (
        <TextContainer>
          <P>{text}</P>
          {afterIcon && (
            <Icon
              icon={afterIcon}
              size={'L'}
              mainColor={afterIconColor || currentTheme.onSurface}
            />
          )}
        </TextContainer>
      )
    case 'h1':
      return (
        <TextContainer>
          <H1>{text}</H1>
          {afterIcon && (
            <Icon
              icon={afterIcon}
              size={'L'}
              mainColor={afterIconColor || currentTheme.onSurface}
            />
          )}
        </TextContainer>
      )

    case 'h2':
      return (
        <TextContainer>
          <H2>{text}</H2>
          {afterIcon && (
            <Icon
              icon={afterIcon}
              size={'L'}
              mainColor={afterIconColor || currentTheme.onSurface}
            />
          )}
        </TextContainer>
      )
    case 'h3':
      return (
        <TextContainer>
          <H3>{text}</H3>
          {afterIcon && (
            <Icon
              icon={afterIcon}
              size={'L'}
              mainColor={afterIconColor || currentTheme.onSurface}
            />
          )}
        </TextContainer>
      )
    case 'span':
      return (
        <TextContainer>
          <Span>{text}</Span>
          {afterIcon && (
            <Icon
              icon={afterIcon}
              size={'L'}
              mainColor={afterIconColor || currentTheme.onSurface}
            />
          )}
        </TextContainer>
      )

    default:
      return (
        <TextContainer>
          <P>{text}</P>
          {afterIcon && (
            <Icon
              icon={afterIcon}
              size={'L'}
              mainColor={afterIconColor || currentTheme.onSurface}
            />
          )}
        </TextContainer>
      )
  }
}
