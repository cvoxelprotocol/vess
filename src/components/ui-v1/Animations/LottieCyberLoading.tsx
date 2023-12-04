import type { LottieProps } from 'react-lottie-player'
import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
import animationData from './purple_particle.json'

export default function LottieCyberLoading(props: LottieProps) {
  return <Lottie animationData={animationData} {...props} />
}
