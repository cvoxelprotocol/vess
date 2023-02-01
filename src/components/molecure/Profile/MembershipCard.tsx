import styled from '@emotion/styled'
import { FC } from 'react'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { DefaultCardColor } from '@/constants/ui'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  title: string
  icon?: string
  roles?: string[]
  mainColor?: string
  secondColor?: string
  textColor?: string
  isSelected?: boolean
}
export const MembershipCard: FC<Props> = ({
  roles,
  title,
  icon,
  mainColor,
  secondColor,
  textColor,
  isSelected = false,
}) => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()
  const CardContainer = styled.div`
    background: ${mainColor || DefaultCardColor.mainColor};
    border: ${isSelected ? `4px solid ${currentTheme.secondary}` : 'none'};
    border-radius: 16px;
    padding: ${isSelected ? '12px' : '16px'};
    width: 230px;
    max-height: 150px;
    height: 100%;
    position: relative;
    overflow: hidden;
  `

  const LogoContainer = styled.div`
    opacity: 0.8;
    width: 24px;
    height: 24px;
  `
  const BackLogoContainer = styled.div`
    opacity: 0.2;
    width: 84px;
    height: 78px;
    position: absolute;
    left: 158px;
    top: 74px;
  `
  const MarkContainer = styled.div`
    width: 100%;
    height: 12px;
    text-align: right;
  `

  const WorkSpaceTitle = styled.div`
    color: ${textColor || DefaultCardColor.textColor};
    font: ${getFont(currentTypo.title.medium)};
  `

  return (
    <CardContainer>
      <BackLogoContainer>
        <ImageContainer src={icon || 'https://app.vess.id/vess-logo.png'} width='84px' />
      </BackLogoContainer>
      <Flex flexDirection='column' rowGap='8px' alignItems='start'>
        <MarkContainer></MarkContainer>
        <LogoContainer>
          <ImageContainer
            src={icon || 'https://app.vess.id/vess-logo.png'}
            width='24px'
            borderRadius='100%'
          />
        </LogoContainer>
        <WorkSpaceTitle>{title}</WorkSpaceTitle>
        {roles &&
          roles.map((role) => {
            return (
              <Chip
                key={role}
                text={role}
                variant={'filled'}
                mainColor={secondColor || DefaultCardColor.secondColor}
                textColor={textColor || DefaultCardColor.textColor}
                size={'S'}
              />
            )
          })}
      </Flex>
    </CardContainer>
  )
}
