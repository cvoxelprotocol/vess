import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as Toast from '@radix-ui/react-toast'
import { FC } from 'react'
import { Button } from '../Buttons/Button'
import { IconButton } from '../Buttons/IconButton'
import { IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateOpenToast } from '@/jotai/ui'

export type BaseToastProps = {
  text: string
  trigger?: React.ReactNode
  tailIcon?: IconsType
  actionTitle?: string
  onClickAction?: () => void
  onClickTailIcon?: () => void
  oneLiner?: boolean
  duration?: number
}
export const BaseToast: FC<BaseToastProps> = ({
  trigger,
  text,
  tailIcon,
  actionTitle,
  onClickAction,
  onClickTailIcon,
  duration,
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const [open, setOpen] = useStateOpenToast()

  const VIEWPORT_PADDING = 25

  const TriggerWrapper = styled.div`
    background: none;
    border: none;
  `

  const ToastViewport = styled(Toast.Viewport)`
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding: ${VIEWPORT_PADDING}px;
    gap: 10;
    max-width: 100vw;
    margin: 0;
    list-style: none;
    z-index: 9999;
    outline: none;
  `

  const hide = keyframes({
    '0%': { opacity: 1 },
    '100%': { opacity: 0 },
  })

  const slideIn = keyframes({
    from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
    to: { transform: 'translateX(0)' },
  })

  const swipeOut = keyframes({
    from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
    to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  })

  const ToastRoot = styled(Toast.Root)`
    background-color: ${currentTheme.inverseSurface};
    border-radius: 4px;
    padding: 14px 8px 14px 16px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: center;
    width: 380px;
    max-width: 100vw;
    position: relative;
    box-shadow: var(--vess-theme-card-box-shadow, 0px 2px 0px 0px rgba(175, 169, 173, 1));
    @media (max-width: 599px) {
      width: 90vw;
    }

    &[data-state='open'] {
      animation: ${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    &[data-state='closed'] {
      animation: ${hide} 100ms ease-in;
    }
    &[data-swipe='move'] {
      transform: translateX(var(--radix-toast-swipe-move-x));
    }
    &[data-swipe='cancel'] {
      transform: translateX(0);
      transition: transform 200ms ease-out;
    }
    &[data-swipe='end'] {
      animation: ${swipeOut} 100ms ease-out;
    }
  `

  const ToastTitle = styled(Toast.Title)`
    color: ${currentTheme.inverseOnSurface};
    grid-area: title;
    text-align: left;
    ${getBasicFont(currentTypo.body.medium)};
    position: relative;
    flex: 1;
    flex-wrap: nowrap;
    overflow: hidden;
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.body.small)};
    }
  `

  const ToastActionContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
  `
  const ToastAction = styled(Toast.Action)`
    grid-area: action;
    flex-shrink: 0;
    width: fit-content;
  `

  const onClickRightAction = () => {
    if (!onClickAction) {
      setOpen(false)
      return
    }
    onClickAction()
    setOpen(false)
  }

  const onClickIcon = () => {
    if (!onClickTailIcon) {
      setOpen(false)
      return
    }
    onClickTailIcon()
    setOpen(false)
  }

  return (
    <Toast.Provider swipeDirection='right' duration={duration || 3000}>
      {trigger && <TriggerWrapper onClick={() => setOpen(true)}>{trigger}</TriggerWrapper>}

      <ToastRoot open={open} onOpenChange={setOpen}>
        <ToastTitle>{text}</ToastTitle>
        <ToastAction asChild altText='Action'>
          <ToastActionContainer>
            <Button
              text={actionTitle || 'OK'}
              btnWidth={'100%'}
              variant={'text'}
              textColor={currentTheme.inversePrimary}
              mainColor={currentTheme.inversePrimary}
              onClick={() => onClickRightAction()}
            />
            {tailIcon && (
              <IconButton
                icon={tailIcon}
                size={'XS'}
                mainColor={currentTheme.inverseOnSurface}
                focusColor={currentTheme.inverseOnSurface}
                variant={'text'}
                onClick={() => onClickIcon}
              />
            )}
          </ToastActionContainer>
        </ToastAction>
      </ToastRoot>
      <ToastViewport />
    </Toast.Provider>
  )
}
