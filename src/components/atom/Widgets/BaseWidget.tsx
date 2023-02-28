import styled from '@emotion/styled'
import { FC, useState, useMemo, useEffect } from 'react'
import { IconButton } from '../Buttons/IconButton'
import { ICONS } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useWidgetRaduis } from '@/hooks/useWidgetRadius'
import { useStateFocusEditable } from '@/jotai/ui'
import { keyframes } from '@emotion/react'

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
  EditButtonPosition = '-10px',
  onClickEdit,
  border = 'none',
  editable = false,
  overflow = 'hidden',
}) => {
  const { currentTheme } = useVESSTheme()
  const [showEdit, setShowEdit] = useState(false)
  const [focusEditable, _] = useStateFocusEditable()
  const { radius, radiusOnSp } = useWidgetRaduis({ gridRow, gridCol, gridRowOnSp, gridColOnSp })
  const [btnOpacity, setBtnOpacity] = useState(0)

  useEffect(() => {
    if (showEdit) {
      setBtnOpacity(0)
    }
    if (focusEditable) {
      setBtnOpacity(1)
    } else {
      setBtnOpacity(0)
    }
  }, [showEdit, focusEditable])

  const shake = keyframes`
    0% {
      transform: rotate(0deg);
    }
    33% {
      transform: rotate(0.5deg);
    }
    66%{
      transform: rotate(-0.5deg);
    }
    100% {
      transform: rotate(0deg);
    }
    `
  const alwaysOn = keyframes`
    from {
      opacity: 1;
    }
    
    to {
      opacity: 1;
    } 
    `

  const fadeIn = keyframes`
    from {
      opacity: ${btnOpacity};
    }
    
    to {
      opacity: 1;
    } 
    `
  const fadeOut = keyframes`
    from {
      opacity: 1;
    }
    
    to {
      opacity: 0;
    }
    `

  const Container4Edit = styled.div`
    position: relative;
    grid-column: ${gridCol};
    grid-row: ${gridRow};

    @media (max-width: 599px) {
      grid-column: ${gridColOnSp};
      grid-row: ${gridRowOnSp};
      animation: ${focusEditable && editable ? shake : undefined} 0.5s linear infinite;
    }
  `
  const Container = styled.div`
    overflow: ${overflow};
    @media (max-width: 1079px) {
      border-radius: ${radius};
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
    pointer-events: ${showEdit ? 'auto' : 'none'};
    cursor: pointer;
    opacity: 0;
    animation: ${showEdit || focusEditable ? fadeIn : undefined} 0.15s ease-in-out forwards;
    transition: all 0.15s ease-in-out;
    @media (max-width: 599px) {
      pointer-events: ${focusEditable ? 'auto' : 'none'};
    }
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
