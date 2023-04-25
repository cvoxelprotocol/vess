import styled from '@emotion/styled'
import type { TaskCredential, WithCeramicId } from 'vess-sdk'
import { NoItem } from '@/components/atom/Common/NoItem'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'

import { TaskCredentialCard } from '@/components/molecure/Work/TaskCredentialCard'
import { useHeldTaskCredentials } from '@/hooks/useHeldTaskCredentials'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useSetSelectTask } from '@/jotai/item'

type Props = {
  did: string
}
export default function WorkTabContent({ did }: Props) {
  const { heldTaskCredentials, isFetchingHeldTaskCredentials } = useHeldTaskCredentials(did)
  const selectTask = useSetSelectTask()
  const { setShowTaskDetailModal } = useVESSWidgetModal()
  const Wrapper = styled.div`
    width: 100%;
  `
  const MembersContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;
    justify-content: center;
    text-align: center;
    @media (max-width: 1079px) {
      grid-template-columns: repeat(auto-fit, 300px);
    }
    @media (max-width: 599px) {
      grid-template-columns: repeat(auto-fit, 300px);
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

  const showDetail = (item: WithCeramicId<TaskCredential>) => {
    selectTask(item.ceramicId)
    setShowTaskDetailModal(true)
  }

  return (
    <Wrapper>
      {isFetchingHeldTaskCredentials ? (
        <LoadingContainer>
          {' '}
          <CommonSpinner />
        </LoadingContainer>
      ) : (
        <MembersContainer>
          {!heldTaskCredentials || heldTaskCredentials.length === 0 ? (
            <NoItem text={'No Item yet...'} />
          ) : (
            <>
              {heldTaskCredentials.length > 0 &&
                heldTaskCredentials.map((item) => {
                  return (
                    <Content key={item.ceramicId}>
                      <TaskCredentialCard crdl={item} handleClick={showDetail} />
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
