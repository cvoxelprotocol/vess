import styled from '@emotion/styled'
import { FC, useEffect, useMemo } from 'react'
import { Flex } from '@/components/atom/Common/Flex'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStatePFFilledRate } from '@/jotai/ui'

type Props = {
  width?: string
  height?: string
}

export const ProfileFilledRate: FC<Props> = ({ width = '100%', height = 'fit-content' }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { setShowPFRateModal } = useVESSWidgetModal()
  const [PFFilledRate, setPFFilledRate] = useStatePFFilledRate()

  const BarColor = useMemo(() => {
    if (PFFilledRate < 40) {
      return currentTheme.error
    } else if (PFFilledRate >= 40 && PFFilledRate < 80) {
      return currentTheme.secondary
    } else if (PFFilledRate >= 80) {
      return currentTheme.tertiary
    }
  }, [PFFilledRate])

  const BannerShape = styled.button`
    width: ${width};
    height: ${height};
    padding: 0;
    max-width: 40rem;
    display: flex;
    border-radius: 1rem;
    background: ${currentTheme.surface3};
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    border: none;
    outline: none;

    &:hover {
      transform: scale(1.02);
      cursor: pointer;
    }
  `

  const ProgressContainer = styled.div`
    width: 100%;
    height: fit-content;
    background-image: url('/banner/banner_bg_1_50.png');
    background-position: center;
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    justify-content: start;
    align-items: start;
    padding: 1rem 1.5rem;
  `

  const Tagline = styled.p`
    color: ${currentTheme.onPrimaryContainer};
    ${getBasicFont(currentTypo.title.large)};
    text-align: start;

    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.label.large)};
    }
  `

  const Percent = styled.p`
    color: ${BarColor || currentTheme.error};
    ${getBasicFont(currentTypo.headLine.medium)};

    &::after {
      content: '% completed';
      margin-left: 0.125rem;
      ${getBasicFont(currentTypo.title.medium)};
    }
  `

  const ProgressBarFrame = styled.div`
    width: 100%;
    height: 1rem;
    background: ${currentTheme.surface1};
    border-radius: 0.5rem;
    padding: 0.125rem;
  `

  const ProgressBar = styled.div`
    width: ${PFFilledRate + '%'};
    height: 100%;
    border-radius: 0.5rem;
    background-color: ${BarColor || currentTheme.error};
  `

  const NextIndicator = styled.div`
    ${getBasicFont(currentTypo.label.medium)};
    color: ${currentTheme.onPrimary};
    opacity: 0.5;
  `
  const NextTaskText = styled.p`
    ${getBasicFont(currentTypo.label.large)};
    color: ${currentTheme.onPrimary};
    width: 100%;
    text-align: start;
  `

  const onClickBanner = () => {
    setShowPFRateModal(true)
  }

  return (
    <BannerShape onClick={() => onClickBanner()}>
      <ProgressContainer>
        <Tagline>Complete your profile and get more job offers!</Tagline>
        <Percent>{PFFilledRate}</Percent>
        <ProgressBarFrame>
          <ProgressBar />
        </ProgressBarFrame>
      </ProgressContainer>
      {/* <Flex
        flexDirection='column'
        justifyContent='space-between'
        alignItems='start'
        background={currentTheme.primary}
        width='9rem'
        height='100%'
        padding='1rem'
      >
        <NextIndicator>Next</NextIndicator>
        <NextTaskText>
          {' '}
          Enter <br />
          Work Styles
        </NextTaskText>
      </Flex> */}
    </BannerShape>
  )
}
