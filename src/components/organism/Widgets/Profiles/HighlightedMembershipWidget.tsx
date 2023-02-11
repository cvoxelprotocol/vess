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
  gridRowOnSp: string
  gridColOnSp: string
  editable?: boolean
  onClick?: () => void
}

export const HighlightedMembershipWidget: FC<Props> = (props) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { highlightedMembership, highlightedSelfClaimedMembership } = useHeldMembershipSubject(
    props.did,
  )
  const { openMembershipModal } = useVESSWidgetModal()

  const Container = styled.div`
    padding: 16px 24px;
    @media (max-width: 1079px) {
      padding: 16px 24px;
    }
    @media (max-width: 599px) {
      padding: 12px 16px;
    }
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  `

  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.title.medium)};
  `
  const CardContainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
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
                roles={highlightedMembership.roles}
                mainColor={highlightedMembership.workspace?.primaryColor}
                secondColor={highlightedMembership.workspace?.secondaryColor}
                textColor={highlightedMembership.workspace?.optionColor}
                vc
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
