import { FC } from 'react'
import { BaseDetailModal, BaseDetailModalContainer } from '../BaseDetailModal'
import { EventDetailContent } from './EventDetailContent'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'

type Props = {
  streamId?: string
}
export const EventDetailModal: FC<Props> = ({ streamId }) => {
  const { showDetailModal, setShowDetailModal } = useVESSWidgetModal()

  return (
    <BaseDetailModalContainer open={showDetailModal} onOpenChange={setShowDetailModal}>
      <BaseDetailModal>
        <EventDetailContent streamId={streamId} />
      </BaseDetailModal>
    </BaseDetailModalContainer>
  )
}
