import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import type { EventAttendanceWithId, WorkCredentialWithId } from 'vess-sdk'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { EventCard } from '@/components/molecure/Event/EventCard'
import { WorkCredentialCard } from '@/components/molecure/Work/WorkCredentialCard'
import { initVoxel } from '@/constants/test'
import { useHeldEventAttendances } from '@/hooks/useHeldEventAttendances'
import { useWorkCredentials } from '@/hooks/useWorkCredential'

type Props = {
  did: string
}

export const WorkTabContent: FC<Props> = ({ did }) => {
  const router = useRouter()
  const { workCredentials, isInitialLoading } = useWorkCredentials(did)
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
      grid-template-columns: repeat(1, 1fr);
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

  const goToEventPage = (event: WorkCredentialWithId) => {
    // router.push(`/events/${removeCeramicPrefix(event.ceramicId)}`)
  }

  return (
    <Wrapper>
      {isInitialLoading ? (
        <LoadingContainer>
          {' '}
          <CommonSpinner />
        </LoadingContainer>
      ) : (
        <MembersContainer>
          {initVoxel &&
            initVoxel.map((work) => {
              return (
                <Content key={work.ceramicId} onClick={() => goToEventPage(work)}>
                  <WorkCredentialCard workCredential={work} />
                </Content>
              )
            })}
          {/* {workCredentials &&
            workCredentials.map((work) => {
              return (
                <Content key={work.ceramicId} onClick={() => goToEventPage(work)}>
                  <WorkCredentialCard workCredential={work} />
                </Content>
              )
            })} */}
        </MembersContainer>
      )}
    </Wrapper>
  )
}
