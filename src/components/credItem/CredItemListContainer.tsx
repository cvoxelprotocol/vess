import { Button, FlexHorizontal, FlexVertical, Text } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useUserCredItem } from '@/hooks/useUserCredItem'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'

export const CredItemListContainer: FC = () => {
  const { id } = useVESSAuthUser()
  const { isInitialLoading, userCredentialItems } = useUserCredItem(id)
  const router = useRouter()

  useEffect(() => {
    console.log({ userCredentialItems })
  }, [userCredentialItems])

  const toIssueUrl = (id: string) => {
    window.open(`${process.env.NEXT_PUBLIC_VESS_URL}/creds/receive/${id}`, '_blank')
  }

  return (
    <FlexVertical
      width='100%'
      alignItems='center'
      justifyContent='center'
      height='auto'
      gap='32px'
      padding='32px'
    >
      <FlexVertical width='100%' justifyContent='center' gap='24px' padding='32px'>
        <FlexHorizontal width='100%' alignItems='center' justifyContent='center'>
          <Button
            variant='filled'
            width='var(--kai-size-ref-240)'
            onPress={() => router.push('/creds/items/create')}
          >
            新規発行へ
          </Button>
        </FlexHorizontal>
        <Text
          as='p'
          typo='body-lg'
          color='var(--kai-color-sys-on-layer)'
          style={{ padding: '0 var(--kai-size-sys-space-sm)' }}
        >
          作成済みステッカー一覧
        </Text>
        {userCredentialItems &&
          userCredentialItems.length > 0 &&
          userCredentialItems?.map((item) => {
            return (
              <FlexVertical key={item.id} width='100%' alignItems='center' gap='8px'>
                <ImageContainer src={item.icon || item.image || ''} width='50px' height='50px' />
                <div>{item.title}</div>
                <Button
                  variant='text'
                  width='var(--kai-size-ref-240)'
                  onPress={() => toIssueUrl(item.id)}
                >
                  {`発行URL: ${process.env.NEXT_PUBLIC_VESS_URL}/creds/receive/${item.id}`}
                </Button>
              </FlexVertical>
            )
          })}
      </FlexVertical>
    </FlexVertical>
  )
}
