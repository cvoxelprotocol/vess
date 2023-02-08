import { FC } from 'react'
import type { SocialLinks } from 'vess-sdk'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { SocialLinkWidgetEditForm } from './SocialLinkWidgetEditForm'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'

type Props = {
  did: string
  socialLinks?: SocialLinks | null
  editable?: boolean
}

export const SocialLinkWidgetEditModal: FC<Props> = (props) => {
  const { showSocialLinkModal, setShowSocialLinkModal } = useVESSWidgetModal()

  return (
    <VESSModalContainer open={showSocialLinkModal} onOpenChange={setShowSocialLinkModal}>
      <VESSModal>
        <SocialLinkWidgetEditForm {...props} />
      </VESSModal>
    </VESSModalContainer>
  )
}
