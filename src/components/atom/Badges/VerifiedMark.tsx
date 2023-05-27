import styled from '@emotion/styled'
import { FC } from 'react'
import { Icon, ICONS, IconSize, IconsType } from '../Icons/Icon'
import { Text } from '../Texts/Text'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  withText?: string
  tailIcon?: IconsType
  size?: IconSize
  handleClick?: () => void
}
export const VerifiedMark: FC<Props> = ({ withText, tailIcon, size = 'MM', handleClick }) => {
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

  return (
    <VcMarkContainer onClick={handleClick || undefined}>
      <VcMark>
        <Icon icon={ICONS.VERIFIED} size={size} mainColor={currentTheme.tertiary} />
        {withText && (
          <Text
            type='p'
            color={currentTheme.tertiary}
            font={getBasicFont(currentTypo.label.medium)}
            text={withText}
          />
        )}

        {tailIcon && <Icon icon={tailIcon} size={size} mainColor={currentTheme.tertiary} />}
      </VcMark>
    </VcMarkContainer>
  )
}
