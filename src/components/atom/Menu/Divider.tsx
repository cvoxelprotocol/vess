import styled from '@emotion/styled'
import { FC } from 'react'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  title?: string
}

export const Divider: FC<Props> = ({ title }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const DividerContainer = styled.div`
    width: 100%;
    padding: 0px 8px;
    display: flex;
    flex-direction: column;
  `

  const DividerLine = styled.div`
    width: 100%;
    height: 8px;
    border-bottom: solid 1px;
    border-color: ${currentTheme.outline};
  `

  const Title = styled.span`
    margin-top: 4px;
    ${getBasicFont(currentTypo.label.medium)}
    color: ${currentTheme.outline}
  `

  return (
    <DividerContainer>
      <DividerLine />
      {title && <Title>{title}</Title>}
    </DividerContainer>
  )
}
