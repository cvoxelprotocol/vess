import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence } from 'framer-motion'
import { FC } from 'react'
import type { BusinessProfile } from 'vess-sdk'
import { VESSModalContainer } from '../VESSModal'
import { PFOnboardingForm } from './PFOnboardingForm'
import { FadeInOut } from '@/components/atom/Motions/FadeInOut'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  businessProfile?: BusinessProfile | null
}

export const PFOnboardingModal: FC<Props> = ({ did, businessProfile }) => {
  const { showPFRateModal, setShowPFRateModal } = useVESSWidgetModal()
  const { currentTheme } = useVESSTheme()

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
  const DialogInnerContent = styled.div`
    display: flex;
    flex-direction: column;
    background: transparent;
    position: relative;
    width: 100%;
    height: fit-content;
  `

  return (
    <VESSModalContainer open={showPFRateModal} onOpenChange={setShowPFRateModal}>
      <AnimatePresence>
        {showPFRateModal ? (
          <DialogPrimitive.Portal forceMount>
            <FadeInOut noAnimatePresence>
              <DialogOverlay forceMount />
            </FadeInOut>
            <FadeInOut duration={0.2} noAnimatePresence>
              <DialogWrapper>
                <DialogContent>
                  <DialogInnerContent id={'DialogInterContetn'}>
                    <PFOnboardingForm did={did} businessProfile={businessProfile} />
                  </DialogInnerContent>
                </DialogContent>
              </DialogWrapper>
            </FadeInOut>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </VESSModalContainer>
  )
}
