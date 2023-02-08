import styled from '@emotion/styled'
import * as Slider from '@radix-ui/react-slider'
import { FC } from 'react'
import { NextImageContainer } from '../Images/NextImageContainer'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  num: number
  icon: string
  color: string
}

export const WorkStatusSlider: FC<Props> = ({ num, icon, color }) => {
  const { currentTheme } = useVESSTheme()

  const SliderRoot = styled(Slider.Root)`
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    touch-action: none;
    width: 100%;
    height: 100%;
    flex-direction: column;
    width: 36px;
  `

  const SliderTrack = styled(Slider.Track)`
    background: ${currentTheme.surfaceVariant};
    position: relative;
    flex-grow: 1;
    border-radius: 9999px;
    width: 12px;
  `

  const SliderRange = styled(Slider.Range)`
    position: absolute;
    background-color: ${color};
    border-radius: 9999px;
    width: 100%;
  `

  const SliderThumb = styled(Slider.Thumb)`
    display: block;
    width: 36px;
    height: 36px;
    background: none;
    &:focus {
      outline: none;
    }
  `

  return (
    <SliderRoot disabled value={[num]} max={100} step={1} orientation='vertical'>
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb>
        <NextImageContainer src={icon} width={'36px'} />
      </SliderThumb>
    </SliderRoot>
  )
}
