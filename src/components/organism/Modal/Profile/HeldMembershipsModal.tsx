import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
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
import { sortedMembership } from '@/interfaces/ui'
import { convertDateStrToTimestamp } from '@/utils/date'

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

  const sortedMemberships = useMemo(() => {
    if (!displayHeldMembership && !selfClaimedMemberships) return []
    let sorted: sortedMembership[] = []
    displayHeldMembership.forEach((m) => {
      sorted.push({
        item: m,
        startDate: m.credentialSubject.startDate,
        endDate: m.credentialSubject.endDate,
      })
    })
    selfClaimedMemberships?.forEach((m) => {
      sorted.push({ selfClaim: m, startDate: m.startDate, endDate: m.endDate })
    })
    return sorted.sort((a, b) => {
      return convertDateStrToTimestamp(a.startDate) > convertDateStrToTimestamp(b.startDate)
        ? -1
        : 1
    })
  }, [displayHeldMembership, selfClaimedMemberships])

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
    justify-content: start;
    gap: 16px;
    width: 100%;
    @media (max-width: 599px) {
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
  `
  const MembershipCardWrapper = styled.div`
    width: fit-content;
    min-width: 240px;
    @media (max-width: 599px) {
      min-width: 180px;
    }
  `

  const selectMembership = async (id?: string) => {
    if (!id) return
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

  const isSelected = (item: sortedMembership) => {
    return (
      (highlightedMembership && item.item?.ceramicId === highlightedMembership?.ceramicId) ||
      (highlightedSelfClaimedMembership &&
        item.selfClaim?.ceramicId === highlightedSelfClaimedMembership?.ceramicId)
    )
  }
  return (
    <VESSModalContainer open={showMembershipModal} onOpenChange={setShowMembershipModal}>
      <VESSModal headerColor={currentTheme.depth1} modalTitle={'Membership'}>
        <Container>
          <SelfClaimMembershipForm did={props.did} />
          <Title>Or... Pick Your Experience</Title>
          <Desc>Please Pick your highlighted experience VC</Desc>
          <InnerContent>
            {sortedMemberships &&
              sortedMemberships.map((item) => {
                return (
                  <MembershipCardWrapper
                    key={item.item?.ceramicId || item.selfClaim?.ceramicId}
                    onClick={() =>
                      selectMembership(item.item?.ceramicId || item.selfClaim?.ceramicId)
                    }
                  >
                    <MembershipCard
                      title={
                        item.item?.workspace?.name ||
                        item.item?.credentialSubject.organizationName ||
                        item.selfClaim?.organizationName ||
                        ''
                      }
                      roles={
                        item.item?.roles ||
                        (item.selfClaim?.membershipName ? [item.selfClaim?.membershipName] : [])
                      }
                      icon={item.item?.workspace?.icon}
                      mainColor={item.item?.workspace?.primaryColor}
                      secondColor={item.item?.workspace?.secondaryColor}
                      textColor={item.item?.workspace?.optionColor}
                      isSelected={isSelected(item)}
                      vc={!!item.item}
                      startDate={item.startDate}
                      endDate={item.endDate}
                    />
                  </MembershipCardWrapper>
                )
              })}
          </InnerContent>
        </Container>
      </VESSModal>
    </VESSModalContainer>
  )
}
