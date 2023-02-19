import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { NewTaskForm } from '../../Modal/Tasks/NewTaskForm'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const CreateWorkCredentialContent: FC = () => {
  const router = useRouter()
  const { currentTheme } = useVESSTheme()
  const { did } = useDIDAccount()

  const ClaimWrapper = styled.div`
    background: ${currentTheme.surface3};
    width: 100%;
    position: relative;
  `

  return <ClaimWrapper>{did && <NewTaskForm did={did} />}</ClaimWrapper>
}
