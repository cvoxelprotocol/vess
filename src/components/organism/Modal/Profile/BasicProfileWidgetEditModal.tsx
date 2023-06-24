import { motion, AnimatePresence } from 'framer-motion'
import type { BusinessProfile } from 'vess-sdk'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { BasicProfileWidgetEditForm } from './BasicProfileWidgetEditForm'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  businessProfile?: BusinessProfile | null
}
export default function BasicProfileWidgetEditModal({ did, businessProfile }: Props) {
  const { showModal, setShowModal } = useVESSWidgetModal()
  const { currentTheme } = useVESSTheme()

  return (
    <VESSModalContainer open={showModal} onOpenChange={setShowModal}>
      <AnimatePresence>
        {showModal ? (
          <VESSModal forceMount headerColor={currentTheme.depth1} modalTitle={'Work Styles'}>
            <BasicProfileWidgetEditForm did={did} businessProfile={businessProfile} />
          </VESSModal>
        ) : null}
      </AnimatePresence>
    </VESSModalContainer>
  )
}
