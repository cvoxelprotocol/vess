import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { FC } from 'react'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  label?: string
  width?: string
  height?: string
}

export const CyberLoading: FC<Props> = ({ label = 'Loading...', width, height }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const LoadingContainer = styled.button`
    position: relative;
    width: ${width || 'fit-content'};
    height: ${height || 'fit-content'};
    height: fit-content;
    padding: 2px;
    border: none;
    overflow: visible;
    background: transparent;
  `

  const BarAnimation = keyframes`
    from {
      transform: translateX(200px);
    }

    to {
      transform: translateX(-200px);
    }
  `
  const UpperBar = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    background: ${currentTheme.secondary};
    animation: ${BarAnimation} 1s ease-in-out alternate infinite;
  `

  const BottomBar = styled.div`
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    height: 1px;
    background: ${currentTheme.secondary};
    animation: ${BarAnimation} 1s ease-in-out alternate-reverse infinite;
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
    <>
      <LoadingContainer>
        <UpperBar />
        <LabelContainer>{label}</LabelContainer>
        <BottomBar />
      </LoadingContainer>
    </>
  )
}
