import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import React from 'react'
import { isMobileOnly } from 'react-device-detect'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const BaseDetailModal = React.forwardRef<HTMLDivElement, DialogPrimitive.DialogContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const { currentTheme } = useVESSTheme()

    const DialogOverlay = styled(DialogPrimitive.Overlay)`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: grid;
      place-items: center;
      overflow-y: auto;
      background: ${currentTheme.background};
      opacity: 0.1;
    `
    const DialogContent = styled(DialogPrimitive.Content)`
      border-radius: 32px;
      position: fixed;
      top: 35%;
      left: 50%;
      will-change: transform;
      transform: translate(-50%, -50%);
      width: 100vw;
      max-width: 780px;
      max-height: 85vh;
      min-height: 20vh;
      gap: 29px;
      z-index: 90;
      margin-top: 80px;
      &:focus {
        outline: none;
      }
      @media (max-width: 599px) {
        max-height: 100vh;
        top: 50%;
        z-index: 999;
        margin-top: 0;
      }
    `
    const DialogInnerContent = styled.div`
      width: 100%;
      height: 100%;
      position: relative;
    `

    const Close = styled(DialogPrimitive.Close)`
      position: absolute;
      top: 16px;
      left: 16px;
      background: none;
      border: none;
      z-index: 999;
      outline: none;
    `
    const IconContainer = styled.div`
      width: 100;
      height: 100%;
      background: none;
      border: none;
      color: ${currentTheme.onSurface};
    `

    return (
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogContent {...props} ref={forwardedRef}>
          <DialogInnerContent>
            <Close aria-label='Close'>
              <IconContainer>
                {isMobileOnly ? (
                  <Icon icon={ICONS.LEFT_ARROW} size={'M'} mainColor={currentTheme.onSurface} />
                ) : (
                  <Icon icon={ICONS.CROSS} size={'M'} mainColor={currentTheme.onSurface} />
                )}
              </IconContainer>
            </Close>
            {children}
          </DialogInnerContent>
        </DialogContent>
      </DialogPrimitive.Portal>
    )
  },
)

BaseDetailModal.displayName = 'BaseDetailModal'

export const BaseDetailModalContainer = DialogPrimitive.Root
