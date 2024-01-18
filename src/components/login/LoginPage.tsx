import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BaseSyntheticEvent, FC, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { useForm } from 'react-hook-form'
import { PiEnvelopeSimple, PiArrowFatRightDuotone } from 'react-icons/pi'
import { Connector, useConnect } from 'wagmi'
import { HCLayout } from '../app/HCLayout'
import { FlexHorizontal } from '../ui-v1/Common/FlexHorizontal'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'
import { LoginButton } from './LoginButton'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { Separator } from '@/kai/Separator'
import { Button } from '@/kai/button/Button'
import { useKai } from '@/kai/hooks/useKai'
import { IconButton } from '@/kai/icon-button'
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
      if (router.query.rPath) {
        router.push(router.query.rPath as string)
      } else {
        router.push(`/did/${did}`)
      }
    }
  }, [did, router])

  useEffect(() => {
    console.log('conncectors: ', connectors)
  }, [connectors])

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
        <Text as='h1' typo='headline-lg' color={kai.color.sys.onSurfaceVariant}>
          ログイン / 登録
        </Text>
        <FlexVertical gap='var(--kai-size-ref-16)' width='100%'>
          <FlexHorizontal width='100%' gap='8px' alignItems='center' justifyContent='center'>
            <LoginButton
              iconSrc='/brand/google.png'
              onPress={() => loginWithGoogle()}
              isDisabled={isLoading}
              aria-label='Googleでログイン'
            />
            <LoginButton
              iconSrc='/brand/discord.png'
              onPress={() => loginWithDiscord()}
              isDisabled={isLoading}
              aria-label='Discordでログイン'
            />
            {!isMobile && (
              <LoginButton
                iconSrc='/brand/metamask.png'
                onPress={() => handleLogin(connectors[1])}
                isDisabled={isLoading}
                aria-label='Metamaskでログイン'
              />
            )}
            <LoginButton
              iconSrc='/brand/walletconnect.png'
              onPress={() => handleLogin(connectors[0])}
              isDisabled={isLoading}
              aria-label='Walletconnectでログイン'
            />
          </FlexHorizontal>
          {/* <Button
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
          </Button> */}
          <Separator title='または' titlePlacement='in-center' lineWeight='thick' />
          <Form id='email-login' onSubmit={handleSubmit(onClickSubmit)}>
            <FlexHorizontal gap='8px' width='100%'>
              <TextInput
                label='Email'
                width='100%'
                size='lg'
                {...register('email', { required: true })}
                placeholder='メールアドレス'
                isLabel={false}
                inputStartContent={<PiEnvelopeSimple size={20} />}
              />
              <IconButton
                icon={<PiArrowFatRightDuotone />}
                round='md'
                size='lg'
                type='submit'
                isDisabled={isLoading}
                variant='tonal'
                style={{ flex: '0 0 auto' }}
              ></IconButton>
            </FlexHorizontal>
          </Form>
          <TermsFrame>
            ログインまたは登録することで、当サービスの
            <Link
              href='https://vesslabs.notion.site/VESS-Terms-of-Use-1ae74e0b9ae74b86a5e2e7b377b79722'
              target='_blank'
              style={{ color: 'var(--kai-color-sys-primary)' }}
            >
              利用規約
            </Link>
            および、
            <Link
              href='https://vesslabs.notion.site/VESS-Privacy-Policy-b22d5bcda02e43189c202ec952467a0d'
              target='_blank'
              style={{ color: 'var(--kai-color-sys-primary)' }}
            >
              プライバシーポリシー
            </Link>
            に同意するものとします。
          </TermsFrame>
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
const TermsFrame = styled.p`
  width: 100%;
  padding: 0 var(--kai-size-ref-8);
  font-family: var(--kai-typo-ref-font-family-base);
  font-weight: var(--kai-typo-sys-body-md-font-weight);
  font-size: var(--kai-typo-sys-body-md-bold-font-size);
  line-height: var(--kai-typo-sys-body-md-line-height);
  color: var(--kai-color-sys-on-surface-varinant);
`
