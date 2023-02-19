import styled from '@emotion/styled'
import { FC } from 'react'
import { Icon, ICONS, IconSize, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  withText?: string
  tailIcon?: IconsType
  size?: IconSize
}
export const VerifiedMark: FC<Props> = ({ withText, tailIcon, size = 'MM' }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const VcMarkContainer = styled.div`
    width: 100%;
    flex-grow: 1;
    position: relative;
  `
  const VcMark = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    right: 0;
    top: 0;
    gap: 6px;
  `
  const VcText = styled.div`
    color: ${currentTheme.tertiary};
    ${getBasicFont(currentTypo.label.medium)};
    word-wrap: break-word;
  `

  return (
    <VcMarkContainer>
      <VcMark>
        <Icon icon={ICONS.VERIFIED} size={size} mainColor={currentTheme.tertiary} />
        {withText && <VcText>{withText}</VcText>}
        {tailIcon && <Icon icon={tailIcon} size={size} mainColor={currentTheme.tertiary} />}
      </VcMark>
    </VcMarkContainer>
  )
}
