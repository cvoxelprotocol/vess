import styled from '@emotion/styled'
import { FC, ReactElement, ReactNode } from 'react'
import { Button, ButtonProps } from '@/components/atom/Buttons/Button'

type Props = {
  LeftButton?: ButtonProps
  RightButton?: ButtonProps
  showLeftButton?: boolean
  showRightButton?: boolean
  layout?: 'space-between' | 'end'
  children?: React.ReactNode
}

const initialButtonState: ButtonProps = {
  text: 'button',
  fill: true,
  type: 'button',
}

export const ButtonGroup: FC<Props> = ({
  LeftButton = initialButtonState,
  RightButton = initialButtonState,
  showLeftButton = true,
  showRightButton = true,
  layout = 'space-between',
  children,
}) => {
  const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: ${layout};
    height: 64px;
    padding: 16px 0px;
    gap: 8px;
  `

  return (
    <ButtonContainer>
      {showLeftButton ? <Button {...LeftButton} /> : children}
      {showRightButton ? <Button {...RightButton} /> : children}
    </ButtonContainer>
  )
}
