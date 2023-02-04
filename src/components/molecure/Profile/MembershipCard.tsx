import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { isMobileOnly } from 'react-device-detect'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { IconSize } from '@/components/atom/Icons/Icon'
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
  size?: IconSize
}
export const MembershipCard: FC<Props> = ({
  roles,
  title,
  icon,
  mainColor,
  secondColor,
  textColor,
  isSelected = false,
  size = 'M',
}) => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()

  const logoSize = useMemo(() => {
    return size === 'M' ? '40px' : size === 'S' ? '32px' : '20px'
  }, [size])

  const backLogoSize = useMemo(() => {
    return size === 'M' ? '120px' : size === 'S' ? '100px' : '64px'
  }, [size])

  const backLogoPortion = useMemo(() => {
    return size === 'M' ? '-12px' : size === 'S' ? '-10px' : '-5px'
  }, [size])

  const CardContainer = styled.div`
    background: ${mainColor || DefaultCardColor.mainColor};
    border: ${isSelected ? `4px solid ${currentTheme.secondary}` : 'none'};
    border-radius: 16px;
    padding: ${isSelected ? '12px' : '12px'};
    @media (max-width: 599px) {
      padding: ${isSelected ? '8px' : '8px'};
    }
    width: 100%;
    aspect-ratio: 1.58 / 1;
    position: relative;
    overflow: hidden;
  `

  const LogoContainer = styled.div`
    opacity: 0.8;
    width: ${logoSize};
    height: ${logoSize};
    @media (max-width: 1079px) {
      width: ${logoSize};
      height: ${logoSize};
    }
    @media (max-width: 599px) {
      width: ${'20px'};
      height: ${'20px'};
    }
  `
  const BackLogoContainer = styled.div`
    opacity: 0.2;
    width: ${backLogoSize};
    height: ${backLogoSize};
    @media (max-width: 1079px) {
      width: ${backLogoSize};
      height: ${backLogoSize};
    }
    @media (max-width: 599px) {
      width: ${'64px'};
      height: ${'64px'};
    }
    position: absolute;
    right: ${backLogoPortion};
    bottom: ${backLogoPortion};
    @media (max-width: 1079px) {
      right: ${backLogoPortion};
      bottom: ${backLogoPortion};
    }
    @media (max-width: 599px) {
      right: ${'-5px'};
      bottom: ${'-5px'};
    }
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
        <ImageContainer
          src={icon || 'https://app.vess.id/vess-logo.png'}
          width={isMobileOnly ? '64px' : backLogoSize}
        />
      </BackLogoContainer>
      <Flex flexDirection='column' rowGap='8px' alignItems='start'>
        <MarkContainer></MarkContainer>
        <LogoContainer>
          <ImageContainer
            src={icon || 'https://app.vess.id/vess-logo.png'}
            width={isMobileOnly ? '20px' : logoSize}
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
                size={isMobileOnly ? 'S' : size}
              />
            )
          })}
      </Flex>
    </CardContainer>
  )
}
