import styled from '@emotion/styled'
import { FC, useState } from 'react'
import { IconButton } from '../Buttons/IconButton'
import { ICONS } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useWidgetRaduis } from '@/hooks/useWidgetRadius'

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
  overflow?: string
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
  overflow = 'hidden',
}) => {
  const { currentTheme, initTheme } = useVESSTheme()
  const [showEdit, setShowEdit] = useState(false)
  const { radius, radiusOnSp } = useWidgetRaduis({ gridRow, gridCol, gridRowOnSp, gridColOnSp })

  const Container4Edit = styled.div`
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
    position: relative;
  `
  const Container = styled.div`
    overflow: ${overflow};
    @media (max-width: 1079px) {
      border-radius: ${radiusOnSp};
    }
    @media (max-width: 599px) {
      border-radius: ${radiusOnSp};
    }
    background: ${background || currentTheme.surface2};
    border: ${border};
    border-radius: ${radius};
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
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
    <Container4Edit
      onMouseEnter={editable ? () => setShowEdit(true) : undefined}
      onMouseLeave={editable ? () => setShowEdit(false) : undefined}
    >
      <Container>{children}</Container>
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
    </Container4Edit>
  )
}
