import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { CyberButton } from '@/components/atom/Buttons/CyberButton'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

const LottieCyberLoading = dynamic(
  () => import('@/components/atom/Animations/LottieCyberLoading'),
  {
    ssr: false,
  },
)

export const NfcCreatedContainer: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const router = useRouter()
  const { did } = useDIDAccount()

  const Wrapper = styled.main`
    width: 100%;
    background: ${currentTheme.background};
  `

  const CardContainer = styled.div`
    position: relative;
    max-width: 599px;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 160px);
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: ${currentTheme.onSurface};
    padding: 0px 16px 32px 16px;
  `
  const ImageContainer = styled.div`
    position: relative;
    width: 100%;

    display: flex;
    justify-content: center;
  `

  const AnimContainer = styled.div`
    position: absolute;
    top: -30px;
    right: 0;
    left: 0;
    transform: scale(1.2);
  `

  const TextContainer = styled.div`
    padding: 16px 0px;
    ${getBasicFont(currentTypo.headLine.small)};
    color: ${currentTheme.onPrimaryContainer};
    text-shadow: 0px 0px 5px ${currentTheme.onPrimary};
  `

  const onClickHandler = () => {
    router.push(`/did/${did}`)
  }

  return (
    <>
      <Wrapper>
        <CardContainer>
          <ImageContainer>
            <NextImageContainer src='/vessCard/gif4_condensed.gif' width='296px' height='296px' />
            <AnimContainer>
              <LottieCyberLoading loop={false} play style={{ width: '100%', height: '100%' }} />
            </AnimContainer>
          </ImageContainer>
          <TextContainer>Your VESS Card is here!</TextContainer>
          <CyberButton label='Complete Your Resume' width='100%' onClick={() => onClickHandler()} />
        </CardContainer>
      </Wrapper>
    </>
  )
}
