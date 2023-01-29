import styled from '@emotion/styled'
import { FC, useState } from 'react'
import { IconButton } from '../Buttons/IconButton'
import { ICONS } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  gridRow: string
  gridCol: string
  children: React.ReactNode
  onClick?: () => void
  editable?: boolean
  onClickEdit?: () => void
  background?: string
  EditButtonPosition?: string
}

export const BaseWidget: FC<Props> = ({
  gridCol,
  gridRow,
  children,
  background,
  EditButtonPosition = '12px',
  onClickEdit,
  editable = false,
}) => {
  const { currentTheme, initTheme } = useVESSTheme()
  const [showEdit, setShowEdit] = useState(false)
  const Container = styled.div`
    grid-column: ${gridCol};
    grid-row: ${gridRow};
    background: ${background || currentTheme.surface2};
    border-radius: 40px;
    position: relative;
  `
  const EditButton = styled.div`
    position: absolute;
    top: ${EditButtonPosition};
    right: ${EditButtonPosition};
    z-index: 10;
    display: ${showEdit ? 'block' : 'none'};
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
