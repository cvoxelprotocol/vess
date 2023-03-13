import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import React from 'react'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  headerColor?: string
  contentColor?: string
  modalTitle?: string
} & DialogPrimitive.DialogContentProps

export const VESSModal = React.forwardRef<HTMLDivElement, Props>(
  ({ children, headerColor, contentColor, modalTitle, ...props }, forwardedRef) => {
    const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

    const OverlayAnimation = keyframes`
      0% {
        opacity: 0;
      }
      100% {
        opacity: 0.8;
      }
    `

    const ContentAnimation = keyframes`
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `

    const DialogOverlay = styled(DialogPrimitive.Overlay)`
      position: fixed;
      inset: 0;
      background: ${currentTheme.background};
      opacity: 0.8;
      z-index: 9998;
      animation: ${OverlayAnimation} 0.15s ease-in-out forwards;
    `

    const DialogWrapper = styled.div`
      position: fixed;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    `

    const DialogContent = styled(DialogPrimitive.Content)`
      background: ${currentTheme.surface3};
      position: relative;
      border-radius: 32px;
      width: 90vw;
      height: fit-content;
      max-width: 600px;
      max-height: 85vh;
      min-height: 20vh;
      animation: ${ContentAnimation} 0.15s ease-in-out forwards;
      overflow: hidden;
      &:focus {
        outline: none;
      }
      @media (max-width: 599px) {
        margin-top: 64px;
      }
    `
    const Header = styled.div`
      background: ${headerColor ? headerColor : 'transparent'};
      width: 100%;
      height: 56px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px 8px 32px;
    `

    const ModalTitle = styled.div`
      ${getBasicFont(currentTypo.title.large)}
      color: ${currentTheme.onSurface};
    `

    const DialogInnerContent = styled.div`
      display: flex;
      background: ${currentTheme.primaryContainer};
      flex-direction: column;
      background: transparent;
      position: relative;
      width: 100%;
      height: 100%;
    `

    const Close = styled(DialogPrimitive.Close)`
      background: none;
      border: none;
      outline: none;
      cursor: pointer;
    `
    const IconContainer = styled.div`
      width: 100;
      height: 100%;
      background: none;
      border: none;
      outline: none;
    `

    return (
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogWrapper>
          <DialogContent {...props} ref={forwardedRef}>
            <DialogInnerContent id={'DialogInterContetn'}>
              <Header>
                <ModalTitle>{modalTitle}</ModalTitle>
                <Close aria-label='Close'>
                  <IconContainer>
                    <Icon icon={ICONS.CROSS} size={'M'} mainColor={currentTheme.onSurface} />
                  </IconContainer>
                </Close>
              </Header>
              {children}
            </DialogInnerContent>
          </DialogContent>
        </DialogWrapper>
      </DialogPrimitive.Portal>
    )
  },
)

VESSModal.displayName = 'VESSModal'

export const VESSModalContainer = DialogPrimitive.Root
