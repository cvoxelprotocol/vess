import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { BaseSyntheticEvent, FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { TextInput } from '@/kai/text-Input/TextInput'

type EmailLoginProps = {
  email: string
}
export const LoginPage: FC = () => {
  const { kai } = useKai()
  const { connectors, error, isLoading } = useConnect()
  const { loginWithWallet, loginWithGoogle, loginWithEmail, loginWithDiscord } = useConnectDID()
  const router = useRouter()
  const { did } = useDIDAccount()

  useEffect(() => {
    if (did) {
      router.push(`/did/${did}`)
    }
  }, [did, router])

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EmailLoginProps>({
    defaultValues: {
      email: '',
    },
  })

  const onClickSubmit = async (data: EmailLoginProps, e?: BaseSyntheticEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    try {
      const { email } = data
      const isSuccess = await loginWithEmail(email)
      if (isSuccess) {
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async (connector?: Connector<any, any>) => {
    try {
      const isSuccess = await loginWithWallet(connector)
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
            onPress={() => loginWithGoogle()}
            isDisabled={isLoading}
          >
            Google
          </Button>
          <Button
            width='100%'
            round='lg'
            size='lg'
            onPress={() => loginWithDiscord()}
            isDisabled={isLoading}
          >
            Discord
          </Button>
          <Form id='email-login' onSubmit={handleSubmit(onClickSubmit)}>
            <TextInput
              label='Email'
              width='100%'
              {...register('email', { required: true })}
              placeholder='Email'
              hideLabel
            />
            <Button width='100%' round='lg' size='lg' type='submit' isDisabled={isLoading}>
              Emailでログイン
            </Button>
          </Form>
          <Text as='h3' typo='label-lg' color={kai.color.sys.onSurface}>
            Walletでログイン
          </Text>
          <Button
            variant='outlined'
            width='100%'
            round='lg'
            size='lg'
            startContent={<SiWalletconnect />}
            onPress={() => handleLogin(connectors[0])}
            isDisabled={isLoading}
          >
            {connectors[0].name}
          </Button>
          <Button
            variant='outlined'
            width='100%'
            round='lg'
            size='lg'
            // startContent={<SiWalletconnect />}
            onPress={() => handleLogin(connectors[1])}
            isDisabled={isLoading}
          >
            {connectors[1].name}
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

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-ref-8);
`
