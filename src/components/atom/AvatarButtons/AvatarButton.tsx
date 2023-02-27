import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC } from 'react'
import Image from 'next/image'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  width: string
  height: string
  imgURL: string
  state?: 'default' | 'disabled'
  overlap?: boolean
  order?: number
} & ButtonHTMLAttributes<HTMLButtonElement>

export const AvatarButton: FC<Props> = ({
  width,
  height,
  imgURL,
  overlap = false,
  state = 'default',
  order = 0,
  onClick,
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const ButtonContainer = styled.button`
    justify-self: start;
    position: relative;
    overflow: hidden;
    width: ${width};
    height: ${height};
    padding: 0;
    opacity: ${state == 'disabled' ? 0.3 : 1.0};
    /* margin-left: ${overlap ? '-16px' : '0px'}; */
    border: solid;
    border-color: ${currentTheme.surfaceVariant};
    border-width: 3px;
    border-radius: 99px;
    transition: all 0.15s ease-in-out;
    box-sizing: content-box;
    cursor: ${state == 'default' ? 'pointer' : 'default'};
    order: ${order};

    &:hover {
      border-color: ${state == 'default' ? currentTheme.primary : undefined};
      margin-left: 0px;
    }
  `
  return (
    <ButtonContainer onClick={state == 'default' ? onClick : undefined}>
      <Image src={imgURL} alt='' fill style={{ objectFit: 'contain' }} />
    </ButtonContainer>
  )
}
