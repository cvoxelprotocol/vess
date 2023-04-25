import type { SocialLinks } from 'vess-sdk'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { SocialLinkWidgetEditForm } from './SocialLinkWidgetEditForm'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  socialLinks?: SocialLinks | null
  editable?: boolean
}
export default function SocialLinkWidgetEditModal(props: Props) {
  const { showSocialLinkModal, setShowSocialLinkModal } = useVESSWidgetModal()
  const { currentTheme } = useVESSTheme()

  return (
    <VESSModalContainer open={showSocialLinkModal} onOpenChange={setShowSocialLinkModal}>
      <VESSModal headerColor={currentTheme.depth1} modalTitle='Social Links'>
        <SocialLinkWidgetEditForm {...props} />
      </VESSModal>
    </VESSModalContainer>
  )
}
