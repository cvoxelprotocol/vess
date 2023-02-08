import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as Dialog from '@radix-ui/react-dialog'
import { FC } from 'react'
import { Button } from '../Buttons/Button'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateOpenBaseDialog } from '@/jotai/ui'

type Props = {
  trigger?: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  closeActionTitle?: string
  rightActionTitle?: string
  rightAction?: () => void
}
export const BaseDialog: FC<Props> = ({
  trigger,
  title,
  description,
  children,
  closeActionTitle,
  rightActionTitle,
  rightAction,
}) => {
  const { currentTheme, currentTypo } = useVESSTheme()
  const [open, setOpen] = useStateOpenBaseDialog()
  const overlayShow = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  })

  const contentShow = keyframes({
    '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
    '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  })

  const DialogOverlay = styled(Dialog.Overlay)`
    position: fixed;
    inset: 0;
    animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  `

  const DialogContentContainer = styled(Dialog.Content)`
    background: ${currentTheme.surface3};
    border-radius: 32px;
    padding: 32px 32px 32px 32px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 450px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 29px;
    align-items: flex-start;
    justify-content: flex-start;
    align-self: stretch;
    flex-shrink: 0;
    animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
    &:focus {
      outline: none;
    }
  `
  const DialogContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 9px;
    align-items: flex-start;
    justify-content: flex-start;
    flex-shrink: 0;
    position: relative;
  `

  const DialogTitle = styled(Dialog.Title)`
    color: ${currentTheme.onSurface};
    text-align: left;
    margin: 0;
    font-family: ${currentTypo.headLine.small.fontFamily};
    font-size: ${currentTypo.headLine.small.fontSize};
    line-height: ${currentTypo.headLine.small.lineHeight};
    font-weight: ${currentTypo.headLine.small.fontWeight};
  `
  const DialogDescription = styled(Dialog.Description)`
    color: ${currentTheme.onSurface};
    text-align: left;
    font-family: ${currentTypo.body.medium.fontFamily};
    font-size: ${currentTypo.body.medium.fontSize};
    line-height: ${currentTypo.body.medium.lineHeight};
    font-weight: ${currentTypo.body.medium.fontWeight};
  `

  const ActionBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  `

  const ActionContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: flex-start;
    justify-content: flex-start;
    align-self: stretch;
    flex-shrink: 0;
    position: relative;
    margin-top: 25;
  `

  const onClickRightAction = () => {
    if (!rightAction) {
      setOpen(false)
      return
    }
    rightAction()
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContentContainer>
          <DialogContent>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
            {children && children}
          </DialogContent>
          <ActionContainer>
            <ActionBtn>
              <Button
                text={closeActionTitle || 'Cancel'}
                variant={'outlined'}
                btnWidth={'100%'}
                onClick={() => setOpen(false)}
              />
            </ActionBtn>
            <ActionBtn>
              <Button
                text={rightActionTitle || 'OK'}
                btnWidth={'100%'}
                onClick={() => onClickRightAction()}
              />
            </ActionBtn>
          </ActionContainer>
        </DialogContentContainer>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
