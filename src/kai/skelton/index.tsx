import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { ComponentPropsWithoutRef, FC } from 'react'
import { SemanticColors } from '@/@types/theme'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export type SkeltonProps = {
  variant?: 'filled' | 'outlined'
  isLoading?: boolean
  children?: React.ReactNode
  width?: string
  height?: string
  radius?: string
  borderWidth?: string
  maskColor?: string
  aspectRatio?: string
} & ComponentPropsWithoutRef<'div'>

export const Skelton: FC<SkeltonProps> = ({
  variant = 'filled',
  isLoading,
  children,
  width = '32px',
  height = '32px',
  radius = '8px',
  borderWidth = '2px',
  maskColor = 'white',
  aspectRatio = 'auto',
  ...props
}) => {
  const { currentTheme } = useVESSTheme()

  return (
    <>
      {isLoading ? (
        <SkeltonRoot
          colorTheme={currentTheme}
          variant={variant}
          width={width}
          height={height}
          radius={radius}
          aspectRatio={aspectRatio}
          {...props}
        >
          {variant === 'outlined' && (
            <SkeltonMask
              colorTheme={currentTheme}
              backgroundColor={maskColor}
              radius={radius}
              borderWidth={borderWidth}
            />
          )}
        </SkeltonRoot>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

const BlinkAnimation = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.3;
  }
  
`

const OutlineRotationAnimation = keyframes`
  0%{
    --angle: 360deg;
  }
  100% {
    --angle: 0deg;
  } 


`

const SkeltonRoot = styled.div<{
  variant: 'filled' | 'outlined'
  width: string
  height: string
  colorTheme: SemanticColors
  radius: string
  aspectRatio: string
}>`
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  position: relative;
  aspect-ratio: ${(props) => props.aspectRatio};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background: ${(props) =>
    props.variant === 'filled'
      ? props.colorTheme.surfaceVariant
      : `conic-gradient(from var(--angle) at 50% 50%, ${props.colorTheme.surfaceVariant} 0deg, rgba(126, 164, 183, 0.00) 240.00000715255737deg, rgba(126, 164, 183, 0.00) 360deg);`};
  border-radius: ${(props) => props.radius};
  animation: ${(props) => (props.variant === 'filled' ? BlinkAnimation : OutlineRotationAnimation)}
    2s linear infinite;
`

const SkeltonMask = styled.div<{
  colorTheme: SemanticColors
  backgroundColor: string
  radius: string
  borderWidth?: string
}>`
  position: absolute;
  top: ${(props) => props.borderWidth};
  left: ${(props) => props.borderWidth};
  bottom: ${(props) => props.borderWidth};
  right: ${(props) => props.borderWidth};
  border-radius: ${(props) => `calc(${props.radius} - ${props.borderWidth})`};
  background-color: ${(props) => props.backgroundColor};
`
