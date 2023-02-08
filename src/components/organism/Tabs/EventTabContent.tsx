import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import type { EventAttendanceWithId } from 'vess-sdk'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { EventCard } from '@/components/molecure/Event/EventCard'
import { useHeldEventAttendances } from '@/hooks/useHeldEventAttendances'

type Props = {
  did: string
}

export const EventTabContent: FC<Props> = ({ did }) => {
  const router = useRouter()
  const { HeldEventAttendances, isFetchingHeldEventAttendances } = useHeldEventAttendances(did)
  const Wrapper = styled.div`
    width: 100%;
  `
  const MembersContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 12px;
    text-align: center;
    @media (max-width: 1517px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 599px) {
      grid-template-columns: repeat(2, 1fr);
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

  const goToEventPage = (event: EventAttendanceWithId) => {
    // router.push(`/events/${removeCeramicPrefix(event.ceramicId)}`)
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
          {HeldEventAttendances &&
            HeldEventAttendances.map((event) => {
              return (
                <Content key={event.ceramicId} onClick={() => goToEventPage(event)}>
                  <EventCard ceramicId={event.credentialSubject.eventId} />
                </Content>
              )
            })}
        </MembersContainer>
      )}
    </Wrapper>
  )
}
