import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Button } from '@/components/atom/Buttons/Button'
import { InvitaionContent } from '@/components/organism/Connection/InvitaionContent'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const ConnectionInvitationContainer: FC = () => {
  const { currentTheme } = useVESSTheme()
  const { did } = useDIDAccount()
  const router = useRouter()

  const Container = styled.div`
    padding: 12px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    align-items: center;
    background: ${currentTheme.surface3};
    height: 100%;
  `

  const backToMyProfile = () => {
    router.push(`/did/${did}`)
  }

  return (
    <Container>
      <InvitaionContent />
      <Button
        variant='outlined'
        text='Close'
        mainColor={currentTheme.primary}
        textColor={currentTheme.primary}
        type='button'
        onClick={() => backToMyProfile()}
      />
    </Container>
  )
}
