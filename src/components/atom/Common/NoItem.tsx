import styled from '@emotion/styled'
import { FC } from 'react'
import { Font } from '@/@types/theme'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  text: string
  font?: Font
  color?: string
}
export const NoItem: FC<Props> = ({ text, font, color }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const Text = styled.h1`
    color: ${color || currentTheme.onBackground};
    ${getBasicFont(font || currentTypo.title.large)};
  `

  return <Text>{text}</Text>
}
