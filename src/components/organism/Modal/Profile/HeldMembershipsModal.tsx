import styled from '@emotion/styled'
import { FC } from 'react'
import { addCeramicPrefix } from 'vess-sdk'
import type { HighlightedCredentials, SocialLinks } from 'vess-sdk'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { SelfClaimMembershipForm } from './SelfClaimMembershipForm'
import { MembershipCard } from '@/components/molecure/Profile/MembershipCard'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useHighlightedCredentials } from '@/hooks/useHighlightedCredentials'
import { useSelfClaimedMembership } from '@/hooks/useSelfClaimedMembership'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  socialLinks?: SocialLinks | null
  editable?: boolean
}

export const HeldMembershipsModal: FC<Props> = (props) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { showMembershipModal, setShowMembershipModal } = useVESSWidgetModal()
  const { displayHeldMembership, highlightedMembership, highlightedSelfClaimedMembership } =
    useHeldMembershipSubject(props.did)
  const { selfClaimedMemberships } = useSelfClaimedMembership(props.did)
  const { highlightedCredentials, storeHighlightedCredentials } = useHighlightedCredentials(
    props.did,
  )

  const Container = styled.div`
    padding: 32px;
    border-radius: 32px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 60vh;
    background: ${currentTheme.surface1};
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  `
  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.title.medium)};
  `
  const Desc = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.label.medium)};
  `
  const InnerContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 16px;
    width: 100%;
    @media (max-width: 599px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `
  const MembershipCardWrapper = styled.div`
    width: fit-content;
    min-width: 240px;
    @media (max-width: 599px) {
      min-width: 180px;
    }
  `

  const selectMembership = async (id: string) => {
    const items: HighlightedCredentials = {
      memberships: [addCeramicPrefix(id)],
      attendances: highlightedCredentials?.attendances || [],
      works: highlightedCredentials?.works || [],
    }
    const res = await storeHighlightedCredentials(items)
    if (res.status === 200) {
      setShowMembershipModal(false)
    }
  }
  return (
    <VESSModalContainer open={showMembershipModal} onOpenChange={setShowMembershipModal}>
      <VESSModal>
        <Container>
          <Title>Your Memberships</Title>
          <Desc>Please Pick your highlighted membership</Desc>
          <InnerContent>
            {displayHeldMembership &&
              displayHeldMembership.map((item) => {
                return (
                  <MembershipCardWrapper
                    key={item.ceramicId}
                    onClick={() => selectMembership(item.ceramicId)}
                  >
                    <MembershipCard
                      title={item.workspace?.name || item.credentialSubject.organizationName}
                      roles={item.roles}
                      icon={item.workspace?.icon}
                      mainColor={item.workspace?.primaryColor}
                      secondColor={item.workspace?.secondaryColor}
                      textColor={item.workspace?.optionColor}
                      isSelected={item.ceramicId === highlightedMembership?.ceramicId}
                      vc
                    />
                  </MembershipCardWrapper>
                )
              })}
            {selfClaimedMemberships &&
              selfClaimedMemberships.map((item) => {
                return (
                  <MembershipCardWrapper
                    key={item.ceramicId}
                    onClick={() => selectMembership(item.ceramicId)}
                  >
                    <MembershipCard
                      title={item.organizationName}
                      roles={[item.membershipName]}
                      isSelected={item.ceramicId === highlightedSelfClaimedMembership?.ceramicId}
                    />
                  </MembershipCardWrapper>
                )
              })}
          </InnerContent>
          <SelfClaimMembershipForm did={props.did} />
        </Container>
      </VESSModal>
    </VESSModalContainer>
  )
}
