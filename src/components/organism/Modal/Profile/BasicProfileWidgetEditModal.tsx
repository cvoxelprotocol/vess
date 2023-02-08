import { FC } from 'react'
import type { BusinessProfile } from 'vess-sdk'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { BasicProfileWidgetEditForm } from './BasicProfileWidgetEditForm'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'

type Props = {
  did: string
  businessProfile?: BusinessProfile | null
}

export const BasicProfileWidgetEditModal: FC<Props> = ({ did, businessProfile }) => {
  const { showModal, setShowModal } = useVESSWidgetModal()

  return (
    <VESSModalContainer open={showModal} onOpenChange={setShowModal}>
      <VESSModal>
        <BasicProfileWidgetEditForm did={did} businessProfile={businessProfile} />
      </VESSModal>
    </VESSModalContainer>
  )
}
