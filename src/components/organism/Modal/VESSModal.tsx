import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import React from 'react'
import { ProgressBarModalHeader } from './Headers/ProgressBarModalHeader'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { FadeInOut } from '@/components/atom/Motions/FadeInOut'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { PFFilledRate, useStatePFFilledRate } from '@/jotai/ui'

type Props = {
  headerColor?: string
  contentColor?: string
  modalTitle?: string
  modalTitles?: string[]
  variant?: 'ProgressBar'
  rate?: number
} & DialogPrimitive.DialogContentProps

export const VESSModal = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      headerColor,
      contentColor,
      modalTitle,
      modalTitles,
      variant,
      rate,
      forceMount,
      ...props
    },
    forwardedRef,
  ) => {
    // const [PFFilledRate, setPFFilledRate] = useStatePFFilledRate()
    const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

    const DialogOverlay = styled(DialogPrimitive.Overlay)`
      position: fixed;
      inset: 0;
      background: ${currentTheme.background};
      opacity: 0.8;
      z-index: 9998;
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

      overflow: hidden;
      &:focus {
        outline: none;
      }
      @media (max-width: 599px) {
        margin-top: 64px;
      }
    `
    const Header = styled.div`
      background: ${headerColor || 'transparent'};
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
      flex-direction: column;
      background: transparent;
      position: relative;
      width: 100%;
      height: fit-content;
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
      <DialogPrimitive.Portal forceMount={forceMount}>
        <FadeInOut noAnimatePresence>
          <DialogOverlay forceMount={forceMount} />
        </FadeInOut>
        <FadeInOut duration={0.2} noAnimatePresence>
          <DialogWrapper>
            <DialogContent {...props} ref={forwardedRef}>
              <DialogInnerContent id={'DialogInterContetn'}>
                {variant == 'ProgressBar' ? (
                  <ProgressBarModalHeader lastPage={3} titles={modalTitles ? modalTitles : []} />
                ) : (
                  <Header>
                    <ModalTitle>{modalTitle}</ModalTitle>
                    <Close aria-label='Close'>
                      <IconContainer>
                        <Icon icon={ICONS.CROSS} size={'M'} mainColor={currentTheme.onSurface} />
                      </IconContainer>
                    </Close>
                  </Header>
                )}
                {children}
              </DialogInnerContent>
            </DialogContent>
          </DialogWrapper>
        </FadeInOut>
      </DialogPrimitive.Portal>
    )
  },
)

VESSModal.displayName = 'VESSModal'

export const VESSModalContainer = DialogPrimitive.Root
