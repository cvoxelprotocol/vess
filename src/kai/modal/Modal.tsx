import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React, { FC, useEffect } from 'react'
import type { ModalOverlayProps as RACModalOverlayProps } from 'react-aria-components'
import { Modal as RACModal, ModalOverlay as RACModalOverlay } from 'react-aria-components'
import { Button, ButtonProps } from '../button/Button'
import { Text } from '../text/Text'
import { useModalContext } from './ModalContext'

export type ModalProps = {
  name?: string
  title?: string
  disableClose?: boolean
  children?: React.ReactNode
  CTA?: Omit<ButtonProps, 'variant' | 'size' | 'width'> & { buttonText: string }
  onClose?: () => void
} & RACModalOverlayProps

export const Modal: FC<ModalProps> = ({
  children,
  name,
  title,
  isDismissable,
  disableClose = false,
  CTA,
  onClose,
}) => {
  const { isOpenModal, setIsOpenModal, attachToRef, closeModal } = useModalContext(name)

  return (
    <ModalOverlay
      isDismissable={!disableClose && isDismissable}
      isOpen={isOpenModal}
      onOpenChange={setIsOpenModal}
    >
      <ModalFrame width={attachToRef?.current?.offsetWidth}>
        <ModalHeader>
          <Button
            variant='text'
            size='sm'
            onPress={() => {
              onClose && onClose()
              closeModal()
            }}
            isDisabled={disableClose}
          >
            閉じる
          </Button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Text as='h3' typo='title-md' color='var(--kai-color-sys-on-surface)'>
              {title}
            </Text>
          </div>
          {CTA && (
            <Button variant='text' size='sm' width='100%' {...CTA}>
              {CTA.buttonText}
            </Button>
          )}
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </ModalFrame>
    </ModalOverlay>
  )
}

const ModalOverlay = styled(RACModalOverlay)`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`
const SlideIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(var(--kai-size-ref-56)) scale(1.1);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
`
const SlideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(var(--kai-size-ref-56)) scale(1.1);
  }
`

const ModalFrame = styled(RACModal)<{ width?: number }>`
  display: grid;
  grid-template-rows: var(--kai-size-ref-56) 1fr;
  width: ${(props) => {
    if (props.width != undefined) {
      return `${props.width}px`
    } else {
      return '100%'
    }
  }};

  background: var(--kai-color-sys-surface-container);
  border-radius: var(--kai-size-sys-round-lg) var(--kai-size-sys-round-lg) 0 0;
  border: var(--kai-size-ref-1) solid var(--kai-color-sys-outline-variant);
  border-bottom: none;
  &[data-entering] {
    animation: ${SlideIn} 0.5s cubic-bezier(0, 0.7, 0.3, 1);
  }

  &[data-exiting] {
    animation: ${SlideOut} 0.5s cubic-bezier(0, 0.7, 0.3, 1);
  }
`

const ModalHeader = styled.div`
  display: grid;
  grid-template-columns: var(--kai-size-ref-80) 1fr var(--kai-size-ref-80);
  align-items: center;
  align-content: center;
  width: 100%;
  padding: var(--kai-size-ref-16) var(--kai-size-ref-8);
  grid-row: 1 / 2;
`

const ModalContent = styled.div`
  grid-row: 2 / 3;
  width: 100%;
  height: fit-content;
  max-height: 70svh;
  padding: var(--kai-size-ref-8) var(--kai-size-ref-16) var(--kai-size-ref-24)
    var(--kai-size-ref-16);
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`
