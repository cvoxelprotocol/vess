import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import React from 'react'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const VESSModal = React.forwardRef<HTMLDivElement, DialogPrimitive.DialogContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const { currentTheme } = useVESSTheme()
    const contentShow = keyframes({
      '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
      '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
    })

    const DialogOverlay = styled(DialogPrimitive.Overlay)`
      position: fixed;
      inset: 0;
      background: ${currentTheme.background};
      opacity: 0.8;
    `
    const DialogContent = styled(DialogPrimitive.Content)`
      border-radius: 32px;
      position: fixed;
      top: 35%;
      left: 50%;
      will-change: transform;
      transform: translate(-50%, -50%);
      width: 90vw;
      max-width: 600px;
      max-height: 85vh;
      min-height: 20vh;
      gap: 29px;
      animation: ${contentShow} 300ms cubic-bezier(0.77, 0.2, 0.05, 1);
      z-index: 90;
      margin-top: 80px;
      &:focus {
        outline: none;
      }
      @media (max-width: 599px) {
        margin-top: 64px;
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
      right: 16px;
      background: none;
      border: none;
      z-index: 999;
    `
    const IconContainer = styled.div`
      width: 100;
      height: 100%;
      background: none;
      border: none;
    `

    return (
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogContent {...props} ref={forwardedRef}>
          <DialogInnerContent>
            <Close aria-label='Close'>
              <IconContainer>
                <Icon icon={ICONS.CROSS} size={'M'} mainColor={currentTheme.onSurface} />
              </IconContainer>
            </Close>
            {children}
          </DialogInnerContent>
        </DialogContent>
      </DialogPrimitive.Portal>
    )
  },
)

VESSModal.displayName = 'VESSModal'

export const VESSModalContainer = DialogPrimitive.Root