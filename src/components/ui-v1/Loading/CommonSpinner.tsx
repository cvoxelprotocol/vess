import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type CommonSpinnerprops = {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}
export const CommonSpinner: FC<CommonSpinnerprops> = ({ size = 'md', color }) => {
  const { currentTheme } = useVESSTheme()
  const spinnerSize = useMemo(() => {
    if (size === 'sm') return '16px'
    if (size === 'md') return '28px'
    return '40px'
  }, [size])

  const spin = keyframes`
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `

  const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `
  const Spinner = styled.div`
    animation: ${spin} 1s linear infinite;
    width: ${spinnerSize};
    height: ${spinnerSize};
    border: 2px solid;
    color: ${color || currentTheme.primary};
    border-radius: 100%;
    border-top-color: transparent;
  `
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  )
}
