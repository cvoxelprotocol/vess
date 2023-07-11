import styled from '@emotion/styled'

import type { SelfClaimedMembershipSubject, WithCeramicId } from 'vess-sdk'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { EditSelfClaimMembershipForm } from './EditSelfClaimMembershipForm'

import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  selfClaim: WithCeramicId<SelfClaimedMembershipSubject>
}

export default function EditSelfClaimMembershipsModal(props: Props) {
  const { currentTheme } = useVESSTheme()
  const { showEditSelfClaimedMembershipModal, setShowEditSelfClaimedMembershipModal } =
    useVESSWidgetModal()

  const Container = styled.div`
    padding: 32px;
    border-radius: 32px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 60vh;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    @media (max-width: 599px) {
      height: 70vh;
      padding: 8px;
    }
  `

  return (
    <VESSModalContainer
      open={showEditSelfClaimedMembershipModal}
      onOpenChange={setShowEditSelfClaimedMembershipModal}
    >
      <VESSModal headerColor={currentTheme.depth1} modalTitle={'Edit New Experience'}>
        <Container>
          <EditSelfClaimMembershipForm selfClaim={props.selfClaim} />
        </Container>
      </VESSModal>
    </VESSModalContainer>
  )
}
