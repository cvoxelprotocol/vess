
import { FC } from 'react'
import { IconButton } from '../Buttons/IconButton'
import { ICONS } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateFocusEditable } from '@/jotai/ui'

type Props = {
  onClick?: () => void
  editable?: boolean
  onClickEdit?: () => void
  background?: string
  border?: string
  EditButtonPosition?: string
  overflow?: string
  isLoading?: boolean
}

export const EditWidget: FC<Props> = ({
  background,
  EditButtonPosition = '-10px',
  onClickEdit,
  border = 'none',
  editable = true,
  overflow = 'visible',
  isLoading = false,
}) => {
  const { currentTheme } = useVESSTheme()
 

 
  const handleEdit = () => {
    if (onClickEdit) onClickEdit()
  }


  return (
    <>
      {onClickEdit && editable && (
        <IconButton
          icon={ICONS.EDIT}
          size={'MM'}
          mainColor={currentTheme.onPrimary}
          backgroundColor={currentTheme.primary}
          onClick={() => handleEdit()}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
          }}
        />
      )}
    </>
  )
}
