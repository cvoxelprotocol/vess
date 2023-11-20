import styled from '@emotion/styled'
import { BaseCredential, WithCeramicId } from '@/@types/credential'
import { NoItem } from '@/components/atom/Common/NoItem'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { EventCard } from '@/components/molecure/Event/EventCard'
import { useHeldEventAttendances } from '@/hooks/useHeldEventAttendances'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useSetSelectAttendance } from '@/jotai/item'

type Props = {
  did: string
}
export default function EventTabContent({ did }: Props) {
  const { displayHeldEventAttendances, isFetchingHeldEventAttendances } =
    useHeldEventAttendances(did)
  const { setShowDetailModal } = useVESSWidgetModal()
  const selectAttendance = useSetSelectAttendance()
  const Wrapper = styled.div`
    width: 100%;
  `
  const MembersContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 12px;
    text-align: center;
    justify-content: center;
    @media (max-width: 1079px) {
      grid-template-columns: repeat(auto-fit, 216px);
    }
    @media (max-width: 599px) {
      grid-template-columns: repeat(auto-fit, 180px);
      grid-gap: 8px;
    }
  `
  const Content = styled.div`
    grid-template-columns: repeat(auto-fill, 1fr);
  `
  const LoadingContainer = styled.div`
    grid-column: 1/3;
    width: 100%;
    height: 100%;
  `

  const goToEventPage = (event: WithCeramicId<BaseCredential>) => {
    selectAttendance(event)
    setShowDetailModal(true)
  }

  return (
    <Wrapper>
      {isFetchingHeldEventAttendances ? (
        <LoadingContainer>
          {' '}
          <CommonSpinner />
        </LoadingContainer>
      ) : (
        <MembersContainer>
          {!displayHeldEventAttendances || displayHeldEventAttendances.length === 0 ? (
            <NoItem text={'No Item yet'} />
          ) : (
            <>
              {displayHeldEventAttendances &&
                displayHeldEventAttendances.map((event) => {
                  return (
                    <Content key={event.ceramicId} onClick={() => goToEventPage(event)}>
                      <EventCard ceramicId={event.credentialSubject.eventId} />
                    </Content>
                  )
                })}
            </>
          )}
        </MembersContainer>
      )}
    </Wrapper>
  )
}
