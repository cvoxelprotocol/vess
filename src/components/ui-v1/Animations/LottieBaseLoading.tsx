import type { LottieProps } from 'react-lottie-player'
import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
import loadingJson from './VESS_loading.json'

export default function LottieBaseLoading(props: LottieProps) {
  return <Lottie animationData={loadingJson} {...props} />
}
