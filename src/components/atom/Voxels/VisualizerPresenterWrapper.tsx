import { Canvas } from '@react-three/fiber'
import type { TaskCredential, WithCeramicId } from 'vess-sdk'
import VisualizerPresenter from './VisualizerPresenter'

type Props = {
  content: WithCeramicId<TaskCredential>[]
  showDetailBox?: (item: WithCeramicId<TaskCredential>) => void
}
export default function VisualizerPresenterWrapper(props: Props) {
  return (
    <Canvas shadows>
      <VisualizerPresenter workCredentials={props.content} showDetailBox={props.showDetailBox} />
    </Canvas>
  )
}
