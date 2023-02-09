import { FC } from 'react'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { SocialProfileEditForm } from './SocialProfileEditForm'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'

type Props = {
  did: string
}

export const SocialProfileEditModal: FC<Props> = ({ did }) => {
  const { showSocialProfileModal, setShowSocialProfileModal } = useVESSWidgetModal()

  return (
    <VESSModalContainer open={showSocialProfileModal} onOpenChange={setShowSocialProfileModal}>
      <VESSModal>
        <SocialProfileEditForm did={did} />
      </VESSModal>
    </VESSModalContainer>
  )
}
