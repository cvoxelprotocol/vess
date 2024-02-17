import { Button } from 'kai-kit'
import router from 'next/router'
import React, { FC } from 'react'
import { PiSignOutFill } from 'react-icons/pi'
import { useNCLayoutContext } from './NCLayout'
import { DidAuthService } from '@/lib/didAuth'

const LogoutButton: FC = () => {
  const didAuthService = DidAuthService.getInstance()
  const { closeNavigation } = useNCLayoutContext()

  const logout = async () => {
    try {
      await didAuthService.disConnectDID()
      closeNavigation()
      router.push('/login')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Button
      endContent={<PiSignOutFill />}
      variant='tonal'
      width='100%'
      color='dominant'
      onPress={logout}
      align='space-between'
    >
      ログアウトする
    </Button>
  )
}
export default LogoutButton
