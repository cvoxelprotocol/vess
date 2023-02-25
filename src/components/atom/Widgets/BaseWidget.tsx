import styled from '@emotion/styled'
import { FC, useState } from 'react'
import { IconButton } from '../Buttons/IconButton'
import { ICONS } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateFocusEditable } from '@/jotai/ui'

type Props = {
  gridRow: string
  gridCol: string
  gridRowOnSp: string
  gridColOnSp: string
  children: React.ReactNode
  onClick?: () => void
  editable?: boolean
  onClickEdit?: () => void
  background?: string
  border?: string
  EditButtonPosition?: string
}

export const BaseWidget: FC<Props> = ({
  gridCol,
  gridRow,
  gridRowOnSp,
  gridColOnSp,
  children,
  background,
  EditButtonPosition = '12px',
  onClickEdit,
  border = 'none',
  editable = false,
}) => {
  const { currentTheme } = useVESSTheme()
  const [showEdit, setShowEdit] = useState(false)
  const [focusEditable, _] = useStateFocusEditable()

  const Container = styled.div`
    grid-column: ${gridCol};
    grid-row: ${gridRow};
    @media (max-width: 1079px) {
      grid-column: ${gridColOnSp};
      grid-row: ${gridRowOnSp};
    }
    @media (max-width: 599px) {
      grid-column: ${gridColOnSp};
      grid-row: ${gridRowOnSp};
    }
    background: ${background || currentTheme.surface2};
    border: ${border};
    border-radius: 40px;
    position: relative;
  `
  const EditButton = styled.div`
    position: absolute;
    top: ${EditButtonPosition};
    right: ${EditButtonPosition};
    z-index: 10;
    display: ${focusEditable || showEdit ? 'block' : 'none'};
    @media (max-width: 599px) {
      display: ${focusEditable ? 'block' : 'none'};
    }
  `
  const handleEdit = () => {
    setShowEdit(false)
    if (onClickEdit) onClickEdit()
  }

  return (
    <Container
      onMouseEnter={editable ? () => setShowEdit(true) : undefined}
      onMouseLeave={editable ? () => setShowEdit(false) : undefined}
    >
      {onClickEdit && editable && (
        <EditButton>
          <IconButton
            icon={ICONS.EDIT}
            size={'MM'}
            mainColor={currentTheme.onPrimary}
            backgroundColor={currentTheme.primary}
            onClick={() => handleEdit()}
          />
        </EditButton>
      )}
      {children}
    </Container>
  )
}
