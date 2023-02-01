import styled from '@emotion/styled'
import { FC } from 'react'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { MembershipCard } from '@/components/molecure/Profile/MembershipCard'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  editable?: boolean
  onClick?: () => void
}

export const HighlightedMembershipWidget: FC<Props> = (props) => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()
  const { highlightedMembership, highlightedSelfClaimedMembership } = useHeldMembershipSubject(
    props.did,
  )
  const { openMembershipModal } = useVESSWidgetModal()

  const Container = styled.div`
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  `

  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    font: ${getFont(currentTypo.title.medium)};
  `
  const CardContainer = styled.div`
    width: 230px;
    height: 150px;
  `

  const handleEdit = () => {
    openMembershipModal()
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props}>
        <Container>
          <Title>Membership</Title>
          <CardContainer>
            {highlightedMembership ? (
              <MembershipCard
                title={highlightedMembership.credentialSubject.organizationName}
                roles={[highlightedMembership.credentialSubject.membershipName]}
                mainColor={highlightedMembership.workspace?.primaryColor}
                secondColor={highlightedMembership.workspace?.secondaryColor}
                textColor={highlightedMembership.workspace?.optionColor}
              />
            ) : (
              <>
                {highlightedSelfClaimedMembership ? (
                  <MembershipCard
                    title={highlightedSelfClaimedMembership.organizationName}
                    roles={[highlightedSelfClaimedMembership.membershipName]}
                  />
                ) : (
                  <MembershipCard title={'Your membership'} roles={['Pick one']} />
                )}
              </>
            )}
          </CardContainer>
        </Container>
      </BaseWidget>
    </>
  )
}
