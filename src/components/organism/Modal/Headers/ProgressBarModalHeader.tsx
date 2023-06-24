import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ProgressBarHandlerType } from '../Onboarding/PFOnboardingForm'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStatePFFilledRate, useStatePFOnbordingPage } from '@/jotai/ui'

type Props = {
  lastPage: number
  titles: string[]
  backgroundColor?: string
} & DialogPrimitive.DialogCloseProps

export const ProgressBarModalHeader = forwardRef<ProgressBarHandlerType, Props>(
  ({ lastPage, titles, backgroundColor }, forwardRef) => {
    const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
    const [currentPage, setCurrentPage] = useStatePFOnbordingPage()
    const [tempRate, setTempRate] = useState(0)
    const [PFFilledRate, setPFFilledRate] = useStatePFFilledRate()
    const prevTempRate = useRef(0)
    const [barColor, setBarColor] = useState(currentTheme.error)

    useEffect(() => {
      setTempRate(PFFilledRate)
      prevTempRate.current = PFFilledRate
    }, [PFFilledRate])

    useImperativeHandle(forwardRef, () => {
      return {
        setRate(r: number) {
          prevTempRate.current = tempRate
          setTempRate((rate) => (rate += r))
        },
      }
    })

    useEffect(() => {
      if (tempRate < 40) {
        setBarColor(currentTheme.error)
      } else if (tempRate >= 40 && tempRate < 80) {
        setBarColor(currentTheme.secondary)
      } else if (tempRate >= 80) {
        setBarColor(currentTheme.tertiary)
      }
    }, [tempRate])

    const Container = styled.div`
      background: ${backgroundColor || currentTheme.surface1};
      width: 100%;
      height: fit-content;
      display: flex;
      justify-content: space-between;
      align-items: start;
      padding: 1rem 1rem 1rem 2rem;
    `

    const ProgressContainer = styled.div`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      row-gap: 0.25rem;
      justify-content: center;
      align-items: start;
    `

    const Title = styled.p`
      color: ${currentTheme.onSurface};
      ${getBasicFont(currentTypo.title.large)};

      &::before {
        content: '${currentPage + 1 + '/' + lastPage}';
        margin-right: 0.5rem;
        color: ${currentTheme.outline};
      }
    `

    const Percent = styled.p`
      color: ${barColor || currentTheme.error};
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
      background: ${currentTheme.surface3};
      border-radius: 0.5rem;
      padding: 0.125rem;
    `

    const ProgressBarAnim = keyframes`
    from {
      width: ${prevTempRate.current + '%'};
    }
    to {
      width: ${tempRate + '%'}
    }
  `

    type ProgressBarProps = {
      rate: number
    }
    const ProgressBar = styled.div<ProgressBarProps>`
      width: ${(props) => props.rate + '%'};
      height: 100%;
      border-radius: 0.5rem;
      background-color: ${barColor || currentTheme.error};

      animation: ${ProgressBarAnim} 0.3s ease-in-out;
    `

    const Close = styled(DialogPrimitive.Close)`
      background: none;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 0.25rem;
    `

    const IconContainer = styled.div`
      width: 100;
      height: 100%;
      background: none;
      border: none;
      outline: none;
    `

    return (
      <Container>
        <ProgressContainer>
          <Title>{titles[currentPage] || ''}</Title>
          <Percent>{tempRate}</Percent>
          <ProgressBarFrame>
            <ProgressBar rate={tempRate} />
          </ProgressBarFrame>
        </ProgressContainer>
        <Close>
          <IconContainer>
            <Icon icon={ICONS.CROSS} size={'M'} mainColor={currentTheme.onSurface} />
          </IconContainer>
        </Close>
      </Container>
    )
  },
)

ProgressBarModalHeader.displayName = 'ProgressBarModalHeader'
