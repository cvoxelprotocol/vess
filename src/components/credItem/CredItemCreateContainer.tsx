import { Button, FlexHorizontal, FlexVertical } from 'kai-kit'
import { FC, useEffect } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { IIssueCredentialItemByUserRequest } from '@/@types/credential'
import { useUserCredItem } from '@/hooks/useUserCredItem'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'

export const CredItemCreateContainer: FC = () => {
  const { id } = useVESSAuthUser()
  const { isInitialLoading, userCredentialItems, create } = useUserCredItem(id)

  useEffect(() => {
    console.log({ userCredentialItems })
  }, [userCredentialItems])

  const addItem = async () => {
    if (!id) return
    const param: IIssueCredentialItemByUserRequest = {
      userId: id,
      title: 'new sample item3',
      description: 'new sample item description3',
      icon: 'https://vess-storage.s3.ap-northeast-1.amazonaws.com/653c3f23-75af-4943-bf5b-7ef6b84c8149.png',
      image:
        'https://vess-storage.s3.ap-northeast-1.amazonaws.com/653c3f23-75af-4943-bf5b-7ef6b84c8149.png',
      startDate: new Date().toISOString(),
      endDate: new Date('2025-01-01').toISOString(),
      link: 'https://vess.id/',
      saveCompose: false,
      stickers: [
        'https://vess-storage.s3.ap-northeast-1.amazonaws.com/653c3f23-75af-4943-bf5b-7ef6b84c8149.png',
      ],
    }
    const res = await create(param)
    console.log({ res })
  }

  return (
    <FlexVertical
      width='100%'
      alignItems='center'
      justifyContent='center'
      height='100vh'
      gap='32px'
    >
      <FlexHorizontal width='100%' alignItems='center' justifyContent='center'>
        <Button variant='filled' width='var(--kai-size-ref-240)' onPress={() => addItem()}>
          新規発行
        </Button>
      </FlexHorizontal>
    </FlexVertical>
  )
}
