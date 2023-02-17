import {
  useStateshowQRModal,
  useStateSocialProfileEditModal,
  useStateVESSHighlightedMembershipModal,
  useStateVESSSocialLinkWidgetModal,
  useStateVESSWidgetModal,
} from '@/jotai/ui'

export const useVESSWidgetModal = () => {
  const [showModal, setShowModal] = useStateVESSWidgetModal()
  const [showSocialLinkModal, setShowSocialLinkModal] = useStateVESSSocialLinkWidgetModal()
  const [showMembershipModal, setShowMembershipModal] = useStateVESSHighlightedMembershipModal()
  const [showSocialProfileModal, setShowSocialProfileModal] = useStateSocialProfileEditModal()
  const [showQRModal, setShowQRModal] = useStateshowQRModal()

  return {
    openModal: () => setShowModal(true),
    closeModal: () => setShowModal(false),
    showModal,
    setShowModal,
    openSocialLinkModal: () => setShowSocialLinkModal(true),
    closeSocialLinkModal: () => setShowSocialLinkModal(false),
    showSocialLinkModal,
    setShowSocialLinkModal,
    openMembershipModal: () => setShowMembershipModal(true),
    closeMembershipModal: () => setShowMembershipModal(false),
    showMembershipModal,
    setShowMembershipModal,
    showSocialProfileModal,
    setShowSocialProfileModal,
    showQRModal,
    setShowQRModal,
  }
}
