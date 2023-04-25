import { FC } from 'react'
import { Text } from '../Texts/Text'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  text: string
  font?: string
  color?: string
}
export const NoItem: FC<Props> = ({ text, font, color }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  return (
    <Text
      type='h1'
      color={color || currentTheme.onBackground}
      font={font || getBasicFont(currentTypo.title.large)}
      text={text}
    />
  )
}
