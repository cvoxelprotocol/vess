import styled from '@emotion/styled'
import { FC } from 'react'

const LOGOS = {
  LOGO_COLORED: 'logoColored',
  LOGO_MONO: 'logoMono',
  LOGOMARK_COLORED: 'logoMarkColored',
  LOGOMARK_MONO: 'logoMarkMono',
  LOGOMARK_BIRD: 'logoMarkBird',
} as const

export type LogosType = typeof LOGOS[keyof typeof LOGOS]

type IconProps = {
  type?: LogosType
  width?: string // px
  height?: string
}

export const Logo: FC<IconProps> = ({
  type = 'logoMarkColored',
  width = '32px',
  height = '32px',
}) => {
  const LogoContainer = styled.div`
    width: ${width};
    height: ${height};
    position: relative;
  `
  const ImageContent = styled.img`
    object-fit: fill;
    width: 100%;
    height: auto;
  `
  return (
    <LogoContainer>
      {/* <Image src={`/logos/${type}.png`} fill alt={type} /> */}
      <ImageContent src={`/logos/${type}.png`} alt={type} />
    </LogoContainer>
  )
}
