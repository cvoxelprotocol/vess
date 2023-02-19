import { FC } from 'react'
import { BaseDetailModal, BaseDetailModalContainer } from '../BaseDetailModal'
import { TaskDetailContent } from './TaskDetailContent'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'

type Props = {
  streamId?: string
}
export const TaskDetailModal: FC<Props> = ({ streamId }) => {
  const { showTaskDetailModal, setShowTaskDetailModal } = useVESSWidgetModal()

  return (
    <BaseDetailModalContainer open={showTaskDetailModal} onOpenChange={setShowTaskDetailModal}>
      <BaseDetailModal>
        <TaskDetailContent streamId={streamId} />
      </BaseDetailModal>
    </BaseDetailModalContainer>
  )
}
