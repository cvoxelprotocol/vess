import styled from '@emotion/styled'
import { FC, ButtonHTMLAttributes } from 'react'
import { IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  label: string
  width?: string
  height?: string
  icon?: IconsType
} & ButtonHTMLAttributes<HTMLButtonElement>

export const CyberButton: FC<Props> = ({ label, width, height, icon, ...props }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const ButtonContainer = styled.button`
    width: ${width || 'fit-content'};
    height: ${height || 'fit-content'};
    height: fit-content;
    padding: 2px;
    border: none;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 80%);
    background: ${currentTheme.secondary};
    filter: drop-shadow(0px 0px 10px rgba(85, 245, 255, 1));
    overflow: visible;
  `

  const ButtonBackground = styled.div`
    position: relative;
    width: ${width || 'fit-content'};
    height: ${height || 'fit-content'};
    height: fit-content;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 80%);
    background: ${currentTheme.secondaryContainer};
  `

  const LabelContainer = styled.div`
    padding: 16px 24px;
    width: ${width || 'fit-content'};
    height: ${height || 'fit-content'};
    display: flex;
    justify-content: center;
    align-items: center;
    ${getBasicFont(currentTypo.title.medium)};
    color: ${currentTheme.onSecondaryContainer};
    text-shadow: 0px 0px 5px rgba(145, 222, 255, 0.59);
  `

  return (
    <ButtonContainer {...props}>
      <ButtonBackground>
        <LabelContainer>{label}</LabelContainer>
      </ButtonBackground>
    </ButtonContainer>
  )
}
