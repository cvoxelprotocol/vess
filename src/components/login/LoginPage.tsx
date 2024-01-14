import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { GrGoogle } from 'react-icons/gr'
import { LuExternalLink } from 'react-icons/lu'
import { SiWalletconnect } from 'react-icons/si'
import { Connector, useConnect } from 'wagmi'
import { HCLayout } from '../app/HCLayout'
import { FlexHorizontal } from '../ui-v1/Common/FlexHorizontal'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { Button } from '@/kai/button/Button'
import { useKai } from '@/kai/hooks/useKai'
import { Text } from '@/kai/text/Text'

export const LoginPage: FC = () => {
  const { kai } = useKai()
  const { connectors, error, isLoading, pendingConnector } = useConnect()
  const { connectDID } = useConnectDID()
  const router = useRouter()
  const { did } = useDIDAccount()

  useEffect(() => {
    if (did) {
      router.push(`/did/${did}`)
    }
  }, [did, router])

  const handleLogin = async (connector?: Connector<any, any>) => {
    try {
      const isSuccess = await connectDID(connector)
      if (isSuccess) {
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <HCLayout>
      <LoginFrame>
        <Text as='h1' typo='headline-lg' color={kai.color.sys.onSurface}>
          ログイン / 登録
        </Text>
        <FlexVertical gap='var(--kai-size-ref-16)' width='100%' padding='0 var(--kai-size-ref-16)'>
          <Button
            width='100%'
            round='lg'
            size='lg'
            startContent={<GrGoogle />}
            onPress={() => handleLogin(connectors[0])}
            isDisabled={isLoading || pendingConnector === connectors[0]}
          >
            Googleアカウントで続ける
          </Button>
          <Button
            variant='outlined'
            width='100%'
            round='lg'
            size='lg'
            startContent={<SiWalletconnect />}
            onPress={() => handleLogin(connectors[1])}
            isDisabled={isLoading}
          >
            ウォレットを接続する
          </Button>
          <FlexHorizontal width='100%' gap='var(--kai-size-ref-8)' justifyContent='center'>
            <Text
              as='span'
              typo='label-lg'
              color={kai.color.sys.onPrimaryContainer}
              endContent={<LuExternalLink />}
            >
              利用規約
            </Text>
            <Text
              as='span'
              typo='label-lg'
              color={kai.color.sys.onPrimaryContainer}
              endContent={<LuExternalLink />}
            >
              プライバシーポリシー
            </Text>
          </FlexHorizontal>
        </FlexVertical>
        <NextImageContainer
          src='/landscape.png'
          objectFit='cover'
          width='100%'
          height={kai.size.ref[144]}
        />
      </LoginFrame>
    </HCLayout>
  )
}

const LoginFrame = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: var(--kai-size-ref-24);
  padding: 0;
`
