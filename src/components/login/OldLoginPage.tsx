import styled from '@emotion/styled'
import { Button, useKai, Text } from 'kai-kit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { HCLayout } from '../app/HCLayout'
import { FlexHorizontal } from '../ui-v1/Common/FlexHorizontal'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useStateRPath } from '@/jotai/ui'
import { DidAuthService } from '@/lib/didAuth'

export const OldLoginPage: FC = () => {
  const { kai } = useKai()
  const didAuthService = DidAuthService.getInstance()
  const router = useRouter()
  const { user } = useVESSAuthUser()
  const [rPath, setRpath] = useStateRPath()

  useEffect(() => {
    if (user?.did) {
      if (rPath) {
        const returnUrl = rPath.startsWith('/') ? rPath : `/${rPath}`
        setRpath(null)
        router.push(returnUrl)
        return
      } else {
        router.push(`/did/${user?.did}`)
        return
      }
    }
  }, [user?.did])

  return (
    <HCLayout>
      <LoginFrame>
        <Text as='h1' typo='headline-lg' color={kai.color.sys.onSurfaceVariant}>
          ログイン
        </Text>
        <FlexVertical gap='var(--kai-size-ref-16)' width='100%'>
          <FlexHorizontal width='100%' gap='8px' alignItems='center' justifyContent='center'>
            <Button
              variant='filled'
              width='var(--kai-size-ref-320)'
              onPress={() => didAuthService.loginWithEmailAndPw()}
              isDisabled={didAuthService.isConnecting}
            >
              メール / パスワードでログイン
            </Button>
          </FlexHorizontal>
          <TermsFrame>
            ログインまたは登録することで、当サービスの
            <Link
              href='https://vesslabs.notion.site/VESS-Terms-of-Use-1ae74e0b9ae74b86a5e2e7b377b79722'
              target='_blank'
              style={{ color: 'var(--kai-color-sys-dominant)' }}
            >
              利用規約
            </Link>
            および、
            <Link
              href='https://vesslabs.notion.site/VESS-Privacy-Policy-b22d5bcda02e43189c202ec952467a0d'
              target='_blank'
              style={{ color: 'var(--kai-color-sys-dominant)' }}
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
  background: var(--kai-color-sys-background);
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
  color: var(--kai-color-sys-on-layer-minor);
`
