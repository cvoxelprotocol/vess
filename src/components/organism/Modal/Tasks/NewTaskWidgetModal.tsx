import { VESSModal, VESSModalContainer } from '../VESSModal'
import { NewTaskForm } from './NewTaskForm'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'

type Props = {
  did: string
}
export default function NewTaskWidgetModal({ did }: Props) {
  const { showTaskModal, setShowTaskModal } = useVESSWidgetModal()

  return (
    <VESSModalContainer open={showTaskModal} onOpenChange={setShowTaskModal}>
      <VESSModal>
        <NewTaskForm did={did} isModal />
      </VESSModal>
    </VESSModalContainer>
  )
}
