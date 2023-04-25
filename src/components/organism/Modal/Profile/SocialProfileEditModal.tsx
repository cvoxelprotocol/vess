import { VESSModal, VESSModalContainer } from '../VESSModal'
import { SocialProfileEditForm } from './SocialProfileEditForm'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
}
export default function SocialProfileEditModal({ did }: Props) {
  const { showSocialProfileModal, setShowSocialProfileModal } = useVESSWidgetModal()
  const { currentTheme } = useVESSTheme()

  return (
    <VESSModalContainer open={showSocialProfileModal} onOpenChange={setShowSocialProfileModal}>
      <VESSModal headerColor={currentTheme.depth1} modalTitle='Basic Profile'>
        <SocialProfileEditForm did={did} />
      </VESSModal>
    </VESSModalContainer>
  )
}
