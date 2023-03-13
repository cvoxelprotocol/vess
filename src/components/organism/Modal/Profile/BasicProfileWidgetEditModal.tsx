import { FC } from 'react'
import type { BusinessProfile } from 'vess-sdk'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { BasicProfileWidgetEditForm } from './BasicProfileWidgetEditForm'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  businessProfile?: BusinessProfile | null
}

export const BasicProfileWidgetEditModal: FC<Props> = ({ did, businessProfile }) => {
  const { showModal, setShowModal } = useVESSWidgetModal()
  const { currentTheme } = useVESSTheme()

  return (
    <VESSModalContainer open={showModal} onOpenChange={setShowModal}>
      <VESSModal headerColor={currentTheme.depth1} modalTitle={'Work Styles'}>
        <BasicProfileWidgetEditForm did={did} businessProfile={businessProfile} />
      </VESSModal>
    </VESSModalContainer>
  )
}
