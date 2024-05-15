import { Button, FlexHorizontal, FlexVertical } from 'kai-kit'
import { FC, useEffect } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { IIssueCredentialItemByUserRequest } from '@/@types/credential'
import { useUserCredItem } from '@/hooks/useUserCredItem'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'

export const AddPostContainer: FC = () => {
  const { id } = useVESSAuthUser()
  const { isInitialLoading, userCredentialItems, create } = useUserCredItem(id)

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
