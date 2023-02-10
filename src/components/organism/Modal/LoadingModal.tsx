import styled from '@emotion/styled'
import Lottie from 'react-lottie-player'
import loadingJson from './VESS_loading.json'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  text?: string
}
export default function LoadingModal(props: Props) {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const Container = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    z-index: 999;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    z-index: 9999;
  `
  const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `
  const LoadingText = styled.p`
    color: ${currentTheme.onSurface};
    text-align: left;
    ${getBasicFont(currentTypo.body.medium)}
  `
  return (
    <Container>
      <Loading>
        <Lottie loop animationData={loadingJson} play style={{ width: 200, height: 200 }} />
      </Loading>
      <LoadingText>{props.text || ''}</LoadingText>
    </Container>
  )
}
