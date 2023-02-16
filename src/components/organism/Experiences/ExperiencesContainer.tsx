import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { Button } from '@/components/atom/Buttons/Button'
import { NoItem } from '@/components/atom/Common/NoItem'
import { ExperienceCard } from '@/components/molecure/Profile/Experiences/ExperienceCard'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useSelfClaimedMembership } from '@/hooks/useSelfClaimedMembership'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did?: string
}
export const ExperiencesContainer: FC<Props> = ({ did }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { displayHeldMembership, isFetchingHeldMembershipSubjects } = useHeldMembershipSubject(did)
  const { selfClaimedMemberships } = useSelfClaimedMembership(did)
  const { openMembershipModal } = useVESSWidgetModal()

  const hasMemberships = useMemo(() => {
    if (isFetchingHeldMembershipSubjects) return false
    return (
      (displayHeldMembership && displayHeldMembership.length > 0) ||
      (selfClaimedMemberships && selfClaimedMemberships.length > 0)
    )
  }, [displayHeldMembership, selfClaimedMemberships, isFetchingHeldMembershipSubjects])

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 24px;
    margin-bottom: 32px;
    @media (max-width: 599px) {
      gap: 8px;
    }
  `
  const ItemHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px;
  `
  const HeaderText = styled.p`
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.large)};
  `
  const handleEdit = () => {
    openMembershipModal()
  }
  return (
    <>
      <ItemHeader>
        <HeaderText>Experiences</HeaderText>
        <Button
          variant='outlined'
          text='Edit'
          onClick={() => handleEdit()}
          mainColor={currentTheme.outline}
          textColor={currentTheme.outline}
          size={'S'}
        />
      </ItemHeader>
      <Container>
        {!hasMemberships ? (
          <NoItem text={'No Item yet'} />
        ) : (
          <>
            {displayHeldMembership &&
              displayHeldMembership.map((item) => {
                return <ExperienceCard key={item.ceramicId} item={item} />
              })}
            {selfClaimedMemberships &&
              selfClaimedMemberships.map((item) => {
                return <ExperienceCard key={item.ceramicId} selfClaim={item} />
              })}
          </>
        )}
      </Container>
    </>
  )
}
