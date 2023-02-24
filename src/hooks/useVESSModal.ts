import {
  useStateShowConnectModal,
  useStateShowDetailModal,
  useStateshowQRModal,
  useStateShowTaskDetailModal,
  useStateShowTaskFormModal,
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
  const [showDetailModal, setShowDetailModal] = useStateShowDetailModal()
  const [showTaskDetailModal, setShowTaskDetailModal] = useStateShowTaskDetailModal()
  const [showTaskModal, setShowTaskModal] = useStateShowTaskFormModal()
  const [showConnectModal, setShowConnectModal] = useStateShowConnectModal()

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
    showDetailModal,
    setShowDetailModal,
    setShowTaskModal,
    showTaskModal,
    showTaskDetailModal,
    setShowTaskDetailModal,
    showConnectModal,
    setShowConnectModal,
  }
}
