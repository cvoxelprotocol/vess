import { Canvas } from '@react-three/fiber'
import type { WorkCredentialWithId } from 'vess-sdk'
import VisualizerPresenter from './VisualizerPresenter'

type Props = {
  content: WorkCredentialWithId[]
  showDetailBox?: (item: WorkCredentialWithId) => void
}
export default function VisualizerPresenterWrapper(props: Props) {
  return (
    <Canvas shadows>
      <VisualizerPresenter workCredentials={props.content} showDetailBox={props.showDetailBox} />
    </Canvas>
  )
}
