import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { NoItem } from '@/components/atom/Common/NoItem'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { MembershipCard } from '@/components/molecure/Profile/MembershipCard'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useSelfClaimedMembership } from '@/hooks/useSelfClaimedMembership'

type Props = {
  did: string
}

export const MembershipsTabContent: FC<Props> = ({ did }) => {
  const { HeldMembershipSubjects, isFetchingHeldMembershipSubjects } = useHeldMembershipSubject(did)
  const { selfClaimedMemberships } = useSelfClaimedMembership(did)
  const Wrapper = styled.div`
    width: 100%;
  `
  const MembersContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;
    @media (max-width: 1517px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 599px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 2px;
    }
  `
  const MembershipCardWrapper = styled.div`
    width: fit-content;
    min-width: 240px;
    @media (max-width: 599px) {
      min-width: 180px;
    }
  `
  const LoadingContainer = styled.div`
    grid-column: 1/3;
    width: 100%;
    height: 100%;
  `

  const hasMemberships = useMemo(() => {
    if (isFetchingHeldMembershipSubjects) return false
    return (
      (HeldMembershipSubjects && HeldMembershipSubjects.length > 0) ||
      (selfClaimedMemberships && selfClaimedMemberships.length > 0)
    )
  }, [HeldMembershipSubjects, selfClaimedMemberships, isFetchingHeldMembershipSubjects])

  return (
    <Wrapper>
      {isFetchingHeldMembershipSubjects ? (
        <LoadingContainer>
          {' '}
          <CommonSpinner />
        </LoadingContainer>
      ) : (
        <MembersContainer>
          {!hasMemberships ? (
            <NoItem text={'No Item yet'} />
          ) : (
            <>
              {HeldMembershipSubjects &&
                HeldMembershipSubjects.map((item) => {
                  return (
                    <MembershipCardWrapper key={item.ceramicId}>
                      <MembershipCard
                        title={item.credentialSubject.organizationName}
                        roles={[item.credentialSubject.membershipName]}
                        mainColor={item.workspace?.primaryColor}
                        secondColor={item.workspace?.secondaryColor}
                        textColor={item.workspace?.optionColor}
                        vc
                      />
                    </MembershipCardWrapper>
                  )
                })}
              {selfClaimedMemberships &&
                selfClaimedMemberships.map((item) => {
                  return (
                    <MembershipCardWrapper key={item.ceramicId}>
                      <MembershipCard title={item.organizationName} roles={[item.membershipName]} />
                    </MembershipCardWrapper>
                  )
                })}
            </>
          )}
        </MembersContainer>
      )}
    </Wrapper>
  )
}
