import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { VerifiedMark } from '@/components/atom/Badges/VerifiedMark'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS, IconSize } from '@/components/atom/Icons/Icon'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { DefaultCardColor } from '@/constants/ui'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { formatDate } from '@/utils/date'

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
  spMaxWidth?: string
  spPadding?: string
  startDate?: string
  endDate?: string
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
  spMaxWidth = '180px',
  spPadding = '8px',
  startDate,
  endDate,
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

  const logoSizeSP = useMemo(() => {
    return size === 'M' ? '32px' : '20px'
  }, [size])

  const backLogoSizeSP = useMemo(() => {
    return size === 'M' ? '100px' : '64px'
  }, [size])

  const backLogoPortionSP = useMemo(() => {
    return size === 'M' ? '-10px' : '-5px'
  }, [size])

  const period = useMemo(() => {
    return `${startDate ? formatDate(startDate) : '?'} - ${
      endDate ? formatDate(endDate) : 'Present'
    }`
  }, [startDate, endDate])

  const CardContainer = styled.div`
    background: ${mainColor || DefaultCardColor.mainColor};
    border: ${isSelected ? `4px solid ${currentTheme.secondary}` : 'none'};
    border-radius: 16px;
    padding: 8px 12px;
    width: 100%;
    aspect-ratio: 1.58 / 1;
    position: relative;
    overflow: hidden;
    max-width: 280px;
    @media (max-width: 599px) {
      padding: ${spPadding};
      max-width: ${spMaxWidth};
    }
  `

  const LogoContainer = styled.div`
    opacity: 1;
    width: ${logoSize};
    height: ${logoSize};
    margin-top: 8px;
    @media (max-width: 599px) {
      width: ${logoSizeSP};
      height: ${logoSizeSP};
      margin-top: 0;
    }
  `
  const BackLogoContainer = styled.div`
    opacity: 0.2;
    width: ${backLogoSize};
    height: ${backLogoSize};
    position: absolute;
    right: ${backLogoPortion};
    bottom: ${backLogoPortion};
    @media (max-width: 599px) {
      width: ${backLogoSizeSP};
      height: ${backLogoSizeSP};
      right: ${backLogoPortionSP};
      bottom: ${backLogoPortionSP};
    }
  `

  const WorkSpaceTitle = styled.div`
    color: ${textColor || DefaultCardColor.textColor};
    ${getBasicFont(currentTypo.title.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.medium)};
    }
  `
  const Label = styled.p`
    padding-top: 8px;
    color: ${textColor || DefaultCardColor.textColor};
    ${getBasicFont(currentTypo.label.small)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.label.small)};
    }
  `

  return (
    <CardContainer>
      {vc && <VerifiedMark size='L' />}
      <Flex flexDirection='column' rowGap='2px' alignItems='start'>
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
        <Label>{period}</Label>
      </Flex>
      <BackLogoContainer>
        <ImageContainer src={icon || 'https://workspace.vess.id/company.png'} width={'100%'} />
      </BackLogoContainer>
    </CardContainer>
  )
}
