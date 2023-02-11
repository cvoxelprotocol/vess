import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS, IconSize } from '@/components/atom/Icons/Icon'
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
  vc?: boolean
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
  vc = false,
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const logoSize = useMemo(() => {
    return size === 'M' ? '40px' : '32px'
  }, [size])

  const backLogoSize = useMemo(() => {
    return size === 'M' ? '120px' : '100px'
  }, [size])

  const backLogoPortion = useMemo(() => {
    return size === 'M' ? '-12px' : '-10px'
  }, [size])

  const CardContainer = styled.div`
    background: ${mainColor || DefaultCardColor.mainColor};
    border: ${isSelected ? `4px solid ${currentTheme.secondary}` : 'none'};
    border-radius: 16px;
    padding: ${isSelected ? '12px' : '12px'};
    width: 100%;
    aspect-ratio: 1.58 / 1;
    position: relative;
    overflow: hidden;
    max-width: 280px;
    @media (max-width: 599px) {
      padding: ${isSelected ? '8px' : '8px'};
      max-width: 180px;
    }
  `

  const LogoContainer = styled.div`
    opacity: 0.8;
    width: ${logoSize};
    height: ${logoSize};
    margin-top: 12px;
    @media (max-width: 1079px) {
      width: ${logoSize};
      height: ${logoSize};
    }
    @media (max-width: 599px) {
      width: ${'20px'};
      height: ${'20px'};
      margin-top: 12px;
    }
  `
  const BackLogoContainer = styled.div`
    opacity: 0.2;
    width: ${backLogoSize};
    height: ${backLogoSize};
    position: absolute;
    right: ${backLogoPortion};
    bottom: ${backLogoPortion};
    @media (max-width: 1079px) {
      width: ${backLogoSize};
      height: ${backLogoSize};
      right: ${backLogoPortion};
      bottom: ${backLogoPortion};
    }
    @media (max-width: 599px) {
      width: ${'64px'};
      height: ${'64px'};
      right: ${'-5px'};
      bottom: ${'-5px'};
    }
  `
  const VcMarkContainer = styled.div`
    position: relative;
  `
  const VcMark = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    right: 0;
    top: 0;
  `

  const WorkSpaceTitle = styled.div`
    color: ${textColor || DefaultCardColor.textColor};
    ${getBasicFont(currentTypo.title.medium)};
  `

  return (
    <CardContainer>
      <BackLogoContainer>
        <ImageContainer src={icon || 'https://workspace.vess.id/company.png'} width={'100%'} />
      </BackLogoContainer>
      {vc && (
        <VcMarkContainer>
          <VcMark>
            <Icon icon={ICONS.VERIFIED} size={'M'} mainColor={currentTheme.tertiary} />
          </VcMark>
        </VcMarkContainer>
      )}
      <Flex flexDirection='column' rowGap='8px' alignItems='start'>
        <LogoContainer>
          <ImageContainer src={icon || 'https://workspace.vess.id/company.png'} width={'100%'} />
        </LogoContainer>
        <WorkSpaceTitle>{title}</WorkSpaceTitle>
        <Flex flexDirection='row' rowGap='4px' justifyContent={'start'}>
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
      </Flex>
    </CardContainer>
  )
}
