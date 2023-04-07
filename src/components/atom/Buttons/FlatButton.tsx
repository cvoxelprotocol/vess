import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import { IconsType } from '../Icons/Icon'
import { NextImageContainer } from '../Images/NextImageContainer'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  src: string | IconsType
  label?: string
  labelColor?: string
  background?: string
  width?: string
  height?: string
  radius?: string
  borderColor?: string
  iconSize?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const FlatButton: FC<Props> = ({
  src,
  label,
  labelColor,
  background,
  width,
  height,
  radius,
  borderColor,
  iconSize = '32px',
  ...props
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const WrappedButton = styled.button`
    width: ${width || 'fit-content'};
    height: ${height || 'fit-content'};
    padding: 16px 20px;
    background: ${background || 'transparent'};
    display: flex;
    align-items: center;
    column-gap: 12px;
    border-radius: ${radius || '16px'};
    border: ${borderColor ? `solid 1px ${borderColor}` : 'none'};
    position: relative;
    cursor: pointer;
    z-index: 0;
    overflow: hidden;
    min-width: 150px;

    @media (max-width: 599px) {
      min-width: 120px;
    }

    &::after {
      content: '';
      transition: all 0.15s ease-in-out;
      opacity: 0;
      position: absolute;
      background: ${currentTheme.inverseSurface};
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
    &:hover:after {
      opacity: 0.03;
    }
  `

  const ImageContainer = styled.div`
    z-index: 1;
    width: ${iconSize};
    height: ${iconSize};
  `

  const Label = styled.span`
    color: ${labelColor || currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.medium)}
    z-index: 2;

    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.small)}
    }
  `

  return (
    <WrappedButton {...props}>
      <ImageContainer>
        <NextImageContainer src={src} width={'100%'} height={'100%'} objectFit={'contain'} />
      </ImageContainer>
      <Label>{label}</Label>
    </WrappedButton>
  )
}
